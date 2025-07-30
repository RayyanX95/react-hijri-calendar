export interface AvailableDateInfo {
  dateStatus: string;
  date: string;
  leaveStatement: string;
}

export interface HijriDate {
  day: number;
  month: number;
  year: number;
}

export type SetSelectedDateFunc = (date: string) => void;
