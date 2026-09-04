import { useState } from "react";
import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string, sshKeyPath?: string) => void;
}

export function RemoteProjectModal({
  isOpen,
  onClose,
  onSubmit,
}: Props): ReactElement | null {
  const { t } = useTranslation();
  const [urlInput, setUrlInput] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [sshKeyPath, setSshKeyPath] = useState("");

  if (!isOpen) return null;

  const handleSelectKey = async () => {
    const { api } = window;
    if (!api || !api.selectFile) return;
    const filePath = await api.selectFile();
    if (filePath) setSshKeyPath(filePath);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onSubmit(urlInput.trim(), isPrivate ? sshKeyPath : undefined);
      setUrlInput("");
      setIsPrivate(false);
      setSshKeyPath("");
      onClose();
    }
  };

  const handleCancel = () => {
    setUrlInput("");
    setIsPrivate(false);
    setSshKeyPath("");
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0d1117] border border-indigo-500/30 rounded-lg p-5 w-full shadow-[0_0_30px_rgba(99,102,241,0.1)]">
        <h3 className="text-indigo-400 font-mono font-bold text-sm mb-3 flex items-center gap-2">
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
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          {t("sidebar.modalRemoteTitle")}
        </h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            required
            autoFocus
            placeholder={
              isPrivate
                ? "git@github.com:user/repo.git"
                : "https://github.com/user/repo.git"
            }
            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-600 mb-4"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <label className="flex items-center gap-2 mb-3 text-sm text-slate-400 cursor-pointer hover:text-slate-300 transition-colors">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            />
            {t("sidebar.modalPrivate")}
          </label>
          {isPrivate && (
            <div className="mb-5 flex gap-2 animate-in slide-in-from-top-2 duration-200">
              <input
                type="text"
                readOnly
                required={isPrivate}
                placeholder={t("sidebar.modalSshPlaceholder")}
                value={sshKeyPath}
                className="flex-1 bg-slate-950/50 border border-slate-800 rounded p-2 text-xs text-slate-500 font-mono opacity-80 cursor-not-allowed"
              />
              <button
                type="button"
                onClick={handleSelectKey}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 rounded border border-slate-700 text-xs font-bold transition-colors whitespace-nowrap"
              >
                {t("sidebar.btnSelect")}
              </button>
            </div>
          )}
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-200 uppercase tracking-wider transition-colors"
            >
              {t("sidebar.modalCancel")}
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded uppercase tracking-wider transition-colors shadow-lg shadow-indigo-900/20 disabled:opacity-50"
            >
              {t("sidebar.modalConnect")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
