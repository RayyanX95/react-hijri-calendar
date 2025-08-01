import { useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { Calendar } from '../src/Calendar/Calendar';

import type {
  AvailableDateInfo,
  RenderDayCellParams,
} from '../src/Calendar/types';

const today = new Date();
const mockAvailableDates: AvailableDateInfo[] = Array.from(
  { length: 31 },
  (_, i) => {
    const date = new Date(today.getFullYear(), today.getMonth(), i + 1);
    return {
      date: date.toISOString().slice(0, 10).replaceAll('-', ''),
      isAvailable: i % 5 !== 0, // Every 5th date is unavailable
      leaveStatement: i % 5 === 0 ? 'On leave' : '',
      // Add more properties as needed
      isHalfDay: i % 7 === 0, // Every 7th date is a half day
      note: i % 3 === 0 ? 'Special event' : '',
    };
  },
);

const DemoApp = () => {
  // Example 1: Basic usage with custom available dates
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  // Example 2: Calendar with custom day cell rendering
  const [selectedDateCustomCell, setSelectedDateCustomCell] =
    useState<Date | null>(null);
  // Example 3: Calendar in Arabic mode
  const [selectedDateArabic, setSelectedDateArabic] = useState<Date | null>(
    null,
  );

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

  const renderDayCell = ({
    date,
    isSelected,
    isAvailable,
    isCurrentDay,
    availableCellData,
  }: RenderDayCellParams) => (
    <div
      style={{
        backgroundColor:
          bgColor(isCurrentDay, isSelected, isAvailable) || 'transparent',
        padding: '28px 4px',
        transition: 'background 0.2s, border 0.2s',
        color: isSelected ? '#fff' : '#000',
        cursor: isAvailable ? 'pointer' : 'not-allowed',
      }}
      onClick={() => console.log(availableCellData)}
    >
      <span>{date.getDate()}</span>
      {availableCellData?.leaveStatement && (
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
    <div
      style={{ maxWidth: 1200, margin: '2rem auto', fontFamily: 'sans-serif' }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: 32 }}>
        React Dual Calendar Demo
      </h1>

      {/* Example 1: Basic usage */}
      <h2>1. Basic Calendar with Custom Available Dates</h2>
      <p>
        This example shows the calendar with custom available dates and language
        toggle.
      </p>
      <button style={{ marginBottom: 8 }} onClick={handleToggleLanguage}>
        Toggle Language ({lang === 'en' ? 'Ar' : 'En'})
      </button>
      <Calendar
        availableDatesInfo={mockAvailableDates}
        lang={lang}
        mode="customAvailable"
        primaryColor="#ff6600"
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        unavailableColor="#999999"
      />
      <div style={{ marginTop: 8, marginBottom: 32 }}>
        <b>Selected Date:</b>{' '}
        {selectedDate ? selectedDate.toLocaleString() : 'None'}
      </div>

      {/* Example 2: Custom Day Cell Rendering */}
      <h2>2. Calendar with Custom Day Cell Rendering</h2>
      <p>
        This example demonstrates how to use a custom renderer for each day
        cell.
      </p>
      <Calendar
        availableDatesInfo={mockAvailableDates}
        lang="en"
        mode="customAvailable"
        primaryColor="#0ea5e9"
        renderDayCell={renderDayCell}
        selectedDate={selectedDateCustomCell}
        setSelectedDate={setSelectedDateCustomCell}
        unavailableColor="#e5e7eb"
      />
      <div style={{ marginTop: 8, marginBottom: 32 }}>
        <b>Selected Date:</b>{' '}
        {selectedDateCustomCell
          ? selectedDateCustomCell.toLocaleString()
          : 'None'}
      </div>

      {/* Example 3: Calendar in Arabic Mode */}
      <h2>3. Calendar in Arabic (RTL) Mode</h2>
      <p>This example shows the calendar fully in Arabic (RTL) mode.</p>
      <Calendar
        availableDatesInfo={mockAvailableDates}
        lang="ar"
        mode="customAvailable"
        primaryColor="#16a34a"
        selectedDate={selectedDateArabic}
        setSelectedDate={setSelectedDateArabic}
        unavailableColor="#d1d5db"
      />
      <div style={{ marginTop: 8, marginBottom: 32 }}>
        <b>Selected Date:</b>{' '}
        {selectedDateArabic ? selectedDateArabic.toLocaleString() : 'None'}
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
