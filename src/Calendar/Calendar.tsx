import { isSameDay, format, parse, isToday } from "date-fns";

import {
  ActionsContainer,
  CalendarContainer,
  ChevronButton,
  DayContainer,
  Header,
  IconsContainer,
  MonthYearText,
  Table,
  TableCell,
  TableContainer,
  TableHeader,
  CellContent,
} from "./StyledComponents";
import { useManageCalendar } from "./useManageCalendar";
import { getHijriDate } from "./utils";

import { JSX } from "react";
import { AvailableDateInfo, SetSelectedDateFunc } from "./types";
import { ChevronRightIcon } from "./ChevronRightIcon";
import { ChevronLeftIcon } from "./ChevronLeftIcon";

const LABELS = {
  en: {
    hijri: "Hijri",
    gregorian: "Gregorian",
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
  ar: {
    hijri: "هجري",
    gregorian: "ميلادي",
    weekdays: ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
  },
};

interface CalendarProps {
  /** Currently selected date (string in yyyyMMdd or Date object, or null) */
  selectedDate: string | Date | null;
  /** Callback to update selected date */
  setSelectedDate: SetSelectedDateFunc;
  /** Array of date availability information */
  availableDatesInfo: AvailableDateInfo[];
  /** Loading state of the calendar */
  isLoading?: boolean;
  /** Language for labels ("en" or "ar") */
  lang?: "en" | "ar";
  /** Optional: Custom day cell renderer */
  renderDayCell?: (params: {
    date: Date;
    isSelected: boolean;
    isAvailable: boolean;
    isCurrentDay: boolean;
    isCurrentMonth: boolean;
    hijriDate: ReturnType<typeof getHijriDate>;
    leaveStatement?: string;
  }) => JSX.Element;
  /** Optional: Style overrides */
  className?: string;
}

/**
 * Calendar component for displaying and selecting dates
 * @param {Object} props - Component props
 * @param {string|Date|null} props.selectedDate - Currently selected date
 * @param {function} props.setSelectedDate - Function to update selected date
 * @param {AvailableDateInfo[]} props.availableDatesInfo - Array of date availability information
 * @param {boolean} [props.isLoading] - Loading state of the calendar
 * @param {"en"|"ar"} [props.lang] - Language for labels
 * @param {function} [props.renderDayCell] - Custom day cell renderer
 * @param {string} [props.className] - Optional className for style overrides
 * @returns {JSX.Element} Calendar component
 */
export const Calendar = ({
  selectedDate,
  setSelectedDate,
  availableDatesInfo,
  isLoading,
  lang = "en",
  renderDayCell,
  className,
}: CalendarProps): JSX.Element => {
  const labels = LABELS[lang] || LABELS.en;

  const {
    weekdayNames,
    weeks,
    currentMonthYear,
    handleDateClick,
    goToPreviousMonth,
    goToNextMonth,
    toggleHijri,
    isHijri,
    currentHijriDate,
    currentActiveViewDate,
  } = useManageCalendar(availableDatesInfo, setSelectedDate, lang);

  // Use internal weekday labels
  const weekDays = labels.weekdays;

  const renderChevronIcon = (action: "prev" | "next") => (
    <ChevronButton
      $isRtl={lang === "en"}
      type="button"
      onClick={action === "prev" ? goToPreviousMonth : goToNextMonth}
    >
      {action === "prev" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
    </ChevronButton>
  );

  return (
    <CalendarContainer className={className || "text-xs-regular"}>
      <Header>
        <MonthYearText>
          <span>{currentMonthYear.month}</span>
          <span>{currentMonthYear.year}</span>
        </MonthYearText>
        <ActionsContainer>
          <button onClick={toggleHijri}>
            {isHijri ? labels.gregorian : labels.hijri}
          </button>
          <IconsContainer>
            {renderChevronIcon("prev")}
            {renderChevronIcon("next")}
          </IconsContainer>
        </ActionsContainer>
      </Header>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              {weekDays.map((day, index) => (
                <TableHeader key={index}>{day}</TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, weekIndex) => (
              <tr key={weekIndex}>
                {week.map((date, dateIndex) => {
                  const isSelectedDate = selectedDate
                    ? typeof selectedDate === "string"
                      ? isSameDay(date, parse(selectedDate))
                      : isSameDay(date, selectedDate)
                    : false;
                  const isAvailable =
                    availableDatesInfo?.find(
                      (item) => item.date === format(date, "yyyyMMdd")
                    )?.dateStatus === "Available";
                  const isCurrentDay = isToday(date);
                  const hijriDate = getHijriDate(date);

                  const leaveStatement = availableDatesInfo?.find(
                    (item) => item.date === format(date, "yyyyMMdd")
                  )?.leaveStatement;

                  // Determine if this date belongs to the current month being viewed
                  const isCurrentMonthDate = isHijri
                    ? hijriDate.month === currentHijriDate.month &&
                      hijriDate.year === currentHijriDate.year
                    : format(date, "yyyy-MM") ===
                      format(currentActiveViewDate, "yyyy-MM");

                  // Custom renderer support
                  if (renderDayCell) {
                    return renderDayCell({
                      date,
                      isSelected: isSelectedDate,
                      isAvailable,
                      isCurrentDay,
                      isCurrentMonth: isCurrentMonthDate,
                      hijriDate,
                      leaveStatement,
                    });
                  }

                  return (
                    <TableCell
                      key={dateIndex}
                      $isAvailable={isAvailable}
                      $isCurrentDay={isCurrentDay}
                      $isCurrentMonth={isCurrentMonthDate}
                      $isSelected={isSelectedDate}
                      onClick={() => handleDateClick(date)}
                    >
                      <CellContent>
                        <DayContainer $isCurrentMonth={isCurrentMonthDate}>
                          {isHijri ? hijriDate.day : format(date, "d")}
                        </DayContainer>
                      </CellContent>
                    </TableCell>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </CalendarContainer>
  );
};

Calendar.displayName = "Calendar";
