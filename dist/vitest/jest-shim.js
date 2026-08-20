import { vi } from 'vitest';
Object.assign(globalThis, {
    jest: {
        fn: vi.fn,
        mock: () => undefined,
        doMock: () => undefined,
        unmock: () => undefined,
        dontMock: () => undefined,
        advanceTimersByTime: (milliseconds) => vi.advanceTimersByTime(milliseconds),
        advanceTimersToNextTimer: () => vi.advanceTimersToNextTimer(),
        runAllTimers: () => vi.runAllTimers(),
        runOnlyPendingTimers: () => vi.runOnlyPendingTimers(),
        useFakeTimers: (options) => vi.useFakeTimers(options),
        useRealTimers: () => vi.useRealTimers(),
        clearAllTimers: () => vi.clearAllTimers(),
    },
});
