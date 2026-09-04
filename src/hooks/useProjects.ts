import { useState, useEffect, useCallback, useMemo } from "react";
import type { Project, Workspace, ScanSummary } from "../types";
import { useTranslation } from "react-i18next";

export function useProjects() {
  const { t, i18n } = useTranslation();
  const DEFAULT_WORKSPACE: Workspace = useMemo(() => ({ 
    id: "default", 
    name: t("dashboard.defaultWorkspace", "Default Workspace") 
  }), [t]);

  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => {
    const saved = localStorage.getItem("sentinel-workspaces");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [DEFAULT_WORKSPACE];
      }
    }
    return [DEFAULT_WORKSPACE];
  });

  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(() => {
    return (
      localStorage.getItem("sentinel-active-workspace") || DEFAULT_WORKSPACE.id
    );
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem("sentinel-forge-projects");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Project[];
        return parsed.map((p) => ({
          ...p,
          workspaceId: p.workspaceId || DEFAULT_WORKSPACE.id,
        }));
      } catch (e) {
        console.error(`[Sentinel Forge] ${t("messages.cacheError")}`, e);
        return [];
      }
    }
    return [];
  });

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    localStorage.setItem("sentinel-workspaces", JSON.stringify(workspaces));
  }, [workspaces]);

  useEffect(() => {
    localStorage.setItem("sentinel-active-workspace", activeWorkspaceId);
  }, [activeWorkspaceId]);

  useEffect(() => {
    localStorage.setItem("sentinel-forge-projects", JSON.stringify(projects));
  }, [projects]);

  const addWorkspace = useCallback((name: string) => {
    const newWs: Workspace = { id: `ws-${Date.now()}`, name };
    setWorkspaces((prev) => [...prev, newWs]);
    setActiveWorkspaceId(newWs.id);
  }, []);

  const removeWorkspace = useCallback(
    (id: string) => {
      if (id === DEFAULT_WORKSPACE.id) return;
      setWorkspaces((prev) => prev.filter((ws) => ws.id !== id));
      setProjects((prev) => prev.filter((p) => p.workspaceId !== id));
      if (activeWorkspaceId === id) setActiveWorkspaceId(DEFAULT_WORKSPACE.id);
    },
    [activeWorkspaceId, DEFAULT_WORKSPACE.id],
  );

  const addProject = useCallback(
    (project: Project) => {
      setProjects((prev) => [
        ...prev,
        { ...project, workspaceId: activeWorkspaceId },
      ]);
    },
    [activeWorkspaceId],
  );

  const removeProject = useCallback(
    (id: string) => {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (selectedProjectId === id) setSelectedProjectId(null);
    },
    [selectedProjectId],
  );

  const projectExists = useCallback(
    (path: string) => {
      return projects.some(
        (p) => p.path === path && p.workspaceId === activeWorkspaceId,
      );
    },
    [projects, activeWorkspaceId],
  );

  const activeProjects = useMemo(() => {
    return projects.filter((p) => p.workspaceId === activeWorkspaceId);
  }, [projects, activeWorkspaceId]);

  const selectedProject = activeProjects.find(
    (p) => p.id === selectedProjectId,
  );

  const runProjectCommand = useCallback(
    (commandType: string, args: string = "") => {
      if (!selectedProject) return;
      const manager = selectedProject.defaultManager || "yarn";
      (window as any).api.runCommand(
        selectedProject.path,
        commandType,
        manager,
        i18n.language,
        args,
      );
    },
    [selectedProject, i18n.language],
  );

  const addScanByPath = useCallback((path: string, summary: ScanSummary) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.path === path) {
          const currentHistory = p.scanHistory || [];
          const newHistory = [summary, ...currentHistory].slice(0, 5);
          return { ...p, scanHistory: newHistory };
        }
        return p;
      }),
    );
  }, []);

  return {
    workspaces,
    activeWorkspaceId,
    setActiveWorkspaceId,
    addWorkspace,
    removeWorkspace,
    projects: activeProjects,
    addProject,
    removeProject,
    projectExists,
    addScanByPath,
    selectedProjectId,
    setSelectedProjectId,
    selectedProject,
    runProjectCommand,
  };
}