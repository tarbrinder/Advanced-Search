import React, { useEffect, useState } from "react";
import axios from "axios";
import { SkipForward, ArrowRight } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

/**
 * Compact buyer-requirement assistant.
 * Shows ONE question at a time. Persona + product-extra questions inline.
 * Two-way sync via onAnswer().
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
  const [active, setActive] = useState(0);
  const [textVal, setTextVal] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setActive(0);
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
        const all = [...productQs, ...personaQs].slice(0, 6);
        setQuestions(all);
        setLoading(false);
      })
      .catch(() => {
        if (alive) setLoading(false);
      });
    return () => { alive = false; };
  }, [productName, JSON.stringify(filledSpecs), JSON.stringify(isqSpecs), quantity]);

  const cur = questions[active];
  const total = questions.length;
  const isLast = active === total - 1;

  const next = () => {
    setTextVal("");
    if (isLast) {
      onRefine();
    } else {
      setActive((a) => a + 1);
    }
  };

  const skip = () => {
    onAnswer(cur.name, null);
    next();
  };

  const choose = (val) => {
    onAnswer(cur.name, val);
    setTimeout(next, 180);
  };

  if (loading) {
    return (
      <div
        data-testid="buyer-assistant"
        className="rounded-[10px] border border-[#6d28d9]/20 bg-[#6d28d9]/5 px-3 py-2.5 flex items-center gap-2"
      >
        <span className="w-2 h-2 rounded-full bg-[#6d28d9] animate-pulse shrink-0" />
        <span className="text-[12px] text-slate-600 font-medium">Personalising your questions…</span>
      </div>
    );
  }

  if (!cur) {
    return (
      <div
        data-testid="buyer-assistant"
        className="rounded-[10px] border border-slate-200 bg-white px-3 py-2.5 flex items-center justify-between gap-2"
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

  const isText = cur.type === "text" || !cur.options || cur.options.length === 0;

  return (
    <div
      data-testid="buyer-assistant"
      className="rounded-[12px] border border-[#6d28d9]/25 bg-gradient-to-r from-[#6d28d9]/6 via-white to-[#0f1f5c]/5 px-4 py-3"
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-[10.5px] font-semibold text-[#6d28d9] tracking-wide uppercase">
          Refine · {active + 1}/{total}
        </span>
        <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#6d28d9] transition-all duration-300"
            style={{ width: `${((active + 1) / total) * 100}%` }}
          />
        </div>
        <button
          data-testid={`skip-${cur.name}`}
          onClick={skip}
          className="text-[10.5px] text-slate-400 hover:text-slate-700 flex items-center gap-1"
        >
          <SkipForward size={11} /> Skip
        </button>
      </div>

      <div className="flex items-center gap-3 flex-wrap" data-testid={`question-${cur.name}`}>
        <label className="text-[12.5px] font-bold text-slate-800 shrink-0">
          {cur.name}
          {cur.hint && (
            <span className="ml-1.5 text-[10.5px] font-normal text-slate-400">· {cur.hint}</span>
          )}
        </label>

        {isText ? (
          <div className="flex-1 flex items-center gap-2 min-w-[260px]">
            <input
              type="text"
              data-testid={`text-input-${cur.name}`}
              value={textVal}
              onChange={(e) => setTextVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && textVal.trim() && (onAnswer(cur.name, textVal.trim()), next())}
              placeholder={cur.hint || "Enter value..."}
              className="flex-1 h-8 px-3 text-[12px] rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#6d28d9]/30 focus:border-[#6d28d9]"
            />
            <button
              data-testid={`text-next-${cur.name}`}
              onClick={() => { if (textVal.trim()) { onAnswer(cur.name, textVal.trim()); next(); } else { skip(); } }}
              className="h-8 px-3 rounded-md bg-[#0f1f5c] hover:bg-[#172d80] text-white text-[11.5px] font-semibold flex items-center gap-1"
            >
              {isLast ? "Refine" : "Next"} <ArrowRight size={11} />
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5 flex-1">
            {cur.options.map((opt) => {
              const selected = answers[cur.name] === opt;
              return (
                <button
                  key={opt}
                  data-testid={`opt-${cur.name}-${opt}`}
                  onClick={() => choose(opt)}
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
    </div>
  );
}
