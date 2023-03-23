---
title: 'Get Started: Experiments Iterations'
description: 'Explore the benefits of running experiments using DVC Pipelines.'
---

# Get Started: Experiments Iterations

Now that you have a <abbr>DVC Pipeline</abbr>, all the explanations in
[Experiment Versioning](/doc/start/experiments/experiment-versioning) and
[Experiment Management](/doc/start/experiments/experiment-management) still
apply here, the only difference is that the experiments are now being created by
`dvc exp run`.

## Running experiments

When you run an experiment for the first time, all the <abbr>stages</abbr> in
the pipeline will be computed:

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

If you later modify a parameter of the `train` stage, only the stages affected
by the change will be computed:

```cli
$ dvc exp run -S "train.img_size=128"
'data/pool_data.dvc' didn't change, skipping
Stage 'data_split' didn't change, skipping
Running stage 'train':
> python src/train.py
...
Running stage 'evaluate':
> python src/evaluate.py
...
```

If you have already run a stage with the same set of <abbr>dependencies</abbr>
and <abbr>parameters</abbr>, it will be retrieved from the
[run cache](/doc/user-guide/pipelines/run-cache) and skipped:

```cli
$ dvc exp run -S "train.img_size=256"
'data/pool_data.dvc' didn't change, skipping
Stage 'data_split' didn't change, skipping
Stage 'train' is cached - skipping run, checking out outputs
Stage 'evaluate' is cached - skipping run, checking out outputs
```

<admon type="info">

Learn more about
[Running Experiments](/doc/user-guide/experiment-management/running-experiments)

</admon>

## Queuing experiments

You can queue multiple experiments for later execution. For example, you can set
up a grid search of parameters using a single command:

```cli
$ dvc exp run --queue \
-S 'train.arch=alexnet,resnet34,squeezenet1_1' \
-S 'train.img_size=128,256'
Queueing with overrides '{'params.yaml': ['train.arch=alexnet', 'train.img_size=128']}'.
Queueing with overrides '{'params.yaml': ['train.arch=alexnet', 'train.img_size=256']}'.
Queueing with overrides '{'params.yaml': ['train.arch=resnet34', 'train.img_size=128']}'.
...
```

You can now run all the experiments with a single command:

```cli
$ dvc exp run --run-all
```

<admon type="info">

Learn more about
[The experiments queue](/doc/user-guide/experiment-management/running-experiments#the-experiments-queue)

</admon>
