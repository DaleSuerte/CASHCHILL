"use client";

type PlausibleWindow = Window & {
  plausible?: (eventName: string, options?: Record<string, unknown>) => void;
};

export function track(eventName: string, options?: Record<string, unknown>) {
  if (typeof window === "undefined") {
    return;
  }

  const pWindow = window as PlausibleWindow;

  if (typeof pWindow.plausible === "function") {
    pWindow.plausible(eventName, options);
  } else {
    console.log(`[analytics placeholder] ${eventName}`, options ?? {});
  }
}
