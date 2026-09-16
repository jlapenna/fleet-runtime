import assert from 'node:assert/strict';
import test from 'node:test';

import { Logger } from '@jlapenna/fleet-runtime/logging';

function captureStructuredMessage(fn) {
  const lines = [];
  const originalLog = console.log;
  console.log = (...args) => lines.push(args);
  try {
    fn(new Logger('error', { forceStructuredLogging: () => true }));
  } finally {
    console.log = originalLog;
  }
  assert.equal(lines.length, 1);
  return JSON.parse(lines[0][0]).message;
}

test('error with no cause logs unchanged (stack only)', () => {
  const error = new Error('boom');
  const message = captureStructuredMessage((logger) => logger.error(error));
  assert.equal(message, error.stack);
  assert.ok(!message.includes('Caused by:'));
});

test('error with a single cause appends one Caused by line', () => {
  const cause = new Error('root cause');
  const error = new Error('wrapper', { cause });
  const message = captureStructuredMessage((logger) => logger.error(error));
  assert.equal(message, `${error.stack}\nCaused by: ${cause.stack}`);
});

test('nested causes are each printed on their own line', () => {
  const root = new Error('root');
  const mid = new Error('mid', { cause: root });
  const outer = new Error('outer', { cause: mid });
  const message = captureStructuredMessage((logger) => logger.error(outer));
  assert.equal(
    message,
    `${outer.stack}\nCaused by: ${mid.stack}\nCaused by: ${root.stack}`,
  );
});

test('a non-Error cause is stringified instead of using .stack', () => {
  const error = new Error('ProjectionRefreshError', {
    cause: { message: 'FORBIDDEN', type: 'GRAPHQL_ERROR' },
  });
  const message = captureStructuredMessage((logger) => logger.error(error));
  assert.equal(
    message,
    `${error.stack}\nCaused by: ${String(error.cause)}`,
  );
});

test('cause chains longer than 5 are depth-limited', () => {
  let current = new Error('level-0');
  const errors = [current];
  for (let i = 1; i <= 7; i += 1) {
    current = new Error(`level-${i}`, { cause: current });
    errors.push(current);
  }
  const outermost = errors[errors.length - 1];

  const message = captureStructuredMessage((logger) => logger.error(outermost));
  const causedByCount = message.split('\n').filter((line) => line.startsWith('Caused by:')).length;
  assert.equal(causedByCount, 5);
});

test('a cyclical cause chain does not loop forever', () => {
  const errorA = new Error('A');
  const errorB = new Error('B', { cause: errorA });
  errorA.cause = errorB;

  const message = captureStructuredMessage((logger) => logger.error(errorA));
  assert.equal(message, `${errorA.stack}\nCaused by: ${errorB.stack}`);
});
