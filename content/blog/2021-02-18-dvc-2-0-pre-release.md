---
title: DVC 2.0 Pre-Release
date: 2021-02-17
description: |
  Today, we're announcing DVC 2.0 pre-release. We'll share learnings from our
  journey and how these will be reflected in the coming release.

descriptionLong: |
  The new release is a result of our learnings from our users. There are four
  major features are coming:

  🔗 ML pipelines templating and iterative foreach stages

  🧪 Lightweight ML experiments

  📍 ML model checkpoints

  📈 Dvc-live - metrics logging

picture: 2021-02-18/dvc-2-0-pre-release.png
pictureComment: DVC 2.0 Pre-Release
author: dmitry_petrov
commentsUrl: https://discuss.dvc.org/t/dvc-3-years-anniversary-and-1-0-pre-release/374
tags:
  - Release
  - MLOps
  - DataOps
---

## Install

First things first. You can install the 1.0 pre-release from the master branch
in our repo (instruction [here](https://dvc.org/doc/install/pre-release)) or
through pip:

```bash
pip install --upgrade --pre dvc
```

## ML pipelines parametrization and foreach stages

After introducing the multi-stage pipeline file `dvc.yaml`, it was quickly
adopted among DVC users. The DVC team got tons of positive feedback from users
as well as feature requests.

### Parameters

The most requested feature was the ability to use parameters in the pipeline
file. So, you can pass the same seed value or filename to multiple stages in the
pipeline.

```yaml
vars:
    train_matrix: train.pkl
    test_matrix: test.pkl
    seed: 20210215

...

stages:
    process:
        cmd: python process.py \
                --seed ${seed} \
                --train ${train_matrix} \
                --test ${test_matrix}
        outs:
        - ${test_matrix}
        - ${train_matrix}

        ...

    train:
        cmd: python train.py ${train_matrix} --seed ${seed}
        deps:
        - ${train_matrix}
```

Also, it gives an ability to localize all important parameters in a single `var`
block and play with them. This is a natural thing to do for scenarios like NLP
or when hyperparameter optimization is happening not only in the model training
code but in the data processing as well.

### Pipeline params from params.yaml

It is quite common to define pipeline parameters in a config file or the
parameters file `params.yaml` instead of in the pipeline file `dvc.yaml`.
Parameters defined in `params.yaml` can also be used in `dvc.yaml`.

Params.yaml:

```yaml
models:
  us:
    thresh: 10
    filename: 'model-us.hdf5'
```

Pipeline file `dvc.yaml`:

```yaml
stages:
  build-us:
    cmd: >-
      python script.py
        --out ${models.us.filename}
        --thresh ${models.us.thresh}
    outs:
      - ${models.us.filename}
```

DVC properly tracks params dependencies for each stage starting from the
previous DVC version 1.0. See
[params option](https://dvc.org/doc/command-reference/run#for-displaying-and-comparing-data-science-experiments)
in `dvc run` for more details.

### Iterating over params with foreach stages

Iterating over params was a frequently requested feature. Now users can define
multiple similar stages by a single command.

```yaml
stages:
  build:
    foreach:
      gb:
        thresh: 15
        filename: 'model-gb.hdf5'
      us:
        thresh: 10
        filename: 'model-us.hdf5'
    do:
      cmd: >-
        python script.py --out ${item.filename} --thresh ${item.thresh}
      outs:
        - ${item.filename}
```

## Lightweight ML experiments

DVC uses Git as a foundation for ML experiments. This solid foundation makes
each ML experiment reproducible and accessible from Git history. This Git-based
approach works very well for ML projects with mature ML models when only a few
new experiments per day are running. However, in more active development when
dozens or hundreds of experiments need to be run in a single day, Git creates
overhead - each experiment run requires additional Git commands
`git add/commit`, and comparing all experiments is difficult.

We introduce lightweight experiments in DVC 2.0! This is the way of
auto-tracking without any overhead from ML engineers:

```yaml
$ dvc exp run
...
Reproduced experiment(s): exp-0c0f7
…
$ dvc exp run --params learning_rate=0.03
Reproduced experiment(s): exp-bc5cd


$ dvc exp run --params learning_rate=0.025
Reproduced experiment(s): exp-49181

$ vi train.py  # edit code
$ dvc exp run --params learning_rate=0.025
Reproduced experiment(s): exp-a814a
```

See all the runs:

```yaml
$ dvc exp show --no-pager
```

Any of the runs can be easily obtained with code, data and models:

```yaml
$ dvc apply exp-49181 Changes for experiment 'exp-0c0f7' have been applied to
your current workspace.
```

## Model checkpoints tracking

ML model checkpoints are an essential part of deep learning. ML engineers prefer
to save the model files (or weights) at checkpoints during a training process
and return back when metrics start diverging or learning is not fast enough.

The checkpoints create a different dynamic around ML modeling process and need a
special support from the toolset:

1. Track and save model checkpoints (DVC outputs) periodically, not only the
   final result or training epoch.
2. Save metrics corresponding to each of the checkpoints.
3. Reuse checkpoints - warm-start training with an existing model file,
   corresponding code, dataset version and metrics.

This new behaviour is supported in DVC 2.0. Now, DVC can version all your
checkpoints with corresponding code and data. It brings reproducibility of DL
processes to the next level - every checkpoint is reproducible.

This is how you define checkpoints with live-metrics:

```

```

Start and interrupt training process:

```

```

Navigate in checkpoints:

```

```

Get back to any version:

```

```

Under the hood DVC uses Git to store the checkpoint meta-information.
Straight-forward implementation of checkpoints on top of Git should include
branches and auto-commits in the branches. This approach over-pollutes the
branch namespace very quickly. To avoid this issue, we introduced Git custom
references `exps` the same way as GitHub uses Git custom references `pulls` to
track pull requests. This is an interesting technical topic that deserves a
separate blog post. Please follow us if you are interested.

## Metrics logging

Continuously logging ML metrics is a very common practice in the ML world.
Instead of a simple command line output with the metrics values many ML
engineers prefer visuals and plots. These plots can be organized in a "database"
of ML experiments to keep track of a project. There are many special solutions
for metrics collecting and experiment tracking such as sacred, mlflow, weight
and biases, neptune.ai or other.

With DVC 2.0 we are releasing new open-source library
[DVC-Live](https://github.com/iterative/dvclive) that provide functionality for
tracking model metrics and organizing metrics in simple text files in a way that
DVC can visualize the metrics with navigation in Git histroy. So, DVC can show
you a metrics difference between current model and a model in `master` or any
other branch.

This approach is similar to the other metrics tracking tools with the difference
that Git becomes a "database" or of ML experiments.

In your code:

```

```

Result:

```

```

Visualize:

```

```

Navigate in Git history:

```

```

## Thank you!

I'd like to thank all of you DVC community members for the feedback that we are
constantly getting. This feedback helps us build new functionalities in DVC and
make it more stable.

Please be in touch with us on [Twitter](https://twitter.com/DVCorg) and our
[Discord channel](https://dvc.org/chat).
