import { useCallback, useMemo, useState } from 'react';
import {
  addDays,
  addMonths,
  format,
  getYear,
  setDay,
  subMonths,
} from 'date-fns';
import { arSA, enUS } from 'date-fns/locale';

import {
  hijriFirstMonthIndex,
  hijriLastMonthIndex,
  hijriMonthsAr,
  hijriMonthsEn,
} from './constants';
import {
  getDaysInMonthArray,
  getHijriDate,
  isFirstHijriMonth,
  isLastHijriMonth,
} from './utils';
import { AvailableDateInfo, SetSelectedDateFunc } from './types';

export const useManageCalendar = (
  availableDatesInfo: AvailableDateInfo[] | null,
  setSelectedDate: SetSelectedDateFunc,
  lang: 'en' | 'ar',
) => {
  const [currentActiveViewDate, setCurrentActiveViewDate] = useState(
    new Date(),
  );
  const [currentHijriDate, setCurrentHijriDate] = useState(() =>
    getHijriDate(new Date()),
  );

  const [isHijri, setIsHijri] = useState(lang === 'ar');

  const localeToUse = useMemo(() => (lang === 'ar' ? arSA : enUS), [lang]);

  const handleDateClick = (date: Date) => {
    const formattedDate = format(date, 'yyyyMMdd');
    const isAvailable =
      availableDatesInfo?.find((item) => item.date === formattedDate)
        ?.isAvailable === true;
    if (isAvailable) {
      setSelectedDate(date);
    }
  };

  const goToPreviousMonth = () => {
    if (isHijri) {
      const isFirstMonth = isFirstHijriMonth(currentHijriDate);
      const newMonth = isFirstMonth
        ? hijriLastMonthIndex
        : currentHijriDate.month - 1;
      const newYear = isFirstMonth
        ? currentHijriDate.year - 1
        : currentHijriDate.year;
      setCurrentHijriDate({
        ...currentHijriDate,
        month: newMonth,
        year: newYear,
      });
    } else {
      setCurrentActiveViewDate(subMonths(currentActiveViewDate, 1));
    }
  };

  const goToNextMonth = () => {
    if (isHijri) {
      const isLastMonth = isLastHijriMonth(currentHijriDate);
      const newMonth = isLastMonth
        ? hijriFirstMonthIndex
        : currentHijriDate.month + 1;
      const newYear = isLastMonth
        ? currentHijriDate.year + 1
        : currentHijriDate.year;
      setCurrentHijriDate({
        ...currentHijriDate,
        month: newMonth,
        year: newYear,
      });
    } else {
      setCurrentActiveViewDate(addMonths(currentActiveViewDate, 1));
    }
  };

  // Toggle between Hijri and Gregorian calendar
  const toggleHijri = useCallback(() => {
    setIsHijri(!isHijri);
    // When switching to Hijri, sync the Hijri date with current Gregorian view
    if (!isHijri) {
      const hijriEquivalent = getHijriDate(currentActiveViewDate);
      setCurrentHijriDate(hijriEquivalent);
    }
  }, [isHijri, currentActiveViewDate]);

  const getCurrentMonthYearText = () => {
    if (isHijri) {
      const monthNames = lang === 'ar' ? hijriMonthsAr : hijriMonthsEn;
      return {
        month: monthNames[currentHijriDate.month],
        year: currentHijriDate.year.toString(),
      };
    }
    return {
      month: format(currentActiveViewDate, 'MMMM'),
      year: getYear(currentActiveViewDate).toString(),
    };
  };

  const weeks = [];
  const days = getDaysInMonthArray(
    isHijri,
    currentActiveViewDate,
    currentHijriDate,
  );
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  // Generate consistent weekday names starting from Sunday
  const anyDate = new Date(1970, 0, 1);
  const baseSunday = setDay(anyDate, 0);
  const weekdayNames = Array.from({ length: 7 }).map(
    (_, i) =>
      format(addDays(baseSunday, i), localeToUse === enUS ? 'EE' : 'EEEE'),

    // TODO: ..
    // format(addDays(baseSunday, i), localeToUse === enUS ? "EE" : "EEEE", {
    //   locale: localeToUse,
    // })
  );

  const currentMonthYear = getCurrentMonthYearText();

  return {
    weekdayNames,
    weeks,
    handleDateClick,
    goToPreviousMonth,
    goToNextMonth,
    toggleHijri,
    isHijri,
    currentHijriDate,
    currentActiveViewDate,
    currentMonthYear,
  };
};
