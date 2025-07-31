/// <reference types="@testing-library/jest-dom" />
import { render, fireEvent } from '@testing-library/react';

import { Calendar } from '../Calendar/Calendar';

describe('Calendar', () => {
  it('renders in English (LTR) mode', () => {
    const { getByText } = render(
      <Calendar
        availableDatesInfo={[]}
        lang="en"
        selectedDate={null}
        setSelectedDate={() => {}}
      />,
    );
    expect(getByText('Hijri')).toBeInTheDocument();
    expect(getByText('Sun')).toBeInTheDocument();
  });

  it('renders in Arabic (RTL) mode', () => {
    const { getByText } = render(
      <Calendar
        availableDatesInfo={[]}
        lang="ar"
        selectedDate={null}
        setSelectedDate={() => {}}
      />,
    );

    expect(getByText('ميلادي')).toBeInTheDocument();
    expect(getByText('أحد')).toBeInTheDocument();
  });

  it('calls setSelectedDate when an available date is clicked', () => {
    const mockSetSelectedDate = jest.fn();
    // 2025-07-30 is a Wednesday
    const availableDatesInfo = [
      {
        date: '20250730',
        dateStatus: 'Available',
        isAvailable: true,
      },
    ];
    const { container } = render(
      <Calendar
        availableDatesInfo={availableDatesInfo}
        lang="en"
        selectedDate={null}
        setSelectedDate={mockSetSelectedDate}
      />,
    );
    // Find the td for 30 that is available
    const cells = Array.from(container.querySelectorAll('td'));
    const cell30 = cells.find(
      (td) =>
        td.textContent === '30' &&
        td.className.includes('available') &&
        td.className.includes('currentMonth'),
    );
    expect(cell30).toBeDefined();
    if (cell30) fireEvent.click(cell30);
    expect(mockSetSelectedDate).toHaveBeenCalledWith('20250730');
  });
});
