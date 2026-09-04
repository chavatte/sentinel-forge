import { useState, useEffect } from "react";
import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import logoImg from "../../assets/sentinel.png";

type SentinelLoaderProps = {
  onComplete: () => void;
};

export function SentinelLoader({
  onComplete,
}: SentinelLoaderProps): ReactElement {
  const { t } = useTranslation();
  const messages = [
    t("loader.step1"),
    t("loader.step2"),
    t("loader.step3"),
    t("loader.step4"),
  ];

  const [msgIndex, setMsgIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => {
        if (prev < messages.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 800);
    const finishTimeout = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(onComplete, 500);
    }, 3500);

    return () => {
      clearInterval(interval);
      clearTimeout(finishTimeout);
    };
  }, [messages.length, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950 font-mono text-slate-300 transition-opacity duration-500 ${isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <style>{`
        @keyframes pulse-glow-img {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(34, 211, 238, 0.2)); }
          50% { filter: drop-shadow(0 0 20px rgba(34, 211, 238, 0.8)); }
        }
        @keyframes loader-indeterminate {
          0% { left: -40%; width: 30%; }
          50% { width: 60%; }
          100% { left: 100%; width: 30%; }
        }
      `}</style>
      <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="relative mb-6">
          <img
            src={logoImg}
            alt="Sentinel Forge Logo"
            className="w-16 h-16 object-contain"
            style={{ animation: "pulse-glow-img 2s infinite" }}
          />
        </div>
        <div className="text-4xl font-bold tracking-[0.2em] text-slate-100 uppercase mb-1">
          Sentinel<span className="text-cyan-400">Forge</span>
        </div>
        <div className="text-xs text-slate-500 tracking-[0.2em] mb-1 uppercase font-semibold">
          {t("loader.subtitle")}
        </div>
        <div className="text-[10px] text-slate-700 tracking-wider mb-12">
          {t("loader.builtBy")}
        </div>
        <div className="w-80 h-1.5 bg-slate-900 border border-slate-800 rounded-full relative overflow-hidden mb-5 shadow-inner">
          <div className="absolute top-0 h-full bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-loader-indeterminate"></div>
        </div>
        <div className="text-xs text-cyan-500 uppercase tracking-widest animate-pulse font-bold">
          {messages[msgIndex]}
        </div>
      </div>
    </div>
  );
}
