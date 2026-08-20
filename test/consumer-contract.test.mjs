import assert from 'node:assert/strict';
import test from 'node:test';

import {
  isTrueEnv,
  optionalEnv,
  requiredEnv,
  splitEnvList,
} from '../dist/env.js';
import { Logger, shouldLog } from '../dist/logging.js';

test('environment helpers preserve the public contract', () => {
  const environment = { EMPTY: 'null', ENABLED: 'TRUE', LIST: 'a:b, c', VALUE: 'ok' };
  assert.equal(optionalEnv('EMPTY', environment), undefined);
  assert.equal(isTrueEnv('ENABLED', environment), true);
  assert.deepEqual(splitEnvList('LIST', environment), ['a', 'b', 'c']);
  assert.equal(requiredEnv('VALUE', environment), 'ok');
  assert.throws(() => requiredEnv('MISSING', environment), /process\.env\.MISSING not defined/);
});

test('logging filters according to its public levels', () => {
  assert.equal(shouldLog('info', 'error'), true);
  assert.equal(shouldLog('info', 'debug'), false);
  assert.equal(Logger.getLogLevel(), 'debug');
});
