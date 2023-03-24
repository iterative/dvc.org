---
title: 'Get Started: Building Pipelines'
description:
  'Split your workflow into stages and build a pipeline by connecting
  dependencies and outputs.'
---

# Get Started: Building Pipelines

Eventually, managing your notebook cells may start to feel fragile, and you may
want to structure your project and code. When you are ready to
[migrate from notebooks to scripts](https://towardsdatascience.com/from-jupyter-notebook-to-sc-582978d3c0c),
DVC <abbr>Pipelines</abbr> can help you standardize your workflow following
software engineering best practices:

- **Modularization**: split the different logical steps in your notebook into
  separate scripts.

- **Parametrization**: adapt your scripts to decouple the configuration from the
  source code.

## Creating stages

In our example repo, we first extract data preparation from the
[original notebook](https://github.com/iterative/example-get-started-experiments/blob/main/notebooks/TrainSegModel.ipynb)
into
[`data_split.py`](https://github.com/iterative/example-get-started-experiments/blob/main/src/data_split.py).
We parametrize this script by reading parameters from
[`params.yaml`](https://github.com/iterative/example-get-started-experiments/blob/main/params.yaml):

```python
from ruamel.yaml import YAML

yaml = YAML(typ="safe")

def data_split():
    params = yaml.load(open("params.yaml", encoding="utf-8"))
...
```

You can use `dvc stage add` to transform a script into a <abbr>stage</abbr>:

```cli
$ dvc stage add --name data_split \
  --params base,data_split \
  --deps data/pool_data --deps src/data_split.py \
  --outs data/train_data --outs data/test_data \
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

`dvc exp run` will run all stages in the `dvc.yaml` file:

```cli
$ dvc exp run
'data/pool_data.dvc' didn't change, skipping
Running stage 'data_split':
> python src/data_split.py
Generating lock file 'dvc.lock'
Updating lock file 'dvc.lock'
...
```

<admon type="info">

Learn more about [Stages](/doc/user-guide/pipelines/defining-pipelines#stages)

</admon>

## Building a DAG

By using `dvc stage add` multiple times and defining <abbr>outputs</abbr> of a
stage as <abbr>dependencies</abbr> of another, you describe a sequence of
commands which forms a [pipeline](/doc/user-guide/pipelines/defining-pipelines),
also called a [DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph).

Let's create a `train` stage using
[`train.py`](https://github.com/iterative/example-get-started-experiments/blob/main/src/train.py)
to train the model:

```cli
$ dvc stage add -n train \
  -p base,train \
  -d src/train.py -d data/train_data \
  -o models/model.pkl \
  python src/train.py
```

`dvc exp run` checks the `data_split` stage first and then the `train` stage
since it depends on the <abbr>outputs</abbr> of `data_split`. If a stage has not
changed or has been run before with the same <abbr>dependencies</abbr> and
<abbr>parameters</abbr>, it will be
[skipped](/doc/user-guide/pipelines/run-cache):

```cli
$ dvc exp run
'data/pool_data.dvc' didn't change, skipping
Stage 'data_split' didn't change, skipping
Running stage 'train':
> python src/train.py
...
```

Finally, let's add an `evaluate` stage:

```cli
$ dvc stage add -n evaluate \
  -p base,evaluate \
  -d src/evaluate.py -d models/model.pkl -d data/test_data \
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
  evaluate:
    cmd: python src/evaluate.py
    deps:
      - data/test_data
      - models/model.pkl
      - src/evaluate.py
    params:
      - base
      - evaluate
```

</details>

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
