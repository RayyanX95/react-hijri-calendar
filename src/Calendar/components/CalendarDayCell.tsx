import { format } from 'date-fns';

import styles from '../Calendar.module.css';
import { getHijriDate } from '../utils';

import type { AvailableDateInfo, RenderDayCellParams } from '../types';
import type { CSSProperties, JSX } from 'react';
import type React from 'react';

interface CalendarDayCellProps {
  date: Date;
  isSelected: boolean;
  isAvailable: boolean;
  isCurrentDay: boolean;
  isCurrentMonth: boolean;
  isHijri: boolean;
  currentHijriDate: ReturnType<typeof getHijriDate>;
  currentActiveViewDate: Date;
  dayCellClassName?: string;
  dayCellStyle?: CSSProperties;
  onClick: (date: Date) => void;
  availableRowData?: AvailableDateInfo;
  renderDayCell?: (params: RenderDayCellParams) => JSX.Element;
}

export const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  date,
  isSelected,
  isAvailable,
  isCurrentDay,
  isCurrentMonth,
  isHijri,
  dayCellClassName,
  dayCellStyle,
  onClick,
  renderDayCell,
  availableRowData,
}) => {
  const hijriDate = getHijriDate(date);
  return (
    <td
      aria-disabled={!isAvailable}
      aria-selected={isSelected}
      className={[
        styles.tableCell,
        isCurrentDay ? styles.currentDay : '',
        isCurrentMonth ? styles.currentMonth : styles.notCurrentMonth,
        dayCellClassName || '',
      ].join(' ')}
      role="gridcell"
      style={dayCellStyle}
      tabIndex={-1}
      onClick={() => onClick(date)}
    >
      {renderDayCell ? (
        renderDayCell({
          date,
          isSelected,
          isAvailable,
          isCurrentDay,
          isCurrentMonth,
          hijriDate,
          availableCellData: availableRowData,
        })
      ) : (
        <div
          className={[
            styles.cellContent,
            isSelected ? styles.selected : '',
            isAvailable ? styles.available : styles.unavailable,
          ].join(' ')}
        >
          <div className={styles.dayContainer}>
            {isHijri ? String(hijriDate.day ?? '') : format(date, 'd')}
          </div>
        </div>
      )}
    </td>
  );
};
