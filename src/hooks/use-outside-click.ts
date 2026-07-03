import * as React from "react";

type Handler = (event: MouseEvent | TouchEvent) => void;

/** Calls `handler` when a pointer/touch event occurs outside `ref`. */
export function useOutsideClick(
  ref: React.RefObject<HTMLElement | null>,
  handler: Handler
) {
  React.useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
