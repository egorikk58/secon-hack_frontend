import axios from 'axios';

export interface DateRangePart {
  startDate: Date;
  endDate: Date;
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
    const response = await axios.get<MaxDaysResponse>('***');
    return  28 //response.data.maxDays;
  },

  async submitDateRanges(payload: DateRangePayload) {
    const data = {
      ranges: payload.ranges.map(range => ({
        startDate: range.startDate.toISOString(),
        endDate: range.endDate.toISOString(),
      })),
      totalDays: payload.totalDays
    };

    const response = await axios.post('***', data);
    return response.data;
  },
};
