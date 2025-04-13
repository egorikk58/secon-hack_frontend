export function generatePeopleDataForMonth(year: number, month: number): Record<string, number> {
  const staticData: Record<string, number> = {
    "2025-04-02": 9,
    "2025-04-04": 12,
    "2023-11-10": 8,
    "2023-11-15": 3,
    "2023-11-20": 7,
    "2023-11-25": 15,
    "2023-11-30": 10,
  };

  let baseValue, min, max;

  if (month >= 5 && month <= 10) {
    baseValue = 35;
    min = 30;
    max = 80;
  }
  else if (month >= 2 && month <= 4 || month >= 8 && month <= 9) {
    baseValue = 25;
    min = 20;
    max = 35;
  }
  else {
    baseValue = 15;
    min = 10;
    max = 25;
  }

  const generatedData = generateSmoothDataForMonth(year, month, baseValue, min, max);

  return {
    ...staticData,
    ...generatedData,
  };
}

function generateSmoothDataForMonth(
  year: number,
  month: number,
  baseValue: number,
  min: number,
  max: number
): Record<string, number> {
  const data: Record<string, number> = {};
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let currentValue = baseValue;
  const maxChange = 2;
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateString = date.toISOString().split('T')[0];

    const change = Math.floor(Math.random() * (maxChange * 2 + 1)) - maxChange;
    currentValue += change;

    currentValue = Math.max(min, Math.min(max, currentValue));

    data[dateString] = currentValue;
  }

  return data;
}