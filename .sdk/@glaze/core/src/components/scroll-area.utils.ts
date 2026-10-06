// Threshold within which the viewport counts as being at the bottom.
export const AT_BOTTOM_THRESHOLD_PX = 5;

type ScrollGeometry = {
  scrollHeight: number;
  scrollTop: number;
  clientHeight: number;
};

export function shouldShowScrollToBottomButton({ scrollHeight, scrollTop, clientHeight }: ScrollGeometry): boolean {
  const scrollableDistance = Math.max(0, scrollHeight - clientHeight);
  if (scrollableDistance < AT_BOTTOM_THRESHOLD_PX) return false;
  return scrollableDistance - scrollTop >= AT_BOTTOM_THRESHOLD_PX;
}
