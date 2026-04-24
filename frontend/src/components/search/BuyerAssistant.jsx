import React, { useEffect, useState } from "react";
import axios from "axios";
import { Sparkles, SkipForward } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

/**
 * Inline buyer-requirement assistant.
 * - Fetches dynamic spec questions from Gemini via /api/ai/refine-questions
 * - Chip-based answers (or text input) with Skip
 * - Calls onAnswer(specName, value) for two-way sync with left filter panel
 * - Refine button triggers onRefine()
 */
export default function BuyerAssistant({
  productName,
  filledSpecs,
  isqSpecs,
  answers,
  onAnswer,
  onRefine,
}) {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [textInputs, setTextInputs] = useState({});

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
      })
      .then((res) => {
        if (!alive) return;
        const relevantIsq = (res.data.isq_classified || []).filter(
          (q) => q.status === "RELEVANT" && q.options && q.options.length > 0
        );
        const suggested = res.data.suggested || [];
        setQuestions([...relevantIsq, ...suggested].slice(0, 6));
        setLoading(false);
      })
      .catch(() => {
        if (alive) setLoading(false);
      });
    return () => { alive = false; };
  }, [productName, JSON.stringify(filledSpecs), JSON.stringify(isqSpecs)]);

  return (
    <div
      data-testid="buyer-assistant"
      className="rounded-[12px] border border-[#6d28d9]/20 bg-gradient-to-br from-[#6d28d9]/5 via-white to-[#0f1f5c]/5 p-4"
    >
      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={15} className="text-[#6d28d9]" />
        <h4 className="text-[13px] font-bold text-[#0f1f5c]">
          Help us find an even better match
        </h4>
      </div>
      <p className="text-[11.5px] text-slate-500 mb-3">
        Answer a few quick questions to refine your results.
      </p>

      {loading && (
        <div className="flex items-center gap-2 py-4 text-[12px] text-slate-500">
          <span className="w-2 h-2 rounded-full bg-[#6d28d9] animate-pulse" />
          <span>Generating smart questions…</span>
        </div>
      )}

      {!loading && questions.length === 0 && (
        <div className="text-[12px] text-slate-500 py-3">
          No refinement questions available.
        </div>
      )}

      {!loading && questions.length > 0 && (
        <div className="space-y-3.5">
          {questions.map((q) => {
            const isText = q.type === "text" || !q.options || q.options.length === 0;
            return (
              <div key={q.name} data-testid={`question-${q.name}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <label className="text-[12px] font-semibold text-slate-800">
                    {q.name}
                  </label>
                  {q.hint && (
                    <span className="text-[10.5px] text-slate-400">· {q.hint}</span>
                  )}
                  <button
                    data-testid={`skip-${q.name}`}
                    onClick={() => onAnswer(q.name, null)}
                    className="ml-auto inline-flex items-center gap-1 text-[10.5px] text-slate-400 hover:text-slate-600"
                  >
                    <SkipForward size={10} />
                    Skip
                  </button>
                </div>

                {isText ? (
                  <input
                    type="text"
                    data-testid={`text-input-${q.name}`}
                    value={textInputs[q.name] || ""}
                    onChange={(e) => {
                      setTextInputs({ ...textInputs, [q.name]: e.target.value });
                      onAnswer(q.name, e.target.value);
                    }}
                    placeholder={q.hint || "Enter value..."}
                    className="w-full h-8 px-3 text-[12px] rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#6d28d9]/30 focus:border-[#6d28d9]"
                  />
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {q.options.map((opt) => {
                      const selected = answers[q.name] === opt;
                      return (
                        <button
                          key={opt}
                          data-testid={`opt-${q.name}-${opt}`}
                          onClick={() => onAnswer(q.name, selected ? null : opt)}
                          className={`px-2.5 h-7 rounded-full text-[11px] font-medium transition-all border ${
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
                )}
              </div>
            );
          })}
        </div>
      )}

      <button
        data-testid="refine-results-btn"
        onClick={onRefine}
        disabled={loading}
        className="mt-4 w-full h-10 rounded-md bg-[#0f1f5c] hover:bg-[#172d80] disabled:opacity-50 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        Refine My Results →
      </button>
    </div>
  );
}
