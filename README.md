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
  // For 'customAvailable' mode:
  const availableDatesInfo = [
    { date: '20250730', isAvailable: true, leaveStatement: '' },
    // ...
  ];
  return (
    <>
      {/* All days selectable (allAvailable mode --- default) */}
      <Calendar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        lang="en" // or "ar"
      />

      {/* Only specific dates selectable (customAvailable mode) */}
      <Calendar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        availableDatesInfo={availableDatesInfo}
        mode="customAvailable"
        lang="en"
      />
    </>
  );
}
```

## Props

| Prop               | Type                                  | Description                                                                                                               |
| ------------------ | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| selectedDate       | `Date \| null`                        | Currently selected date (Date object or null)                                                                             |
| setSelectedDate    | `(date: Date) => void`                | Callback to update selected date.                                                                                         |
| availableDatesInfo | `AvailableDateInfo[]`                 | Array of date info objects (required for `customAvailable` mode)                                                          |
| mode               | `'allAvailable' \| 'customAvailable'` | Calendar selection mode. `'allAvailable'` = all days selectable (default), `'customAvailable'` = only availableDatesInfo. |
| lang               | `'en' \| 'ar'`                        | Language for labels                                                                                                       |
| renderDayCell      | `function`                            | Custom day cell renderer                                                                                                  |
| className          | `string`                              | Custom class for main container                                                                                           |
| style              | `React.CSSProperties`                 | Inline styles for main container (supports CSS variables for theming)                                                     |
| dayCellStyle       | `React.CSSProperties`                 | Inline styles for day cells                                                                                               |
| dayCellClassName   | `string`                              | Custom class for day cells                                                                                                |
| primaryColor       | `string`                              | Primary color (overrides default)                                                                                         |
| unavailableColor   | `string`                              | Unavailable color (overrides default)                                                                                     |

## Modes

The `mode` prop controls which days are selectable:

- `allAvailable` (default): All days are available for selection. The `availableDatesInfo` prop is ignored.
- `customAvailable`: Only dates in the `availableDatesInfo` array with `isAvailable: true` are selectable. All other days are disabled.

If `mode` is `customAvailable` and `availableDatesInfo` is missing or empty, all days will be disabled and a warning will be shown in development.

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

export type AvailableDateInfo = {
  date: string; // 'YYYYMMDD' format
  isAvailable: boolean;
  leaveStatement?: string;
};
```

## License

ISC
