import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";

export type SemVerType = "MAJOR" | "MINOR" | "PATCH" | "UNKNOWN";

export const getUpdateType = (current: string, latest: string): SemVerType => {
  if (!current || !latest || current === "?" || latest === "?")
    return "UNKNOWN";

  const cleanCurrent = current.replace(/^[^\d]+/, "");
  const cleanLatest = latest.replace(/^[^\d]+/, "");
  const [cMajor, cMinor, cPatch] = cleanCurrent.split(".").map(Number);
  const [lMajor, lMinor, lPatch] = cleanLatest.split(".").map(Number);

  if (lMajor > cMajor) return "MAJOR";
  if (lMajor === cMajor && lMinor > cMinor) return "MINOR";
  if (lMajor === cMajor && lMinor === cMinor && lPatch > cPatch) return "PATCH";

  return "UNKNOWN";
};

export function SemVerBadge({
  type,
}: {
  type: SemVerType | string;
}): ReactElement | null {
  const { t } = useTranslation();

  switch (type) {
    case "MAJOR":
      return (
        <span className="text-[11px] font-bold text-rose-500 border border-rose-500/40 bg-rose-500/10 px-1.5 py-0.5 rounded tracking-wider ml-2">
          {t("semver.major")}
        </span>
      );
    case "MINOR":
      return (
        <span className="text-[11px] font-bold text-amber-500 border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 rounded tracking-wider ml-2">
          {t("semver.minor")}
        </span>
      );
    case "PATCH":
      return (
        <span className="text-[11px] font-bold text-slate-400 border border-slate-600 bg-slate-800/50 px-1.5 py-0.5 rounded tracking-wider ml-2">
          {t("semver.patch")}
        </span>
      );
    default:
      return null;
  }
}
