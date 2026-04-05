import { useState, useRef, useCallback } from 'react';

/**
 * A game timer that uses Date.now() to avoid drift.
 * Counts up in elapsed milliseconds.
 * - start(): starts timer on first card flip (no-op if already running)
 * - stop(): stops timer (called on win)
 * - reset(): resets elapsed to 0 and stops timer
 */
export function useTimer() {
  const [elapsedMs, setElapsedMs] = useState(0);
  // null means not running
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // the Date.now() value when the timer was (last) started
  const startTimestampRef = useRef<number | null>(null);
  // accumulated ms before the current interval (for pause/resume support if needed)
  const accumulatedRef = useRef(0);

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      // Snapshot the current elapsed into accumulated so it survives a stop
      if (startTimestampRef.current !== null) {
        accumulatedRef.current += Date.now() - startTimestampRef.current;
        startTimestampRef.current = null;
      }
    }
  }, []);

  const start = useCallback(() => {
    // Already running — ignore
    if (intervalRef.current !== null) return;

    startTimestampRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      if (startTimestampRef.current !== null) {
        setElapsedMs(accumulatedRef.current + Date.now() - startTimestampRef.current);
      }
    }, 100); // update every 100 ms for smooth MM:SS display
  }, []);

  const reset = useCallback(() => {
    stop();
    accumulatedRef.current = 0;
    startTimestampRef.current = null;
    setElapsedMs(0);
  }, [stop]);

  return { elapsedMs, start, stop, reset };
}

/** Formats elapsed milliseconds as MM:SS */
export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
