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

      {/* Example 1: Basic Calendar (default) */}
      <section
        style={{
          marginBottom: 40,
          padding: 24,
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          background: '#f9fafb',
        }}
      >
        <h2 style={{ marginBottom: 8 }}>1. Basic Calendar (Default)</h2>
        <p style={{ marginBottom: 16 }}>
          This is the default calendar with no customizations.
        </p>
        <Calendar />
      </section>

      {/* Example 2: Calendar with Custom Available Dates & Language Toggle */}
      <section
        style={{
          marginBottom: 40,
          padding: 24,
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          background: '#f3f4f6',
        }}
      >
        <h2 style={{ marginBottom: 8 }}>
          2. Calendar with Custom Available Dates & Language Toggle
        </h2>
        <p style={{ marginBottom: 16 }}>
          This example shows the calendar with custom available dates and a
          language toggle button.
        </p>
        <button
          style={{
            marginBottom: 16,
            padding: '8px 18px',
            border: 'none',
            borderRadius: 6,
            background: 'linear-gradient(90deg, #6366f1 0%, #38bdf8 100%)',
            color: '#fff',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(56,189,248,0.08)',
            transition: 'background 0.2s, box-shadow 0.2s',
          }}
          onClick={handleToggleLanguage}
        >
          {lang === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
        </button>
        <Calendar
          availableDatesInfo={mockAvailableDates}
          initialSelectedDate={selectedDate}
          lang={lang}
          mode="customAvailable"
          primaryColor="#ff6600"
          setSelectedDate={setSelectedDate}
          unavailableColor="#999999"
        />
        <div style={{ marginTop: 12 }}>
          <b>Selected Date:</b>{' '}
          {selectedDate ? selectedDate.toLocaleString() : 'None'}
        </div>
      </section>

      {/* Example 3: Calendar with Custom Day Cell Rendering */}
      <section
        style={{
          marginBottom: 40,
          padding: 24,
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          background: '#f1f5f9',
        }}
      >
        <h2 style={{ marginBottom: 8 }}>
          3. Calendar with Custom Day Cell Rendering
        </h2>
        <p style={{ marginBottom: 16 }}>
          This example demonstrates how to use a custom renderer for each day
          cell, including leave statements and special events.
        </p>
        <Calendar
          availableDatesInfo={mockAvailableDates}
          initialSelectedDate={selectedDateCustomCell}
          lang="en"
          mode="customAvailable"
          primaryColor="#0ea5e9"
          renderDayCell={renderDayCell}
          setSelectedDate={setSelectedDateCustomCell}
          unavailableColor="#e5e7eb"
        />
        <div style={{ marginTop: 12 }}>
          <b>Selected Date:</b>{' '}
          {selectedDateCustomCell
            ? selectedDateCustomCell.toLocaleString()
            : 'None'}
        </div>
      </section>

      {/* Example 4: Calendar in Arabic (RTL) Mode */}
      <section
        style={{
          marginBottom: 40,
          padding: 24,
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          background: '#f9fafb',
        }}
      >
        <h2 style={{ marginBottom: 8 }}>4. Calendar in Arabic (RTL) Mode</h2>
        <p style={{ marginBottom: 16 }}>
          This example shows the calendar fully in Arabic (RTL) mode.
        </p>
        <Calendar
          availableDatesInfo={mockAvailableDates}
          initialSelectedDate={selectedDateArabic}
          lang="ar"
          mode="customAvailable"
          primaryColor="#16a34a"
          setSelectedDate={setSelectedDateArabic}
          unavailableColor="#d1d5db"
        />
        <div style={{ marginTop: 12 }}>
          <b>Selected Date:</b>{' '}
          {selectedDateArabic ? selectedDateArabic.toLocaleString() : 'None'}
        </div>
      </section>
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
