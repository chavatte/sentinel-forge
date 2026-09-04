import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import logoImg from "../../assets/sentinel.png";

export function TitleBar(): ReactElement {
  const { t } = useTranslation();

  const handleMinimize = () => (window as any).api.minimizeWindow();
  const handleMaximize = () => (window as any).api.maximizeWindow();
  const handleClose = () => (window as any).api.closeWindow();

  return (
    <div className="h-8 bg-[#090D14] border-b border-slate-800 flex items-center justify-between shrink-0 select-none [-webkit-app-region:drag]">
      <div className="flex items-center gap-2 pl-3">
        <img
          src={logoImg}
          alt="Icon"
          className="w-4 h-4 opacity-80 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]"
        />
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">
          {t("titlebar.appTitle")} <span className="text-cyan-600/50">|</span>{" "}
          {t("titlebar.appSubtitle")}
        </span>
      </div>
      <div className="flex h-full [-webkit-app-region:no-drag]">
        <button
          onClick={handleMinimize}
          className="h-full px-4 flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-cyan-400 transition-colors"
          title={t("titlebar.minimize")}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 12H4"
            ></path>
          </svg>
        </button>
        <button
          onClick={handleMaximize}
          className="h-full px-4 flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-emerald-400 transition-colors"
          title={t("titlebar.maximize")}
        >
          <svg
            className="w-3 h-3"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 24 24"
          >
            <rect
              x="4"
              y="4"
              width="16"
              height="16"
              strokeWidth="2"
              rx="1"
            ></rect>
          </svg>
        </button>
        <button
          onClick={handleClose}
          className="h-full px-4 flex items-center justify-center text-slate-400 hover:bg-rose-600 hover:text-white transition-colors"
          title={t("titlebar.close")}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
