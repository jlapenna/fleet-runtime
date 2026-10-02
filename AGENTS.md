# fleet-runtime Agent Guide

This is a compact routing file for a deliberately small package.

## Start Here

- Read `ARCHITECTURE.md` before changing a public subpath or boundary.
- Use `docs/README.md` to locate package and consumer documentation.
- Make changes in a dedicated linked worktree from current `origin/main`.
- Run the focused contract while iterating, then `pnpm test` before delivery.

## Task Routes

| Task | Owner | Proof |
| --- | --- | --- |
| Environment values | `src/env.ts` | consumer-contract tests |
| Structured logging | `src/logging.ts` | logging consumer contracts |
| Vitest compatibility helpers | `src/vitest/` | fixture consumer contracts |
| Public subpaths | `package.json` exports and build config | build plus consumer contracts |
| Package boundary or docs | `ARCHITECTURE.md`, `docs/README.md` | agent-context contracts |

## Boundaries

- This package owns neutral runtime primitives, not application policy.
- It contains no Agent LCARS session/identity behavior and no repository or
  deployment commands.
- Consumers depend only on published `@jlapenna/fleet-runtime/*` subpaths;
  internal source paths are not public contracts.
- Keep runtime dependencies minimal and avoid importing optional test peers
  from production modules.

Update the owning module and executable contract when behavior changes; do not
expand this router into a procedure manual.
