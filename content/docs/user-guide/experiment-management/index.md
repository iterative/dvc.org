# Experiment Management

Data science and ML are iterative processes that require a large number of
attempts to reach a certain level of a metric. Experimentation is part of the
development of data features, hyperspace exploration, deep learning
optimization, etc.

Some of DVC's base features already help you codify and analyze experiments.
[Parameters](/doc/command-reference/params) are simple values you can tweak in a
formatted text file; They cause different behaviors in your code and models. On
the other end, [metrics](/doc/command-reference/metrics) (and
[plots](/doc/command-reference/plots)) let you define, visualize, and compare
quantitative measures of your results.

<details>

## 💡 Run Cache: Automatic Log of Stage Runs

Every time you [reproduce](/doc/command-reference/repro) a pipeline with DVC, it
logs the unique signature of each stage run (in `.dvc/cache/runs` by default).
If it never happened before, the stage command(s) are executed normally. Every
subsequent time a [stage](/doc/command-reference/run) runs under the same
conditions, the previous results can be restored instantly, without wasting time
or computing resources.

✅ This built-in feature is called <abbr>run-cache</abbr> and it can
dramatically improve performance. It's enabled out-of-the-box (can be disabled),
which means DVC is already saving all of your tests and experiments behind the
scene. But there's no easy way to explore it.

</details>

## DVC Experiments

_New in DVC 2.0_

DVC experiment management features are designed to support these main
approaches:

1. [Run] and capture [experiments] that derive from your latest project version
   without polluting your Git history. DVC tracks them for you, letting you list
   and compare them. The best ones can be made persistent, and the rest left as
   history or cleared.
1. [Queue] and process series of experiments based on a parameter search or
   other modifications to your baseline.
1. Generate [checkpoints] during your code execution to analyze the internal
   progress of deep experiments. DVC captures them at runtime, and can manage
   them in batches.
1. Make experiments [persistent] by committing them to your
   <abbr>repository</abbr> history.

[run]: /doc/user-guide/experiment-management/running-experiments
[experiments]: /doc/user-guide/experiment-management/dvc-experiments
[queue]:
  /doc/user-guide/experiment-management/running-experiments#the-experiments-queue
[checkpoints]: /doc/user-guide/experiment-management/checkpoints
[persistent]:
  /doc/user-guide/experiment-management/dvc-experiments#persistent-experiments

📖 More information in the
[full guide](/doc/user-guide/experiment-management/dvc-experiments).

> 👨‍💻 See [Get Started: Experiments](/doc/start/experiments) for a hands-on
> introduction to DVC experiments.

### Organization Patterns

It's up to you to decide how to organize completed experiments. These are the
main alternatives:

- **Git tags and branches** - use the repo's "time dimension" to distribute your
  experiments. This makes the most sense for experiments that build on each
  other. Helpful if the Git [revisions](https://git-scm.com/docs/revisions) can
  be easily visualized, for example with tools
  [like GitHub](https://docs.github.com/en/github/visualizing-repository-data-with-graphs/viewing-a-repositorys-network).
- **Directories** - the project's "space dimension" can be structured with
  directories (folders) to organize experiments. Useful when you want to see all
  your experiments at the same time (without switching versions) by just
  exploring the file system.
- **Hybrid** - combining an intuitive directory structure with a good repo
  branching strategy tends to be the best option for complex projects.
  Completely independent experiments live in separate directories, while their
  progress can be found in different branches.

DVC takes care of arranging `dvc exp` experiments and the data
<abbr>cache</abbr> under the hood so there's no need to decide on the above
until your experiments are made [persistent].
