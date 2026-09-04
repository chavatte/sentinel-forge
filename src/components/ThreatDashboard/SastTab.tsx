import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import type { SastFinding } from "./ThreatDashboard";

interface SastTabProps {
  sastList: SastFinding[];
}

export function SastTab({ sastList }: SastTabProps): ReactElement {
  const { t } = useTranslation();
  const sastCount = sastList.length;

  if (sastCount === 0) {
    return (
      <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
        <div className="flex flex-col items-center justify-center h-40 border border-emerald-900/50 bg-emerald-950/10 rounded-lg text-emerald-500">
          <span className="font-mono text-sm tracking-wide">
            {t("dashboard.sast.safe")}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
      <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-6">
        <h3 className="text-red-500 font-bold mb-4 uppercase tracking-wider flex items-center gap-2">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
          {t("dashboard.sast.alert")}
        </h3>
        <div className="space-y-4">
          {sastList.map((sast, idx) => (
            <div
              key={idx}
              className="bg-slate-900/80 border border-red-900/30 p-4 rounded-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-red-400 text-sm">
                  {sast.type}
                </span>
                <span className="text-xs bg-red-900/50 text-red-300 px-2 py-1 rounded">
                  {t("dashboard.sast.line")} {sast.line}
                </span>
              </div>
              <p className="font-mono text-xs text-slate-400 mb-2">
                {t("dashboard.sast.file")}:{" "}
                <span className="text-slate-300">{sast.file}</span>
              </p>
              <div className="bg-black/50 p-3 rounded border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
                {t("dashboard.sast.foundValue")}:{" "}
                <span className="text-red-400 font-bold">{sast.match}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
