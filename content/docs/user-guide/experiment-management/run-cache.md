## Run Cache: Automatic Log of Stage Runs

Every time you `dvc repro` pipelines or `dvc exp run` experiments, DVC logs the
unique signature of each stage run (to `.dvc/cache/runs` by default). If it
never happened before, the stage command(s) are executed normally. Every
subsequent time a [stage](/doc/command-reference/run) runs under the same
conditions, the previous results can be restored instantly, without wasting time
or computing resources.

✅ This built-in feature is called <abbr>run-cache</abbr> and it can
dramatically improve performance. It's enabled out-of-the-box (but can be
disabled with the `--no-run-cache` command option).
