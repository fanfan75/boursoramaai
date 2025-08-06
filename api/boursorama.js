import fetch from "node-fetch";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  const { symbols } = req.query;
  if (!symbols) {
    return res.status(400).json({ error: "Missing symbols parameter" });
  }

  const list = symbols.split(",").map(s => s.trim().toUpperCase());
  const results = [];

  for (const symbol of list) {
    const url = `https://www.boursorama.com/cours/${symbol}/`;
    try {
      const page = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36",
          "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8"
        }
      });

      const html = await page.text();
      const $ = cheerio.load(html);

      const price = $('span.c-instrument.c-instrument--last').first().text().trim();
      const variation = $('span.c-instrument.c-instrument--variation').first().text().trim();

      const cells = $('div.c-table__cell').map((i, el) => $(el).text().trim()).get();
      const [open, high, low, volume] = [cells[0], cells[1], cells[2], cells[3]];

      results.push({
        symbol,
        price: price || null,
        variation: variation || null,
        open: open || null,
        high: high || null,
        low: low || null,
        volume: volume || null,
        last_update: new Date().toLocaleString("fr-FR")
      });
    } catch (err) {
      console.error("Erreur scraping pour", symbol, err);
      results.push({
        symbol,
        error: "Scraping failed",
        last_update: new Date().toLocaleString("fr-FR")
      });
    }
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json(results);
}
