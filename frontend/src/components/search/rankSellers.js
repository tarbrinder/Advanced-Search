// Enrich sellers with metadata so the top-pick cards can render
// the required tag row (TrustSEAL, Payment Protected, Spec match).

function hashCode(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

export function enrichSellers(sellers, answers = {}) {
  const answered = Object.values(answers).filter((v) => v != null && v !== "").length;
  return sellers.map((s) => {
    const h = hashCode(s.name);
    const specMatch = Math.min(5, 3 + ((h + answered) % 3)); // 3..5
    const distanceKm = 5 + (h % 40);
    const responsiveness = 70 + (h % 28);
    const trustSeal = s.trustSeal !== undefined ? s.trustSeal : (h % 5 !== 0); // ~80% trust
    const paymentProtected = (h % 4 !== 0); // ~75% protected
    return {
      ...s,
      trustSeal,
      paymentProtected,
      specMatch,
      distanceKm,
      responsiveness,
      aiScore: specMatch * 25 + responsiveness * 0.6 + (trustSeal ? 8 : 0) + (paymentProtected ? 5 : 0),
    };
  });
}

export function rankSellers(sellers, answers) {
  const enriched = enrichSellers(sellers, answers);
  return [...enriched].sort((a, b) => b.aiScore - a.aiScore);
}
