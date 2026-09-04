import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import type { Project } from "../../types";

type Props = {
  project: Project;
  onClose: () => void;
  onOpenReport: (report: any) => void;
};

export function ProjectStats({
  project,
  onClose,
  onOpenReport,
}: Props): ReactElement {
  const { t } = useTranslation();
  const history = project.scanHistory || [];

  return (
    <div className="h-full bg-slate-950 border-b border-slate-800 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
      <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 relative z-10">
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5 text-cyan-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            ></path>
          </svg>
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-widest">
            {t("projectStats.telemetry")}{" "}
            <span className="text-cyan-400">{project.name}</span>
          </h2>
        </div>
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
      <div className="p-6 flex-1 overflow-y-auto relative z-10 custom-scrollbar">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 font-mono text-sm">
            <svg
              className="w-12 h-12 mb-3 opacity-20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              ></path>
            </svg>
            {t("projectStats.emptyStateLine1")}
            <br />
            {t("projectStats.emptyStateLine2")}
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-widest border-b border-slate-800 pb-2">
              {t("projectStats.lastScans")}
            </h3>
            <div className="grid gap-3">
              {history.map((scan, idx) => {
                const date = new Date(scan.timestamp);
                const isLatest = idx === 0;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (scan.fullReport) onOpenReport(scan.fullReport);
                    }}
                    className={`bg-slate-900 border ${isLatest ? "border-cyan-900/50 shadow-[0_0_15px_rgba(34,211,238,0.05)]" : "border-slate-800"} rounded p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-all group relative`}
                    title={t("projectStats.tooltipReport")}
                  >
                    <div className="flex flex-col w-1/4">
                      <span className="text-xs text-slate-300 font-bold group-hover:text-cyan-400 transition-colors">
                        {date.toLocaleDateString()}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {date.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex-1 flex gap-4 items-center justify-center">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-slate-500 font-bold mb-1">
                          {t("projectStats.levels.critical")}
                        </span>
                        <span
                          className={`text-sm font-bold font-mono ${scan.critical > 0 ? "text-rose-500" : "text-slate-600"}`}
                        >
                          {scan.critical}
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-slate-500 font-bold mb-1">
                          {t("projectStats.levels.high")}
                        </span>
                        <span
                          className={`text-sm font-bold font-mono ${scan.high > 0 ? "text-orange-500" : "text-slate-600"}`}
                        >
                          {scan.high}
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-slate-500 font-bold mb-1">
                          {t("projectStats.levels.moderate")}
                        </span>
                        <span
                          className={`text-sm font-bold font-mono ${scan.moderate > 0 ? "text-purple-500" : "text-slate-600"}`}
                        >
                          {scan.moderate}
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-slate-500 font-bold mb-1">
                          {t("projectStats.levels.low")}
                        </span>
                        <span
                          className={`text-sm font-bold font-mono ${scan.low > 0 ? "text-blue-500" : "text-slate-600"}`}
                        >
                          {scan.low}
                        </span>
                      </div>
                      <div className="flex flex-col items-center border-l border-slate-700/50 pl-4 ml-2">
                        <span className="text-[10px] text-amber-600/70 font-bold mb-1">
                          {t("projectStats.levels.outdated")}
                        </span>
                        <span
                          className={`text-sm font-bold font-mono ${(scan.outdated || 0) > 0 ? "text-amber-500" : "text-slate-600"}`}
                        >
                          {scan.outdated || 0}
                        </span>
                      </div>
                    </div>
                    <div className="w-1/4 flex justify-end items-center gap-3">
                      {(() => {
                        const isClean =
                          scan.total === 0 &&
                          (!scan.outdated || scan.outdated === 0);
                        const tagText = isClean
                          ? t("projectStats.tags.clean")
                          : scan.total > 0
                            ? t("projectStats.tags.vuln", { count: scan.total })
                            : t("projectStats.tags.outdated", {
                                count: scan.outdated,
                              });

                        const tagClass = isClean
                          ? "bg-emerald-950/30 text-emerald-400 border border-emerald-900/50"
                          : scan.total > 0
                            ? "bg-rose-950/30 text-rose-400 border border-rose-900/50"
                            : "bg-amber-950/30 text-amber-400 border border-amber-900/50";

                        return (
                          <div
                            className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest ${tagClass}`}
                          >
                            {tagText}
                          </div>
                        );
                      })()}
                      <svg
                        className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1"
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
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
