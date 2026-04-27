import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { ArrowRight } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const BATCH_SIZE = 3;

/**
 * Compact buyer-requirement assistant.
 * Shows 2-3 questions at a time as a horizontal row.
 * Header copy: "Answer these questions to help me serve you better"
 * No Skip option. "Next" advances to the next batch (or fires onRefine on the last).
 */
export default function BuyerAssistant({
  productName,
  filledSpecs,
  isqSpecs,
  quantity,
  answers,
  onAnswer,
  onRefine,
}) {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [batch, setBatch] = useState(0);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setBatch(0);
    axios
      .post(`${API}/ai/refine-questions`, {
        product_name: productName,
        additional_notes: "",
        filled_specs: filledSpecs || {},
        isq_specs: isqSpecs || [],
        free_text_specs: [],
        quantity: Number(quantity) || 0,
      })
      .then((res) => {
        if (!alive) return;
        const productQs = (res.data.suggested || []).slice(0, 4);
        const personaQs = res.data.persona || [];
        // Filter out free-text questions (don't fit horizontal layout)
        const all = [...productQs, ...personaQs]
          .filter((q) => q.options && q.options.length > 0)
          .slice(0, 6);
        setQuestions(all);
        setLoading(false);
      })
      .catch(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [productName, JSON.stringify(filledSpecs), JSON.stringify(isqSpecs), quantity]);

  const totalBatches = Math.max(1, Math.ceil(questions.length / BATCH_SIZE));
  const visibleQs = useMemo(
    () => questions.slice(batch * BATCH_SIZE, (batch + 1) * BATCH_SIZE),
    [questions, batch]
  );

  const handleNext = () => {
    if (batch + 1 < totalBatches) setBatch(batch + 1);
    else onRefine();
  };

  if (loading) {
    return (
      <div
        data-testid="buyer-assistant"
        className="rounded-[10px] border border-[#6d28d9]/20 bg-[#6d28d9]/5 px-3 py-2 flex items-center gap-2"
      >
        <span className="w-2 h-2 rounded-full bg-[#6d28d9] animate-pulse shrink-0" />
        <span className="text-[12px] text-slate-600 font-medium">Personalising your questions…</span>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div
        data-testid="buyer-assistant"
        className="rounded-[10px] border border-slate-200 bg-white px-3 py-2 flex items-center justify-between gap-2"
      >
        <span className="text-[12px] text-slate-500">Want even better matches?</span>
        <button
          data-testid="refine-results-btn"
          onClick={onRefine}
          className="h-8 px-3 rounded-md bg-[#0f1f5c] hover:bg-[#172d80] text-white text-[12px] font-semibold flex items-center gap-1"
        >
          Refine <ArrowRight size={12} />
        </button>
      </div>
    );
  }

  const isLastBatch = batch + 1 >= totalBatches;

  return (
    <div
      data-testid="buyer-assistant"
      className="rounded-[12px] border border-[#6d28d9]/25 bg-gradient-to-r from-[#6d28d9]/6 via-white to-[#0f1f5c]/5 px-4 py-2.5"
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-[11.5px] font-semibold text-[#0f1f5c]">
          Answer these questions to help me serve you better
        </span>
        <span className="text-[10px] font-semibold text-[#6d28d9] uppercase tracking-wide ml-auto">
          {batch + 1}/{totalBatches}
        </span>
        <button
          data-testid="assistant-next-btn"
          onClick={handleNext}
          className="h-7 px-3 rounded-md bg-[#0f1f5c] hover:bg-[#172d80] text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
        >
          {isLastBatch ? "Refine" : "Next"} <ArrowRight size={11} />
        </button>
      </div>

      <div className={`grid grid-cols-${visibleQs.length} gap-4`} style={{ gridTemplateColumns: `repeat(${visibleQs.length}, minmax(0, 1fr))` }}>
        {visibleQs.map((q) => (
          <div key={q.name} data-testid={`question-${q.name}`} className="min-w-0">
            <div className="text-[11px] font-bold text-slate-800 truncate">
              {q.name}
              {q.hint && (
                <span className="ml-1 font-normal text-[10px] text-slate-400">· {q.hint}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {q.options.slice(0, 6).map((opt) => {
                const selected = answers[q.name] === opt;
                return (
                  <button
                    key={opt}
                    data-testid={`opt-${q.name}-${opt}`}
                    onClick={() => onAnswer(q.name, selected ? null : opt)}
                    className={`px-2 h-6 rounded-full text-[10.5px] font-medium transition-all border ${
                      selected
                        ? "bg-teal-500 text-white border-teal-500 shadow-sm"
                        : "bg-white text-slate-600 border-slate-200 hover:border-teal-400 hover:text-teal-700"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
