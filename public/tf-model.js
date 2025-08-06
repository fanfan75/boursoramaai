async function runPrediction(prices) {
  if (!prices || prices.length < 6) return { advice: "Pas assez de données" };

  const maxPrice = Math.max(...prices);
  const normalized = prices.map(p => p / maxPrice);

  const xs = [];
  const ys = [];
  for (let i = 0; i < normalized.length - 5; i++) {
    xs.push(normalized.slice(i, i + 5));
    ys.push(normalized[i + 5]);
  }

  const xsTensor = tf.tensor3d(xs, [xs.length, 5, 1]);
  const ysTensor = tf.tensor2d(ys, [ys.length, 1]);

  const model = tf.sequential();
  model.add(tf.layers.lstm({ inputShape: [5, 1], units: 20 }));
  model.add(tf.layers.dense({ units: 1 }));
  model.compile({ loss: 'meanSquaredError', optimizer: 'adam' });

  await model.fit(xsTensor, ysTensor, { epochs: 5, batchSize: 4, verbose: 0 });

  const input = tf.tensor3d([normalized.slice(-5)], [1, 5, 1]);
  const prediction = model.predict(input);
  const predValue = (await prediction.data())[0] * maxPrice;

  const lastPrice = prices.at(-1);
  const advice = predValue > lastPrice
    ? "Acheter 📈"
    : predValue < lastPrice
    ? "Vendre 📉"
    : "Attendre ⏸️";

  return {
    advice,
    pred3d: (predValue * 1.01).toFixed(2),
    pred7d: (predValue * 1.03).toFixed(2),
    pred30d: (predValue * 1.08).toFixed(2)
  };
}
