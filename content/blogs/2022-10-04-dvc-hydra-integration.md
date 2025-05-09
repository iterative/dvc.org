---
title: DVC and Hydra integration
date: 2022-10-04
description: >
  Use Hydra and DVC in the same project and benefit from the best of both tools.
descriptionLong: |
  How to use Hydra and DVC in the same project has been a recurrent question in our community for a while.
  We decided to tackle this by providing a deeper integration and allowing users to benefit from the best of both tools.
picture: 2022-10-04/header.png
pictureComment:
  A mixture of DeeVee and Hydra, according to [stable
  diffusion](https://huggingface.co/spaces/stabilityai/stable-diffusion)
authors:
  - diglesia
  - gema_parreno
  - dave_berenbaum
tags:
  - DVC
  - Hydra
  - Release
---

[Hydra](https://hydra.cc/) has become one of the most popular tools for managing
the configuration of research projects and complex applications, given its
ability for composing and overwriting configuration both from the command line
and from files.

These features are a great complement to many of the values provided as part of
DVC:
[data versioning](https://dvc.org/doc/start/data-management/data-versioning),
[data pipelines](https://dvc.org/doc/start/data-management/data-pipelines), and
[experiment management](https://dvc.org/doc/start/experiment-management/experiments).

Therefore, we decided to tackle this by providing a deeper integration: using
Hydra internals inside DVC and allowing users to benefit from the best of both
tools.

In this post, we are going to provide an overview of the benefits that users of
both tools can get from the integration.

# What DVC users gain from the integration

## Use Hydra composition to configure DVC experiments

<video controlslist="nodownload" preload="metadata" autoplay muted loop style="width:100%;"><source src="../uploads/images/2022-10-04/deevee-band.mp4" type="video/mp4"/>
Your browser does not support the video tag. </video>

DVC didn’t provide a way of composing configuration from multiple sources, which
can be very convenient in several use cases, like switching between different
model architectures. The Hydra docs provide a great overview of
[common patterns](https://hydra.cc/docs/patterns/configuring_experiments/) where
this composition is useful.

DVC can now use Hydra Composition to configure entire DVC pipelines and run DVC
experiments.

You can learn more about this feature on the
[Hydra Composition](https://dvc.org/doc/user-guide/experiment-management/hydra-composition)
page of the user guide.

## Appending and removing parameters on the fly

DVC supported a limited functionality for modifying configuration using
`exp run --set-param`.

`--set-param` can now be used with
[Hydra’s Basic Override syntax](https://hydra.cc/docs/advanced/override_grammar/basic/)
supporting new operations like _Appending_ and _Removing_ parameters for
arbitrary parameter files.

When Hydra’s composition is enabled, the same syntax can be used to override
values in the
[Config Groups](https://hydra.cc/docs/tutorials/basic/your_first_app/config_groups/)
and
[Defaults list](https://hydra.cc/docs/tutorials/basic/your_first_app/defaults/).

```dvc
# Append new param
$ dvc exp run -S '+trainer.gradient_clip_val=0.001'
# Remove existing param
$ dvc exp run -S '~model.dropout'
# Target arbitrary files
$ dvc exp run -S 'train_config.json:+train.weight_decay=0.001'
# Modify the defauls list
$ dvc exp run --set-param 'train/model=efficientnet'
```

## Grid Search of parameters

DVC `exp run` only supported
[queuing](https://dvc.org/doc/user-guide/experiment-management/running-experiments#the-experiments-queue)
a single experiment at a time.

`exp run --set-param` can now use Hydra's
[Choice](https://hydra.cc/docs/advanced/override_grammar/extended/#choice-sweep)
and
[Range](https://hydra.cc/docs/advanced/override_grammar/extended/#range-sweep)
syntax for adding multiple experiments to the queue and performing a grid
search:

```dvc
$ dvc exp run -S 'model.learning_rate=range(0.01, 0.5, 0.01)' --queue
Queueing with "{'params.yaml': ['model.learning_rate=0.01']}".
Queued experiment '84e89be' for future execution.
Queueing with "{'params.yaml': ['model.learning_rate=0.02']}".
Queued experiment 'd7708fa' for future execution.
Queueing with "{'params.yaml': ['model.learning_rate=0.03']}".
Queued experiment '5494d5c' for future execution.
Queueing with "{'params.yaml': ['model.learning_rate=0.04']}".
Queued experiment '2e16c1f' for future execution.
Queueing with "{'params.yaml': ['model.learning_rate=0.05']}".
Queued experiment '7c7a615' for future execution.

$ dvc queue start
```

# What Hydra users gain from the integration

## Git-based versioning and caching

Hydra relies on
[folder-based versioning](https://hydra.cc/docs/configure_hydra/workdir/) for
managing multiple runs.

By using the DVC and Hydra integration, you can version the runs using
[DVC experiments](https://dvc.org/doc/user-guide/experiment-management),
enabling a more
[git-friendly](https://dvc.org/doc/user-guide/experiment-management/persisting-experiments)
workflow and adding
[caching](https://dvc.org/doc/user-guide/experiment-management#run-cache-automatic-log-of-stage-runs)
capabilities so runs won’t be unnecessarily recomputed.

## Multi-step pipelines and Language Agnostic

Hydra's scope is limited to a single **Python script** wrapped with the
`@hydra.main` decorator.

By using the
[DVC and Hydra integration](https://dvc.org/doc/user-guide/experiment-management/hydra-composition),
you can use Hydra to configure entire
[DVC pipelines](https://dvc.org/doc/start/data-management/data-pipelines), which
can be composed of **multiple** **stages** running **arbitrary** **commands.**

```yaml
stages:
  featurize:
    cmd: python src/featurization.py data/prepared data/features
    deps:
      - data/prepared
      - src/featurization.py
    params:
      - featurize.max_features
      - featurize.ngrams
    outs:
      - data/features
  train:
    cmd: python src/train.py data/features model.pkl
    deps:
      - data/features
      - src/train.py
    params:
      - train.min_split
      - train.n_est
    outs:
      - model.pkl
```

```dvc
$ dvc exp run -S 'featurize.max_features=200' -S 'train.n_est=100'
Running stage 'featurize':
> python src/featurization.py data/prepared data/features

Running stage 'train':
> python src/train.py data/features model.pkl
```

# Conclusion

Starting with DVC `2.25.0`, you can use the features described in this post to
efficiently combine Hydra and DVC in your projects.

To get a deeper understanding of all the parts involved, you can read the
[Hydra Composition](https://dvc.org/doc/user-guide/experiment-management/hydra-composition)
page of the DVC user guide.
