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
