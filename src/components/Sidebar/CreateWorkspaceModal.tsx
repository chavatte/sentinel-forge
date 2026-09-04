import { useState } from "react";
import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export function CreateWorkspaceModal({
  isOpen,
  onClose,
  onCreate,
}: Props): ReactElement | null {
  const { t } = useTranslation();
  const [newWsName, setNewWsName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWsName.trim()) {
      onCreate(newWsName.trim());
      setNewWsName("");
      onClose();
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0d1117] border border-cyan-500/30 rounded-lg p-5 w-full shadow-[0_0_30px_rgba(34,211,238,0.1)]">
        <h3 className="text-cyan-400 font-mono font-bold text-sm mb-3">
          {t("sidebar.createWorkspaceTitle")}
        </h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            required
            autoFocus
            placeholder={t("sidebar.createWorkspacePlaceholder")}
            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 mb-4"
            value={newWsName}
            onChange={(e) => setNewWsName(e.target.value)}
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => {
                setNewWsName("");
                onClose();
              }}
              className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-200 uppercase tracking-wider transition-colors"
            >
              {t("sidebar.modalCancel")}
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-bold bg-cyan-700 hover:bg-cyan-600 text-white rounded uppercase tracking-wider transition-colors shadow-lg"
            >
              {t("sidebar.btnCreateWorkspace")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
