document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const input = document.querySelector("#symbolInput");
  const resultDiv = document.querySelector("#result");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const symbols = input.value.trim().toUpperCase().split(/[\s,;]+/);
    if (!symbols.length) return;

    resultDiv.innerHTML = "⏳ Chargement...";

    try {
      const response = await fetch(`/api/boursorama?symbols=${symbols.join(",")}`);
      if (!response.ok) throw new Error("Réponse invalide");

      const data = await response.json();
      if (!data || !data.length) throw new Error("Pas de données");

      // Affichage des données
      resultDiv.innerHTML = data.map(item => `
        <div class="card">
          <h2>${item.symbol}</h2>
          <p>💶 Prix : <strong>${item.price}</strong></p>
          <p>📈 Variation : <strong>${item.variation}</strong></p>
          <p>🕒 MAJ : ${item.last_update}</p>
        </div>
      `).join("");
    } catch (err) {
      console.error(err);
      resultDiv.innerHTML = `<p style="color: red;">❌ Erreur réseau ou backend</p>`;
    }
  });
});
