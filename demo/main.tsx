/* eslint-disable @typescript-eslint/no-unused-vars --- for testing */
import { useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { Calendar } from '../src/Calendar/Calendar';

import type { AvailableDateInfo } from '../src/Calendar/types';

const today = new Date();
const mockAvailableDates: AvailableDateInfo[] = Array.from(
  { length: 31 },
  (_, i) => {
    const date = new Date(today.getFullYear(), today.getMonth(), i + 1);
    return {
      date: date.toISOString().slice(0, 10).replaceAll('-', ''),
      isAvailable: i % 5 !== 0, // Every 5th date is unavailable
      leaveStatement: i % 5 === 0 ? 'On leave' : '',
    };
  },
);

const DemoApp = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  const handleToggleLanguage = () => {
    const currentLang = document.documentElement.lang;
    document.documentElement.lang = currentLang === 'en' ? 'ar' : 'en';
    document.documentElement.dir = currentLang === 'en' ? 'rtl' : 'ltr';

    setLang(currentLang === 'en' ? 'ar' : 'en');
  };

  const bgColor = useCallback(
    (isCurrentDay: boolean, isSelected: boolean, isAvailable: boolean) => {
      if (isCurrentDay) return '#fffde7';
      if (isSelected) return '#ff6600';
      if (!isAvailable) return '#f0f0f0';
      return 'transparent';
    },
    [],
  );

  interface RenderDayCellProps {
    date: Date;
    isSelected: boolean;
    isAvailable: boolean;
    isCurrentDay: boolean;
    // isCurrentMonth?: boolean;
    // hijriDate?: string;
    leaveStatement?: string;
  }

  const renderDayCell = ({
    date,
    isSelected,
    isAvailable,
    isCurrentDay,
    // isCurrentMonth,
    // hijriDate,
    leaveStatement,
  }: RenderDayCellProps) => (
    <div
      style={{
        backgroundColor:
          bgColor(isCurrentDay, isSelected, isAvailable) || 'transparent',
        padding: '28px 4px',
        transition: 'background 0.2s, border 0.2s',
        color: isSelected ? '#fff' : '#000',
        cursor: isAvailable ? 'pointer' : 'not-allowed',
      }}
    >
      <span>{date.getDate()}</span>
      {leaveStatement && (
        <span
          style={{
            background: 'linear-gradient(90deg, #f8fafc 0%, #e0e7ff 100%)',
            color: '#3b82f6',
            border: '1px solid #a5b4fc',
            borderRadius: '2px',
            padding: '0.2rem 0.3rem',
            marginLeft: '0.5rem',
            fontWeight: 500,
            fontSize: '0.5em',
            boxShadow: '0 1px 3px rgba(59,130,246,0.07)',
            cursor: 'pointer',
          }}
          title="Leave Statement for national holidays"
        >
          i
        </span>
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto' }}>
      <button onClick={handleToggleLanguage}>
        Toggle Language ({lang === 'en' ? 'Ar' : 'En'})
      </button>
      <br />
      <Calendar
        availableDatesInfo={mockAvailableDates}
        lang={lang}
        primaryColor="#ff6600"
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        unavailableColor="#999999"
        mode="customAvailable"
        // renderDayCell={renderDayCell}
      />
      <div style={{ marginTop: 16 }}>
        <b>Selected Date:</b>{' '}
        {selectedDate ? selectedDate.toLocaleString() : 'None'}
      </div>
    </div>
  );
};

const rootElement = document.querySelector('#root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<DemoApp />);
} else {
  console.error("Root element with id 'root' not found.");
}
