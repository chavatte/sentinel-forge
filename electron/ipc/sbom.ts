import { ipcMain } from "electron";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { getMessages } from "../utils";
import { logger } from "../logger";

export function setupSbomIPC() {
  ipcMain.handle(
    "generate-sbom",
    async (_event, projectPath: string, lang = "en") => {
      const t = getMessages(lang);
      try {
        if (!projectPath || typeof projectPath !== "string") {
          throw new Error("Invalid project path provided.");
        }

        const resolvedPath = path.resolve(projectPath);
        const pkgPath = path.join(resolvedPath, "package.json");

        try {
          await fs.access(pkgPath);
        } catch {
          logger.warn(`[SBOM] package.json not found at ${pkgPath}`);
          return {
            success: false,
            error: t.sbomMissingPackage,
          };
        }

        const pkgContent = await fs.readFile(pkgPath, "utf-8");
        const pkg = JSON.parse(pkgContent);
        const components: any[] = [];
        const addComponents = (deps: Record<string, string>, scope: string) => {
          if (!deps) return;
          for (const [name, version] of Object.entries(deps)) {
            let cleanVersion = version.replace(/^[^\d]+/, "");

            if (!cleanVersion || cleanVersion.trim() === "") {
              cleanVersion =
                version.replace(/[^a-zA-Z0-9.\-:*]+/g, "") || "unknown";
            }

            components.push({
              type: "library",
              "bom-ref": `pkg:npm/${name}@${cleanVersion}`,
              name: name,
              version: cleanVersion,
              scope: scope,
              purl: `pkg:npm/${name}@${cleanVersion}`,
            });
          }
        };

        addComponents(pkg.dependencies, "required");
        addComponents(pkg.devDependencies, "optional");

        const sbom = {
          bomFormat: "CycloneDX",
          specVersion: "1.4",
          serialNumber: `urn:uuid:${crypto.randomUUID()}`,
          version: 1,
          metadata: {
            timestamp: new Date().toISOString(),
            tools: [
              {
                vendor: "DeVChavatte",
                name: "Sentinel Forge EDR",
                version: "2.0.0",
              },
            ],
            component: {
              type: "application",
              name: pkg.name || path.basename(resolvedPath),
              version: pkg.version || "0.0.0",
            },
          },
          components: components,
        };

        logger.info(
          `[SBOM] Successfully generated CycloneDX SBOM for ${pkg.name || "project"}`,
        );
        return { success: true, data: JSON.stringify(sbom, null, 2) };
      } catch (error: any) {
        logger.error(`[SBOM] Fatal error generating SBOM: ${error.message}`);
        return { success: false, error: error.message };
      }
    },
  );
}
