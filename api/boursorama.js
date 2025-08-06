const API_KEY = '2d4a0fbc22c0466ab6c7ac5211a1685d';

async function fetchStockData(query) {
  const response = await fetch(`https://api.twelvedata.com/symbol_search?symbol=${query}&apikey=${API_KEY}`);
  const data = await response.json();
  return data.data?.filter(item => item.instrument_type === "Equity") || [];
}

async function fetchQuote(symbol) {
  const response = await fetch(`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${API_KEY}`);
  const data = await response.json();
  return data;
}

window.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const results = document.getElementById('results');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    results.innerHTML = '';
    const query = document.getElementById('search').value.trim().toUpperCase();

    try {
      const matches = await fetchStockData(query);

      if (!matches.length) {
        results.innerHTML = `<div class="card error">Aucune action trouvée pour : ${query}</div>`;
        return;
      }

      for (const match of matches) {
        const quote = await fetchQuote(match.symbol);

        if (!quote.price) continue;

        const card = document.createElement('div');
        card.className = 'card';

        card.innerHTML = `
          <h2>${match.instrument_name.toUpperCase()}</h2>
          <p>📊 Prix : <strong>${parseFloat(quote.price).toFixed(2)} ${quote.currency}</strong></p>
          <p>📉 Variation : <strong>${parseFloat(quote.percent_change).toFixed(2)}%</strong></p>
          <p>🕒 MAJ : ${new Date().toLocaleString()}</p>
        `;
        results.appendChild(card);
      }

    } catch (err) {
      console.error(err);
      results.innerHTML = `<div class="card error">Erreur réseau ou API</div>`;
    }
  });
});
