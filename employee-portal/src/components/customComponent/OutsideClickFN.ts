import { useEffect } from "react";

export function useOutsideClick(
  ref: React.RefObject<HTMLElement | null> | React.RefObject<HTMLElement | null>[],
  cb: () => void,
  enabled: boolean,
): void {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: MouseEvent): void => {
      const refs = Array.isArray(ref) ? ref : [ref];
      // Check if the click is outside all of the provided refs
      const isOutside = refs.every((r) => r.current && !r.current.contains(e.target as Node));
      if (isOutside) cb();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [enabled, cb, ref]); // Note: If passing an array literal for `ref`, ensure it's memoized or stable.
}
