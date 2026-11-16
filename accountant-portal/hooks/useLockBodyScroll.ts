"use client";

import { useEffect } from "react";

/**
 * Reusable hook to lock body scrolling when a modal or overlay is active.
 * Restores original scroll behavior upon unmounting or when locked becomes false.
 */
export function useLockBodyScroll(isLocked: boolean = true) {
  useEffect(() => {
    if (!isLocked) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow || "unset";
    };
  }, [isLocked]);
}
