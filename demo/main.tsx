import { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Calendar } from '../src/Calendar/Calendar';
import type { AvailableDateInfo } from '../src/Calendar/types';

const today = new Date();
const mockAvailableDates: AvailableDateInfo[] = Array.from(
  { length: 31 },
  (_, i) => {
    const date = new Date(today.getFullYear(), today.getMonth(), i + 1);
    return {
      date: date.toISOString().slice(0, 10).replace(/-/g, ''),
      isAvailable: i % 5 === 0 ? false : true, // Every 5th date is unavailable
      leaveStatement: i % 5 === 0 ? 'On leave' : '',
    };
  },
);

console.log('mockAvailableDates', mockAvailableDates);
function DemoApp() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  const toggleLanguage = () => {
    const currentLang = document.documentElement.lang;
    document.documentElement.lang = currentLang === 'en' ? 'ar' : 'en';
    document.documentElement.dir = currentLang === 'en' ? 'rtl' : 'ltr';

    setLang(currentLang === 'en' ? 'ar' : 'en');
  };

  const renderDayCell = ({
    date,
    isSelected,
    isAvailable,
    isCurrentDay,
    isCurrentMonth,
    hijriDate,
    leaveStatement,
  }: any) => {
    const bgColor = useMemo(() => {
      if (isCurrentDay) return '#fffde7';
      if (isSelected) return '#ff6600';
      if (!isAvailable) return '#f0f0f0';
      return 'transparent';
    }, [isCurrentDay, isSelected]);

    return (
      <div
        style={{
          backgroundColor: bgColor,
          padding: '28px 4px',
          transition: 'background 0.2s, border 0.2s',
          color: isSelected ? '#fff' : '#000',
          cursor: isAvailable ? 'pointer' : 'not-allowed',
        }}
      >
        <span>{date.getDate()}</span>
        {leaveStatement && (
          <span
            title="Leave Statement for national holidays"
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
          >
            i
          </span>
        )}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto' }}>
      <button onClick={toggleLanguage}>
        Toggle Language ({lang === 'en' ? 'Ar' : 'En'})
      </button>
      <br />
      <Calendar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        availableDatesInfo={mockAvailableDates}
        lang={lang}
        primaryColor="#ff6600"
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
}

const root = createRoot(document.getElementById('root')!);
root.render(<DemoApp />);
