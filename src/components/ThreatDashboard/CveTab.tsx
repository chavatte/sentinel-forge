import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import type { Vulnerability, Severity } from "./ThreatDashboard";

const severityColors: Record<Severity, string> = {
  critical: "bg-rose-950/40 border-rose-500/50 text-rose-400",
  high: "bg-orange-950/40 border-orange-500/50 text-orange-400",
  moderate: "bg-purple-950/40 border-purple-500/50 text-purple-400",
  low: "bg-blue-950/40 border-blue-500/50 text-blue-400",
  info: "bg-slate-800/40 border-slate-500/50 text-slate-400",
};

interface CveTabProps {
  sortedVulnList: Vulnerability[];
  totalVulns: number;
  onAutoFix?: () => void;
}

export function CveTab({
  sortedVulnList,
  totalVulns,
  onAutoFix,
}: CveTabProps): ReactElement {
  const { t } = useTranslation();

  return (
    <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
      {totalVulns > 0 && onAutoFix && (
        <div className="flex justify-end mb-4 shrink-0">
          <button
            onClick={onAutoFix}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-600/50 rounded transition-colors text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.15)]"
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
            {t("dashboard.cve.btnAutoFix")}
          </button>
        </div>
      )}
      {totalVulns === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 border border-emerald-900/50 bg-emerald-950/10 rounded-lg text-emerald-500">
          <span className="font-mono text-sm tracking-wide">
            {t("dashboard.cve.safe")}
          </span>
        </div>
      ) : (
        sortedVulnList.map((vuln, index) => {
          const displayTitle =
            vuln.title ||
            vuln.via?.find((v: any) => typeof v === "object" && v.title)?.title;
          const displayUrl =
            vuln.url ||
            vuln.via?.find((v: any) => typeof v === "object" && v.url)?.url;

          return (
            <div
              key={`${vuln.name}-${index}`}
              className={`p-5 rounded-lg border bg-opacity-10 backdrop-blur-md flex flex-col gap-3 group ${severityColors[vuln.severity]}`}
            >
              <div className="flex justify-between items-start border-b border-current/20 pb-3">
                <div>
                  <h3 className="font-mono font-bold text-lg">
                    📦 {vuln.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2 mb-2">
                    {vuln.sources && vuln.sources.length > 0 ? (
                      vuln.sources.map((src: string) => (
                        <span
                          key={src}
                          title={
                            src === "OSV.dev"
                              ? t("dashboard.cve.sourceOsv")
                              : t("dashboard.cve.sourceLocal")
                          }
                          className={`px-2 py-0.5 text-xs font-bold rounded flex items-center gap-1.5 border transition-all ${
                            src === "OSV.dev"
                              ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.2)]"
                              : "bg-slate-700/40 text-slate-300 border-slate-600/50"
                          }`}
                        >
                          {src === "OSV.dev" ? (
                            <svg
                              className="w-3 h-3 text-indigo-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                              ></path>
                            </svg>
                          ) : (
                            <svg
                              className="w-3 h-3 text-slate-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                              ></path>
                            </svg>
                          )}
                          {src}
                        </span>
                      ))
                    ) : (
                      <span
                        title={t("dashboard.cve.sourceLocal")}
                        className="px-2 py-0.5 text-xs font-bold rounded flex items-center gap-1.5 border bg-slate-700/40 text-slate-300 border-slate-600/50"
                      >
                        <svg
                          className="w-3 h-3 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                          ></path>
                        </svg>
                        NPM / YARN
                      </span>
                    )}
                  </div>
                  {displayTitle && (
                    <p className="text-sm mt-1 opacity-90 border-l-2 border-current/50 pl-2">
                      {displayTitle}
                    </p>
                  )}
                </div>
                <span className="text-xs uppercase px-2 py-1 rounded bg-black/30 font-bold shrink-0">
                  {vuln.severity}
                </span>
              </div>
              <div className="text-sm opacity-80 grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 font-mono">
                <div className="flex flex-col gap-2">
                  <p>
                    <span className="opacity-60">
                      {t("dashboard.cve.vector")}:
                    </span>{" "}
                    {vuln.isDirect
                      ? t("dashboard.cve.direct")
                      : t("dashboard.cve.transitive")}
                  </p>

                  {vuln.effects && vuln.effects.length > 0 && (
                    <p>
                      <span className="opacity-60">
                        {t("dashboard.cve.origin")}:
                      </span>{" "}
                      {vuln.effects.join(", ")}
                    </p>
                  )}
                  {vuln.introducedBy && (
                    <div className="mt-2 p-2 bg-slate-950/80 border-l-2 border-cyan-500 rounded shadow-[inset_0_0_10px_rgba(34,211,238,0.05)] relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                        <svg
                          className="w-3 h-3 text-cyan-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                          ></path>
                        </svg>
                        Forensics / Git Blame
                      </p>
                      <p className="text-cyan-400 font-bold truncate pl-4">
                        {vuln.introducedBy}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <p>
                    <span className="opacity-60">
                      {t("dashboard.cve.mitigation")}:
                    </span>{" "}
                    {vuln.patchedIn
                      ? `${t("dashboard.cve.updateTo")} ${vuln.patchedIn}`
                      : t("dashboard.cve.manualFix")}
                  </p>

                  {displayUrl && (
                    <a
                      href={displayUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 underline block truncate"
                    >
                      {t("dashboard.cve.advisory")}
                    </a>
                  )}
                  {vuln.osvData && vuln.osvData.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {Array.from(
                        new Set(
                          vuln.osvData.flatMap(
                            (osv) => osv.aliases || [osv.id],
                          ),
                        ),
                      ).map((alias) => (
                        <span
                          key={alias}
                          className="px-2 py-0.5 text-[9px] font-bold bg-indigo-950/60 text-indigo-300 border border-indigo-500/40 rounded uppercase tracking-wider shadow-[0_0_8px_rgba(99,102,241,0.15)]"
                        >
                          {alias}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
