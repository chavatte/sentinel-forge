export type PackageManager = "npm" | "yarn" | "pnpm";
export type CommandType =
  | "dedupe"
  | "force-install"
  | "clean-cache"
  | "outdated"
  | "upgrade"
  | "upgradeLatest"
  | "audit"
  | "upgrade-selection"
  | "clean-cache-global";

export type Workspace = {
  id: string;
  name: string;
};

export type ScanSummary = {
  timestamp: string;
  total: number;
  critical: number;
  high: number;
  moderate: number;
  low: number;
  info: number;
  outdated?: number;
  fullReport?: any;
};

export type Project = {
  id: string;
  name: string;
  path: string;
  defaultManager?: PackageManager;
  workspaceId?: string;
  scanHistory?: ScanSummary[];
};

export interface IElectronAPI {
  selectFolder: (lang: string) => Promise<any>;
  selectFile: () => Promise<any>;
  showNotification: (title: string, body: string) => void;
  exportReport: (
    content: string,
    format: "json" | "html" | "pdf",
    defaultName: string,
    lang: string,
  ) => Promise<any>;
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;
  runSecurityAudit: (projectPath: string, manager: string) => void;
  onAuditResult: (callback: (result: any) => void) => void;
  onAuditError: (callback: (error: string) => void) => void;
  removeAuditListeners: () => void;
  runSilentAudit: (projectPath: string, manager: string) => void;
  onSilentAuditResult: (callback: (result: any) => void) => void;
  removeSilentAuditListeners: () => void;
  runCommand: (
    path: string,
    commandType: string,
    manager: string,
    lang: string,
    args?: string,
  ) => void;
  onTerminalLog: (callback: (log: string) => void) => void;
  onCommandFinished: (callback: (data: any) => void) => void;
  removeTerminalListeners: () => void;
  removeCommandFinishedListeners: () => void;
  addRemoteProject: (url: string, sshKeyPath?: string) => void;
  onRemoteProjectAdded: (callback: (project: any) => void) => void;
  removeRemoteProjectListeners: () => void;
  generateSbom: (
    projectPath: string,
  ) => Promise<{ success: boolean; data?: string; error?: string }>;
  syncWatchedProjects: (projects: { path: string; manager: string }[]) => void;
}

export interface OSVData {
  id: string;
  summary?: string;
  details?: string;
  modified: string;
  [key: string]: any;
}

export interface Vulnerability {
  name: string;
  title: string;
  severity: "info" | "low" | "moderate" | "high" | "critical";
  patchedIn?: string | null;
  url?: string | null;
  isDirect: boolean;
  fixAvailable: boolean | string;
  via: string[];
  effects: string[];
  sources?: string[];
  osvData?: OSVData[];
  blame?: {
    author: string;
    date: string;
    commit: string;
    message: string;
  } | null;
}

export interface AuditReportData {
  vulnerabilities: Record<string, Vulnerability>;
  outdated?: Record<
    string,
    { current: string; wanted: string; latest: string }
  >;
  sast?: string[];
  metadata: {
    vulnerabilities: {
      info: number;
      low: number;
      moderate: number;
      high: number;
      critical: number;
    };
    dependencies: {
      total: number;
    };
  };
}

declare global {
  interface Window {
    api: IElectronAPI;
  }
}
