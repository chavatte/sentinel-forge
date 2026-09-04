import { useState } from "react";
import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import type { Project, PackageManager, Workspace } from "../../types";
import { ProjectCard } from "./ProjectCard";
import { AboutModal } from "./AboutModal";
import { CreateWorkspaceModal } from "./CreateWorkspaceModal";
import { DeleteWorkspaceModal } from "./DeleteWorkspaceModal";
import { RemoteProjectModal } from "./RemoteProjectModal";
import logoImg from "../../assets/sentinel.png";

type SidebarProps = {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  setActiveWorkspaceId: (id: string) => void;
  addWorkspace: (name: string) => void;
  removeWorkspace: (id: string) => void;
  selectedProjectId: string | null;
  onSelectProject: (id: string) => void;
  projects: Project[];
  isProcessing: boolean;
  onAddProject: () => void;
  onAddRemoteProject: (url: string, sshKeyPath?: string) => void;
  onRemoveProject: (id: string, name: string) => void;
  onRunCommand: (
    path: string,
    commandType: string,
    actionKey: string,
    manager?: PackageManager,
    args?: string,
  ) => void;
  onOpenSettings: () => void;
  onExportWorkspace: (format: "json" | "html" | "pdf") => void;
};

export function Sidebar({
  workspaces,
  activeWorkspaceId,
  setActiveWorkspaceId,
  addWorkspace,
  removeWorkspace,
  selectedProjectId,
  onSelectProject,
  projects,
  isProcessing,
  onAddProject,
  onAddRemoteProject,
  onRemoveProject,
  onRunCommand,
  onOpenSettings,
  onExportWorkspace,
}: SidebarProps): ReactElement {
  const { t, i18n } = useTranslation();
  const [isRemoteModalOpen, setIsRemoteModalOpen] = useState(false);
  const [isNewWsModalOpen, setIsNewWsModalOpen] = useState(false);
  const [wsToDelete, setWsToDelete] = useState<string | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const activeWsName = workspaces.find((w) => w.id === wsToDelete)?.name || "";

  const openDocumentation = () => {
    window.open(`./help.html?lang=${i18n.language}`, '_blank', 'width=1100,height=800,nodeIntegration=no');
  };

  return (
    <aside className="w-1/3 min-w-[320px] bg-slate-950 border-r border-slate-800 p-6 flex flex-col relative">
      <div className="mb-6 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <img
            src={logoImg}
            alt="Logo"
            className="w-9 h-9 object-contain drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]"
          />
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl font-bold text-cyan-500 tracking-tight leading-none">
              {t("sidebar.title")}
            </h1>
            <p className="text-[10px] text-slate-500 mt-1.5 uppercase tracking-widest font-semibold leading-none">
              {t("sidebar.subtitle")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAboutOpen(true)}
            title="System Intel (About)"
            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-cyan-400 bg-slate-900/50 hover:bg-slate-800 border border-transparent hover:border-cyan-900/50 rounded transition-all group"
          >
            <svg
              className="w-4 h-4 group-hover:scale-110 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </button>
          <button
            onClick={openDocumentation}
            title={t("sidebar.openDocs")}
            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-cyan-400 bg-slate-900/50 hover:bg-slate-800 border border-transparent hover:border-cyan-900/50 rounded transition-all group"
          >
            <svg
              className="w-4 h-4 group-hover:scale-110 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </button>
          <button
            onClick={onOpenSettings}
            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-cyan-400 bg-slate-900/50 hover:bg-slate-800 border border-transparent hover:border-cyan-900/50 rounded transition-all group"
          >
            <svg
              className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300"
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
          </button>
        </div>
      </div>
      <div className="mb-3 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2 relative">
        <svg
          className="w-4 h-4 text-cyan-600 absolute left-4 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          ></path>
        </svg>
        <select
          value={activeWorkspaceId}
          onChange={(e) =>
            e.target.value === "NEW_WORKSPACE"
              ? setIsNewWsModalOpen(true)
              : setActiveWorkspaceId(e.target.value)
          }
          className="flex-1 bg-slate-950 border border-slate-700 text-cyan-500 text-[11px] rounded focus:ring-1 focus:ring-cyan-500 py-2 pl-8 pr-2 outline-none font-bold uppercase tracking-wider appearance-none cursor-pointer"
        >
          {workspaces.map((ws) => (
            <option key={ws.id} value={ws.id} className="bg-slate-900">
              {ws.name}
            </option>
          ))}
          <option
            value="NEW_WORKSPACE"
            className="text-cyan-400 font-bold bg-slate-950"
          >
            {t("sidebar.newWorkspaceBtn")}
          </option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-10 flex items-center text-slate-500">
          <svg
            className="w-3 h-3"
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
        {activeWorkspaceId !== "default-vexor" && (
          <button
            onClick={() => setWsToDelete(activeWorkspaceId)}
            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-red-400 bg-slate-950 border border-slate-700 hover:border-red-900/50 rounded transition-colors"
            title={t("sidebar.removeTooltip")}
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
        )}
      </div>
      <div className="flex items-center justify-between bg-slate-900/30 p-2 rounded-lg border border-slate-800/50 mb-6">
        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-1.5">
          <svg
            className="w-3.5 h-3.5 text-cyan-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            ></path>
          </svg>
          {t("sidebar.exportGlobal")}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => onExportWorkspace("json")}
            className="px-2 py-1 text-[9px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 rounded transition-colors uppercase"
          >
            JSON
          </button>
          <button
            onClick={() => onExportWorkspace("html")}
            className="px-2 py-1 text-[9px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 rounded transition-colors uppercase"
          >
            HTML
          </button>
          <button
            onClick={() => onExportWorkspace("pdf")}
            className="px-2 py-1 text-[9px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 rounded transition-colors uppercase"
          >
            PDF
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-6">
        <button
          onClick={onAddProject}
          disabled={isProcessing}
          className="flex flex-col items-center justify-center gap-2 bg-cyan-950/30 hover:bg-cyan-900/50 text-cyan-400 p-3 rounded border border-cyan-900/50 hover:border-cyan-500/50 transition-all disabled:opacity-50"
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
              strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
          <span className="text-xs font-bold uppercase tracking-wider">
            {t("sidebar.btnAddLocal")}
          </span>
        </button>
        <button
          onClick={() => setIsRemoteModalOpen(true)}
          disabled={isProcessing}
          className="flex flex-col items-center justify-center gap-2 bg-indigo-950/30 hover:bg-indigo-900/50 text-indigo-400 p-3 rounded border border-indigo-900/50 hover:border-indigo-500/50 transition-all disabled:opacity-50 relative overflow-hidden group"
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
              strokeWidth={2}
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
          </svg>
          <span className="text-xs font-bold uppercase tracking-wider">
            {t("sidebar.btnAddRemote")}
          </span>
          <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-bl uppercase tracking-widest">
            {t("sidebar.remoteBadge", "Remoto")}
          </div>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {projects.length === 0 ? (
          <div className="text-sm text-slate-600 border border-slate-800 border-dashed rounded p-4 text-center whitespace-pre-wrap">
            {t("sidebar.emptyState")}
          </div>
        ) : (
          projects.map((proj) => (
            <ProjectCard
              key={proj.id}
              project={proj}
              isSelected={proj.id === selectedProjectId}
              onSelect={onSelectProject}
              isProcessing={isProcessing}
              onRemove={onRemoveProject}
              onRunCommand={onRunCommand}
            />
          ))
        )}
      </div>
      <CreateWorkspaceModal
        isOpen={isNewWsModalOpen}
        onClose={() => setIsNewWsModalOpen(false)}
        onCreate={addWorkspace}
      />
      <DeleteWorkspaceModal
        workspaceName={wsToDelete ? activeWsName : null}
        onClose={() => setWsToDelete(null)}
        onConfirm={() => {
          if (wsToDelete) removeWorkspace(wsToDelete);
          setWsToDelete(null);
        }}
      />
      <RemoteProjectModal
        isOpen={isRemoteModalOpen}
        onClose={() => setIsRemoteModalOpen(false)}
        onSubmit={onAddRemoteProject}
      />
      <AboutModal 
        isOpen={isAboutOpen} 
        onClose={() => setIsAboutOpen(false)} 
      />
    </aside>
  );
}
