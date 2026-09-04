import { useState, type ReactElement } from "react";
import { useTranslation } from "react-i18next";
import type { Project, CommandType, PackageManager } from "../../types";
import { SemVerBadge, getUpdateType } from "../common/SemVerBadge";

type ProjectCardProps = {
  project: Project;
  isSelected: boolean;
  isProcessing: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string, name: string) => void;
  onRunCommand: (
    path: string,
    commandType: CommandType | string,
    actionKey: string,
    manager?: PackageManager,
    args?: string,
  ) => void;
};

export function ProjectCard({
  project,
  isSelected,
  isProcessing,
  onSelect,
  onRemove,
  onRunCommand,
}: ProjectCardProps): ReactElement {
  const { t } = useTranslation();
  const manager = (project.defaultManager as PackageManager) || "yarn";
  const isRemote = project.id.startsWith("remote-");
  const latestScan = project.scanHistory?.[0];
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedPkgs, setSelectedPkgs] = useState<Set<string>>(new Set());
  const outdatedPackages = Object.entries(
    latestScan?.fullReport?.outdated || {},
  );

  const handleTogglePackage = (pkgName: string) => {
    const newSet = new Set(selectedPkgs);
    if (newSet.has(pkgName)) newSet.delete(pkgName);
    else newSet.add(pkgName);
    setSelectedPkgs(newSet);
  };

  const handleRunUpgrade = (all: boolean = false) => {
    const pkgsToUpdate = all
      ? outdatedPackages.map(([pkg]) => pkg)
      : Array.from(selectedPkgs);
    if (pkgsToUpdate.length === 0) return;

    const argsString = pkgsToUpdate.map((pkg) => `${pkg}@latest`).join(" ");
    onRunCommand(
      project.path,
      "upgrade-selection",
      "projectCard.upgradeAction",
      manager,
      argsString,
    );
    setIsUpgradeModalOpen(false);
    setSelectedPkgs((newSet) => {
      newSet.clear();
      return newSet;
    });
  };

  const ActionButton = ({
    type,
    labelKey,
    actionKey,
    colorClass,
    icon,
    onClickOverride,
  }: any) => (
    <button
      disabled={isProcessing}
      onClick={(e) => {
        e.stopPropagation();
        if (onClickOverride) onClickOverride();
        else onRunCommand(project.path, type, actionKey, manager);
      }}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed border ${colorClass}`}
    >
      {icon}
      {t(labelKey)}
    </button>
  );

  return (
    <>
      <div
        onClick={() => onSelect(project.id)}
        className={`bg-slate-900 border rounded-lg p-4 transition-all relative group cursor-pointer ${isSelected ? "border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.1)]" : "border-slate-800 hover:border-cyan-900/50"}`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(project.id, project.name);
          }}
          className="absolute top-3 right-3 text-slate-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
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
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="pr-6">
          <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            {project.name}
            <span className="text-[10px] uppercase tracking-wider bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
              {manager}
            </span>
            {isRemote && (
              <span className="text-[10px] uppercase tracking-wider bg-indigo-900/50 border border-indigo-700 text-indigo-300 px-1.5 py-0.5 rounded">
                {t("projectCard.remoteBadge")}
              </span>
            )}
          </h2>
          <p className="text-xs font-mono text-slate-500 mt-1 truncate">
            {project.path}
          </p>
        </div>
        {latestScan && (
          <div className="mt-3 flex items-center gap-2 text-[10px] font-bold font-mono uppercase tracking-widest bg-slate-950/50 p-2 rounded border border-slate-800">
            <svg
              className="w-3 h-3 text-cyan-600 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span className="text-slate-400 mr-2 shrink-0">
              {new Date(latestScan.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {latestScan.total === 0 &&
            (!latestScan.outdated || latestScan.outdated === 0) ? (
              <span className="text-emerald-500">
                {t("projectCard.cleanStatus")}
              </span>
            ) : (
              <div className="flex gap-1.5 overflow-hidden flex-wrap">
                {latestScan.critical > 0 && (
                  <span className="text-rose-500 shrink-0">
                    {latestScan.critical} C
                  </span>
                )}
                {latestScan.high > 0 && (
                  <span className="text-orange-500 shrink-0">
                    {latestScan.high} A
                  </span>
                )}
                {latestScan.moderate > 0 && (
                  <span className="text-purple-500 shrink-0">
                    {latestScan.moderate} M
                  </span>
                )}
                {latestScan.low > 0 && (
                  <span className="text-blue-500 shrink-0">
                    {latestScan.low} B
                  </span>
                )}
                {(latestScan.outdated || 0) > 0 && (
                  <span className="text-amber-500 shrink-0">
                    {latestScan.outdated} D
                  </span>
                )}
              </div>
            )}
          </div>
        )}
        <div className="mt-4">
          <ActionButton
            type="audit"
            labelKey="sidebar.groupAudit"
            actionKey="actions.auditName"
            colorClass="w-full justify-center bg-rose-950/30 text-rose-400 border-rose-900/50 hover:bg-rose-900 hover:text-rose-100"
            icon={
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            }
          />
        </div>
        {!isRemote && (
          <div className="mt-4 pt-4 border-t border-slate-800/50">
            <div className="flex flex-wrap gap-2">
              <ActionButton
                type="dedupe"
                labelKey="sidebar.btnDedupe"
                actionKey="actions.dedupeName"
                colorClass="flex-1 justify-center bg-indigo-600/10 text-indigo-400 border-indigo-600/30 hover:bg-indigo-600 hover:text-white"
                icon={
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M4 7v10c0 1.1.9 2 2 2h12a2 2 0 002-2V7M4 7l8-4 8-4M4 7l8 4 8-4m-8 4v10"
                      strokeWidth="2"
                    />
                  </svg>
                }
              />
              <ActionButton
                type="upgrade-gui"
                labelKey="projectCard.btnUpgradeGui"
                actionKey="projectCard.upgradeAction"
                colorClass="flex-1 justify-center bg-emerald-600/10 text-emerald-400 border-emerald-600/30 hover:bg-emerald-600 hover:text-white"
                onClickOverride={() => setIsUpgradeModalOpen(true)}
                icon={
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      strokeWidth="2"
                    />
                  </svg>
                }
              />
            </div>
          </div>
        )}
      </div>
      {isUpgradeModalOpen && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            e.stopPropagation();
            setIsUpgradeModalOpen(false);
          }}
        >
          <div
            className="bg-[#0d1117] border border-emerald-500/30 rounded-lg w-full max-w-2xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
              <h3 className="text-emerald-400 font-bold flex items-center gap-2 uppercase tracking-wider text-sm">
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  ></path>
                </svg>
                {t("upgradeModal.title")}
              </h3>
              <button
                onClick={() => setIsUpgradeModalOpen(false)}
                className="text-slate-500 hover:text-rose-400 transition-colors font-mono text-xs"
              >
                [ {t("upgradeModal.close")} ]
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              {outdatedPackages.length === 0 ? (
                <div className="text-center text-emerald-500 font-mono py-8 bg-emerald-950/20 rounded border border-emerald-900/30">
                  {t("upgradeModal.emptyState")}
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700 text-xs text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 w-10 text-center">
                        <input
                          type="checkbox"
                          className="accent-emerald-500 w-3.5 h-3.5 cursor-pointer"
                          checked={
                            selectedPkgs.size === outdatedPackages.length
                          }
                          onChange={(e) => {
                            if (e.target.checked)
                              setSelectedPkgs(
                                new Set(outdatedPackages.map(([p]) => p)),
                              );
                            else setSelectedPkgs(new Set());
                          }}
                        />
                      </th>
                      <th className="pb-3">
                        {t("upgradeModal.table.package")}
                      </th>
                      <th className="pb-3">
                        {t("upgradeModal.table.current")}
                      </th>
                      <th className="pb-3 text-emerald-400">
                        {t("upgradeModal.table.target")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {outdatedPackages.map(([pkg, info]: any) => (
                      <tr
                        key={pkg}
                        className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="py-3 text-center">
                          <input
                            type="checkbox"
                            className="accent-emerald-500 w-3.5 h-3.5 cursor-pointer"
                            checked={selectedPkgs.has(pkg)}
                            onChange={() => handleTogglePackage(pkg)}
                          />
                        </td>
                        <td className="py-3 font-mono font-bold text-slate-200 text-xs">
                          {pkg}
                        </td>
                        <td className="py-3 font-mono text-slate-500 text-xs">
                          {info.current}
                        </td>
                        <td className="py-3 font-mono font-bold text-emerald-400 text-xs flex items-center">
                          {info.latest}
                          <SemVerBadge
                            type={getUpdateType(info.current, info.latest)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="p-4 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/50">
              <button
                disabled={outdatedPackages.length === 0 || isProcessing}
                onClick={() => handleRunUpgrade(true)}
                className="px-4 py-2 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors disabled:opacity-50 border border-slate-700"
              >
                {t("upgradeModal.btnForceAll")}
              </button>
              <button
                disabled={selectedPkgs.size === 0 || isProcessing}
                onClick={() => handleRunUpgrade(false)}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(5,150,105,0.2)]"
              >
                {t("upgradeModal.btnUpdateSelected", {
                  count: selectedPkgs.size,
                })}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
