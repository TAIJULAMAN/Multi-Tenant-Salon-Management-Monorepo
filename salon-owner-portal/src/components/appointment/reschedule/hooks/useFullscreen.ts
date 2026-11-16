import { RefObject } from "react";

export function useFullscreen(ref: RefObject<HTMLElement | null>) {
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      ref.current?.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message}`,
        );
      });
    } else {
      document.exitFullscreen();
    }
  };

  return toggleFullscreen;
}
