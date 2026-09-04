import { useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";

type TerminalProps = {
  logs: string[];
  isProcessing: boolean;
  onClear: () => void;
};

export function Terminal({
  logs,
  isProcessing,
  onClear,
}: TerminalProps): ReactElement {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const logsRendered = useRef<number>(0);
  const { t } = useTranslation();
  const [isMinimized, setIsMinimized] = useState(false);
  const [height, setHeight] = useState<number>(230);
  const [isDraggingState, setIsDraggingState] = useState(false);
  const isDragging = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;

      const newHeight = window.innerHeight - e.clientY;

      if (newHeight > 100 && newHeight < window.innerHeight - 100) {
        setHeight(newHeight);
        if (isMinimized) setIsMinimized(false);
      }
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        setIsDraggingState(false);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isMinimized]);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new XTerm({
      theme: {
        background: "#090D14",
        foreground: "#cbd5e1",
        cursor: "#22d3ee",
        cursorAccent: "#090D14",
        selectionBackground: "rgba(34, 211, 238, 0.2)",
        black: "#0f172a",
        red: "#ef4444",
        green: "#10b981",
        yellow: "#f59e0b",
        blue: "#3b82f6",
        magenta: "#8b5cf6",
        cyan: "#06b6d4",
        white: "#f8fafc",
        brightBlack: "#334155",
        brightRed: "#f87171",
        brightGreen: "#34d399",
        brightYellow: "#fbbf24",
        brightBlue: "#60a5fa",
        brightMagenta: "#a78bfa",
        brightCyan: "#22d3ee",
        brightWhite: "#ffffff",
      },
      fontFamily:
        '"Fira Code", "Cascadia Code", "JetBrains Mono", Consolas, monospace',
      fontSize: 13,
      fontWeight: "500",
      cursorBlink: true,
      cursorStyle: "block",
      disableStdin: true,
      convertEol: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;
    let initialFitTimeout: ReturnType<typeof setTimeout>;

    const safeFit = () => {
      if (
        fitAddonRef.current &&
        terminalRef.current &&
        terminalRef.current.clientWidth > 0
      ) {
        try {
          fitAddonRef.current.fit();
        } catch (error) {
          console.debug("[Sentinel Forge]: XTerm fit evitado.", error);
        }
      }
    };

    initialFitTimeout = setTimeout(safeFit, 50);
    let resizeTimeout: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        requestAnimationFrame(safeFit);
      }, 100);
    };

    window.addEventListener("resize", handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(terminalRef.current);

    return () => {
      clearTimeout(initialFitTimeout);
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
      term.dispose();
    };
  }, []);

  useEffect(() => {
    if (!xtermRef.current) return;

    if (logs.length < logsRendered.current) {
      xtermRef.current.clear();
      xtermRef.current.reset();
      logsRendered.current = 0;
    }

    for (let i = logsRendered.current; i < logs.length; i++) {
      const chunk = logs[i];
      xtermRef.current.write(chunk);
    }
    logsRendered.current = logs.length;
  }, [logs]);

  const transitionClass = isDraggingState
    ? ""
    : "transition-all duration-300 ease-in-out";
  const flexStyle = {
    flex: "none",
    height: isMinimized ? "56px" : `${height}px`,
  };

  return (
    <main
      style={flexStyle}
      className={`relative w-full flex flex-col bg-[#090D14] border-t border-slate-800 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-20 ${transitionClass}`}
    >
      <div
        onMouseDown={() => {
          isDragging.current = true;
          setIsDraggingState(true);
          document.body.style.cursor = "ns-resize";
          document.body.style.userSelect = "none";
        }}
        className="absolute top-0 left-0 w-full h-1.5 cursor-ns-resize hover:bg-cyan-500/50 z-30 transition-colors"
      />
      <header
        onDoubleClick={() => setIsMinimized(!isMinimized)}
        className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 shrink-0 z-10 select-none cursor-pointer group"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
            className="w-6 h-6 flex items-center justify-center rounded bg-slate-800 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 transition-colors"
            title={
              isMinimized ? t("terminal.maximize") : t("terminal.minimize")
            }
          >
            {isMinimized ? (
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
                  d="M5 15l7-7 7 7"
                ></path>
              </svg>
            ) : (
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
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            )}
          </button>
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isProcessing ? "bg-amber-400" : "bg-emerald-400"}`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${isProcessing ? "bg-amber-500" : "bg-emerald-500"}`}
              ></span>
            </span>
            <span className="text-sm font-medium text-slate-400 group-hover:text-slate-200 transition-colors">
              {isProcessing ? t("terminal.running") : t("terminal.standby")}
            </span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-rose-400 transition-colors px-2 py-1 rounded hover:bg-slate-800"
        >
          {t("terminal.clearConsole")}
        </button>
      </header>
      <div
        className={`flex-1 relative w-full overflow-hidden p-4 ${isMinimized ? "hidden" : "block"}`}
      >
        <div className="absolute inset-4" ref={terminalRef} />
      </div>
    </main>
  );
}
