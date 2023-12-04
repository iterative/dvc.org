# Environment Variables

List of environment variables to configure DVC behavior.

- `DVC_EXP_AUTO_PUSH`: If `true`, run `dvc exp push` at the end of a successful
  <abbr>experiment</abbr>.
- `DVC_EXP_GIT_REMOTE`: The name of the Git remote to use in `DVC_EXP_AUTO_PUSH`
  (for example, `origin`).
- `DVC_NO_ANALYTICS`: If `true`, disables
  [analytics](/doc/user-guide/analytics). Overrides `dvc config core.analytics`.
- `DVC_PAGER`: Set what program DVC uses for paging output (for example,
  `more`).
- `DVC_STUDIO_OFFLINE`: If `true`, disables sharing
  [live experiments](/doc/studio/user-guide/experiments/live-metrics-and-plots)
  even if the DVC Studio token is set. Overrides `dvc config studio.offline`.
- `DVC_STUDIO_REPO_URL`: Set URL of Git remote associated with the DVC Studio
  project. Overrides `dvc config studio.repo_url`.
- `DVC_STUDIO_TOKEN`: Set DVC Studio access token to use. Overrides
  `dvc config studio.token`.
- `DVC_STUDIO_URL`: Set URL of Studio to use (in case of self-hosted DVC Studio
  instance). Overrides `dvc config studio.url`.

See also [DVCLive environment variables](/doc/dvclive/env).
