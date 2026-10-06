import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "./button";
import { ButtonGroup, ButtonGroupSeparator, type ButtonGroupProps } from "./button-group";

export interface NavigationButtonGroupProps {
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  size?: ButtonGroupProps["size"];
  variant?: ButtonGroupProps["variant"];
}

export function NavigationButtonGroup({
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
  size = "large",
  variant = "glass",
}: NavigationButtonGroupProps) {
  const iconClass = size === "large" ? "size-5.5" : size === "medium" ? "size-4.5" : "size-4";

  return (
    <ButtonGroup variant={variant} size={size}>
      <Button iconOnly disabled={!canGoBack} onClick={onGoBack}>
        <ChevronLeftIcon className={`${iconClass} relative -left-px`} />
      </Button>
      <ButtonGroupSeparator />
      <Button iconOnly disabled={!canGoForward} onClick={onGoForward}>
        <ChevronRightIcon className={`${iconClass} relative -right-px`} />
      </Button>
    </ButtonGroup>
  );
}
