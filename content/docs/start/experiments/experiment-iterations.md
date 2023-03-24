---
title: 'Get Started: Experiments Iterations'
description: 'Explore the benefits of running experiments using DVC Pipelines.'
---

# Get Started: Experiments Iterations

Now that you have a <abbr>DVC Pipeline</abbr>, all the explanations in
[Experiment Versioning](/doc/start/experiments/experiment-versioning) and
[Experiment Management](/doc/start/experiments/experiment-management) still
apply here, the only difference is that the experiments are now being created by
`dvc exp run`, which enables some new features for creating iterations.

## Modifying parameters

You can modify <abbr>parameters</abbr> from the CLI using
[`--set-param`](/doc/command-reference/exp/run#--set-param):

```cli
$ dvc exp run --set-param "train.img_size=128"
```

The flag can be used to modify multiple parameters on a single call, even from
different stages:

```cli
$ dvc exp run \
-S "data_split.test_pct=0.1" -S "train.img_size=384"
```

<admon type="info">

Learn more about
[Running Experiments](/doc/user-guide/experiment-management/running-experiments)

</admon>

## Queuing experiments

You can enqueue experiments for later execution using
[`--queue`](/doc/command-reference/exp/run#--queue):

```cli
$ dvc exp run --queue --set-param "train.img_size=512"
Queueing with overrides '{'params.yaml': ['train.img_size=512']}'.
```

Once you have put some experiments in the queue, you can run all with:

```cli
$ dvc exp run --run-all
```

<admon type="info">

Learn more about
[The experiments queue](/doc/user-guide/experiment-management/running-experiments#the-experiments-queue)

</admon>

## Hyperparameter Tuning

You can provide multiple values for the same parameter:

```cli
$ dvc exp run \
--queue --set-param "train.batch_size=8,16,24"
Queueing with overrides '{'params.yaml': ['train.batch_size=8']}'.
Queueing with overrides '{'params.yaml': ['train.batch_size=16']}'.
Queueing with overrides '{'params.yaml': ['train.batch_size=24']}'.
...
```

You can build a grid search by modifying multiple parameters. To better identify
the experiments from the grid search, you can also provide a a
[`--name`](/doc/command-reference/exp/run#--name):

```cli
$ dvc exp run --name "arch-size" --queue \
-S 'train.arch=alexnet,resnet34,squeezenet1_1' \
-S 'train.img_size=128,256'
Queueing with overrides '{'params.yaml': ['train.arch=alexnet', 'train.img_size=128']}'.
Queued experiment 'arch-size-1' for future execution.
Queueing with overrides '{'params.yaml': ['train.arch=alexnet', 'train.img_size=256']}'.
Queued experiment 'arch-size-2' for future execution.
Queueing with overrides '{'params.yaml': ['train.arch=resnet34', 'train.img_size=128']}'.
Queued experiment 'arch-size-3' for future execution.
...
```
