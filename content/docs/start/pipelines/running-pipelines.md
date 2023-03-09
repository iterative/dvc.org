---
title: 'Get Started: Running Pipelines'
description:
  'Get started with running pipelines with DVC. Learn how to run your pipeline
  in different ways without unnecessarily recomputing stages.'
---

# Get Started: Running Pipelines

The whole point of creating DVC Pipelines is the ability to run them. DVC runs
pipelines efficiently by checking the status of the DAG and storing intermediate
results in the cache to make sure stages are not unnecessarily recomputed.

## Reproducing

The most basic execution of your pipeline can be performed with `dvc repro`. The
command will check the status of the <abbr>dependencies</abbr> and
<abbr>outputs</abbr> to determine which stages need to be run:

```cli
$ dvc repro
'data/pool_data.dvc' didn't change, skipping
Running stage 'data_split':
> python src/data_split.py
...
Running stage 'train':
> python src/train.py
...
Running stage 'evaluate':
> python src/evaluate.py
...
Generating lock file 'dvc.lock'
Updating lock file 'dvc.lock'
```

DVC will record the state of your pipeline and results in the
[`dvc.lock`](/doc/user-guide/project-structure/dvcyaml-files#dvclock-file),
which can be tracked via git to version the state of the project:

```cli
$ git commit -am "Reproduced pipeline"
```

`dvc repro` is useful when there are changes in the pipeline but you are sure
that you want to reproduce it and keep the results. For example, if you add a
new metric in your `evaluate` stage by editing the source code in
`src/evaluate.py`:

```cli
$ dvc repro
'data/pool_data.dvc' didn't change, skipping
Stage 'data_split' didn't change, skipping
Stage 'train' didn't change, skipping
Running stage 'evaluate':
> python src/evaluate.py
...
Updating lock file 'dvc.lock'
To track the changes with git, run:

        git add dvc.lock results/evaluate/metrics.json results/evaluate/plots
```

DVC detects that only `evaluate` has changed and skips everything else. All the
intermediate results are being reused.

## Experimenting

There are other occasions when you want to try some changes but you don't know
beforehand if you want to keep the results.

`dvc exp run` **extends** `dvc repro` to create DVC experiments</abbr> for each
of the variations you try. It also enables new features:

- [Send live updates to Studio](/doc/studio/user-guide/projects-and-experiments/live-metrics-and-plots)
- [Modify parameters from the CLI](/doc/command-reference/exp/run#example-modify-parameters-on-the-fly)
- [Queue experiments for future execution](https://dvc.org/doc/command-reference/exp/run#example-run-a-grid-search)

For example, `dvc exp run` can be useful if you want to try different values of
a parameter that affects the `train` stage:

TODO VSCode run experiment.

```cli
$ dvc exp run -S 'train.img_size=384'
'data/pool_data.dvc' didn't change, skipping
Stage 'data_split' didn't change, skipping
Running stage 'train':
> python src/train.py
...
Running stage 'evaluate':
> python src/evaluate.py
...
Ran experiment(s): yarer-daff
```

```cli
$ dvc exp run -S 'train.img_size=128'
'data/pool_data.dvc' didn't change, skipping
Stage 'data_split' didn't change, skipping
Running stage 'train':
> python src/train.py
...
Running stage 'evaluate':
> python src/evaluate.py
...
Ran experiment(s): macro-junk
```

You can then
[compare](/doc/start/experiments/experiment-versioning#compare-results),
[manage](/doc/start/experiments/experiment-management#managing-experiments) and
[share](/doc/start/experiments/experiment-management#sharing-experiments) your
experiment before deciding on tracking the best one with git:

```cli
$ dvc exp show
```

```cli
$ dvc exp apply yarer-daff
$ git commit -am "Applied experiment: yarer-daff"
```
