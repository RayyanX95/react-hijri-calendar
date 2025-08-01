import { useEffect, useRef, useState } from 'react';
import { format, isToday, isSameDay } from 'date-fns';

import styles from './Calendar.module.css';
import { CalendarHeader } from './components/CalendarHeader';
import { LABELS } from './i18n';
import { useManageCalendar } from './useManageCalendar';
import { getHijriDate } from './utils';

import type { AvailableDateInfo, SetSelectedDateFunc } from './types';
import type { CSSProperties, JSX, KeyboardEvent } from 'react';

type CalendarMode = 'allAvailable' | 'customAvailable';

type CalendarType = 'hijri' | 'gregorian';

interface CalendarProps {
  /** Currently selected date (Date object) */
  selectedDate: Date | null;
  /** Callback to update selected date */
  setSelectedDate: SetSelectedDateFunc;
  /** Array of date availability information (required for customAvailable mode) */
  availableDatesInfo?: AvailableDateInfo[];
  /** Calendar selection mode */
  mode?: CalendarMode; // 'allAvailable' (all days selectable) | 'customAvailable' (only availableDatesInfo)
  /** Language for labels ("en" or "ar") */
  lang?: 'en' | 'ar';
  /** Calendar type: 'hijri' or 'gregorian'. If not provided, falls back to lang ('ar' = hijri, 'en' = gregorian) */
  calendarType?: CalendarType;
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
  mode = 'allAvailable',
  lang = 'en',
  calendarType,
  renderDayCell,
  className,
  style,
  dayCellStyle,
  dayCellClassName,
  primaryColor = '#1b8354',
  unavailableColor = '#6c737f',
}: CalendarProps): JSX.Element => {
  // Validate props based on mode
  if (
    mode === 'customAvailable' &&
    (!Array.isArray(availableDatesInfo) || availableDatesInfo.length === 0) &&
    process.env.NODE_ENV !== 'production'
  ) {
    // eslint-disable-next-line no-console -- Warn if availableDatesInfo is not provided
    console.warn(
      '[Calendar] In customAvailable mode, availableDatesInfo should be a non-empty array. All days will be unavailable.',
    );
  }
  const labels = LABELS[lang] || LABELS.en;
  // Determine initial calendar type: explicit prop, else fallback to lang
  const initialIsHijri =
    calendarType === 'hijri'
      ? true
      : calendarType === 'gregorian'
        ? false
        : lang === 'ar';
  const {
    weeks,
    currentMonthYear,
    handleDateClick,
    goToPreviousMonth,
    goToNextMonth,
    toggleHijri: handleToggleHijri,
    isHijri,
    currentHijriDate,
    currentActiveViewDate,
  } = useManageCalendar(
    availableDatesInfo || [],
    setSelectedDate,
    lang,
    initialIsHijri,
    mode,
  );

  const weekDays = labels.weekdays;

  // Handlers for header
  const handlePrev = () => {
    goToPreviousMonth();
  };
  const handleNext = () => {
    goToNextMonth();
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
      // @ts-expect-error - focusedCell is null initially
      for (const [row, week] of weeks.entries()) {
        for (const [col, date] of week.entries()) {
          const isAvailable =
            mode === 'allAvailable'
              ? true
              : availableDatesInfo?.find(
                  (item) => item.date === format(date, 'yyyyMMdd'),
                )?.isAvailable === true;
          if (isAvailable) {
            setFocusedCell({ row, col });
            return;
          }
        }
      }
    }
  }, [weeks, availableDatesInfo, focusedCell, mode]);

  // Keyboard navigation handler
  const handleKeyDown = (e: KeyboardEvent<HTMLTableElement>) => {
    if (!focusedCell) return;
    const { row, col } = focusedCell;
    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        if (row < weeks.length - 1) setFocusedCell({ row: row + 1, col });

        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        if (row > 0) setFocusedCell({ row: row - 1, col });

        break;
      }
      case 'ArrowRight': {
        e.preventDefault();
        if (col < weeks[row].length - 1) setFocusedCell({ row, col: col + 1 });

        break;
      }
      case 'ArrowLeft': {
        e.preventDefault();
        if (col > 0) setFocusedCell({ row, col: col - 1 });

        break;
      }
      case 'Enter':
      case ' ': {
        e.preventDefault();
        const date = weeks[row][col];
        handleDateClick(date);

        break;
      }
      case 'Escape': {
        e.preventDefault();
        tableRef.current?.blur();

        break;
      }
      default: {
        break;
      }
    }
  };

  return (
    <div
      aria-label="Calendar"
      className={`${styles.calendarContainer} ${className || ''}`}
      role="region"
      style={mergedStyle}
    >
      <CalendarHeader
        isHijri={isHijri}
        labels={labels}
        lang={lang}
        month={currentMonthYear.month}
        year={currentMonthYear.year}
        onNext={handleNext}
        onPrev={handlePrev}
        onToggleHijri={handleToggleHijri}
      />
      <div className={styles.tableContainer}>
        <table
          ref={tableRef}
          aria-label="Date picker grid"
          className={styles.table}
          role="grid"
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          <thead>
            <tr>
              {weekDays.map((day, index) => (
                <th
                  key={index}
                  className={styles.tableHeader}
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
                  const isSelectedDate = selectedDate
                    ? isSameDay(date, selectedDate)
                    : false;

                  const isAvailable =
                    mode === 'allAvailable'
                      ? true
                      : availableDatesInfo?.find(
                          (item) => item.date === format(date, 'yyyyMMdd'),
                        )?.isAvailable === true;

                  const isCurrentDay = isToday(date);
                  const hijriDate = getHijriDate(date);
                  const isCurrentMonthDate = isHijri
                    ? hijriDate.month === currentHijriDate.month &&
                      hijriDate.year === currentHijriDate.year
                    : format(date, 'yyyy-MM') ===
                      format(currentActiveViewDate, 'yyyy-MM');

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
                      ref={isFocused ? cellRef : undefined}
                      aria-disabled={!isAvailable}
                      aria-selected={isSelectedDate}
                      className={[
                        styles.tableCell,
                        isCurrentDay ? styles.currentDay : '',
                        isCurrentMonthDate
                          ? styles.currentMonth
                          : styles.notCurrentMonth,
                        dayCellClassName || '',
                      ].join(' ')}
                      role="gridcell"
                      style={dayCellStyle}
                      tabIndex={isFocused ? 0 : -1}
                      onClick={() => handleDateClick(date)}
                    >
                      {renderDayCell ? (
                        <>
                          {renderDayCell({
                            date,
                            isSelected: isSelectedDate,
                            isAvailable,
                            isCurrentDay,
                            isCurrentMonth: isCurrentMonthDate,
                            hijriDate,
                          })}
                        </>
                      ) : (
                        <div
                          className={[
                            styles.cellContent,
                            isSelectedDate ? styles.selected : '',
                            isAvailable ? styles.available : styles.unavailable,
                          ].join(' ')}
                        >
                          <div className={styles.dayContainer}>
                            {isHijri
                              ? String(hijriDate.day ?? '')
                              : format(date, 'd')}
                          </div>
                        </div>
                      )}
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
