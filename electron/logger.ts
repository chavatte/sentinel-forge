import { app } from "electron";
import { promises as fs } from "node:fs";
import path from "node:path";

class SystemLogger {
  private logFilePath: string = "";

  public init() {
    this.logFilePath = path.join(app.getPath("userData"), "sentinel.log");
    this.info("=== Sentinel Forge Engine Initialized ===");
  }

  private async write(level: string, message: string) {
    if (!this.logFilePath) return;

    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] [${level}] ${message}\n`;

    if (level === "ERROR") {
      console.error(logLine.trim());
    } else if (level === "WARN") {
      console.warn(logLine.trim());
    } else if (level === "DEBUG") {
      console.debug(logLine.trim());
    } else {
      console.log(logLine.trim());
    }

    if (level === "DEBUG" && app.isPackaged) {
      return;
    }

    try {
      await fs.appendFile(this.logFilePath, logLine, "utf8");
    } catch (error) {
      console.error("Critical failure writing to log file:", error);
    }
  }

  public info(message: string) {
    this.write("INFO", message);
  }

  public warn(message: string) {
    this.write("WARN", message);
  }

  public error(message: string, errorObj?: any) {
    const details = errorObj
      ? ` | Details: ${errorObj.message || errorObj}`
      : "";
    this.write("ERROR", message + details);
  }

  public debug(message: string) {
    this.write("DEBUG", message);
  }

  public getPath() {
    return this.logFilePath;
  }
}

export const logger = new SystemLogger();
