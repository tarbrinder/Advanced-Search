import React, { useEffect, useState } from "react";

const STAGES = [
  "Reaching out to verified sellers",
  "Matching your specifications",
  "Checking proximity & trust scores",
  "Comparing prices across catalogs",
  "Filtering for response time",
  "Curating your top matches",
];

/**
 * Loading animation — single rotating message (one at a time),
 * thin progress bar at top.
 */
export default function AILoading({ durationMs = 5500, onDone }) {
  const [stageIdx, setStageIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stageStep = durationMs / STAGES.length;
    const timer = setInterval(() => {
      setStageIdx((i) => (i + 1) % STAGES.length);
    }, stageStep);

    const start = Date.now();
    const tick = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - start) / durationMs) * 100);
      setProgress(pct);
      if (pct >= 100) clearInterval(tick);
    }, 60);

    const done = setTimeout(() => onDone?.(), durationMs + 150);
    return () => {
      clearInterval(timer);
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
        </div>

        {/* Single rotating message */}
        <div className="h-7 flex items-center justify-center" data-testid="ai-stage-label">
          <span
            key={stageIdx}
            className="text-[14px] font-semibold text-[#0f1f5c] animate-[fadeSwap_0.45s_ease-out]"
          >
            {STAGES[stageIdx]}…
          </span>
        </div>
      </div>

      <style>{`
        @keyframes fadeSwap {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
