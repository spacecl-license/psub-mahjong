export const getBonusRate = () => {
  const rates = [
    { rate: 0, weight: 104 },
    { rate: 0.2, weight: 266 },
    { rate: 0.3, weight: 406 },
    { rate: 0.5, weight: 104 },
    { rate: 1, weight: 56 },
    { rate: 2, weight: 24 },
    { rate: 10, weight: 6 },
  ];

  let weightedRates = [];

  for (let i = 0; i < rates.length; i++) {
    for (let j = 0; j < rates[i].weight; j++) {
      weightedRates.push(rates[i].rate);
    }
  }

  const randomIndex = Math.floor(Math.random() * weightedRates.length);
  return weightedRates[randomIndex];
};
