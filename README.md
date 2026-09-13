# fleet-runtime

Neutral runtime primitives for first-party applications.

This package owns generic environment-value handling, structured console
logging, and Vitest fixtures. It deliberately contains no Agent LCARS session
or identity behavior, and no repository-management commands.

First-party consumers install the current Git artifact:

```sh
pnpm add github:jlapenna/fleet-runtime#main
```

Use only the published subpaths: `@jlapenna/fleet-runtime/env`,
`@jlapenna/fleet-runtime/logging`, and `@jlapenna/fleet-runtime/vitest/*`.

Keep this package limited to runtime and test primitives shared by multiple
first-party applications. Agent/session behavior belongs in `agent-lcars`, and
repository-management commands belong in `repo-tools`.

Package tests resolve the public subpaths through the package's own export map,
so a broken Git artifact cannot reach `main`. Each consumer refreshes its own
lockfile through a protected Renovate pull request; that repository's required
CI compiles and tests its real adapters at the cross-repository boundary.
