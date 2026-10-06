export function getScrollAreaToolbarRootWarning(container: Pick<HTMLElement, "querySelector">): string | null {
  if (container.querySelector("[data-toolbar]")) return null;
  return "[ScrollArea] `toolbar` must contain a complete <Toolbar> ([data-toolbar]). Prefer the wrapper's standard chrome props, or include a complete <Toolbar>.";
}
