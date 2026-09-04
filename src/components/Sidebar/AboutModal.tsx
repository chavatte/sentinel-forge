import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import sentinelLogo from "../../assets/sentinel.png";
import devLogo from "../../assets/devchavatte.png";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({
  isOpen,
  onClose,
}: AboutModalProps): ReactElement | null {
  const { i18n } = useTranslation();

  if (!isOpen) return null;

  const openLink = (url: string) => {
    window.open(url, "_blank");
  };

  const openDocs = () => {
    window.open(
      `./help.html?lang=${i18n.language}`,
      "_blank",
      "width=1100,height=800,nodeIntegration=no",
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-slate-700/50 rounded-xl shadow-[0_0_50px_rgba(6,182,212,0.1)] w-full max-w-md overflow-hidden relative">
        <div className="h-1 w-full bg-gradient-to-r from-cyan-600 via-indigo-500 to-rose-500"></div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 transition-colors"
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
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
        <div className="p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 rounded-full"></div>
              <img
                src={sentinelLogo}
                alt="Sentinel"
                className="w-20 h-20 relative z-10 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]"
              />
            </div>
            <h2 className="text-2xl font-black text-white mt-4 tracking-tight">
              Sentinel Forge
            </h2>
            <p className="text-cyan-500 font-mono text-xs uppercase tracking-[0.2em] mt-1 font-bold">
              Tactical EDR & AppSec
            </p>
            <span className="mt-3 bg-slate-900 border border-slate-700 text-slate-400 text-[10px] px-2 py-0.5 rounded font-mono font-bold tracking-wider">
              BUILD: v1.0.0-PROD
            </span>
          </div>
          <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-4 mb-8">
            <h3 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4 border-b border-slate-800 pb-2">
              System Intelligence
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="mt-0.5 text-emerald-400">
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">Engine</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    Electron + React + TypeScript
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-0.5 text-rose-400">
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">
                    Deep Scanner
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    Triple-Scan Tech (Direct + Transitive + SAST)
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-0.5 text-indigo-400">
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
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">
                    Global Threat Intel
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    Powered by OSV.dev (Google Security)
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="flex gap-2 mb-6">
            <button
              onClick={openDocs}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-cyan-700 transition-colors py-2 rounded text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2"
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                ></path>
              </svg>
              Manual
            </button>
            <button
              onClick={() => openLink("https://github.com/chavatte/sentinel-forge")}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-cyan-700 transition-colors py-2 rounded text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </button>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={devLogo}
                  alt="DevChavatte"
                  className="w-48 h-18 rounded "
                />
                <div>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Forged by
                  </p>
                  <p className="text-xs text-slate-300 font-bold tracking-wide">
                    DevChavatte
                  </p>
                </div>
              </div>
              {/* <div className="text-right">
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">
                  © {new Date().getFullYear()}
                </p>
                <p className="text-[9px] text-cyan-700 uppercase tracking-widest font-mono font-bold mt-0.5">
                  Classified Intel
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
