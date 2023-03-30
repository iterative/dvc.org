# Hydra Composition

_New in DVC 2.25.0 (see `dvc version`)_

[Hydra](https://hydra.cc/) is a framework to configure complex applications. DVC
supports Hydra's [config composition] as a way to configure [experiment runs].

<admon type="info">

At the moment you must explicitly enable this feature with:

```cli
$ dvc config hydra.enabled True
```

</admon>

[config composition]:
  https://hydra.cc/docs/tutorials/basic/your_first_app/composition/
[experiment runs]: /doc/user-guide/experiment-management/running-experiments

## How it works

Upon `dvc exp run`, Hydra will be used to compose a single `params.yaml` before
executing the experiment. Its <abbr>parameters</abbr> will configure the
[underlying DVC pipeline](#running-experiments) that contains your experiment.

<admon type="tip">

[DVC pipelines] can run multiple stages with different shell commands instead of
a single script, and offer advanced features like [templating] and [`foreach`
stages].

[dvc pipelines]: /doc/user-guide/pipelines/defining-pipelines
[templating]: /doc/user-guide/project-structure/dvcyaml-files#templating
[`foreach` stages]:
  /doc/user-guide/project-structure/dvcyaml-files#foreach-stages

</admon>

## Setting up Hydra

First you need a `conf/` directory for Hydra [config groups]. For example:

```cli
conf
├── config.yaml
├── dataset
│   ├── imagenette.yaml
│   └── imagewoof.yaml
└── train
    ├── baseline.yaml
    ├── model
    │   ├── alexnet.yaml
    │   ├── efficientnet.yaml
    │   └── resnet.yaml
    └── optimizer
        ├── adam.yaml
        └── sgd.yaml
```

You also need a `conf/config.yaml` file defining the Hydra [defaults list]:

```yaml
defaults:
  - dataset: imagenette
  - train/model: resnet
  - train/optimizer: sgd
```

[config groups]:
  https://hydra.cc/docs/tutorials/basic/your_first_app/config_groups/
[defaults list]: https://hydra.cc/docs/tutorials/basic/your_first_app/defaults/

<admon type="tip">

Use `dvc config hydra` options to change the default locations for the config
groups directory and defaults list file.

</admon>

Now let's look at what the resulting `params.yaml` could be based on the setup
above:

```yaml
dataset:
  url: https://s3.amazonaws.com/fast-ai-imageclas/imagenette2-160.tgz
  output_folder: imagenette
train:
  model:
    name: ResNet
    size: 50
    weights: ResNet50_Weights.IMAGENET1K_V2
  optimizer:
    name: SGD
    lr: 0.001
    momentum: 0.9
```

## Running experiments

<details>

### Expand to set up a DVC pipeline.

Let's build an [experimental pipeline] with 2 stages. The first one downloads a
dataset and uses the parameters defined in the `dataset` section of
`params.yaml`. The second stage trains an ML model and uses the rest of the
parameters (entire `train` group).

```yaml
stages:
  setup-dataset:
    cmd:
      - wget ${dataset.url} -O tmp.tgz
      - mkdir -p ${dataset.output_folder}
      - tar zxvf tmp.tgz -C ${dataset.output_folder}
      - rm tmp.tgz
    outs:
      - ${dataset.output_folder}
  train:
    cmd: python train.py
    deps:
      - ${dataset.output_folder}
    params:
      - train
```

[experimental pipeline]:
  /doc/user-guide/experiment-management/running-experiments#running-the-pipelines

<admon type="info">

We parametrize the shell commands above (`mkdir`, `tar`, `wget`) as well as
<abbr>output</abbr> and <abbr>dependency</abbr> paths (`outs`, `deps`) using
[templating] (`${}` _expression_).

[templating]: /doc/user-guide/project-structure/dvcyaml-files#templating

</admon>

<admon type="tip">

You can use `dvc.api.params_show()` to load params in Python code. For other
languages, use [dictionary unpacking] or a YAML parsing library.

[dictionary unpacking]:
  /doc/user-guide/project-structure/dvcyaml-files#dictionary-unpacking

</admon>

</details>

We can now use `dvc exp run --set-param` to modify the config composition
on-the-fly, for example loading the model config from
`train/model/efficientnet.yaml` (instead of `resnet.yaml` from the
[defaults list](#setting-up-hydra)):

```cli
$ dvc exp run --set-param 'train/model=efficientnet'
Stage 'setup-dataset' didn't change  skipping
Running stage 'train':
> python train.py
--model.name 'EfficientNet' --model.size 'b0' --model.weights 'ResNet50_Weights.IMAGENET1K_V2'
--optimizer.name 'SGD' --optimizer.lr 0.001 --optimizer.momentum 0.9
...
```

We can also modify specific values from any config section:

```cli
$ dvc exp run --set-param 'train.optimizer.lr=0.1'
Stage 'setup-dataset' didn't change, skipping
Running stage 'train':
> python train.py
--model.name 'EfficientNet' --model.size 'b0' --model.weights 'ResNet50_Weights.IMAGENET1K_V2'
--optimizer.name 'SGD' --optimizer.lr 0.01 --optimizer.momentum 0.9
...
```

We can also load multiple [config groups](#setting-up-hydra) in an [experiments
queue], for example to run a [grid search] of ML hyperparameters:

```cli
$ dvc exp run --queue \
              -S 'train/optimizer=adam,sgd' \
              -S 'train/model=resnet,efficientnet'

Queueing with overrides '{'params.yaml': ['optimizer=adam', 'model=resnet']}'.
Queued experiment 'ed3b4ef' for future execution.
Queueing with overrides '{'params.yaml': ['optimizer=adam', 'model=efficientnet']}'.
Queued experiment '7a10d54' for future execution.
Queueing with overrides '{'params.yaml': ['optimizer=sgd', 'model=resnet']}'.
Queued experiment '0b443d8' for future execution.
Queueing with overrides '{'params.yaml': ['optimizer=sgd', 'model=efficientnet']}'.
Queued experiment '0a5f20e' for future execution.

$ dvc queue start
...
```

[experiments queue]:
  /doc/user-guide/experiment-management/running-experiments#the-experiments-queue
[grid search]:
  https://en.wikipedia.org/wiki/Hyperparameter_optimization#Grid_search

<admon type="info">

Note that DVC keeps a cache of all runs, so many permutations will be completed
without actually having to run the experiment. In the above example, the
experiment with `['optimizer=sgd', 'model=resnet']` will not waste computing
time because the results are already in the <abbr>run cache</abbr>. You can
confirm this with `dvc queue logs`:

```
$ dvc queue logs 0b443d8
Stage 'setup-dataset' didn't change, skipping
Stage 'train' didn't change, skipping
```

</admon>
