import {
  addDays,
  endOfMonth,
  getDay,
  getDaysInMonth,
  startOfMonth,
  subDays,
} from 'date-fns';
import moment from 'moment-hijri';

import { hijriFirstMonthIndex, hijriLastMonthIndex } from './constants';
import { HijriDate } from './types';

export const isFirstHijriMonth = (currentHijriDate: HijriDate) =>
  currentHijriDate.month === hijriFirstMonthIndex;

export const isLastHijriMonth = (currentHijriDate: HijriDate) =>
  currentHijriDate.month === hijriLastMonthIndex;

const hijriToGregorian = (hijriDate: HijriDate): Date => {
  try {
    // moment-hijri expects 1-12 for months
    const hijriMoment = moment(
      `${hijriDate.year}/${hijriDate.month + 1}/${hijriDate.day}`,
      'iYYYY/iM/iD',
    );
    return hijriMoment.toDate();
  } catch {
    // Fallback - return current date
    return new Date();
  }
};

export const getHijriDate = (gregorianDate: Date): HijriDate => {
  const hijriMoment = moment(gregorianDate).format('iYYYY/iM/iD');
  const [year, month, day] = hijriMoment.split('/').map(Number);
  return {
    day,
    month: month - 1, // moment-hijri uses 1-12, we need 0-11 for array indexing
    year,
  };
};

const getDaysInHijriMonth = (hijriYear: number, hijriMonth: number): number => {
  try {
    // Create first day of next month and subtract one day to get last day of current month
    const nextMonth =
      hijriMonth === hijriLastMonthIndex
        ? hijriFirstMonthIndex
        : hijriMonth + 1;
    const nextYear =
      hijriMonth === hijriLastMonthIndex ? hijriYear + 1 : hijriYear;
    const firstOfNextMonth = moment(
      `${nextYear}/${nextMonth + 1}/1`,
      'iYYYY/iM/iD',
    );
    const lastOfCurrentMonth = firstOfNextMonth.clone().subtract(1, 'day');
    return Number.parseInt(lastOfCurrentMonth.format('iD'), 10);
  } catch {
    // Fallback - Islamic months are typically 29 or 30 days
    return hijriMonth % 2 === 0 ? 30 : 29;
  }
};

const getHijriMonthGrid = (currentHijriDate: HijriDate): Date[] => {
  const days: Date[] = [];
  const daysInMonth = getDaysInHijriMonth(
    currentHijriDate.year,
    currentHijriDate.month,
  );

  // Get the first day of the Hijri month in Gregorian calendar
  const firstHijriDay = hijriToGregorian({
    day: 1,
    month: currentHijriDate.month,
    year: currentHijriDate.year,
  });

  // Calculate the starting day of the week (0 = Sunday, 6 = Saturday)
  const startDayOfWeek = getDay(firstHijriDay);

  // Add days from previous month to fill the week
  for (let i = startDayOfWeek; i > 0; i--) {
    const isFirstMonth = isFirstHijriMonth(currentHijriDate);
    const prevDay = hijriToGregorian({
      day:
        getDaysInHijriMonth(
          isFirstMonth ? currentHijriDate.year - 1 : currentHijriDate.year,
          isFirstMonth ? hijriLastMonthIndex : currentHijriDate.month - 1,
        ) -
        i +
        1,
      month: isFirstMonth ? hijriLastMonthIndex : currentHijriDate.month - 1,
      year: isFirstMonth ? currentHijriDate.year - 1 : currentHijriDate.year,
    });
    days.push(prevDay);
  }

  // Add all days of the current Hijri month
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDay = hijriToGregorian({
      day,
      month: currentHijriDate.month,
      year: currentHijriDate.year,
    });
    days.push(currentDay);
  }

  // Add days from next month to complete the grid (6 weeks = 42 days)
  const remainingDays = 42 - days.length;
  for (let day = 1; day <= remainingDays; day++) {
    const isLastMonth = isLastHijriMonth(currentHijriDate);

    const nextDay = hijriToGregorian({
      day,
      month: isLastMonth ? hijriFirstMonthIndex : currentHijriDate.month + 1,
      year: isLastMonth ? currentHijriDate.year + 1 : currentHijriDate.year,
    });
    days.push(nextDay);
  }

  return days;
};

const getGregorianGrid = (currentActiveViewDate: Date) => {
  const start = startOfMonth(currentActiveViewDate);
  const end = endOfMonth(currentActiveViewDate);
  const days = [];

  // Adjust startDay to align with Sunday as the first day of the week
  const startDay = getDay(start);
  for (let i = startDay; i > 0; i--) {
    days.push(subDays(start, i));
  }

  // Add days of the current month
  for (let i = 0; i < getDaysInMonth(currentActiveViewDate); i++) {
    days.push(addDays(start, i));
  }

  // Fill remaining days to complete 6 weeks (42 days)
  const totalDays = 42;
  const remainingDays = totalDays - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push(addDays(end, i));
  }

  return days;
};

// Get the days array based on calendar type
export const getDaysInMonthArray = (
  isHijri: boolean,
  currentActiveViewDate: Date,
  currentHijriDate: HijriDate,
): Date[] => {
  if (isHijri) {
    return getHijriMonthGrid(currentHijriDate);
  }

  return getGregorianGrid(currentActiveViewDate);
};
