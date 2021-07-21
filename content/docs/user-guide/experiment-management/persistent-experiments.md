## Persistent Experiments

When your experiments are good enough to save or share, you may want to store
them persistently as Git commits in your <abbr>repository</abbr>.

Whether the results were produced with `dvc repro` directly, or after a
`dvc exp` workflow (refer to previous sections), the `dvc.yaml` and `dvc.lock`
pair in the <abbr>workspace</abbr> will codify the experiment as a new project
version. The right <abbr>outputs</abbr> (including
[metrics](/doc/command-reference/metrics)) should also be present, or available
via `dvc checkout`.
