---
name: fleet-runtime-dev
description: Develop and review fleet-runtime public package APIs, compatibility, documentation, and consumer contracts.
---

# fleet-runtime-dev

Read [ARCHITECTURE.md](../../../ARCHITECTURE.md) and the
[documentation index](../../../docs/README.md). Work in a dedicated feature
worktree from fresh `origin/main`. Install with `pnpm install --frozen-lockfile`.

## Locate the contract

`src/env.ts` owns environment normalization; `src/logging.ts` owns structured
logging; `src/vitest/` owns optional test helpers. `package.json` exports and
`tsconfig.build.json` own the published import and declaration boundary.
Author source, then build `dist/`; do not edit generated output. Inspect the
matching `test/*.test.mjs` consumer contract before changing a public subpath.
Application environment names, dispatch identity, business policy, and rollout
remain with consumers. Add a shared primitive only when its contract is useful
across consumers without importing their policy.

## Verify and deliver

Run the focused contract during iteration and `pnpm test` before delivery.
This builds the package and exercises its consumer contracts. It does not
prove a consumer has installed or deployed the new artifact. For an integration
change, identify the consuming import and the additional proof needed there.
Commit and push normally, require current-head CI and review, and follow the
shared PR delivery workflow through protected merge and safe worktree cleanup.

## Maintain the guidance

Use the [shared harness-maintenance workflow](https://github.com/jlapenna/repo-tools/blob/main/plugins/repo-tools/skills/harness-maintenance/SKILL.md), adapted from
[Ryan Lopopolo's field guide](https://github.com/lopopolo/harness-engineering/tree/226c8d35fb6ea3ed55467753dba6dea2b5fd5778), when improving agent context.
Trace a concrete failure to the owning contract above; corroborate agent
explanations against source and evidence. Put stable invariants in the existing
API or check, and procedural detail in its owning document or skill reference.
Keep the root guide a router. Dated observations preserve history rather than
live state or permission. Documentation validation proves structure and source
consistency; claim improved agent behavior only with comparable fresh use.
