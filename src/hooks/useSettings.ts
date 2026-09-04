import { useState } from "react";
import { useTranslation } from "react-i18next";

export type ScanInterval = 60000 | 3600000 | 21600000 | 43200000 | 86400000;

export interface SastRule {
  name: string;
  regex: string;
}

export type Settings = {
  socInterval: ScanInterval;
  customSastRules?: SastRule[];
};

const DEFAULT_SETTINGS: Settings = {
  socInterval: 3600000,
  customSastRules: [],
};

export function useSettings() {
  const { t } = useTranslation();

  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem("@sentinel:settings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(`[Sentinel Forge] ${t("messages.settingsError")}`);
      }
    }
    return DEFAULT_SETTINGS;
  });

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem("@sentinel:settings", JSON.stringify(updated));
      return updated;
    });
  };

  return { settings, updateSettings };
}
