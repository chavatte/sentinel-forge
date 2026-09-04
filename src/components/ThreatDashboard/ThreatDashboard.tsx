import { useState } from "react";
import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { generateHtmlReport } from "../../utils/reportGenerator";
import {
  calculateRiskScore,
  getRiskColor,
  getRiskLabel,
} from "../../utils/riskScore";
import { OverviewTab } from "./OverviewTab";
import { SastTab } from "./SastTab";
import { CveTab } from "./CveTab";
import { OutdatedTab } from "./OutdatedTab";
import logoImg from "../../assets/sentinel.png";

export type Severity = "info" | "low" | "moderate" | "high" | "critical";
export interface OutdatedPackage {
  current: string;
  wanted: string;
  latest: string;
}

export interface OsvDataPayload {
  id: string;
  aliases?: string[];
  summary?: string;
  details?: string;
}
export interface Vulnerability {
  name: string;
  title?: string;
  url?: string;
  patchedIn?: string;
  severity: Severity;
  isDirect?: boolean;
  effects?: string[];
  via?: any[];
  fixAvailable:
    | boolean
    | string
    | { name: string; version: string; isSemVerMajor: boolean };
  introducedBy?: string;
  sources?: string[];
  osvData?: OsvDataPayload[];
}
export interface SastFinding {
  file: string;
  line: number;
  type: string;
  match: string;
}
export interface AuditPayload {
  error?: { code: string; summary: string; detail?: string };
  vulnerabilities?: Record<string, Vulnerability>;
  outdated?: Record<string, OutdatedPackage>;
  sast?: SastFinding[];
  metadata?: {
    vulnerabilities: Record<Severity, number>;
    dependencies: { total: number };
  };
}

interface ThreatDashboardProps {
  data: AuditPayload | null;
  onClose: () => void;
  projectName?: string;
  workspaceName?: string;
  projectPath?: string;
  onAutoFix?: () => void;
}

const severityOrder: Record<Severity, number> = {
  critical: 5,
  high: 4,
  moderate: 3,
  low: 2,
  info: 1,
};

export function ThreatDashboard({
  data,
  onClose,
  projectName = "Desconhecido",
  workspaceName = "Padrão",
  projectPath,
  onAutoFix,
}: ThreatDashboardProps): ReactElement | null {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<
    "overview" | "cve" | "outdated" | "sast"
  >("overview");

  if (!data) return null;
  if (data.error) return <div>Erro</div>;

  const rawVulnList = Object.values(
    data.vulnerabilities || {},
  ) as Vulnerability[];
  const outdatedList = Object.entries(data.outdated || {});
  const sastList = data.sast || [];
  const sastCount = sastList.length;

  let metaVulns = data.metadata?.vulnerabilities || {
    critical: 0,
    high: 0,
    moderate: 0,
    low: 0,
    info: 0,
  };
  let totalVulns =
    (Number(metaVulns.critical) || 0) +
    (Number(metaVulns.high) || 0) +
    (Number(metaVulns.moderate) || 0) +
    (Number(metaVulns.low) || 0) +
    (Number(metaVulns.info) || 0);

  if (totalVulns === 0 && rawVulnList.length > 0) {
    const recalc: Record<Severity, number> = {
      critical: 0,
      high: 0,
      moderate: 0,
      low: 0,
      info: 0,
    };
    rawVulnList.forEach((v) => {
      if (recalc[v.severity] !== undefined) recalc[v.severity]++;
    });
    metaVulns = recalc as any;
    totalVulns = rawVulnList.length;
  }

  const sortedVulnList = rawVulnList.sort(
    (a, b) => severityOrder[b.severity] - severityOrder[a.severity],
  );
  const outdatedCount = outdatedList.length;
  const riskScore = calculateRiskScore(
    metaVulns.critical || 0,
    metaVulns.high || 0,
    metaVulns.moderate || 0,
    metaVulns.low || 0,
    outdatedCount,
    sastCount,
  );
  const riskColor = getRiskColor(riskScore);
  const riskLabel = getRiskLabel(riskScore);
  const handleExport = async (format: "json" | "html" | "pdf") => {
    let content = "";
    const defaultName = `Relatorio-Sentinel_${new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)}.${format}`;
    if (format === "json") content = JSON.stringify(data, null, 2);
    else content = generateHtmlReport(data, projectName, workspaceName);

    const { api } = window;
    if (api?.exportReport) {
      const result = await api.exportReport(content, format, defaultName);
      if (result.success)
        api.showNotification(
          t("messages.exportSuccessTitle"),
          t("messages.exportSuccessBody", { format: format.toUpperCase() }),
        );
    }
  };

  const handleExportSbom = async () => {
    const { api } = window;
    if (!api?.generateSbom || !projectPath) return;

    const result = await api.generateSbom(projectPath);
    if (result.success && result.data) {
      const defaultName = `SBOM-CycloneDX_${projectName.replace(/\s+/g, "-")}_${new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)}.json`;
      const exportResult = await api.exportReport(
        result.data,
        "json",
        defaultName,
      );
      if (exportResult.success)
        api.showNotification(
          t("messages.exportSbomTitle"),
          t("messages.exportSbomBody"),
        );
    } else {
      api.showNotification(
        "Erro SBOM",
        "Falha ao gerar o manifesto: " + result.error,
      );
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-[#0d1117]/95 backdrop-blur-sm border-l border-slate-800 animate-in fade-in duration-200">
      <header className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/80 shrink-0">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            {totalVulns > 0 || outdatedCount > 0 || sastCount > 0 ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
            )}
          </span>
          <h2 className="text-sm font-bold tracking-wider text-slate-200 uppercase">
            {t("dashboard.radarTitle")}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-xs font-mono text-slate-500 hover:text-cyan-400 px-3 py-1.5 border border-transparent hover:border-cyan-900 rounded bg-slate-800/50 transition-colors"
        >
          [ {t("dashboard.close")} ]
        </button>
      </header>
      <div className="flex-1 flex flex-col overflow-hidden p-6 gap-6">
        <div className="flex items-center justify-between p-4 bg-slate-800/40 rounded border border-cyan-500/20 shrink-0">
          <div className="flex items-center gap-4">
            <img
              src={logoImg}
              alt="Logo"
              className="w-10 h-10 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]"
            />
            <div>
              <h2 className="text-lg font-bold text-white uppercase tracking-wider leading-none">
                {t("dashboard.tacticalTitle")}
              </h2>
              <p className="text-[10px] text-cyan-500/70 font-mono mt-1">
                {workspaceName} /{" "}
                <span className="text-cyan-400 font-bold">{projectName}</span>
              </p>
            </div>
          </div>
          <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-1.5 text-xs font-bold uppercase rounded-md transition-all ${activeTab === "overview" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}
            >
              {t("dashboard.tabs.overview")}
            </button>
            <button
              onClick={() => setActiveTab("cve")}
              className={`px-4 py-1.5 text-xs font-bold uppercase rounded-md transition-all ${activeTab === "cve" ? "bg-rose-600 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}
            >
              {t("dashboard.tabs.cve")}
              <span className="ml-1 bg-black/30 px-1.5 py-0.5 rounded text-[9px]">
                {totalVulns}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("outdated")}
              className={`px-4 py-1.5 text-xs font-bold uppercase rounded-md transition-all ${activeTab === "outdated" ? "bg-amber-600 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}
            >
              {t("dashboard.tabs.outdated")}
              <span className="ml-1 bg-black/30 px-1.5 py-0.5 rounded text-[9px]">
                {outdatedCount}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("sast")}
              className={`px-4 py-1.5 text-xs font-bold uppercase rounded-md transition-all ${activeTab === "sast" ? "bg-red-800 text-white shadow shadow-red-500/50" : "text-slate-400 hover:text-slate-200"}`}
            >
              {t("dashboard.tabs.sast")}
              {sastCount > 0 && (
                <span className="ml-1 bg-red-500 text-white px-1.5 py-0.5 rounded text-[9px] animate-pulse">
                  {sastCount}
                </span>
              )}
            </button>
          </div>
        </div>
        {activeTab === "overview" && (
          <OverviewTab
            riskScore={riskScore}
            riskColor={riskColor}
            riskLabel={riskLabel}
            metaVulns={metaVulns}
            outdatedCount={outdatedCount}
            sastCount={sastCount}
            onExport={handleExport}
            onExportSbom={handleExportSbom}
            onChangeTab={setActiveTab}
          />
        )}
        {activeTab === "sast" && <SastTab sastList={sastList} />}
        {activeTab === "cve" && (
          <CveTab
            sortedVulnList={sortedVulnList}
            totalVulns={totalVulns}
            onAutoFix={onAutoFix}
          />
        )}
        {activeTab === "outdated" && (
          <OutdatedTab outdatedList={outdatedList} />
        )}
      </div>
    </div>
  );
}
