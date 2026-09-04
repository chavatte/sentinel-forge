import { useState, useEffect, type ReactElement } from "react";
import { useTranslation } from "react-i18next";
import type { Settings, ScanInterval } from "../../hooks/useSettings";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English (Default)" },
  { code: "pt", label: "Português do Brasil" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
  { code: "ru", label: "Русский" },
  { code: "zh", label: "中文 (简体)" },
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onUpdate: (newSettings: Partial<Settings>) => void;
};

export function SettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdate,
}: Props): ReactElement | null {
  const { t, i18n } = useTranslation();

  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [activeTab, setActiveTab] = useState<"general" | "sast">("general");
  const [ruleName, setRuleName] = useState("");
  const [ruleRegex, setRuleRegex] = useState("");
  const [regexError, setRegexError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSelectedLanguage(i18n.language);
      setActiveTab("general");
      setRegexError("");
      setRuleName("");
      setRuleRegex("");
    }
  }, [isOpen, i18n.language]);

  if (!isOpen) return null;

  const intervals: { label: string; value: ScanInterval }[] = [
    { label: t("settingsModal.intervals.1m"), value: 60000 },
    { label: t("settingsModal.intervals.1h"), value: 3600000 },
    { label: t("settingsModal.intervals.6h"), value: 21600000 },
    { label: t("settingsModal.intervals.12h"), value: 43200000 },
    { label: t("settingsModal.intervals.24h"), value: 86400000 },
  ];

  const handleApply = () => {
    if (selectedLanguage !== i18n.language) {
      i18n.changeLanguage(selectedLanguage);
      if ((window as any).api?.changeLanguage) {
        (window as any).api.changeLanguage(selectedLanguage);
      }
    }
    onClose();
  };

  const handleAddRule = () => {
    if (!ruleName.trim() || !ruleRegex.trim()) return;

    try {
      new RegExp(ruleRegex);
      setRegexError("");

      const currentRules = settings.customSastRules || [];
      onUpdate({
        customSastRules: [
          ...currentRules,
          { name: ruleName, regex: ruleRegex },
        ],
      });

      setRuleName("");
      setRuleRegex("");
    } catch (e: any) {
      setRegexError(e.message || "Invalid Regular Expression");
    }
  };

  const handleRemoveRule = (indexToRemove: number) => {
    const currentRules = settings.customSastRules || [];
    onUpdate({
      customSastRules: currentRules.filter((_, idx) => idx !== indexToRemove),
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#020617]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-[0_0_30px_rgba(34,211,238,0.1)] w-full max-w-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-sm font-bold text-slate-200 tracking-widest uppercase flex items-center gap-2">
            <svg
              className="w-4 h-4 text-cyan-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            {t("settingsModal.title")}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-cyan-400 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div className="flex border-b border-slate-800 bg-slate-900 shrink-0">
          <button
            onClick={() => setActiveTab("general")}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === "general"
                ? "text-cyan-400 border-b-2 border-cyan-500 bg-slate-800/30"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {selectedLanguage === "pt" ? "Geral" : "General"}
          </button>
          <button
            onClick={() => setActiveTab("sast")}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === "sast"
                ? "text-red-400 border-b-2 border-red-500 bg-slate-800/30"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {selectedLanguage === "pt" ? "Regras SAST" : "SAST Rules"}
          </button>
        </div>
        <div className="p-6 h-[380px] overflow-y-auto custom-scrollbar">
          {activeTab === "general" ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-mono text-cyan-500 uppercase tracking-widest font-bold">
                  {t("settingsModal.scanIntervalLabel")}
                </label>
                <p className="text-[10px] text-slate-400 leading-relaxed mb-2 font-mono">
                  {t("settingsModal.scanIntervalDesc")}
                </p>
                <div className="relative">
                  <select
                    value={settings.socInterval}
                    onChange={(e) =>
                      onUpdate({
                        socInterval: Number(e.target.value) as ScanInterval,
                      })
                    }
                    className="w-full appearance-none bg-slate-950 border border-slate-700 text-slate-300 text-sm rounded focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 p-3 outline-none transition-all font-mono cursor-pointer"
                  >
                    {intervals.map((int) => (
                      <option key={int.value} value={int.value}>
                        {int.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-6 border-t border-slate-800/50">
                <label className="text-[11px] font-mono text-cyan-500 uppercase tracking-widest font-bold">
                  {selectedLanguage === "pt"
                    ? "Idioma da Interface"
                    : "Interface Language"}
                </label>
                <p className="text-[10px] text-slate-400 leading-relaxed mb-2 font-mono">
                  {selectedLanguage === "pt"
                    ? "Define a linguagem padrão de operação do motor Sentinel Forge."
                    : "Defines the default operating language for the Sentinel Forge engine."}
                </p>
                <div className="relative">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full appearance-none bg-slate-950 border border-slate-700 text-slate-300 text-sm rounded focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 p-3 outline-none transition-all font-mono cursor-pointer"
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-mono text-red-400 uppercase tracking-widest font-bold">
                  {selectedLanguage === "pt"
                    ? "Adicionar Nova Regra"
                    : "Add New Rule"}
                </label>
                <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                  {selectedLanguage === "pt"
                    ? "Defina padrões Regex customizados (Ex: tokens de API internas) para o motor de varredura."
                    : "Define custom Regex patterns (e.g., internal API tokens) for the scan engine."}
                </p>

                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder={
                      selectedLanguage === "pt"
                        ? "Nome (ex: Jira Token)"
                        : "Name (e.g., Jira Token)"
                    }
                    value={ruleName}
                    onChange={(e) => setRuleName(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700 text-slate-300 text-xs font-mono rounded px-3 py-2 outline-none focus:border-red-500"
                  />
                  <input
                    type="text"
                    placeholder="Regex (ex: /ATATT3xFf.../)"
                    value={ruleRegex}
                    onChange={(e) => setRuleRegex(e.target.value)}
                    className="flex-[2] bg-slate-950 border border-slate-700 text-slate-300 text-xs font-mono rounded px-3 py-2 outline-none focus:border-red-500"
                  />
                  <button
                    onClick={handleAddRule}
                    disabled={!ruleName || !ruleRegex}
                    className="px-4 py-2 bg-red-900/20 hover:bg-red-900/50 text-red-400 border border-red-800/50 rounded font-bold text-xs uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {selectedLanguage === "pt" ? "Adicionar" : "Add"}
                  </button>
                </div>
                {regexError && (
                  <span className="text-[10px] text-red-500 font-mono mt-1">
                    {regexError}
                  </span>
                )}
              </div>
              <div className="pt-4 border-t border-slate-800">
                <label className="text-[11px] font-mono text-slate-500 uppercase tracking-widest font-bold mb-3 block">
                  {selectedLanguage === "pt" ? "Regras Ativas" : "Active Rules"}
                </label>
                {!settings.customSastRules ||
                settings.customSastRules.length === 0 ? (
                  <div className="text-center p-6 bg-slate-950/50 rounded border border-slate-800 border-dashed">
                    <span className="text-xs text-slate-500 font-mono">
                      {selectedLanguage === "pt"
                        ? "Nenhuma regra customizada cadastrada."
                        : "No custom rules registered."}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {settings.customSastRules.map((rule, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-3 bg-slate-950 border border-slate-800 rounded group hover:border-slate-600 transition-colors"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-300">
                            {rule.name}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                            {rule.regex}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveRule(idx)}
                          className="text-slate-600 hover:text-red-500 transition-colors p-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end shrink-0">
          <button
            onClick={handleApply}
            className="px-6 py-2 bg-cyan-900/20 text-cyan-400 text-[10px] font-bold font-mono rounded border border-cyan-800 hover:bg-cyan-800 hover:text-white transition-all uppercase tracking-widest shadow-[0_0_10px_rgba(34,211,238,0.1)] hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]"
          >
            {t("settingsModal.btnApplyClose")}
          </button>
        </div>
      </div>
    </div>
  );
}
