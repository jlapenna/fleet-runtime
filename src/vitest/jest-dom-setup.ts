import * as matchers from '@testing-library/jest-dom/matchers';
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, expect, type MatchersObject } from 'vitest';

// @testing-library/jest-dom/vitest still augments Vitest 4's one-parameter
// Assertion<T>; Vitest 5 declares Assertion<R, T>, so that augmentation no
// longer merges (testing-library/jest-dom#738). Register the matchers and
// declare their types against Vitest 5 here instead.
declare module 'vitest' {
  interface Assertion<R extends void | Promise<void> = void, T = unknown>
    extends TestingLibraryMatchers<T, R> {}
  interface AsymmetricMatchersContaining
    extends TestingLibraryMatchers<any, any> {}
}

// The matchers' ESM build has named exports only, but its declarations use
// `export =` (testing-library/jest-dom#746), so TypeScript sees a `default`
// member that does not exist at runtime.
expect.extend(matchers as unknown as MatchersObject);

afterEach(() => {
  cleanup();
});
