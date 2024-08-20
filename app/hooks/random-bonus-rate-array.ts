// 보너스 비율을 무작위로 결정하는 함수
export const getTotalBonusRate = () => {
  const rates = [
    { rate: 0, weight: 2 },
    { rate: 0.03, weight: 40 },
    { rate: 0.05, weight: 50 },
    { rate: 0.1, weight: 5 },
    { rate: 0.15, weight: 3 },
  ];
  let weightedRates = [];

  for (let i = 0; i < rates.length; i++) {
    for (let j = 0; j < rates[i].weight; j++) {
      weightedRates.push(rates[i].rate);
    }
  }

  let result = [];

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * weightedRates.length);
    result.push(weightedRates[randomIndex]);
  }

  const totalRewardRate = result.reduce((a, b) => a + b, 0);

  return Number(totalRewardRate.toFixed(2));

};
