import { useEffect, useState, useRef } from "react";
import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useProjects } from "./hooks/useProjects";
import { useTerminalIPC } from "./hooks/useTerminalIPC";
import { useSOCMonitor } from "./hooks/useSOCMonitor";
import { useSettings } from "./hooks/useSettings";
import { SettingsModal } from "./components/SettingsModal/SettingsModal";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Terminal } from "./components/Terminal/Terminal";
import { SentinelLoader } from "./components/SentinelLoader/SentinelLoader";
import { ThreatDashboard } from "./components/ThreatDashboard/ThreatDashboard";
import { ProjectStats } from "./components/ProjectStats/ProjectStats";
import { TitleBar } from "./components/TitleBar/TitleBar";
import { EmptyState } from "./components/EmptyState/EmptyState";
import { generateWorkspaceHtmlReport } from "./utils/reportGenerator";
import { extractAuditSummary } from "./utils/auditHelper";
import type { AuditPayload } from "./components/ThreatDashboard/ThreatDashboard";
import type { PackageManager } from "./types";

export default function App(): ReactElement {
  const { t, i18n } = useTranslation();
  const [isAppLoading, setIsAppLoading] = useState(true);
  const { settings, updateSettings } = useSettings();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<
    "idle" | "downloaded" | "up-to-date"
  >("idle");
  const [newVersion, setNewVersion] = useState("");

  const {
    workspaces,
    activeWorkspaceId,
    setActiveWorkspaceId,
    addWorkspace,
    removeWorkspace,
    projects,
    addProject,
    removeProject,
    projectExists,
    addScanByPath,
    selectedProjectId,
    setSelectedProjectId,
    selectedProject,
  } = useProjects();

  const { logs, isProcessing, setIsProcessing, appendLog, clearTerminal } =
    useTerminalIPC();

  useSOCMonitor(projects, settings.socInterval);

  const [auditData, setAuditData] = useState<AuditPayload | null>(null);
  const auditingPathRef = useRef<string | null>(null);
  const auditingProjectNameRef = useRef<string>(
    t("dashboard.unknownRepo", "Repositório Desconhecido"),
  );
  const currentWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const workspaceName =
    currentWorkspace?.name ||
    t("dashboard.defaultWorkspace", "Workspace Padrão");

  useEffect(() => {
    const { api } = window as any;
    if (api?.onUpdateStatus) {
      api.onUpdateStatus((data: { status: string; version: string }) => {
        if (data.status === "downloaded") {
          setNewVersion(data.version);
          setUpdateStatus("downloaded");
        } else if (data.status === "up-to-date") {
          setNewVersion(data.version);
          setUpdateStatus("up-to-date");
          setTimeout(() => {
            setUpdateStatus("idle");
          }, 5000);
        }
      });
    }
  }, []);

  useEffect(() => {
    const { api } = window as any;
    if (!api) return;

    api.onAuditResult((result: any) => {
      setIsProcessing(false);
      if (result.success && result.data) {
        setAuditData(result.data);
        appendLog(`\r\n\x1b[1;32m${t("messages.auditComplete")}\x1b[0m\r\n`);

        if (auditingPathRef.current) {
          const summary = extractAuditSummary(result.data);
          addScanByPath(auditingPathRef.current, summary);
          auditingPathRef.current = null;
        }
      }
    });

    api.onAuditError((error: string) => {
      setIsProcessing(false);
      auditingPathRef.current = null;
      appendLog(
        `\r\n\x1b[1;31m${t("messages.auditError", { error })}\x1b[0m\r\n`,
      );
    });

    api.onSilentAuditResult((result: any) => {
      if (result.success && result.data && result.projectPath) {
        const summary = extractAuditSummary(result.data);
        addScanByPath(result.projectPath, summary);
      }
    });

    api.onRemoteProjectAdded((newProject: any) => {
      addProject(newProject);
      setIsProcessing(false);
      appendLog(
        t("messages.workspaceAdded", {
          name: newProject.name,
          manager: newProject.defaultManager,
        }),
      );
    });

    return () => {
      api.removeAuditListeners?.();
      api.removeSilentAuditListeners?.();
      api.removeRemoteProjectListeners?.();
    };
  }, [addProject, appendLog, setIsProcessing, t, addScanByPath]);

  useEffect(() => {
    const { api } = window as any;
    if (projects && projects.length > 0 && api?.syncWatchedProjects) {
      const localProjects = projects
        .filter((p) => !p.id.startsWith("remote-"))
        .map((p) => ({ path: p.path, manager: p.defaultManager }));
      api.syncWatchedProjects(localProjects);
    }
  }, [projects]);

  const handleAddProject = async () => {
    const { api } = window as any;
    if (!api) return appendLog(t("messages.apiError"));

    const result = await api.selectFolder(i18n.language);
    if (!result) return;

    const selectedPath = typeof result === "string" ? result : result.path;
    const detectedManager =
      typeof result === "string" ? "yarn" : result.defaultManager || "yarn";

    if (projectExists(selectedPath)) {
      return appendLog(t("messages.alreadyMapped", { path: selectedPath }));
    }

    const folderName =
      selectedPath.split(/[/\\]/).pop() ||
      t("sidebar.newProjectFallback", "Novo Projeto");

    addProject({
      id: crypto.randomUUID(),
      name: folderName,
      path: selectedPath,
      defaultManager: detectedManager as PackageManager,
    });

    appendLog(
      t("messages.workspaceAdded", {
        name: folderName,
        manager: detectedManager,
      }),
    );
  };

  const handleAddRemoteProject = (url: string, sshKeyPath?: string) => {
    const { api } = window as any;
    if (!api) return appendLog(t("messages.apiError"));
    if (isProcessing) return;

    setIsProcessing(true);
    api.addRemoteProject(url, sshKeyPath, i18n.language);
  };

  const handleRemoveProject = (id: string, name: string) => {
    removeProject(id);
    appendLog(t("messages.workspaceRemoved", { name }));
  };

  const handleRunCommand = (
    path: string,
    commandType: string,
    actionKey: string,
    manager: PackageManager = "yarn",
    args: string = "",
  ) => {
    const { api } = window as any;
    if (!api) return appendLog(t("messages.apiError"));
    if (isProcessing) return;

    setIsProcessing(true);
    appendLog(
      t("messages.startingCommand", {
        action: t(`actions.${actionKey}`, t(actionKey)),
        manager: manager.toUpperCase(),
        path,
      }),
    );

    if (commandType === "audit") {
      auditingPathRef.current = path;
      const proj = projects.find((p) => p.path === path);
      if (proj) auditingProjectNameRef.current = proj.name;

      api.runSecurityAudit(
        path,
        manager,
        i18n.language,
        settings.customSastRules || [],
      );
      return;
    }
    api.runCommand(path, commandType, manager, i18n.language, args);
  };

  const handleExportWorkspace = async (format: "json" | "html" | "pdf") => {
    const { api } = window as any;
    if (!api || !api.exportReport) return;

    let content = "";
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, 19);
    const fileName = `Workspace_${workspaceName.replace(/\s+/g, "_")}_${timestamp}.${format}`;

    if (format === "json") {
      const payload = {
        workspaceName,
        exportDate: new Date().toISOString(),
        projects: projects.map((p) => ({
          id: p.id,
          name: p.name,
          path: p.path,
          manager: p.defaultManager,
          latestScan: p.scanHistory?.[0] || null,
        })),
      };
      content = JSON.stringify(payload, null, 2);
    } else {
      content = generateWorkspaceHtmlReport(workspaceName, projects);
    }

    const result = await api.exportReport(content, format, fileName);
    if (result.success) {
      api.showNotification(
        t("messages.exportCLevelTitle"),
        t("messages.exportCLevelBody", { format: format.toUpperCase() }),
      );
    } else if (!result.canceled) {
      api.showNotification(
        t("messages.exportErrorTitle"),
        t("messages.exportErrorBody"),
      );
    }
  };

  return (
    <>
      {isAppLoading && (
        <SentinelLoader onComplete={() => setIsAppLoading(false)} />
      )}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdate={updateSettings}
      />
      <div className="flex flex-col h-screen bg-slate-900 text-slate-300 font-sans selection:bg-cyan-900 selection:text-cyan-100 relative overflow-hidden">
        {updateStatus === "downloaded" && (
          <div className="absolute bottom-6 right-6 z-[9999] bg-emerald-950/90 border border-emerald-500/50 p-4 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.15)] backdrop-blur-md flex items-center gap-5 animate-in slide-in-from-bottom-5">
            <div className="flex flex-col">
              <span className="font-bold text-emerald-400 text-sm tracking-wide uppercase flex items-center gap-2">
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  ></path>
                </svg>
                {t("updater.newUpdate")} ({newVersion})
              </span>
              <span className="text-xs text-emerald-500 font-mono mt-1">
                {t("updater.readyToInstall")}
              </span>
            </div>
            <button
              onClick={() => {
                setUpdateStatus("idle");
                (window as any).api.restartToUpdate?.();
              }}
              className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500 hover:text-emerald-950 text-emerald-400 border border-emerald-500/50 text-xs font-bold uppercase tracking-wider rounded transition-all"
            >
              {t("updater.restart")}
            </button>
          </div>
        )}
        {updateStatus === "up-to-date" && (
          <div className="absolute bottom-6 right-6 z-[9999] bg-cyan-950/90 border border-cyan-500/50 p-4 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-md flex items-center gap-4 animate-in slide-in-from-bottom-5 fade-out duration-300">
            <div className="flex flex-col">
              <span className="font-bold text-cyan-400 text-sm tracking-wide uppercase flex items-center gap-2">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                {t("updater.upToDate")} (v{newVersion})
              </span>
              <span className="text-xs text-cyan-500 font-mono mt-1">
                {t("updater.upToDateDesc")}
              </span>
            </div>
          </div>
        )}
        <TitleBar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            workspaces={workspaces}
            activeWorkspaceId={activeWorkspaceId}
            setActiveWorkspaceId={setActiveWorkspaceId}
            addWorkspace={addWorkspace}
            removeWorkspace={removeWorkspace}
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
            projects={projects}
            isProcessing={isProcessing}
            onAddProject={handleAddProject}
            onAddRemoteProject={handleAddRemoteProject}
            onRemoveProject={handleRemoveProject}
            onRunCommand={handleRunCommand}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onExportWorkspace={handleExportWorkspace}
          />
          <div className="flex-1 flex flex-col relative h-full overflow-hidden bg-slate-900">
            {selectedProject ? (
              <div className="flex-1 min-h-[150px] shadow-2xl relative z-10 border-b border-slate-800 animate-in slide-in-from-top-4 duration-300 overflow-hidden">
                <ProjectStats
                  project={selectedProject}
                  onClose={() => setSelectedProjectId(null)}
                  onOpenReport={(report) => {
                    auditingProjectNameRef.current = selectedProject.name;
                    setAuditData(report);
                  }}
                />
              </div>
            ) : (
              <EmptyState />
            )}
            <Terminal
              logs={logs}
              isProcessing={isProcessing}
              onClear={clearTerminal}
            />
          </div>
        </div>
        {auditData && (
          <ThreatDashboard
            data={auditData}
            onClose={() => setAuditData(null)}
            projectName={auditingProjectNameRef.current}
            workspaceName={workspaceName}
            projectPath={selectedProject?.path}
            onAutoFix={() => {
              if (selectedProject) {
                handleRunCommand(
                  selectedProject.path,
                  "audit-fix",
                  "auditFixName",
                  selectedProject.defaultManager,
                );
                setAuditData(null);
              }
            }}
          />
        )}
      </div>
    </>
  );
}
