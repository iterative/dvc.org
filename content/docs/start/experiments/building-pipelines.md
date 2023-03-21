---
title: 'Get Started: Building Pipelines'
description:
  'Split your workflow into stages and build a pipeline by connecting
  dependencies and outputs.'
---

# Get Started: Building Pipelines

Once you start consolidating your project and the code structure, the
flexibility of the notebooks might start to lose its value and some parts of the
workflow could be improved.

DVC <abbr>Pipelines</abbr> can help you standardize your workflow following
software engineering best practices while also enabling new features like:

- [Preventing steps to be recomputed](/doc/user-guide/pipelines/run-cache).
- [Modifying parameters from the CLI](/doc/user-guide/experiment-management/running-experiments#tuning-hyperparameters).
- [Queueing and executing multiple experiments at once](/doc/user-guide/experiment-management/running-experiments#the-experiments-queue).
- [Configuring your project with Hydra](/doc/user-guide/experiment-management/running-experiments#hydra-composition).

## From notebook to scripts

We are not going to cover here how to go from notebooks to scripts, but you can
follow
[this detailed blog post](https://towardsdatascience.com/from-jupyter-notebook-to-sc-582978d3c0c)
to learn how to do it.

From a high level perspective, what you need to do before building a pipeline
is:

- **Modularize**: split the different logical steps in your notebook into
  separate scripts.

In our example repo, the
[original notebook](https://github.com/iterative/example-get-started-experiments/blob/main/notebooks/TrainSegModel.ipynb)
has been transformed into 3 scripts:
[`data_split.py`](https://github.com/iterative/example-get-started-experiments/blob/main/src/data_split.py),
[`train.py`](https://github.com/iterative/example-get-started-experiments/blob/main/src/train.py)
and
[`evaluate.py`](https://github.com/iterative/example-get-started-experiments/blob/main/src/evaluate.py).

- **Parametrize**: adapt your scripts to decouple the configuration from the
  source code.

All these scripts are configured using different sections of the
[`params.yaml`](https://github.com/iterative/example-get-started-experiments/blob/main/params.yaml)
file.

## Creating stages

You can use `dvc stage add` to transform a script into a <abbr>stage</abbr>:

```cli
$ dvc stage add -n data_split \
  -p base,data_split \
  -d data/pool_data -d src/data_split.py \
  -o data/train_data -o data/test_data \
  python src/data_split.py
```

A `dvc.yaml` file is generated. It includes information about the command you
want to run (`python src/data_split.py`), its <abbr>dependencies</abbr>,
<abbr>parameters</abbr>, and <abbr>outputs</abbr>:

```yaml
stages:
  prepare:
    cmd: python src/data_split.py
    deps:
      - src/data_split.py
      - data/pool_data
    params:
      - base
      - data_split
    outs:
      - data/train_data
      - data/test_data
```

DVC uses these metafiles to track the data used and produced by the stage, so
there's no need to use `dvc add` on `data/train_data` or `data/test_data`
[manually](/doc/start/data-management/data-versioning).

## Building a DAG

By using `dvc stage add` multiple times and defining <abbr>outputs</abbr> of a
stage as <abbr>dependencies</abbr> of another, you describe a sequence of
commands which gets to some desired result. This is called a
[DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph).

Let's create 2 stages chained to the outputs of `data_split`, one for training
and the other for evaluating the model:

```cli
$ dvc stage add -n train \
  -p base,train \
  -d src/train.py -d data/train_data \
  -o models/model.pkl \
  --metrics-no-cache results/train/metrics.json \
  --plots-no-cache results/train/plots \
  python src/train.py
```

```cli
$ dvc stage add -n evaluate \
  -p base,evaluate \
  -d src/evaluate.py -d models/model.pkl -d data/test_data \
  --metrics-no-cache results/evaluate/metrics.json \
  --plots-no-cache results/evaluate/plots \
  python src/evaluate.py
```

The `dvc.yaml` file is updated automatically and should include all the stages
now.

<details>

### Expand to see the full `dvc.yaml`

```yaml
stages:
  data_split:
    cmd: python src/data_split.py
    deps:
      - data/pool_data
      - src/data_split.py
    params:
      - base
      - data_split
    outs:
      - data/test_data
      - data/train_data
  train:
    cmd: python src/train.py
    deps:
      - data/train_data
      - src/train.py
    params:
      - base
      - train
    outs:
      - models/model.pkl
    metrics:
      - results/train/metrics.json:
          cache: false
    plots:
      - results/train/plots:
          cache: false
  evaluate:
    cmd: python src/evaluate.py
    deps:
      - data/test_data
      - models/model.pkl
      - src/evaluate.py
    params:
      - base
      - evaluate
    metrics:
      - results/evaluate/metrics.json:
          cache: false
    plots:
      - results/evaluate/plots:
          cache: false
```

</details>

These stages use a special type of outputs (<abbr>metrics</abbr> and
<abbr>plots</abbr>) that can be rendered by the DVC CLI (`dvc metrics` /
`dvc plots`) and the VSCode Extension and Studio UIs.

<admon type="info">

Learn more about
[Metrics, Parameters and Plots](/doc/start/data-management/metrics-parameters-plots)

</admon>

## Visualizing the DAG

As the number of stages grows, the `dvc dag` command becomes handy for
visualizing the pipeline without manually inspecting the `dvc.yaml` file:

```cli
$ dvc dag
    +--------------------+
    | data/pool_data.dvc |
    +--------------------+
               *
               *
               *
        +------------+
        | data_split |
        +------------+
         **        **
       **            **
      *                **
+-------+                *
| train |              **
+-------+            **
         **        **
           **    **
             *  *
         +----------+
         | evaluate |
         +----------+
```
