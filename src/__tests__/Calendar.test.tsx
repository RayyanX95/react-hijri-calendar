/// <reference types="@testing-library/jest-dom" />
import { render } from '@testing-library/react';

import { Calendar } from '../Calendar/Calendar';

// describe('Calendar', () => {
//   it('renders in English (LTR) mode', () => {
//     const { getByText } = render(
//       <Calendar
//         availableDatesInfo={[]}
//         lang="en"
//         selectedDate={null}
//         setSelectedDate={() => {}}
//       />,
//     );
//     expect(getByText('Hijri')).toBeInTheDocument();
//     expect(getByText('Sun')).toBeInTheDocument();
//   });

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

// it('calls setSelectedDate when an available date is clicked', () => {
//   const setSelectedDate = jest.fn();
//   const { getByText } = render(
//     <Calendar
//       availableDatesInfo={[{ date: '20225-08-01', isAvailable: true }]}
//       lang="en"
//       selectedDate={null}
//       setSelectedDate={setSelectedDate}
//     />,
//   );

//   fireEvent.click(getByText('Sun'));

//   expect(setSelectedDate).toHaveBeenCalledWith('2025-08-01');
// });
