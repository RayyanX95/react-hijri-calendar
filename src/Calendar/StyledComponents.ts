import styled from "styled-components";

export const CalendarContainer = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 8px;
  @media (min-width: 768px) {
    max-width: 92vw;
    font-size: 14px;
  }
`;

export const Header = styled.div`
  display: flex;
  height: 48px;
  align-items: center;
  justify-content: space-between;
  background-color: #f9fafb;
  color: #161616;
  padding: 0 24px;
  @media (min-width: 768px) {
    height: 48px;
  }
`;

export const MonthYearText = styled.div`
  span:first-child {
    font-size: 22px;
    padding: 0 8px;
    font-weight: bold;
    @media (min-width: 768px) {
      font-size: 18px;
    }
  }
`;

export const ChevronButton = styled.button<{ $isRtl: boolean }>`
  background-color: transparent;
  border: none;
  transform: ${(props) => (props.$isRtl ? "rotate(180deg)" : "none")};
`;

export const TableContainer = styled.div`
  overflow-x: auto;
`;

export const Table = styled.table`
  min-width: 100%;
  border: 3px solid #f8f8f8;
  background-color: white;
`;

export const TableHeader = styled.th`
  border: 3px solid #f9fafb;
  padding: 4px;
  font-size: 14px;
  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

export const TableCell = styled.td<{
  $isSelected: boolean;
  $isAvailable: boolean;
  $isCurrentDay: boolean;
  $isCurrentMonth: boolean
}>`
  padding: 18px 10px;
  border: 2px solid #f9fafb;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  transition: background-color 1000ms;
  cursor: ${(props) => (props.$isAvailable ? "pointer" : "not-allowed")};
  opacity: ${(props) => props.$isCurrentMonth ? 1 : 0.7};

  @media (min-width: 768px) {
    padding: 24px 4px;
    border-width: 1px;
    font-size: 16px;
  }

  background-color: ${(props) => {
    if (props.$isSelected) return "#1B8354";
    if (!props.$isAvailable) return "#E5E7EB";
    if (props.$isCurrentDay && !props.$isSelected) return "transparent";
    return "white";
  }};

  color: ${(props) => {
    if (props.$isSelected) return "white";
    if (!props.$isAvailable) return "#6C737F";
    if (props.$isCurrentDay && !props.$isSelected) return "#1B8354";
    return "inherit";
  }};

  &:hover {
    background-color: ${(props) => {
    if (props.$isSelected) return "#1B8354";
    if (props.$isAvailable) return "#f3f4f6";
    return "#E5E7EB";
  }};
  }
`;

export const CellContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

export const TooltipContainer = styled.div`
  width: min-content;
  opacity: 1;
`;

export const DayContainer = styled.div<{ $isCurrentMonth: boolean }>`
  font-weight: 600;
  opacity: ${(props) => props.$isCurrentMonth ? 1 : 0.7};
`;

export const IconsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;