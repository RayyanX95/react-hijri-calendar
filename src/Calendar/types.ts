type RequiredAvailableDateInfo = {
  date: string; // ISO date string in 'YYYYMMDD' format
  isAvailable: boolean; // Indicates if the date is available
  leaveStatement?: string; // Optional leave statement
};

export type AvailableDateInfo = RequiredAvailableDateInfo;
// & Record<string, any>

export interface HijriDate {
  day: number;
  month: number;
  year: number;
}

export type SetSelectedDateFunc = (date: Date) => void;
