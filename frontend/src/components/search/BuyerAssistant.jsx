import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowRight } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

/**
 * Compact buyer-requirement assistant.
 * Shows EXACTLY 3 questions in a single row. No batching, no Skip.
 * On Submit fires onSubmit() (which shows the toaster) + onRefine().
 */
export default function BuyerAssistant({
  productName,
  filledSpecs,
  isqSpecs,
  quantity,
  answers,
  onAnswer,
  onSubmit,
}) {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
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
        const productQs = (res.data.suggested || []);
        const personaQs = res.data.persona || [];
        // Filter out free-text — chip-based only — take first 3
        const all = [...productQs, ...personaQs]
          .filter((q) => q.options && q.options.length > 0)
          .slice(0, 3);
        setQuestions(all);
        setLoading(false);
      })
      .catch(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [productName, JSON.stringify(filledSpecs), JSON.stringify(isqSpecs), quantity]);

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
          onClick={() => onSubmit?.()}
          className="h-8 px-3 rounded-md bg-[#0f1f5c] hover:bg-[#172d80] text-white text-[12px] font-semibold flex items-center gap-1"
        >
          Submit <ArrowRight size={12} />
        </button>
      </div>
    );
  }

  return (
    <div
      data-testid="buyer-assistant"
      className="rounded-[12px] border border-[#6d28d9]/25 bg-gradient-to-r from-[#6d28d9]/6 via-white to-[#0f1f5c]/5 px-4 py-2.5"
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-[12px] font-semibold text-[#0f1f5c]">
          Answer these questions to help me serve you better
        </span>
        <button
          data-testid="assistant-submit-btn"
          onClick={() => onSubmit?.()}
          className="ml-auto h-7 px-3 rounded-md bg-[#0f1f5c] hover:bg-[#172d80] text-white text-[11.5px] font-semibold flex items-center gap-1 transition-colors shrink-0"
        >
          Submit <ArrowRight size={11} />
        </button>
      </div>

      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${questions.length}, minmax(0, 1fr))` }}>
        {questions.map((q) => (
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
