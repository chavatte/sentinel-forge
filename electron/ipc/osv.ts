import fs from "node:fs/promises";
import path from "node:path";
import { logger } from "../logger";

export interface OsvQuery {
  package: {
    name: string;
    ecosystem: string;
  };
  version: string;
}

export interface OsvVulnerability {
  id: string;
  summary?: string;
  details?: string;
  affected: any[];
  aliases?: string[];
  modified: string;
}

export interface OsvResult {
  name: string;
  version: string;
  vulnerabilities: OsvVulnerability[];
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

async function extractAllDependencies(
  projectPath: string,
): Promise<{ name: string; version: string }[]> {
  const deps = new Map<string, Set<string>>();

  const addDep = (name: string, version: string) => {
    if (!name || !version) return;
    const cleanVersion = version.replace(/^[^\d]+/, "");
    if (!deps.has(name)) deps.set(name, new Set());
    deps.get(name)!.add(cleanVersion);
  };

  try {
    const pkgContent = await fs.readFile(
      path.join(projectPath, "package.json"),
      "utf-8",
    );
    const pkg = JSON.parse(pkgContent);
    const direct = {
      ...(pkg.dependencies || {}),
      ...(pkg.devDependencies || {}),
    };
    for (const [name, version] of Object.entries(direct)) {
      addDep(name, version as string);
    }
  } catch {
    logger.debug(`[OSV] No package.json found at ${projectPath}.`);
  }

  const flattenDeps = () => {
    const result: { name: string; version: string }[] = [];
    for (const [name, versions] of deps.entries()) {
      for (const version of versions) {
        result.push({ name, version });
      }
    }
    return result;
  };

  try {
    const lockContent = await fs.readFile(
      path.join(projectPath, "package-lock.json"),
      "utf-8",
    );
    const lock = JSON.parse(lockContent);
    if (lock.packages) {
      for (const [pkgPath, info] of Object.entries(lock.packages)) {
        if (pkgPath === "" || !(info as any).version) continue;
        const name = pkgPath.replace(/^.*node_modules\//, "");
        addDep(name, (info as any).version);
      }
    } else if (lock.dependencies) {
      for (const [name, info] of Object.entries(lock.dependencies)) {
        addDep(name, (info as any).version);
      }
    }
    return flattenDeps();
  } catch {}

  try {
    const yarnContent = await fs.readFile(
      path.join(projectPath, "yarn.lock"),
      "utf-8",
    );
    const lines = yarnContent.split("\n");
    let currentPackage = "";

    for (const line of lines) {
      const pkgMatch = line.match(/^"?(@?[a-zA-Z0-9\-_\.\/]+)@/);
      if (pkgMatch) {
        currentPackage = pkgMatch[1];
      } else if (currentPackage) {
        const verMatch = line.match(
          /^\s+version:?\s+"?([0-9\.]+[-a-zA-Z0-9\.]*)"?/,
        );
        if (verMatch) {
          addDep(currentPackage, verMatch[1]);
          currentPackage = "";
        } else if (!line.startsWith(" ") && line.trim() !== "") {
          currentPackage = "";
        }
      }
    }
    return flattenDeps();
  } catch {}

  try {
    const pnpmContent = await fs.readFile(
      path.join(projectPath, "pnpm-lock.yaml"),
      "utf-8",
    );
    const pnpmRegex =
      /^\s+\/?(@?[a-zA-Z0-9\-_\.\/]+)\/([0-9\.]+[-a-zA-Z0-9\.]*):/gm;
    let match;
    while ((match = pnpmRegex.exec(pnpmContent)) !== null) {
      addDep(match[1], match[2]);
    }
    return flattenDeps();
  } catch {}

  return flattenDeps();
}

export async function queryOsvBatch(projectPath: string): Promise<OsvResult[]> {
  try {
    const depList = await extractAllDependencies(projectPath);

    if (depList.length === 0) return [];

    const queries: OsvQuery[] = depList.map(({ name, version }) => ({
      package: { name, ecosystem: "npm" },
      version,
    }));

    const chunks = chunkArray(queries, 1000);
    const allResults: OsvResult[] = [];

    logger.info(
      `[OSV] Querying global database for ${queries.length} unique packages/versions in ${chunks.length} batches...`,
    );

    const fetchPromises = chunks.map(async (chunk, index) => {
      const response = await fetch("https://api.osv.dev/v1/querybatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queries: chunk }),
      });

      if (!response.ok) {
        throw new Error(
          `OSV API Chunk ${index} returned status: ${response.status}`,
        );
      }

      const data = await response.json();
      const chunkResults: OsvResult[] = [];

      if (data.results) {
        data.results.forEach((res: any, idx: number) => {
          if (res.vulns && res.vulns.length > 0) {
            chunkResults.push({
              name: chunk[idx].package.name,
              version: chunk[idx].version,
              vulnerabilities: res.vulns,
            });
          }
        });
      }
      return chunkResults;
    });

    const resolvedChunks = await Promise.all(fetchPromises);
    resolvedChunks.forEach((resArray) => allResults.push(...resArray));

    if (allResults.length > 0) {
      logger.warn(
        `[OSV] Deep scan completed. Found ${allResults.length} compromised packages!`,
      );
    } else {
      logger.info(`[OSV] Deep scan completed. No global threats found.`);
    }

    return allResults;
  } catch (error: any) {
    logger.error(`[OSV] Critical failure during global scan: ${error.message}`);
    return [];
  }
}
