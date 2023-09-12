# Run Cache: Automatic Log of Stage Runs

Every time you run a pipeline with DVC, it logs the unique signature of each
stage run (in `.dvc/cache/runs`). If it never happened before, its command(s)
are executed normally. Every subsequent time a <abbr>stage</abbr> runs under the
same conditions, the previous results can be restored instantly -- without
wasting time or computing resources.
[More details](/doc/user-guide/project-structure/internal-files#run-cache)

✅ This built-in feature is called **run cache** and it can dramatically improve
performance. It's enabled out-of-the-box (can be disabled), which means DVC is
already saving all of your tests and experiment results behind the scene.

<admon type="warning">

If an output of a stage has `cache: false`, the run cache will be deactivated
for that stage.

</admon>

The run cache is also enabled when you use `dvc exp run` (see
[DVC Experiments](/doc/user-guide/experiment-management)).
