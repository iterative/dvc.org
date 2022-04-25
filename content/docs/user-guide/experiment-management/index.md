# Experiment Management

Data science and machine learning are iterative processes that require a large
number of attempts to reach a certain level of a metric. Experimentation is part
of the development of data features, hyperspace exploration, deep learning
optimization, etc.

Some of DVC's base features already help you codify and analyze experiments.
[Parameters](/doc/command-reference/params) are simple values in a formatted
text file which you can tweak and use in your code. On the other end,
[metrics](/doc/command-reference/metrics) (and
[plots](/doc/command-reference/plots)) let you define, visualize, and compare
quantitative measures of your results.

## Experimentation in DVC

_New in DVC 2.0 (see `dvc version`)_

DVC experiment management features build on top of base DVC features to form a
comprehensive framework to organize, execute, manage, and share ML experiments.
They support these main approaches:

- Compare parameters and metrics of existing project versions (for example
  different Git branches) against each other or against new, uncommitted results
  in your workspace. One tool to do so is `dvc exp diff`.

- [Run and capture] multiple experiments (derived from any project version as
  baseline) without polluting your Git history. DVC tracks them for you, letting
  you compare and share them. 📖 More info in the [Experiments
  Overview][experiments].

- Generate [checkpoints] at runtime to keep track of the internal progress of
  deeper experiments. DVC captures [live metrics](/doc/dvclive), which you can
  manage in batches.

[run and capture]: /doc/user-guide/experiment-management/running-experiments
[experiments]: /doc/user-guide/experiment-management/experiments-overview
[checkpoints]: /doc/user-guide/experiment-management/checkpoints

> 👨‍💻 See [Get Started: Experiments](/doc/start/experiments) for a hands-on
> introduction to DVC experiments.

### Organization patterns

It's up to you to decide how to organize completed experiments. These are the
main alternatives:

- **Git tags and branches** - use the repo's "time dimension" to distribute your
  experiments. This makes the most sense for experiments that build on each
  other. Git-based experiment structures are especially helpful along with Git
  history exploration tools
  [like GitHub](https://docs.github.com/en/github/visualizing-repository-data-with-graphs/viewing-a-repositorys-network).

- **Directories** - the project's "space dimension" can be structured with
  directories (folders) to organize experiments. Useful when you want to see all
  your experiments at the same time (without switching versions) by just
  exploring the file system.

- **Hybrid** - combining an intuitive directory structure with a good repo
  branching strategy tends to be the best option for complex projects.
  Completely independent experiments live in separate directories (and can be
  generated with [`foreach` stages], for example), while their progress can be
  found in different branches.

- **Labels** - in general, you can record experiments in a separate system and
  structure them using custom labeling. This is typical in dedicated experiment
  tracking tools. A possible problem with this approach is that it's easy to
  lose the connection between your project history and the experiments logged.

DVC takes care of arranging `dvc exp` experiments and the data
<abbr>cache</abbr> under the hood so there's no need to decide on the above
until your experiments are made [persistent].

[`foreach` stages]:
  /doc/user-guide/project-structure/pipelines-files#foreach-stages
[persistent]: /doc/user-guide/experiment-management/persisting-experiments

## Run Cache: Automatic Log of Stage Runs

Every time you [reproduce](/doc/command-reference/repro) a pipeline with DVC, it
logs the unique signature of each stage run (in `.dvc/cache/runs` by default).
If it never happened before, its command(s) are executed normally. Every
subsequent time a [stage](/doc/command-reference/run) runs under the same
conditions, the previous results can be restored instantly, without wasting time
or computing resources.

✅ This built-in feature is called <abbr>run-cache</abbr> and it can
dramatically improve performance. It's enabled out-of-the-box (can be disabled),
which means DVC is already saving all of your tests and experiments behind the
scene. But there's no easy way to explore it.
