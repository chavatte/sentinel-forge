import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { SemVerBadge, getUpdateType } from "../common/SemVerBadge";
import type { OutdatedPackage } from "./ThreatDashboard";

interface OutdatedTabProps {
  outdatedList: [string, OutdatedPackage][];
}

export function OutdatedTab({ outdatedList }: OutdatedTabProps): ReactElement {
  const { t } = useTranslation();

  return (
    <div className="flex-1 overflow-y-auto bg-slate-900/50 border border-slate-800 rounded-lg custom-scrollbar">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-950 sticky top-0 z-10 border-b border-slate-700">
          <tr>
            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t("dashboard.outdated.package")}
            </th>
            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t("dashboard.outdated.current")}
            </th>
            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t("dashboard.outdated.wanted")}
            </th>
            <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t("dashboard.outdated.latest")}
            </th>
          </tr>
        </thead>
        <tbody>
          {outdatedList.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="p-8 text-center text-emerald-500 font-mono"
              >
                {t("dashboard.outdated.safe")}
              </td>
            </tr>
          ) : (
            outdatedList.map(([pkg, info], idx) => (
              <tr
                key={pkg}
                className={`border-b border-slate-800/50 hover:bg-slate-800/30 ${idx % 2 === 0 ? "bg-transparent" : "bg-slate-900/20"}`}
              >
                <td className="p-4 font-mono font-bold text-slate-200">
                  {pkg}
                </td>
                <td className="p-4 text-slate-400 font-mono">{info.current}</td>
                <td className="p-4 text-amber-400 font-mono font-bold">
                  {info.wanted}
                </td>
                <td className="p-4 text-rose-400 font-mono font-bold flex items-center">
                  {info.latest}
                  <SemVerBadge
                    type={getUpdateType(info.current, info.latest)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
