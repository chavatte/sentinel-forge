import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import util from "node:util";
import { logger } from "../logger";

const execFileAsync = util.promisify(execFile);

export async function attachGitBlameToVulnerabilities(
  projectPath: string,
  vulnerabilities: Record<string, any>,
) {
  const packageJsonPath = path.join(projectPath, "package.json");

  try {
    await fs.access(packageJsonPath);
  } catch {
    return vulnerabilities;
  }

  try {
    await execFileAsync("git", ["status"], {
      cwd: projectPath,
      windowsHide: true,
    });

    const { stdout } = await execFileAsync(
      "git",
      ["blame", "package.json", "--date=short"],
      {
        cwd: projectPath,
        windowsHide: true,
      },
    );

    const lines = stdout.split("\n");

    for (const pkgName of Object.keys(vulnerabilities)) {
      const vuln = vulnerabilities[pkgName];
      const searchPkg = vuln.isDirect ? pkgName : vuln.effects?.[0] || pkgName;
      const regex = new RegExp(`"\\s*${searchPkg}\\s*"\\s*:`);
      const lineMatch = lines.find((l: string) => regex.test(l));

      if (lineMatch) {
        const match = lineMatch.match(/\((.*?)\s+(\d{4}-\d{2}-\d{2})/);
        if (match) {
          vuln.introducedBy = `${match[1].trim()} (${match[2]})`;
        }
      }
    }
  } catch (error: any) {
    logger.debug(
      `[Sentinel Forge] Git Blame skipped for ${path.basename(projectPath)}: No repository history or read error.`,
    );
  }

  return vulnerabilities;
}
