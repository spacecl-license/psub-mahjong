// 확률에 따라 날짜를 선택하는 함수
export const getRandomDelayDays = () => {
  const days = [
    { day: 0, weight: 3 },
    { day: 5, weight: 25 },
    { day: 10, weight: 35 },
    { day: 15, weight: 17 },
    { day: 20, weight: 12 },
    { day: 25, weight: 5 },
    { day: 30, weight: 3 },
  ];

  let weightedDays = [];

  for (let i = 0; i < days.length; i++) {
    for (let j = 0; j < days[i].weight; j++) {
      weightedDays.push(days[i].day);
    }
  }

  let result = [];

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * weightedDays.length);
    result.push(weightedDays[randomIndex]);
  }

  return result;

};
