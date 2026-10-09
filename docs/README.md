# Documentation Index

| Need | Document |
| --- | --- |
| Understand package ownership and neutrality | [`../ARCHITECTURE.md`](../ARCHITECTURE.md) |
| Install and import public subpaths | [`../README.md`](../README.md) |
| Inspect the executable consumer contract | [`../test/consumer-contract.test.mjs`](../test/consumer-contract.test.mjs) |
| Inspect public exports and commands | [`../package.json`](../package.json) |

Implementation belongs in `src/`; generated output belongs in `dist/`; public
compatibility is defined by package exports and consumer tests. Keep new durable
guidance small and link it here rather than expanding `AGENTS.md`.

## Repository and harness maintenance

Start at the [agent guide](../AGENTS.md) and
[fleet-runtime-dev skill](../.agents/skills/fleet-runtime-dev/SKILL.md) for source ownership,
verification and delivery. The skill keeps this repository's operational
boundaries local and routes general harness upkeep to the shared workflow.
