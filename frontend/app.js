const backendUrl = "https://tonprojet.vercel.app/api/boursorama"; // Remplace par ton vrai backend

document.getElementById("loadBtn").addEventListener("click", () => {
  const symbols = document.getElementById("symbolsInput").value;
  if (!symbols) return;
  loadStocks(symbols);
});

async function loadStocks(symbols) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "⏳ Chargement...";

  try {
    const res = await fetch(`${backendUrl}?symbols=${symbols}`);
    const data = await res.json();

    resultsDiv.innerHTML = "";
    data.forEach(async (stock) => {
      const card = document.createElement("div");
      card.className = "card";

      if (stock.error) {
        card.textContent = `❌ ${stock.symbol} : ${stock.error}`;
      } else {
        const price = parseFloat((stock.price || "0").replace(",", "."));
        const prices = Array.from({ length: 20 }, () => price + (Math.random() - 0.5) * 1.5);

        card.innerHTML = `
          <h2>${stock.symbol}</h2>
          <p>Prix : ${stock.price} (${stock.variation})</p>
          <p>Ouverture : ${stock.open || "-"} | Haut : ${stock.high || "-"} | Bas : ${stock.low || "-"}</p>
          <p>Volume : ${stock.volume || "N/A"}</p>
          <p>Dernière MAJ : ${stock.last_update}</p>
          <canvas id="chart-${stock.symbol}" height="150"></canvas>
          <div id="ia-${stock.symbol}">⏳ Analyse IA...</div>
        `;

        resultsDiv.appendChild(card);

        // Crée le graphique
        const ctx = document.getElementById(`chart-${stock.symbol}`).getContext("2d");
        new Chart(ctx, {
          type: "line",
          data: {
            labels: Array.from({ length: 20 }, (_, i) => `T-${20-i}`),
            datasets: [{
              label: stock.symbol,
              data: prices,
              borderColor: "#0077cc",
              backgroundColor: "rgba(0, 119, 204, 0.1)",
              tension: 0.3,
              fill: true
            }]
          },
          options: { responsive: true, plugins: { legend: { display: false } } }
        });

        // IA prédictive
        const prediction = await runPrediction(prices);
        document.getElementById(`ia-${stock.symbol}`).innerHTML = `
          🔮 Prédiction IA : ${prediction.advice}<br>
          3j : ${prediction.pred3d} € | 1 sem : ${prediction.pred7d} € | 1 mois : ${prediction.pred30d} €
        `;
      }
    });
  } catch (err) {
    resultsDiv.innerHTML = "❌ Erreur réseau ou backend";
  }
}
