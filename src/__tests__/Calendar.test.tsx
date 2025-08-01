/// <reference types="@testing-library/jest-dom" />

import { render } from '@testing-library/react';

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

it('toggles from Gregorian to Hijri calendars', () => {
  const { getByLabelText, getByText } = render(
    <Calendar
      availableDatesInfo={[]}
      lang="en"
      selectedDate={null}
      setSelectedDate={() => {}}
    />,
  );

  const toggleButton = getByLabelText('Toggle calendar type'); // Assuming the button has this aria-label
  toggleButton.click();

  expect(getByText('Hijri')).toBeInTheDocument();
});

it('toggles from Hijri to Gregorian calendars', () => {
  const { getByLabelText, getByText } = render(
    <Calendar
      availableDatesInfo={[]}
      calendarType="hijri"
      lang="en"
      selectedDate={null}
      setSelectedDate={() => {}}
    />,
  );

  const toggleButton = getByLabelText('Toggle calendar type'); // Assuming the button has this aria-label
  toggleButton.click();

  expect(getByText('Gregorian')).toBeInTheDocument();
});

it('handles date selection', () => {
  const mockSetSelectedDate = jest.fn();
  const { getByText } = render(
    <Calendar
      availableDatesInfo={[]}
      lang="en"
      selectedDate={null}
      setSelectedDate={mockSetSelectedDate}
    />,
  );

  const dateCell = getByText('15'); // Assuming the 15th day of the month is rendered
  dateCell.click();

  expect(mockSetSelectedDate).toHaveBeenCalledWith(expect.any(Date));
});
