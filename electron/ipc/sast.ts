import fs from "node:fs/promises";
import path from "node:path";
import { logger } from "../logger";

const IGNORE_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "out",
  "coverage",
  ".vscode",
  ".idea",
]);

const IGNORE_EXTS = new Set([
  ".svg",
  ".png",
  ".jpg",
  ".jpeg",
  ".ico",
  ".pdf",
  ".zip",
  ".exe",
  ".mp3",
  ".mp4",
  ".ttf",
  ".woff",
  ".woff2",
  ".eot",
  ".bin",
  ".dll",
  ".so",
  ".dylib",
  ".lock",
  ".asar",
]);

const SECRET_PATTERNS = [
  {
    name: "AWS Access Key",
    regex: /(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/,
  },
  { name: "GitHub Token", regex: /(gh[pousr]_[A-Za-z0-9_]{36,255})/ },
  {
    name: "Private Key (SSH/RSA/PGP)",
    regex: /-----BEGIN (RSA|OPENSSH|DSA|EC|PGP) PRIVATE KEY-----/,
  },
  { name: "Google Cloud API Key", regex: /AIza[0-9A-Za-z\-_]{35}/ },
  { name: "Stripe Secret Key", regex: /sk_live_[0-9a-zA-Z]{24}/ },
];

export interface SastFinding {
  file: string;
  line: number;
  type: string;
  match: string;
}

export async function runSastScan(
  dirPath: string,
  customRules: { name: string; regex: string }[] = [], // <-- Recebendo as regras
): Promise<SastFinding[]> {
  const findings: SastFinding[] = [];

  const compiledCustomRules = customRules.reduce(
    (acc, rule) => {
      try {
        acc.push({
          name: `[CUSTOM] ${rule.name}`,
          regex: new RegExp(rule.regex),
        });
      } catch (e) {
        logger.warn(`[SAST] Invalid custom regex ignored: ${rule.name}`);
      }
      return acc;
    },
    [] as typeof SECRET_PATTERNS,
  );

  const ACTIVE_PATTERNS = [...SECRET_PATTERNS, ...compiledCustomRules];

  async function walk(currentPath: string) {
    try {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);

        if (entry.isDirectory()) {
          if (IGNORE_DIRS.has(entry.name)) continue;
          await walk(fullPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (IGNORE_EXTS.has(ext)) continue;

          const stats = await fs.stat(fullPath);
          if (stats.size > 2 * 1024 * 1024) continue;

          const content = await fs.readFile(fullPath, "utf-8");
          const lines = content.split("\n");

          lines.forEach((lineText, lineIndex) => {
            for (const pattern of ACTIVE_PATTERNS) {
              const match = lineText.match(pattern.regex);
              if (match) {
                findings.push({
                  file: path.relative(dirPath, fullPath),
                  line: lineIndex + 1,
                  type: pattern.name,
                  match:
                    match[0].substring(0, 4) +
                    "********" +
                    match[0].substring(match[0].length - 4),
                });
              }
            }
          });
        }
      }
    } catch (err: any) {
      logger.debug(
        `[SAST] Skipped unreadable path: ${currentPath} - ${err.message}`,
      );
    }
  }

  try {
    await walk(dirPath);
  } catch (e: any) {
    logger.error("[SAST] Error during static scan:", e);
  }
  return findings;
}
