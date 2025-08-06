export default async function handler(req, res) {
  const { symbols } = req.query;

  if (!symbols) {
    return res.status(400).json({ error: "Paramètre 'symbols' manquant" });
  }

  const apiKey = "d29khkpr01qhoencpnb0d29khkpr01qhoencpnbg";

  // Dictionnaire de correspondance nom → ticker Finnhub
  const mapping = {
    "BNP": "BNP.PA",
    "HERMÈS": "RMS.PA",
    "HERMES": "RMS.PA",
    "LVMH": "MC.PA",
    "SANOFI": "SAN.PA",
    "AIRBUS": "AIR.PA",
    "TOTAL": "TTE.PA",
    "DANONE": "BN.PA",
    "RENAULT": "RNO.PA",
    "STMICROELECTRONICS": "STM.PA",
    "ENGIE": "ENGI.PA",
    "SOCIETE GENERALE": "GLE.PA",
    "CARREFOUR": "CA.PA",
    "AXA": "CS.PA",
    "VEOLIA": "VIE.PA"
    // ➕ tu peux en ajouter ici facilement
  };

  const list = symbols.split(",").map(s => s.trim().toUpperCase());
  const results = [];

  for (const name of list) {
    const ticker = mapping[name] || name;

    try {
      const url = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.c && data.pc) {
        results.push({
          name,
          symbol: ticker,
          price: data.c,
          variation: ((data.c - data.pc) / data.pc * 100).toFixed(2) + "%",
          last_update: new Date().toLocaleString("fr-FR")
        });
      } else {
        results.push({ name, error: "Données indisponibles" });
      }

    } catch (err) {
      results.push({ name, error: "Erreur réseau" });
    }
  }

  return res.status(200).json(results);
}
