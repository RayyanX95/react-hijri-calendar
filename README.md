# React Hijri and Gregorian Calendar

A pluggable React calendar component supporting both Hijri and Gregorian dates, theming, and custom rendering.

## Features

- Hijri and Gregorian Calendar
- RTL/LTR and Arabic/English support
- Theming and style overrides
- Custom day cell rendering
- TypeScript support

## Installation

```bash
npm install react-hijri-calendar
```

## Usage

```tsx
import { Calendar } from 'react-hijri-calendar';

function MyComponent() {
  const [selectedDate, setSelectedDate] = useState(null);
  const availableDatesInfo = [
    { date: '20250730', dateStatus: 'Available', leaveStatement: '' },
    // ...
  ];
  return (
    <Calendar
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      availableDatesInfo={availableDatesInfo}
      lang="en" // or "ar"
    />
  );
}
```

## Props

| Prop               | Type                     | Description                                                                     |
| ------------------ | ------------------------ | ------------------------------------------------------------------------------- |
| selectedDate       | `string \| Date \| null` | Currently selected date (yyyyMMdd, Date, or null)                               |
| setSelectedDate    | `(date: string) => void` | Callback to update selected date. The date string will be in `yyyyMMdd` format. |
| availableDatesInfo | `AvailableDateInfo[]`    | Array of date info objects                                                      |
| isLoading          | `boolean`                | Show loading state                                                              |
| lang               | `'en' \| 'ar'`           | Language for labels                                                             |
| renderDayCell      | `function`               | Custom day cell renderer                                                        |
| className          | `string`                 | Custom class for main container                                                 |
| style              | `React.CSSProperties`    | Inline styles for main container (supports CSS variables for theming)           |
| dayCellStyle       | `React.CSSProperties`    | Inline styles for day cells                                                     |
| dayCellClassName   | `string`                 | Custom class for day cells                                                      |
| primaryColor       | `string`                 | Primary color (overrides default)                                               |
| unavailableColor   | `string`                 | Unavailable color (overrides default)                                           |

## Theming & Styling

Override colors and styles using the `primaryColor`, `unavailableColor`, `className`, `dayCellStyle`, and `dayCellClassName` props:

```tsx
<Calendar
  primaryColor="#ff6600"
  unavailableColor="#999"
  className="my-calendar"
  dayCellStyle={{ borderRadius: 8 }}
  dayCellClassName="my-day-cell"
  // ...
/>
```

## Custom Day Cell Rendering

```tsx
<Calendar
  renderDayCell={({
    date,
    isSelected,
    isAvailable,
    isCurrentDay,
    isCurrentMonth,
    hijriDate,
  }) => (
    <td style={{ background: isSelected ? 'gold' : undefined }}>
      {hijriDate.day}
    </td>
  )}
  // ...
/>
```

## Types

All types are exported from the package:

```ts
import type {
  AvailableDateInfo,
  SetSelectedDateFunc,
} from 'react-hijri-calendar';
```

## License

ISC
