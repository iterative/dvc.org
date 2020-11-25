---
title: 'Get Started: Data Pipelines'
description: 'Learn how to build and use DVC pipelines to capture, organize,
version, and reproduce your data science and machine learning workflows.'
---

# Get Started: Data Pipelines

Versioning large data files and directories for data science is great, but not
enough. How is data filtered, transformed, or used to train ML models? DVC
introduces a mechanism to capture _data pipelines_ — series of data processes
that produce a final result.

DVC pipelines and their data can also be easily versioned (using Git). This
allows you to better organize projects, and reproduce your workflow and results
later — exactly as they were built originally! For example, you could capture a
simple ETL workflow, organize a data science project, or build a detailed
machine learning pipeline.

Watch and learn, or follow along with the code example below!

https://youtu.be/71IGzyH95UY

## Pipeline stages

Use `dvc run` to create _stages_. These represent processes (source code tracked
with Git) that form the steps of a pipeline. Stages also connect code to its
data input and output. Let's transform a Python script into a
[stage](/doc/command-reference/run):

<details>

### ⚙️ Expand to download example code.

Get the sample code like this:

```dvc
$ wget https://code.dvc.org/get-started/code.zip
$ unzip code.zip
$ rm -f code.zip
$ tree
.
├── params.yaml
└── src
    ├── evaluate.py
    ├── featurization.py
    ├── prepare.py
    ├── requirements.txt
    └── train.py
```

Now let's install the requirements:

> We **strongly** recommend creating a
> [virtual environment](https://python.readthedocs.io/en/stable/library/venv.html)
> first.

```dvc
$ pip install -r src/requirements.txt
```

Please also add or commit the source code directory with Git at this point.

</details>

```dvc
$ dvc run -n prepare \
          -p prepare.seed,prepare.split \
          -d src/prepare.py -d data/data.xml \
          -o data/prepared \
          python src/prepare.py data/data.xml
```

A `dvc.yaml` file is generated. It includes information about the command we ran
(`python src/prepare.py`), its <abbr>dependencies</abbr>, and
<abbr>outputs</abbr>.

<details>

### 💡 Expand to see what happens under the hood.

The command options used above mean the following:

- `-n prepare` specifies a name for the stage. If you open the `dvc.yaml` file
  you will see a section named `prepare`.

- `-p prepare.seed,prepare.split` is a special type of dependencies -
  [parameters](/doc/command-reference/params). We'll get to them later in the
  [Experiments](/doc/tutorials/get-started/experiments) section, but the idea is
  that stage can depend on field values from a parameters file (`params.yaml` by
  default):

```yaml
prepare:
  split: 0.20
  seed: 20170428
```

- `-d src/prepare.py` and `-d data/data.xml` mean that the stage depends on
  these files to work. Notice that the source code itself is marked as a
  dependency. If any of these files change later, DVC will know that this stage
  needs to be [reproduced](#reproduce).

- `-o data/prepared` specifies an output directory for this script, which writes
  two files in it. This is how the <abbr>workspace</abbr> should look like now:

  ```git
   .
   ├── data
   │   ├── data.xml
   │   ├── data.xml.dvc
  +│   └── prepared
  +│       ├── test.tsv
  +│       └── train.tsv
  +├── dvc.yaml
  +├── dvc.lock
   ├── params.yaml
   └── src
       ├── ...
  ```

- The last line, `python src/prepare.py ...`, is the command to run in this
  stage, and it's saved to the stage file, as shown below.

The resulting `prepare` stage in the `dvc.yaml` contains all of the information
above:

```yaml
stages:
  prepare:
    cmd: python src/prepare.py data/data.xml
    deps:
      - data/data.xml
      - src/prepare.py
    params:
      - prepare.seed
      - prepare.split
    outs:
      - data/prepared
```

</details>

There's no need to use `dvc add` for DVC to track stage outputs (`data/prepared`
in this case); `dvc run` already took care of this. You only need to run
`dvc push` if you want to save them to
[remote storage](/doc/tutorials/get-started/data-versioning#storing-and-sharing),
(usually along with `git commit` to version the stage file itself).

## Dependency graphs (DAGs)

By using `dvc run` multiple times, and specifying <abbr>outputs</abbr> of a
stage as <abbr>dependencies</abbr> of another one, we can describe a sequence of
commands that gets to a desired result. This is what we call a _data pipeline_
or [_dependency graph_](https://en.wikipedia.org/wiki/Directed_acyclic_graph).

Let's create a second stage chained to the outputs of `prepare`, to perform
feature extraction:

```dvc
$ dvc run -n featurize \
          -p featurize.max_features,featurize.ngrams \
          -d src/featurization.py -d data/prepared \
          -o data/features \
          python src/featurization.py data/prepared data/features
```

The `dvc.yaml` file is updated automatically and should include two stages now.

<details>

### 💡 Expand to see what happens under the hood.

The changes to the `dvc.yaml` should look like this:

```diff
stages:
  prepare:
    cmd: python src/prepare.py data/data.xml
    deps:
    - data/data.xml
    - src/prepare.py
    params:
    - prepare.seed
    - prepare.split
    outs:
    - data/prepared
+  featurize:
+    cmd: python src/featurization.py data/prepared data/features
+    deps:
+    - data/prepared
+    - src/featurization.py
+    params:
+    - featurize.max_features
+    - featurize.ngrams
+    outs:
+    - data/features
```

</details>

<details>

### ⚙️ Expand to add more stages.

Let's add the training itself. Nothing new this time, the same `dvc run` command
with the same set of options:

```dvc
$ dvc run -n train \
          -p train.seed,train.n_estimators \
          -d src/train.py -d data/features \
          -o model.pkl \
          python src/train.py data/features model.pkl
```

Please check the `dvc.yaml` again, it should have one more stage now.

</details>

This should be a good point to commit the changes with Git. These include
`.gitignore`, `dvc.lock`, and `dvc.yaml` — which describe our pipeline.

## Reproduce

The whole point of creating this `dvc.yaml` pipeline file is an ability to
reproduce the pipeline:

```dvc
$ dvc repro
```

<details>

### ⚙️ Expand to have some fun with it

Let's try to play a little bit with it. First, let's try to change one of the
parameters for the training stage:

```dvc
$ vim params.yaml
```

Change `n_estimators` to `100` and run `dvc repro`, you should see:

```dvc
$ dvc repro
Stage 'prepare' didn't change, skipping
Stage 'featurize' didn't change, skipping
Running stage 'train' with command: ...
```

DVC detected that only `train` should be run, and skipped everything else! All
the intermediate results are being reused.

Now, let's change it back to `50` and run `dvc repro` again:

```dvc
$ dvc repro
Stage 'prepare' didn't change, skipping
Stage 'featurize' didn't change, skipping
```

Same as before, no need to run `prepare`, `featurize`, etc ... but, it doesn't
run even `train` again this time either! It cached the previous run with the
same set of inputs (parameters + data) and reused it.

</details>

<details>

### 💡 Expand to see what happens under the hood.

`dvc repro` relies on the DAG definition that it reads from `dvc.yaml`, and uses
`dvc.lock` to determine what exactly needs to be run.

`dvc.lock` file is similar to `.dvc` files and captures hashes (in most cases
`md5`s) of the dependencies, values of the parameters that were used, it can be
considered a _state_ of the pipeline:

```yaml
prepare:
  cmd: python src/prepare.py data/data.xml
  deps:
    - path: data/data.xml
      md5: a304afb96060aad90176268345e10355
    - path: src/prepare.py
      md5: 285af85d794bb57e5d09ace7209f3519
  params:
    params.yaml:
      prepare.seed: 20170428
      prepare.split: 0.2
  outs:
    - path: data/prepared
      md5: 20b786b6e6f80e2b3fcf17827ad18597.dir
```

> `dvc status` command can be used to compare this state with an actual state of
> the workspace.

</details>

DVC pipelines (`dvc.yaml` file, `dvc run`, and `dvc repro` commands) solve a few
important problems:

- _Automation_ - run a sequence of steps in a "smart" way that makes iterating
  on your project faster. DVC automatically determines which parts of a project
  need to be run, and it caches "runs" and their results, to avoid unnecessary
  re-runs.
- _Reproducibility_ - `dvc.yaml` and `dvc.lock` files describe what data to use
  and which commands will generate the pipeline results (such as an ML model).
  Storing these files in Git makes it easy to version and share.
- _Continuous Delivery and Continuous Integration (CI/CD) for ML_ - describing
  projects in way that it can be reproduced (built) is the first necessary step
  before introducing CI/CD systems. See our sister project,
  [CML](https://cml.dev/) for some examples.

## Visualize

Having built our pipeline, we need a good way to understand its structure.
Seeing a graph of connected stage files would help. DVC lets you do just that,
without leaving the terminal!

```dvc
$ dvc dag
         +---------+
         | prepare |
         +---------+
              *
              *
              *
        +-----------+
        | featurize |
        +-----------+
         **        **
       **            *
      *               **
+-------+               *
| train |             **
+-------+            *
         **        **
           **    **
             *  *
        +----------+
        | evaluate |
        +----------+
```

> Refer to `dvc dag` to explore other ways this command can visualize a
> pipeline.
