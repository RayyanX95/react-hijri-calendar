export interface AvailableDateInfo {
  date: string; // ISO date string in 'YYYYMMDD' format
  isAvailable: boolean; // Indicates if the date is available
}

export interface HijriDate {
  day: number;
  month: number;
  year: number;
}

export type SetSelectedDateFunc = (date: Date) => void;
