# Run Cache: Automatic Log of Stage Runs

Every time you [reproduce](/doc/command-reference/repro) a pipeline with DVC, it
logs the unique signature of each stage run (in `.dvc/cache/runs` by default).
If it never happened before, its command(s) are executed normally. Every
subsequent time a [stage](/doc/command-reference/stage/add) runs under the same
conditions, the previous results can be restored instantly, without wasting time
or computing resources.

<admon type="warning">

If any output of a stage has `cache: false`, the <abbr>run-cache</abbr> will be
deactivated for that stage

</admon>

✅ This built-in feature is called <abbr>run-cache</abbr> and it can
dramatically improve performance. It's enabled out-of-the-box (can be disabled),
which means DVC is already saving all of your tests and experiments behind the
scene.
