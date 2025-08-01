import styles from '../Calendar.module.css';
import { ChevronRightIcon, ChevronLeftIcon } from '../icons';

import type React from 'react';

interface CalendarHeaderProps {
  month: string;
  year: string | number;
  isHijri: boolean;
  labels: { gregorian: string; hijri: string };
  onToggleHijri: () => void;
  onPrev: () => void;
  onNext: () => void;
  lang: string;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  month,
  year,
  isHijri,
  labels,
  onToggleHijri: handleToggleHijri,
  onPrev,
  onNext,
  lang,
}) => {
  const isRtl = lang === 'ar';

  const renderChevronIcon = (action: 'prev' | 'next') => {
    const Icon =
      action === 'prev'
        ? isRtl
          ? ChevronRightIcon
          : ChevronLeftIcon
        : isRtl
          ? ChevronLeftIcon
          : ChevronRightIcon;

    const handleClickMove = action === 'prev' ? onPrev : onNext;

    return (
      <button
        className={styles.chevronButton}
        type="button"
        onClick={handleClickMove}
      >
        <Icon />
      </button>
    );
  };

  return (
    <div className={styles.header}>
      <div className={styles.monthYearText}>
        <span>{month}</span>
        <span>{year}</span>
      </div>
      <div className={styles.actionsContainer}>
        <button
          aria-label="Toggle calendar type"
          className={styles.toggleButton}
          onClick={handleToggleHijri}
        >
          {isHijri ? labels.gregorian : labels.hijri}
        </button>
        <span className={styles.chevronContainer}>
          {renderChevronIcon('prev')}
          {renderChevronIcon('next')}
        </span>
      </div>
    </div>
  );
};
