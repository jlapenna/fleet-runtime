import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), 'utf8');
}

test('always-loaded agent context stays compact', async () => {
  assert.ok(Buffer.byteLength(await read('AGENTS.md')) <= 14 * 1024);
});

test('agent router points to architecture, docs, owners, and proof', async () => {
  const agents = await read('AGENTS.md');
  for (const route of ['ARCHITECTURE.md', 'docs/README.md', '.agents/skills/fleet-runtime-dev/SKILL.md', 'src/env.ts', 'src/logging.ts', 'src/vitest/', 'pnpm test']) {
    assert.match(agents, new RegExp(route.replaceAll('.', '\\.'), 'i'));
  }
});

test('router does not duplicate release or repository procedures', async () => {
  assert.doesNotMatch(await read('AGENTS.md'), /gh pr (create|merge)|git (pull|rebase)|pnpm publish/);
});

test('documentation index targets exist', async () => {
  const skillPath = '.agents/skills/fleet-runtime-dev/SKILL.md';
  for (const routerPath of ['AGENTS.md', 'docs/README.md']) {
    const routerUrl = new URL(routerPath, root);
    const destinations = [...(await read(routerPath)).matchAll(/\[[^\]]*\]\(([^\s)]+)\)/g)]
      .map((match) => match[1])
      .filter((destination) => !destination.startsWith('/') && !destination.includes('\\') &&
        !/^[a-z][a-z0-9+.-]*:/i.test(destination))
      .map((destination) => new URL(destination, routerUrl));
    const target = destinations.find((url) => url.href === new URL(skillPath, root).href);
    assert.ok(target, `${routerPath} must link to the maintenance skill relative to its own directory`);
    await assert.doesNotReject(readFile(target, 'utf8'), `${routerPath} skill destination must exist`);
  }
  for (const path of ['ARCHITECTURE.md', 'README.md', 'test/consumer-contract.test.mjs', 'package.json', '.agents/skills/fleet-runtime-dev/SKILL.md']) {
    await assert.doesNotReject(read(path), path);
  }
});

test('architecture records the neutral package boundary', async () => {
  const architecture = await read('ARCHITECTURE.md');
  for (const concept of ['Neutrality Boundary', 'src/env.ts', 'src/logging.ts', 'src/vitest/', 'Proof Ladder']) {
    assert.match(architecture, new RegExp(concept.replaceAll('.', '\\.'), 'i'));
  }
});

test('negative fixtures violate the contract', () => {
  assert.ok(Buffer.byteLength('x'.repeat(14 * 1024 + 1)) > 14 * 1024);
  assert.match('pnpm publish', /pnpm publish/);
});
