# Architecture

fleet-runtime is a small, runtime-neutral package of primitives shared by
first-party applications. It standardizes mechanics that should behave the
same across consumers without absorbing their business or fleet policy.

## Package Flow

```text
src/env.ts          ---\
src/logging.ts      ----> TypeScript build --> dist/ --> package exports
src/vitest/*.ts     ---/                         |
                                                v
                                    first-party consumers
```

Consumers install the reviewed Git artifact and import only published
subpaths. `dist/` is build output, not an authoring surface.

## Ownership Map

| Concern | Source of truth | Evidence |
| --- | --- | --- |
| Environment normalization | `src/env.ts` | consumer contract tests |
| Structured console logging | `src/logging.ts` | consumer contract tests |
| Test compatibility fixtures | `src/vitest/` | consumer contract tests |
| Public API surface | `package.json` `exports` | build plus import assertions |
| Compiler output | `tsconfig.build.json` | `pnpm run build` |

## Neutrality Boundary

The package may provide deterministic value parsing, logging mechanics, and
test-environment shims. It must not own:

- Agent LCARS sessions, identity, or dispatch;
- repository worktree, PR, or CI orchestration;
- consumer-specific environment names or product policy;
- deployment, secrets distribution, or live fleet state.

Those decisions remain in consuming repositories. A generic primitive should
enter this package only when multiple consumers can use the same contract
without importing one application's policy.

## Compatibility

Published subpaths are the compatibility boundary. Source organization may
change if the generated declarations and JavaScript preserve those imports.
Optional Vitest and Testing Library peers remain optional so production-only
consumers do not pay for test tooling.

## Proof Ladder

1. Run the focused Node contract for the changed primitive.
2. Run the TypeScript build to prove emitted declarations and modules.
3. Run `pnpm test` for the full build and consumer contract.
4. Require CI on the exact PR head.
5. Test a real consumer only when changing a published integration contract;
   consumer rollout remains outside this repository.
