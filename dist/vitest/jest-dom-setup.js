import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'vitest';
// The matchers' ESM build has named exports only, but its declarations use
// `export =` (testing-library/jest-dom#746), so TypeScript sees a `default`
// member that does not exist at runtime.
expect.extend(matchers);
afterEach(() => {
    cleanup();
});
