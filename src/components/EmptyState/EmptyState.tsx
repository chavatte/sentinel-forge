import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import logoImg from "../../assets/sentinel.png";
import devChavatte from "../../assets/devchavatte.png";

export function EmptyState(): ReactElement {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex items-center justify-center relative z-0 select-none pointer-events-none bg-slate-900">
      <div className="flex flex-col items-center justify-center opacity-10">
        <img
          src={logoImg}
          alt="Background Logo"
          className="w-40 h-40 drop-shadow-[0_0_30px_rgba(34,211,238,0.8)] grayscale mix-blend-screen"
        />
        <h1 className="mt-8 text-2xl font-bold tracking-[0.3em] uppercase font-mono text-slate-400">
          Sentinel Forge
        </h1>
        <p className="mt-3 text-xs tracking-widest font-mono text-slate-500">
          {t("emptyState.waiting")}
        </p>
      </div>
      <img
        src={devChavatte}
        alt="DevChavatte Signature"
        className="absolute bottom-8 right-8 w-50 opacity-30 grayscale mix-blend-screen"
      />
    </div>
  );
}
