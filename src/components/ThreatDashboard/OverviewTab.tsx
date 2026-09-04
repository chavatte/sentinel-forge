import { useState } from "react";
import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { getDonutChartOffset } from "../../utils/riskScore";

interface OverviewTabProps {
  riskScore: number;
  riskColor: string;
  riskLabel: string;
  metaVulns: any;
  outdatedCount: number;
  sastCount: number;
  onExport: (format: "json" | "html" | "pdf") => void;
  onExportSbom: () => void;
  onChangeTab: (tab: "sast") => void;
}

export function OverviewTab({
  riskScore,
  riskColor,
  riskLabel,
  metaVulns,
  outdatedCount,
  sastCount,
  onExport,
  onExportSbom,
  onChangeTab,
}: OverviewTabProps): ReactElement {
  const { t } = useTranslation();
  const [showMethodology, setShowMethodology] = useState(false);
  const donutSize = 160;
  const radius = donutSize / 2 - 15;
  const circumference = 2 * Math.PI * radius;
  const offset = getDonutChartOffset(riskScore, circumference);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-800/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            {t("dashboard.overview.riskScore")}
          </h3>
          <div
            className="relative flex items-center justify-center"
            style={{ width: donutSize, height: donutSize }}
          >
            <svg className="transform -rotate-90 w-full h-full">
              <circle
                cx={donutSize / 2}
                cy={donutSize / 2}
                r={radius}
                fill="none"
                stroke="#1e293b"
                strokeWidth="12"
              />
              <circle
                cx={donutSize / 2}
                cy={donutSize / 2}
                r={radius}
                fill="none"
                stroke={riskColor}
                strokeWidth="12"
                strokeLinecap="round"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: offset,
                  transition: "stroke-dashoffset 1s ease-in-out",
                }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span
                className="text-4xl font-black leading-none drop-shadow-md"
                style={{ color: riskColor }}
              >
                {riskLabel}
              </span>
              <span className="text-[10px] font-bold text-slate-500 mt-1">
                SCORE {riskScore}
              </span>
            </div>
          </div>
        </div>
        <div className="md:col-span-2 flex flex-col gap-4">
          <div
            className={`rounded-xl p-5 flex items-center justify-between border transition-all ${sastCount > 0 ? "bg-red-950/20 border-red-900/50 shadow-[0_0_15px_rgba(220,38,38,0.15)]" : "bg-slate-900/40 border-slate-800"}`}
          >
            <div className="flex flex-col">
              <span
                className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${sastCount > 0 ? "text-red-500" : "text-slate-500"}`}
              >
                {t("dashboard.overview.sastCard")}
              </span>
              <span
                className={`text-4xl font-mono font-bold ${sastCount > 0 ? "text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse" : "text-slate-600"}`}
              >
                {sastCount}
              </span>
            </div>
            {sastCount > 0 && (
              <button
                onClick={() => onChangeTab("sast")}
                className="px-4 py-2 bg-red-950/50 hover:bg-red-900/80 text-red-300 text-xs font-bold rounded uppercase transition-colors border border-red-800/50 flex items-center gap-2"
              >
                <span>{t("dashboard.overview.btnViewFiles")}</span>
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
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-4 flex-1">
            {[
              {
                label: t("dashboard.overview.levels.critical"),
                value: metaVulns.critical || 0,
                color: "text-rose-400",
                bg: "bg-rose-950/20 border-rose-900/40 hover:bg-rose-950/40",
                shadow: "drop-shadow-[0_0_10px_rgba(225,29,72,0.3)]",
                labelColor: "text-rose-500",
              },
              {
                label: t("dashboard.overview.levels.high"),
                value: metaVulns.high || 0,
                color: "text-orange-400",
                bg: "bg-orange-950/20 border-orange-900/40 hover:bg-orange-950/40",
                shadow: "drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]",
                labelColor: "text-orange-500",
              },
              {
                label: t("dashboard.overview.levels.moderate"),
                value: metaVulns.moderate || 0,
                color: "text-purple-300",
                bg: "bg-purple-950/20 border-purple-900/40 hover:bg-purple-950/40",
                shadow: "drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]",
                labelColor: "text-purple-400",
              },
              {
                label: t("dashboard.overview.levels.low"),
                value: metaVulns.low || 0,
                color: "text-blue-400",
                bg: "bg-blue-950/20 border-blue-900/40 hover:bg-blue-950/40",
                shadow: "drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]",
                labelColor: "text-blue-500",
              },
              {
                label: t("dashboard.overview.levels.info"),
                value: metaVulns.info || 0,
                color: "text-slate-300",
                bg: "bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60",
                shadow: "drop-shadow-[0_0_10px_rgba(148,163,184,0.3)]",
                labelColor: "text-slate-400",
              },
              {
                label: t("dashboard.overview.levels.outdated"),
                value: outdatedCount,
                color: "text-amber-400",
                bg: "bg-amber-950/20 border-amber-900/40 hover:bg-amber-950/40",
                shadow: "drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]",
                labelColor: "text-amber-500",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className={`${card.bg} border rounded-xl p-4 flex flex-col justify-center items-center transition-colors`}
              >
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${card.labelColor}`}
                >
                  {card.label}
                </span>
                <span
                  className={`text-3xl font-mono font-bold ${card.color} ${card.shadow}`}
                >
                  {card.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex justify-between items-center mt-auto">
        <div className="flex gap-3">
          <button
            onClick={() => setShowMethodology(!showMethodology)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider rounded transition-colors border border-slate-700"
          >
            <svg
              className="w-4 h-4 text-cyan-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            {t("dashboard.overview.btnMethodology")}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-500 mr-2">
            {t("dashboard.exportLabel")}
          </span>
          <div className="flex bg-slate-950 rounded border border-slate-700 overflow-hidden">
            <button
              onClick={() => onExport("json")}
              className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition-colors border-r border-slate-800 uppercase"
            >
              JSON
            </button>
            <button
              onClick={() => onExport("html")}
              className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition-colors border-r border-slate-800 uppercase"
            >
              HTML
            </button>
            <button
              onClick={() => onExport("pdf")}
              className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition-colors uppercase bg-cyan-950/20 hover:bg-cyan-900/40 border-r border-slate-800"
            >
              PDF
            </button>
            <button
              onClick={onExportSbom}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors uppercase shadow-[0_0_15px_rgba(79,70,229,0.5)]"
              title="Gerar Software Bill of Materials (CycloneDX)"
            >
              SBOM
            </button>
          </div>
        </div>
      </div>
      {showMethodology && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 animate-in slide-in-from-bottom-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">
            {t("dashboard.methodology.title")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-400 leading-relaxed font-mono">
            <div>
              <p className="mb-2">{t("dashboard.methodology.description")}</p>
              <ul className="space-y-1 mt-3 bg-slate-950 p-3 rounded border border-slate-800">
                <li>
                  <span className="text-red-500 font-bold">
                    {t("dashboard.methodology.rules.sast")}
                  </span>{" "}
                  {t("dashboard.methodology.rules.sastVal")}
                </li>
                <li>
                  <span className="text-rose-500 font-bold">
                    {t("dashboard.methodology.rules.critical")}
                  </span>{" "}
                  {t("dashboard.methodology.rules.criticalVal")}
                </li>
                <li>
                  <span className="text-orange-500 font-bold">
                    {t("dashboard.methodology.rules.high")}
                  </span>{" "}
                  {t("dashboard.methodology.rules.highVal")}
                </li>
                <li>
                  <span className="text-purple-400 font-bold">
                    {t("dashboard.methodology.rules.moderate")}
                  </span>{" "}
                  {t("dashboard.methodology.rules.moderateVal")}
                </li>
                <li>
                  <span className="text-blue-400 font-bold">
                    {t("dashboard.methodology.rules.low")}
                  </span>{" "}
                  {t("dashboard.methodology.rules.lowVal")}
                </li>
                <li>
                  <span className="text-amber-500 font-bold">
                    {t("dashboard.methodology.rules.outdated")}
                  </span>{" "}
                  {t("dashboard.methodology.rules.outdatedVal")}
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                <span className="font-bold text-emerald-400 text-sm">
                  {t("dashboard.methodology.grades.a")}
                </span>{" "}
                <span>{t("dashboard.methodology.grades.aDesc")}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                <span className="font-bold text-amber-500 text-sm">
                  {t("dashboard.methodology.grades.b")}
                </span>{" "}
                <span>{t("dashboard.methodology.grades.bDesc")}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                <span className="font-bold text-orange-500 text-sm">
                  {t("dashboard.methodology.grades.c")}
                </span>{" "}
                <span>{t("dashboard.methodology.grades.cDesc")}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                <span className="font-bold text-rose-500 text-sm">
                  {t("dashboard.methodology.grades.d")}
                </span>{" "}
                <span>{t("dashboard.methodology.grades.dDesc")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-rose-600 drop-shadow-[0_0_8px_rgba(225,29,72,0.6)] text-sm whitespace-nowrap">
                  {t("dashboard.methodology.grades.f")}
                </span>{" "}
                <span className="text-right ml-2">
                  {t("dashboard.methodology.grades.fDesc")}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
