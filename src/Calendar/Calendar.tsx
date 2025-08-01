import styles from './Calendar.module.css';
import { CalendarHeader } from './components/CalendarHeader';
import { CalendarTable } from './components/CalendarTable';
import { LABELS } from './i18n';
import { useManageCalendar } from './useManageCalendar';

import type { AvailableDateInfo, SetSelectedDateFunc } from './types';
import type { getHijriDate } from './utils';
import type { CSSProperties, JSX } from 'react';

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
        <CalendarTable
          availableDatesInfo={availableDatesInfo}
          currentActiveViewDate={currentActiveViewDate}
          currentHijriDate={currentHijriDate}
          dayCellClassName={dayCellClassName}
          dayCellStyle={dayCellStyle}
          isHijri={isHijri}
          mode={mode}
          renderDayCell={renderDayCell}
          selectedDate={selectedDate}
          weekDays={weekDays}
          weeks={weeks}
          onDateClick={handleDateClick}
        />
      </div>
    </div>
  );
};

Calendar.displayName = 'Calendar';
