export default async function handler(req, res) {
  const { symbols } = req.query;

  if (!symbols) {
    return res.status(400).json({ error: 'Aucun symbole fourni.' });
  }

  try {
    const list = symbols.split(',').map(s => s.trim().toUpperCase());
    const results = [];

    for (const symbol of list) {
      const url = `https://www.boursorama.com/bourse/action/graph/ws/${symbol}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        results.push({
          symbol,
          price: 'N/A',
          variation: 'N/A',
          last_update: null,
          error: `Erreur pour ${symbol}`
        });
        continue;
      }

      const json = await response.json();
      const last = json?.series?.at(-1);

      results.push({
        symbol,
        price: last?.close ?? 'N/A',
        variation: last?.variation ?? 'N/A',
        last_update: new Date().toLocaleString('fr-FR')
      });
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur', detail: error.message });
  }
}
