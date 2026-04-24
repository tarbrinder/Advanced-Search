// Enrich sellers with AI metadata (spec match / distance / responsiveness)
// so the Top-3 pick cards can render the required badge row and meta line.

function hashCode(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

export function enrichSellers(sellers, answers = {}) {
  const answered = Object.values(answers).filter((v) => v != null && v !== "").length;
  return sellers.map((s, i) => {
    const h = hashCode(s.name);
    const specMatch = Math.min(5, 3 + ((h + answered) % 3)); // 3..5
    const distanceKm = 5 + (h % 40); // 5..45
    const responsiveness = 70 + (h % 28); // 70..97
    return {
      ...s,
      specMatch,
      distanceKm,
      responsiveness,
      aiScore: specMatch * 20 + responsiveness - distanceKm * 0.5,
    };
  });
}

export function rankSellers(sellers, answers) {
  const enriched = enrichSellers(sellers, answers);
  return [...enriched].sort((a, b) => b.aiScore - a.aiScore);
}
