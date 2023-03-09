---
title: 'Get Started: Building Pipelines'
description:
  'Get started with building pipelines with DVC. Learn how to split your
  workflow into stages and build a pipeline by connecting dependencies and
  outputs.'
---

# Get Started: Building Pipelines

<details>

### 🎬 Click to watch a video intro.

https://youtu.be/71IGzyH95UY

</details>

Versioning large data files and directories for data science is great, but not
enough. How is data filtered, transformed, or used to train ML models? DVC
introduces a mechanism to capture _pipelines_ — a series of data processes that
produce a final result.

DVC <abbr>pipelines</abbr> can also be easily managed and versioned with Git.
These pipelines are built in a non-intrusive way **without requiring
modifications to your existing code**.

## Creating stages

Use `dvc stage add` to create _stages_. These represent processes (source code
tracked with Git) that form the steps of a _pipeline_. Stages also connect code
to its corresponding data _input_ and _output_. Let's transform a Python script
into a [stage](/doc/command-reference/stage):

```cli
$ dvc stage add -n data_split \
  -p base,data_split \
  -d data/pool_data -d src/data_split.py \
  -o data/train_data -o data/test_data \
  python src/data_split.py
```

A `dvc.yaml` file is generated. It includes information about the command we
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
[manually](/doc/start/data/data-versioning).

## Building a DAG

By using `dvc stage add` multiple times, defining <abbr>outputs</abbr> of a
stage as <abbr>dependencies</abbr> of another, we can describe a sequence of
commands which gets to some desired result. This is what we call a
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
now. You can now track the resulting file with git:

```cli
$ git commit -am "Created dvc.yaml"
```

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

These stages use a special type of outputs, <abbr>metrics</abbr> and
<abbr>plots</abbr>, that will be rendered by `dvc metrics`, `dvc plots` and the
VSCode and Studio UIs.

<admon type="info">

By using the `no-cache` flags we are telling DVC that we want those outputs to
be tracked with Git, as the files are small enough.

</admon>

## Visualizing the DAG

As the number of stages grows, the `dvc dag` command starts to become handy for
visualizing the pipeline without having to manually inspect the `dvc.yaml`:

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
