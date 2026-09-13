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

Pull requests pack the candidate artifact and compile the `env-vars` and
`logging` adapters in both `jlapenna/agent-lcars` and
`supersprinklesracing/sprinkles`. This protects the cross-repository package
boundary before a change reaches `main`; each consumer remains responsible for
refreshing its own lockfile to the current `main` artifact.
