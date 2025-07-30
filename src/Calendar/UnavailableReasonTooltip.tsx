import { memo } from "react";
import { Tooltip } from "platformscode-react";

import type { ReactNode } from "react";

interface Props {
  description: string;
  icon: ReactNode;
}

/**
 * A memoized tooltip component that displays an icon with a description on hover
 * @param {Object} props - Component props
 * @param {string} props.description - The tooltip text to display
 * @param {ReactNode} props.icon - The icon element to show
 * @returns {JSX.Element} A tooltip wrapped icon element
 */
export const UnavailableReasonTooltip = memo(({ description, icon }: Props) => (
  <Tooltip beakAlignment="center" beakPlacement="bottom" title={description}>
    <span>{icon}</span>
  </Tooltip>
));

UnavailableReasonTooltip.displayName = "UnavailableReasonTooltip";
