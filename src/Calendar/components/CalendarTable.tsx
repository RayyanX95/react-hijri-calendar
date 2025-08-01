import React, { useRef } from 'react';
import { format, isToday, isSameDay } from 'date-fns';

import styles from '../Calendar.module.css';
import { getHijriDate } from '../utils';

import { CalendarDayCell } from './CalendarDayCell';

import type { AvailableDateInfo, RenderDayCellParams } from '../types';
import type { CSSProperties, KeyboardEvent, JSX } from 'react';

interface CalendarTableProps {
  weeks: Date[][];
  selectedDate: Date | null;
  availableDatesInfo?: AvailableDateInfo[];
  mode: 'allAvailable' | 'customAvailable';
  isHijri: boolean;
  currentHijriDate: ReturnType<typeof getHijriDate>;
  currentActiveViewDate: Date;
  dayCellClassName?: string;
  dayCellStyle?: CSSProperties;
  onDateClick: (date: Date) => void;
  renderDayCell?: (params: RenderDayCellParams) => JSX.Element;
  weekDays: string[];
}

export const CalendarTable: React.FC<CalendarTableProps> = ({
  weeks,
  selectedDate,
  availableDatesInfo,
  mode,
  isHijri,
  currentHijriDate,
  currentActiveViewDate,
  dayCellClassName,
  dayCellStyle,
  onDateClick: handleDateClick,
  renderDayCell,
  weekDays,
}) => {
  const tableRef = useRef<HTMLTableElement>(null);
  const [focusedCell, setFocusedCell] = React.useState<{
    row: number;
    col: number;
  } | null>(null);

  // Find the first available date for initial focus
  React.useEffect(() => {
    if (!focusedCell && weeks.length > 0) {
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

              const availableRowData = availableDatesInfo?.find(
                (item) => item.date === format(date, 'yyyyMMdd'),
              );
              const isAvailable =
                mode === 'allAvailable'
                  ? true
                  : availableRowData?.isAvailable === true;
              const isCurrentDay = isToday(date);
              const hijriDate = getHijriDate(date);
              const isCurrentMonthDate = isHijri
                ? hijriDate.month === currentHijriDate.month &&
                  hijriDate.year === currentHijriDate.year
                : format(date, 'yyyy-MM') ===
                  format(currentActiveViewDate, 'yyyy-MM');

              return (
                <CalendarDayCell
                  key={dateIndex}
                  availableRowData={availableRowData}
                  currentActiveViewDate={currentActiveViewDate}
                  currentHijriDate={currentHijriDate}
                  date={date}
                  dayCellClassName={dayCellClassName}
                  dayCellStyle={dayCellStyle}
                  isAvailable={isAvailable}
                  isCurrentDay={isCurrentDay}
                  isCurrentMonth={isCurrentMonthDate}
                  isHijri={isHijri}
                  isSelected={isSelectedDate}
                  renderDayCell={renderDayCell}
                  onClick={handleDateClick}
                />
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
