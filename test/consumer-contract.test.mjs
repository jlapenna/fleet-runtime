import assert from 'node:assert/strict';
import test from 'node:test';

import {
  isTrueEnv,
  optionalEnv,
  requiredEnv,
  splitEnvList,
} from '@jlapenna/fleet-runtime/env';
import {
  Logger,
  setLogEnricher,
  shouldLog,
} from '@jlapenna/fleet-runtime/logging';

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

test('structured logging preserves fields, protects its envelope, and can omit context', () => {
  const lines = [];
  const originalLog = console.log;
  console.log = (...args) => lines.push(args);
  setLogEnricher(() => ({
    traceId: 'trace-private',
    requestUrl: '/private',
    userId: 'user-private',
    action: 'action-private',
  }));
  try {
    const logger = new Logger('info', { forceStructuredLogging: () => true });
    logger.structured(
      'info',
      'Search retrieval completed',
      {
        event: 'search_retrieval',
        returnedCount: 3,
        severity: 'OVERRIDE',
        message: 'private query',
        userId: 'field-private',
        action: 'field-action',
        httpRequest: { requestUrl: '/field-private' },
        'logging.googleapis.com/trace': 'field-trace',
      },
      { enrich: false },
    );
    logger.structured('debug', 'filtered', { event: 'must_not_log' });
  } finally {
    setLogEnricher(() => ({}));
    console.log = originalLog;
  }

  assert.equal(lines.length, 1);
  const entry = JSON.parse(lines[0][0]);
  assert.deepEqual(entry, {
    severity: 'INFO',
    message: 'Search retrieval completed',
    event: 'search_retrieval',
    returnedCount: 3,
  });
});

test('structured logging enriches by default without allowing field collisions', () => {
  const lines = [];
  const originalLog = console.log;
  console.log = (...args) => lines.push(args);
  setLogEnricher(() => ({ userId: 'context-user', action: 'context-action' }));
  try {
    new Logger('debug', { forceStructuredLogging: () => true }).structured(
      'info',
      'completed',
      { userId: 'field-user', action: 'field-action', count: 1 },
    );
  } finally {
    setLogEnricher(() => ({}));
    console.log = originalLog;
  }

  assert.deepEqual(JSON.parse(lines[0][0]), {
    severity: 'INFO',
    message: 'completed',
    count: 1,
    userId: 'context-user',
    action: 'context-action',
  });
});
