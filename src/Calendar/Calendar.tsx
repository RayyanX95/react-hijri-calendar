import { format, isToday } from 'date-fns';
import styles from './Calendar.module.css';
import { useManageCalendar } from './useManageCalendar';
import { getHijriDate } from './utils';

import React, {
  CSSProperties,
  JSX,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AvailableDateInfo, SetSelectedDateFunc } from './types';
import { ChevronRightIcon, ChevronLeftIcon } from './icons';

const LABELS = {
  en: {
    hijri: 'Hijri',
    gregorian: 'Gregorian',
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },
  ar: {
    hijri: 'هجري',
    gregorian: 'ميلادي',
    weekdays: ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
  },
};

interface CalendarProps {
  /** Currently selected date (string in yyyyMMdd or Date object, or null) */
  selectedDate: string | Date | null;
  /** Callback to update selected date */
  setSelectedDate: SetSelectedDateFunc;
  /** Array of date availability information */
  availableDatesInfo: AvailableDateInfo[];
  /** Loading state of the calendar */
  isLoading?: boolean;
  /** Language for labels ("en" or "ar") */
  lang?: 'en' | 'ar';
  /** Optional: Custom day cell renderer */
  renderDayCell?: (params: {
    date: Date;
    isSelected: boolean;
    isAvailable: boolean;
    isCurrentDay: boolean;
    isCurrentMonth: boolean;
    hijriDate: ReturnType<typeof getHijriDate>;
    leaveStatement?: string;
  }) => JSX.Element;
  /** Optional: Style overrides */
  className?: string;
  /** Optional: Style overrides for the main calendar container, including CSS variables for theming */
  style?: CSSProperties;
  /** Optional: Style overrides for day cells */
  dayCellStyle?: CSSProperties;
  /** Optional: Class name for day cells */
  dayCellClassName?: string;
  /** Primary color for calendar (overrides default) */
  primaryColor?: string;
  /** Unavailable color for calendar (overrides default) */
  unavailableColor?: string;
}

/**
 * Calendar component for displaying and selecting dates
 * @param {Object} props - Component props
 * @param {string|Date|null} props.selectedDate - Currently selected date
 * @param {function} props.setSelectedDate - Function to update selected date
 * @param {AvailableDateInfo[]} props.availableDatesInfo - Array of date availability information
 * @param {boolean} [props.isLoading] - Loading state of the calendar
 * @param {"en"|"ar"} [props.lang] - Language for labels
 * @param {function} [props.renderDayCell] - Custom day cell renderer
 * @param {string} [props.className] - Optional className for style overrides
 * @param {object} [props.style] - Optional style for main calendar container. You can override theme colors by passing CSS variables, e.g.:
 *   style={{ '--calendar-primary': '#ff6600', '--calendar-unavailable': '#999999' }}
 * @param {object} [props.dayCellStyle] - Optional style for day cells
 * @param {string} [props.dayCellClassName] - Optional className for day cells
 * @param {string} [props.primaryColor] - Primary color for calendar (overrides default)
 * @param {string} [props.unavailableColor] - Unavailable color for calendar (overrides default)
 * @returns {JSX.Element} Calendar component
 *
 * ## Customizing Appearance and Colors
 *
 * You can override styles and theme colors using the `className`, `style`, `dayCellStyle`, and `dayCellClassName` props:
 *
 * ```tsx
 * <Calendar
 *   className="my-calendar"
 *   style={{
 *     background: '#f0f0f0',
 *     '--calendar-primary': '#ff6600',
 *     '--calendar-unavailable': '#999999',
 *   }}
 *   dayCellStyle={{ borderRadius: 8 }}
 *   dayCellClassName="my-day-cell"
 *   ...
 * />
 * ```
 */
export const Calendar = ({
  selectedDate,
  setSelectedDate,
  availableDatesInfo,
  isLoading,
  lang = 'en',
  renderDayCell,
  className,
  style,
  dayCellStyle,
  dayCellClassName,
  primaryColor = '#1b8354',
  unavailableColor = '#6c737f',
}: CalendarProps): JSX.Element => {
  const labels = LABELS[lang] || LABELS.en;
  const {
    weeks,
    currentMonthYear,
    handleDateClick,
    goToPreviousMonth,
    goToNextMonth,
    toggleHijri,
    isHijri,
    currentHijriDate,
    currentActiveViewDate,
  } = useManageCalendar(availableDatesInfo, setSelectedDate, lang);

  const weekDays = labels.weekdays;

  const renderChevronIcon = (action: 'prev' | 'next') => {
    const isRtl = lang === 'ar';
    // In RTL, swap the icons for prev/next
    const Icon =
      action === 'prev'
        ? isRtl
          ? ChevronRightIcon
          : ChevronLeftIcon
        : isRtl
          ? ChevronLeftIcon
          : ChevronRightIcon;
    return (
      <button
        className={styles.chevronButton}
        type="button"
        onClick={action === 'prev' ? goToPreviousMonth : goToNextMonth}
      >
        <Icon />
      </button>
    );
  };

  // Merge default CSS variable values with user style prop and global props
  const mergedStyle = {
    '--calendar-primary': primaryColor,
    '--calendar-unavailable': unavailableColor,
    ...style,
  } as CSSProperties;

  // Accessibility: manage focus for keyboard navigation
  const tableRef = useRef<HTMLTableElement>(null);
  const [focusedCell, setFocusedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  // Find the first available date for initial focus
  useEffect(() => {
    if (!focusedCell && weeks.length > 0) {
      for (let row = 0; row < weeks.length; row++) {
        for (let col = 0; col < weeks[row].length; col++) {
          const date = weeks[row][col];
          const isAvailable =
            availableDatesInfo?.find(
              (item) => item.date === format(date, 'yyyyMMdd'),
            )?.dateStatus === 'Available';
          if (isAvailable) {
            setFocusedCell({ row, col });
            return;
          }
        }
      }
    }
  }, [weeks, availableDatesInfo, focusedCell]);

  // Keyboard navigation handler
  const handleKeyDown = (e: KeyboardEvent<HTMLTableElement>) => {
    if (!focusedCell) return;
    const { row, col } = focusedCell;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (row < weeks.length - 1) setFocusedCell({ row: row + 1, col });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (row > 0) setFocusedCell({ row: row - 1, col });
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (col < weeks[row].length - 1) setFocusedCell({ row, col: col + 1 });
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (col > 0) setFocusedCell({ row, col: col - 1 });
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const date = weeks[row][col];
      handleDateClick(date);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      (tableRef.current as any)?.blur();
    }
  };

  return (
    <div
      className={`${styles.calendarContainer} ${className || ''}`}
      style={mergedStyle}
      role="region"
      aria-label="Calendar"
    >
      <div className={styles.header}>
        <div className={styles.monthYearText}>
          <span>{currentMonthYear.month}</span>
          <span>{currentMonthYear.year}</span>
        </div>
        <div className={styles.actionsContainer}>
          <button
            className={styles.toggleButton}
            onClick={toggleHijri}
            aria-label="Toggle calendar type"
          >
            {isHijri ? labels.gregorian : labels.hijri}
          </button>
          <span className={styles.chevronContainer}>
            {renderChevronIcon('prev')}
            {renderChevronIcon('next')}
          </span>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <table
          className={styles.table}
          ref={tableRef}
          tabIndex={0}
          role="grid"
          aria-label="Date picker grid"
          onKeyDown={handleKeyDown}
        >
          <thead>
            <tr>
              {weekDays.map((day, index) => (
                <th
                  className={styles.tableHeader}
                  key={index}
                  role="columnheader"
                  scope="col"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, weekIndex) => (
              <tr key={weekIndex} role="row">
                {week.map((date, dateIndex) => {
                  let isSelectedDate = false;
                  if (selectedDate) {
                    const formatedDate = format(date, 'yyyyMMdd');
                    isSelectedDate = formatedDate === selectedDate;
                  }
                  const isAvailable =
                    availableDatesInfo?.find(
                      (item) => item.date === format(date, 'yyyyMMdd'),
                    )?.dateStatus === 'Available';
                  const isCurrentDay = isToday(date);
                  const hijriDate = getHijriDate(date);
                  const leaveStatement = availableDatesInfo?.find(
                    (item) => item.date === format(date, 'yyyyMMdd'),
                  )?.leaveStatement;
                  const isCurrentMonthDate = isHijri
                    ? hijriDate.month === currentHijriDate.month &&
                      hijriDate.year === currentHijriDate.year
                    : format(date, 'yyyy-MM') ===
                      format(currentActiveViewDate, 'yyyy-MM');

                  if (renderDayCell) {
                    return renderDayCell({
                      date,
                      isSelected: isSelectedDate,
                      isAvailable,
                      isCurrentDay,
                      isCurrentMonth: isCurrentMonthDate,
                      hijriDate,
                      leaveStatement,
                    });
                  }

                  // Accessibility: set focus and ARIA attributes
                  const isFocused =
                    focusedCell &&
                    focusedCell.row === weekIndex &&
                    focusedCell.col === dateIndex;
                  // Use a callback ref that only focuses when mounted and focused
                  const cellRef = (el: HTMLTableDataCellElement | null) => {
                    if (isFocused && el) {
                      el.focus();
                    }
                  };
                  return (
                    <td
                      key={dateIndex}
                      className={[
                        styles.tableCell,
                        isSelectedDate ? styles.selected : '',
                        isCurrentDay ? styles.currentDay : '',
                        isAvailable ? styles.available : styles.unavailable,
                        isCurrentMonthDate
                          ? styles.currentMonth
                          : styles.notCurrentMonth,
                        dayCellClassName || '',
                      ].join(' ')}
                      style={dayCellStyle}
                      onClick={() => handleDateClick(date)}
                      role="gridcell"
                      aria-selected={isSelectedDate}
                      aria-disabled={!isAvailable}
                      tabIndex={isFocused ? 0 : -1}
                      ref={isFocused ? cellRef : undefined}
                    >
                      <div className={styles.cellContent}>
                        <div className={styles.dayContainer}>
                          {isHijri
                            ? String(hijriDate.day ?? '')
                            : format(date, 'd')}
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Calendar.displayName = 'Calendar';
