export default async function handler(req, res) {
  const { symbols } = req.query;

  if (!symbols) {
    return res.status(400).json({ error: "Paramètre 'symbols' manquant" });
  }

  const list = symbols.split(",").map(sym => sym.trim().toUpperCase());

  // Exemple : simulation (à remplacer par ton vrai fetch vers un service ou parsing Boursorama)
  const fakeData = list.map((symbol, index) => ({
    symbol,
    price: (Math.random() * 100 + index * 10).toFixed(2),
    variation: (Math.random() * 2 - 1).toFixed(2) + "%",
    open: null,
    high: null,
    low: null,
    volume: null,
    last_update: new Date().toLocaleString("fr-FR"),
  }));

  return res.status(200).json(fakeData);
}
