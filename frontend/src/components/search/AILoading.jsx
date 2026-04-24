import React, { useEffect, useState } from "react";

const STAGES = [
  "Building seller universe…",
  "Matching your specifications…",
  "Checking proximity & trust scores…",
  "Curating your top matches…",
];

/**
 * Loading animation — 5–6 seconds (or `durationMs`), 4 sequential stage labels,
 * thin progress bar at top, subtle footer.
 */
export default function AILoading({ durationMs = 5500, onDone }) {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stageStep = durationMs / STAGES.length;
    const stageTimers = STAGES.map((_, i) =>
      setTimeout(() => setStage(i + 1), i * stageStep)
    );
    const start = Date.now();
    const tick = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - start) / durationMs) * 100);
      setProgress(pct);
      if (pct >= 100) clearInterval(tick);
    }, 60);
    const done = setTimeout(() => onDone?.(), durationMs + 200);
    return () => {
      stageTimers.forEach(clearTimeout);
      clearInterval(tick);
      clearTimeout(done);
    };
  }, [durationMs, onDone]);

  return (
    <div className="relative h-full flex flex-col" data-testid="ai-loading">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-slate-100 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#0f1f5c] via-[#6d28d9] to-[#0a6640] transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Orbiting dots */}
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 rounded-full border-2 border-slate-100" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#0f1f5c] to-[#6d28d9] opacity-10 animate-pulse" />
          <div className="absolute inset-0 animate-[spin_2.2s_linear_infinite]">
            <span className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#0f1f5c]" />
            <span className="absolute top-1/2 right-0 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#6d28d9]" />
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#0a6640]" />
            <span className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 rounded-full bg-[#b45309]" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0f1f5c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l2.39 6.95L22 10l-5.61 4.09L18.18 22 12 17.77 5.82 22l1.79-7.91L2 10l7.61-1.05z" />
            </svg>
          </div>
        </div>

        <div className="space-y-2.5 min-h-[140px]">
          {STAGES.map((label, i) => {
            const visible = i < stage;
            const active = i === stage - 1;
            return (
              <div
                key={label}
                data-testid={`ai-stage-${i}`}
                className={`flex items-center gap-2.5 justify-center transition-all duration-500 ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
              >
                {visible && !active && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0a6640" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {active && (
                  <span className="w-2 h-2 rounded-full bg-[#6d28d9] animate-pulse" />
                )}
                <span
                  className={`text-[13px] font-medium ${
                    active ? "text-[#0f1f5c]" : "text-slate-500"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pb-6 text-center">
        <span className="text-[11px] text-slate-400 tracking-wide">
          Analysing filters + your search query
        </span>
      </div>
    </div>
  );
}
