# Hydra Integration

_New in DVC 2.25.0 (see `dvc version`)_

In this guide we explain how to enable and use the DVC and
[Hydra](https://hydra.cc/) integration.

## How it works

On each `dvc exp run` call, DVC will use Hydra to **compose** a single
configuration object and **dump** it to `params.yaml`. This will happen
**before** the experiment starts running.

Instead of relying on the
[`@hydra.main`](https://hydra.cc/docs/tutorials/basic/your_first_app/simple_cli/)
Python decorator for composing the config object, we can now parse a single
file: `params.yaml`.

This allows to combine Hydra composition and DVC <abbr>parameters</abbr> in
order to configure DVC <abbr>pipelines</abbr> (running multiple steps of
different shell commands, instead of a single Python script) and use features
like [Templating](/doc/user-guide/project-structure/dvcyaml-files#templating)
and [`foreach`](/doc/user-guide/project-structure/dvcyaml-files#foreach).

## Setting up Hydra

<admon type="tip">

Learn more about setting up Hydra in the
[official Hydra tutorial](https://hydra.cc/docs/tutorials/basic/your_first_app/composition/).

</admon>

In order to start using Hydra composition capabilities it is required to have a
directory of
[Hydra Config Groups](https://hydra.cc/docs/tutorials/basic/your_first_app/config_groups/)
(`conf`):

```dvc
$ tree conf
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

Along with a file defining the top-level
[Hydra Defaults List](https://hydra.cc/docs/tutorials/basic/your_first_app/defaults/)
(`conf/config.yaml`):

```dvc
$ cat conf/config.yaml
defaults:
  - dataset: imagenette
  - train: baseline
```

<admon type="info">

You can set the [`dvc config hydra`](/doc/command-reference/config#hydra)
options to provide custom locations for the _Config Group_ and the top-level
_Defaults List_.

</admon>

In this example, we also have a nested Defaults List:

```dvc
$ cat conf/train/baseline.yaml
defaults:
  - model: resnet
  - optimizer: sgd
```

## Setting up DVC

We can enable the DVC and Hydra integration by running:

```dvc
$ dvc config hydra.enabled True
```

### Testing the integration

To check how the integration works, we can create a dummy `dvc.yaml` that prints
the contents of `params.yaml`:

```yaml
stages:
  print-params:
    cmd: cat params.yaml
```

Now, if we run an experiment, we will see how the composed configuration looks:

```dvc
$ dvc exp run
Running stage 'print-params':
> cat params.yaml
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

### Building a Pipeline

To showcase a more realistic use case, we are going to build a Pipeline with 2
stages.

The first stage downloads the dataset, and depends on the
<abbr>parameters</abbr> defined in the `dataset` section:

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
  ...
```

We use [Templating](/doc/user-guide/project-structure/dvcyaml-files#templating)
in order to configure our shell commands (`mkdir`, `tar` and `wget`) and to
avoid hardcoding the <abbr>output</abbr> paths.

The second stage trains a model using the downloaded dataset and depends on the
rest of parameters:

```yaml
  ...
  train:
    cmd: python train.py ${train}
    deps:
      - ${dataset.output_folder}
```

We use
[Dict Unpacking](/doc/user-guide/project-structure/dvcyaml-files#dict-unpacking)
in order to pass our configuration as
[argparse](https://docs.python.org/3/library/argparse.html) arguments.

<admon type="tip">

[Dict Unpacking](/doc/user-guide/project-structure/dvcyaml-files#dict-unpacking)
can be also used with other languages. For example, we could use
[R argparse](https://cran.r-project.org/web/packages/argparse/vignettes/argparse.html)
, [Julia ArgParse](https://argparsejl.readthedocs.io/en/latest/argparse.html) or
any other shell command that accepts argparse-like syntax.

</admon>

As an alternative, we could (only for Python scripts) use the
`dvc.api.params_show()` method in order to load all the required parameters
inside the stage:

```python
# train.py
import dvc.api

train_params = dvc.api.params_show("train")

...
```

## Runing experiments

We can now trigger use `dvc exp run --set-param` to modify the Hydra
Composition:

```dvc
$ dvc exp run --set-param 'train/model=efficientnet'
Stage 'setup-dataset' didn't change  skipping
Running stage 'train':
> python train.py
--model.name 'EfficientNet' --model.size 'b0' --model.weights 'ResNet50_Weights.IMAGENET1K_V2'
--optimizer.name 'SGD' --optimizer.lr 0.001 --optimizer.momentum 0.9
...
```

In addition to modifying the _Defaults List_, we can also modify specific values
of a config section:

```dvc
$ dvc exp run --set-param 'train.optimizer.lr=0.1'
Stage 'setup-dataset' didn't change, skipping
Running stage 'train':
> python train.py
--model.name 'EfficientNet' --model.size 'b0' --model.weights 'ResNet50_Weights.IMAGENET1K_V2'
--optimizer.name 'SGD' --optimizer.lr 0.01 --optimizer.momentum 0.9
...
```

### Grid Search

We can use the `dvc queue` in order to run a grid search with different
_Defaults List_ values:

```dvc
$ dvc exp run \
-S 'train/optimizer=adam,sgd' -S 'train/model=resnet,efficientnet' \
--queue

Queueing with overrides '{'params.yaml': ['optimizer=adam', 'model=resnet']}'.
Queued experiment 'ed3b4ef' for future execution.
Queueing with overrides '{'params.yaml': ['optimizer=adam', 'model=efficientnet']}'.
Queued experiment '7a10d54' for future execution.
Queueing with overrides '{'params.yaml': ['optimizer=sgd', 'model=resnet']}'.
Queued experiment '0b443d8' for future execution.
Queueing with overrides '{'params.yaml': ['optimizer=sgd', 'model=efficientnet']}'.
Queued experiment '0a5f20e' for future execution.
```

```dvc
$ dvc queue start
...
```

One of the benefits of using DVC Pipelines is that stages are cached, so they
will not be re-run unless its dependencies and/or parameters change.

In the above example, the experiment with `'optimizer=sgd', 'model=resnet'` will
not waste computing because all stages are already in the cache:

```
$ dvc queue logs 0b443d8
Stage 'setup-dataset' didn't change, skipping
Stage 'train' didn't change, skipping
```
