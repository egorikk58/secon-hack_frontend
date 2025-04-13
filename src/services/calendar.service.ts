import axios from 'axios';

export interface DateRangePart {
  startDate: string; // Изменено с Date на string, так как мы передаем ISO строки
  endDate: string;   // Аналогично
}

export interface DateRangePayload {
  ranges: DateRangePart[];
  totalDays: number;
}

export interface MaxDaysResponse {
  maxDays: number;
}

export const CalendarService = {
  async getMaxDays(): Promise<number> {
    // В реальном приложении раскомментируйте:
    // const response = await axios.get<MaxDaysResponse>('***');
    // return response.data.maxDays;
    return 28; // Заглушка для разработки
  },

  async submitDateRanges(payload: Omit<DateRangePayload, 'totalDays'> & { totalDays: number }) {
    // Не нужно преобразовывать даты в строки, если интерфейс уже использует string
    const response = await axios.post('***', {
      ranges: payload.ranges,
      totalDays: payload.totalDays
    });
    return response.data;
  },
};