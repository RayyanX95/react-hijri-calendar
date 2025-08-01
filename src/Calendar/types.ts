/* eslint-disable @typescript-eslint/no-explicit-any --- needed*/
interface RequiredAvailableDateInfo {
  date: string; // ISO date string in 'YYYYMMDD' format
  isAvailable: boolean; // Indicates if the date is available
}

export type AvailableDateInfo = RequiredAvailableDateInfo & Record<string, any>;

export interface HijriDate {
  day: number;
  month: number;
  year: number;
}

export type SetSelectedDateFunc = (date: Date) => void;

export interface RenderDayCellParams {
  date: Date;
  isSelected: boolean;
  isAvailable: boolean;
  isCurrentDay: boolean;
  isCurrentMonth: boolean;
  hijriDate: HijriDate;
  availableCellData?: AvailableDateInfo;
}
