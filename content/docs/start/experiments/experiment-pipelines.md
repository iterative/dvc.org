---
title: 'Get Started: Experiments with Pipelines'
description: 'Get started with running experiments using DVC pipelines. Explore
the benefits of running experiments using DVC Pipelines.'
---

# Get Started: Experiments with Pipelines

As described in
[Building Pipelines](/doc/start/experiments/building-pipelines#benefits-of-dvc-pipelines),
running experiments using <abbr>DVC Pipelines</abbr> has many benefits in
comparison to the previous setup using notebooks.

All the explanations in
[Experiment Versioning](/doc/start/experimens/experiment-versioning) and
[Experiment Management](/doc/start/experiments/experiment-management) still
apply, the only difference is that the experiment is now being created by
`dvc exp run`.

The `dvc exp run` command will execute the DVC Pipeline and create a DVC
<abbr>Experiment</abbr> on completion.

## Running experiments

If you run an experiment for the first time, all the stages in the pipeline will
be computed:

```cli
$ dvc exp run
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
```

However, if you later modify a parameter of the `train` stage, only the stages
affected by the change will be computed:

```cli
$ dvc exp run --set-param train.img_size=128
'data/pool_data.dvc' didn't change, skipping
Stage 'data_split' didn't change, skipping
Running stage 'train':
> python src/train.py
...
Running stage 'evaluate':
> python src/evaluate.py
...
```

In addition, if you have already run a stage with the same set of dependencies
and parameters, it will be retrieved from the
[run cache](/doc/user-guide/pipelines/run-cache) and skipped:

```cli
$ dvc exp run --set-param train.img_size=256
'data/pool_data.dvc' didn't change, skipping
Stage 'data_split' didn't change, skipping
Stage 'train' is cached - skipping run, checking out outputs
Stage 'evaluate' is cached - skipping run, checking out outputs
```

## Queuing experiments

You can use the `--queue` and `--set-param` flags to set up a grid search of
parameters with a single command:

```cli
$ dvc exp run --queue \
--set-param 'train.arch=alexnet,resnet34,squeezenet1_1' \
--set-param 'train.img_size=128,256'
Queueing with overrides '{'params.yaml': ['train.arch=alexnet', 'train.img_size=128']}'.
Queueing with overrides '{'params.yaml': ['train.arch=alexnet', 'train.img_size=256']}'.
Queueing with overrides '{'params.yaml': ['train.arch=resnet34', 'train.img_size=128']}'.
...
```

And run all the experiments with `dvc queue start`:

```cli
$ dvc queue start
```
