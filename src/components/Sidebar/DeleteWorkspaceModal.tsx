import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  workspaceName: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteWorkspaceModal({
  workspaceName,
  onClose,
  onConfirm,
}: Props): ReactElement | null {
  const { t } = useTranslation();

  if (!workspaceName) return null;

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0d1117] border border-red-500/30 rounded-lg p-5 w-full shadow-[0_0_30px_rgba(239,68,68,0.1)]">
        <h3 className="text-red-400 font-mono font-bold text-sm mb-3 flex items-center gap-2">
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
          {t("sidebar.destroyWarningTitle")}
        </h3>
        <p className="text-slate-300 text-xs mb-4">
          {t("sidebar.destroyWarningText1")}{" "}
          <strong className="text-red-400 uppercase">[{workspaceName}]</strong>{" "}
          {t("sidebar.destroyWarningText2")}
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-200 uppercase tracking-wider transition-colors"
          >
            {t("sidebar.modalCancel")}
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1.5 text-xs font-bold bg-red-700 hover:bg-red-600 text-white rounded uppercase tracking-wider transition-colors shadow-lg"
          >
            {t("sidebar.btnDestroyAll")}
          </button>
        </div>
      </div>
    </div>
  );
}
