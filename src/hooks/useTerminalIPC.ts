import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";

const MAX_LOG_LINES = 1000;

export function useTerminalIPC() {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const hasBooted = useRef<boolean>(false);
  const getPrompt = () =>
    `\x1b[1;36mroot@sentinel-forge\x1b[0m:\x1b[1;34m/secops\x1b[0m# `;

  const appendLog = useCallback(
    (logOrUpdater: string | ((prev: string[]) => string[])) => {
      setLogs((prev) => {
        const newLogs =
          typeof logOrUpdater === "function"
            ? logOrUpdater(prev)
            : [...prev, logOrUpdater];

        if (newLogs.length > MAX_LOG_LINES) {
          return newLogs.slice(-MAX_LOG_LINES);
        }
        return newLogs;
      });
    },
    [],
  );

  const clearTerminal = useCallback(() => {
    setLogs([`\x1b[2J\x1b[3J\x1b[H` + getPrompt()]);
  }, []);

  useEffect(() => {
    if (!hasBooted.current) {
      const bootMessage =
        `\x1b[38;5;51m┌──────────────────────────────────────────────┐\x1b[0m\r\n` +
        `\x1b[38;5;51m│  \x1b[1mS E N T I N E L   F O R G E\x1b[0m   \x1b[38;5;239mEDR KERNEL\x1b[38;5;51m    │\x1b[0m\r\n` +
        `\x1b[38;5;51m└──────────────────────────────────────────────┘\x1b[0m\r\n\r\n` +
        `\x1b[38;5;240m[\x1b[32mOK\x1b[38;5;240m]\x1b[0m ${t("terminal.bootEngine")}\r\n` +
        `\x1b[38;5;240m[\x1b[32mOK\x1b[38;5;240m]\x1b[0m ${t("terminal.bootIpc")}\r\n\r\n` +
        getPrompt();

      appendLog(bootMessage);
      hasBooted.current = true;
    }

    const { api } = window;

    if (!api) {
      appendLog(
        `\r\n\x1b[1;31m${t("terminal.criticalErrorPrefix")}\x1b[0m ${t("terminal.apiError")}\r\n\r\n${getPrompt()}`,
      );
      return;
    }

    api.onTerminalLog((log: string) => {
      appendLog(log);
      if (log.includes("código") || log.includes("code")) {
        setIsProcessing(false);
      }
    });

    api.onCommandFinished(() => {
      setIsProcessing(false);
      appendLog(getPrompt());
    });

    return () => {
      api.removeTerminalListeners?.();
      api.removeCommandFinishedListeners?.();
    };
  }, [appendLog, t]);

  return {
    logs,
    isProcessing,
    setIsProcessing,
    appendLog,
    clearTerminal,
  };
}
