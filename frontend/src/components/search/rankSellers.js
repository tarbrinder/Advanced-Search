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
    const yearsExp = 3 + (h % 13); // 3..15 yrs
    // Generate a stable Indian mobile number per seller
    const last7 = (h % 9000000) + 1000000;
    const prefix = ["98", "97", "96", "99", "70", "82", "85"][h % 7];
    const mid = String((h >> 4) % 100).padStart(2, "0");
    const phone = `+91 ${prefix}${mid}${String(last7).slice(0, 1)} ${String(last7).slice(1)}`;
    return {
      ...s,
      trustSeal,
      paymentProtected,
      phone,
      yearsExp,
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
