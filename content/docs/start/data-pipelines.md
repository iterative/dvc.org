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
simple [ETL workflow][etl], organize a data science project, or build a detailed
machine learning pipeline.

[etl]: https://en.wikipedia.org/wiki/Extract,_transform,_load

Watch and learn, or follow along with the code example below!

https://youtu.be/71IGzyH95UY

## Pipeline stages

Use `dvc stage add` to create _stages_. These represent processes (source code
tracked with Git) which form the steps of a _pipeline_. Stages also connect code
to its corresponding data _input_ and _output_. Let's start by creating a stage
to extract the data file in the project.

<details>

### ⚙️ Expand to download example code.

Get the sample code like this:

```dvc
$ git clone https://github.com/iterative/example-dvc-pipelines -b get-started
$ tree
.
├── params.yaml
├── transform.py
├── data/mnist.zip.dvc
├── requirements.txt
└── train.py
```

Now let's install the requirements:

> We **strongly** recommend creating a
> [virtual environment](https://python.readthedocs.io/en/stable/library/venv.html)
> first.

```dvc
$ pip install -r requirements.txt
```

Now, you can download the data set we'll use in the project:

```dvc
$ dvc pull
```

For details on how to use DVC as a data management tool, please refer to
[Data Management Trail](/doc/start/data-and-model-management)

</details>

If you inspect the code in `transform.py`, you'll see that it requires a set of
image files. The downloaded data file is in zip format. We need a stage to
convert the downloaded file into a directory.

```dvc
$ dvc stage add -n extract \
          -d data/mnist.zip \
          -o data/images \
          tar xvzf data/mnist.tar.gz data/images
```

A `dvc.yaml` file is generated. It includes information about the command we ran
(`tar xvzf ...`), its <abbr>dependencies</abbr>, and <abbr>outputs</abbr>.

<details>

### 💡 Expand to see what happens under the hood.

The command options used above mean the following:

- `-n extract` specifies a name for the stage. If you open the `dvc.yaml` file
  you will see a section named `extract`.

- `-d data/mnist.tar.gz` mean that the stage depends on this file to work. If
  this file change later, DVC will know that this stage needs to be
  [reproduced](#reproduce).

- `-o data/images` specifies an output directory for the command. This is how
  the <abbr>workspace</abbr> should look like now:

  ```git
   .
   ├── data
   │   ├── mnist.tar.gz
   │   ├── mnist.tar.gz.dvc
  +├── dvc.yaml
  +├── dvc.lock
   ├── params.yaml
   ├── ...
  ```

- The last line, `tar xvzf data/mnist.tar.gz ...` is the command to run in this
  stage, and it's saved to `dvc.yaml`, as shown below.

The resulting `extract` stage contains all of the information above:

```yaml
stages:
  extract:
    cmd: tar xvzf data/mnist.tar.gz ...
    deps:
      - data/mnist.tar.gz
    outs:
      - data/images
```

</details>

After adding the stage, we can run it using:

```dvc
$ dvc repro
```

Note the command output is identical with the `tar` command we set as the stage
command.

The `data` directory now contains `images` directory, which has `test` and
`train` subdirectories, each with a directory named after a class label (digit).
You can see the directory hierarchy below:

```dvc
$ tree -d data
```

There's no need to use `dvc add` for DVC to track stage outputs (`data/prepared`
in this case); `dvc stage add` and `dvc repro` takes care of this. You only need
to run `dvc push` if you want to save them to
[remote storage](/doc/start/data-and-model-versioning#storing-and-sharing),
(usually along with `git commit` to version `dvc.yaml` itself).

## Dependency graphs (DAGs)

By using `dvc run` multiple times, and specifying <abbr>outputs</abbr> of a
stage as <abbr>dependencies</abbr> of another one, we can describe a sequence of
commands which gets to a desired result. This is what we call a _data pipeline_
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

```git
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

Let's add the training itself. Nothing new this time; just the same `dvc run`
command with the same set of options:

```dvc
$ dvc run -n train \
          -p train.seed,train.n_est,train.min_split \
          -d src/train.py -d data/features \
          -o model.pkl \
          python src/train.py data/features model.pkl
```

Please check the `dvc.yaml` again, it should have one more stage now.

</details>

This should be a good time to commit the changes with Git. These include
`.gitignore`, `dvc.lock`, and `dvc.yaml` — which describe our pipeline.

## Reproduce

The whole point of creating this `dvc.yaml` file is the ability to easily
reproduce a pipeline:

```dvc
$ dvc repro
```

<details>

### ⚙️ Expand to have some fun with it.

Let's try to play a little bit with it. First, let's try to change one of the
parameters for the training stage:

1. Open `params.yaml` and change `n_est` to `100`, and
2. (re)run `dvc repro`.

You should see:

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

As before, there was no need to rerun `prepare`, `featurize`, etc. But this time
it also doesn't rerun `train`! The previous run with the same set of inputs
(parameters & data) was saved in DVC's <abbr>run-cache</abbr>, and reused here.

</details>

<details>

### 💡 Expand to see what happens under the hood.

`dvc repro` relies on the <abbr>DAG</abbr> definition from `dvc.yaml`, and uses
`dvc.lock` to determine what exactly needs to be run.

The `dvc.lock` file is similar to a `.dvc` file — it captures hashes (in most
cases `md5`s) of the dependencies and values of the parameters that were used.
It can be considered a _state_ of the pipeline:

```yaml
schema: '2.0'
stages:
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

- _Automation_: run a sequence of steps in a "smart" way which makes iterating
  on your project faster. DVC automatically determines which parts of a project
  need to be run, and it caches "runs" and their results to avoid unnecessary
  reruns.
- _Reproducibility_: `dvc.yaml` and `dvc.lock` files describe what data to use
  and which commands will generate the pipeline results (such as an ML model).
  Storing these files in Git makes it easy to version and share.
- [_Continuous Delivery and Continuous Integration (CI/CD) for ML_](/doc/use-cases/ci-cd-for-machine-learning):
  describing projects in way that can be reproduced (built) is the first
  necessary step before introducing CI/CD systems. See our sister project
  [CML](https://cml.dev) for some examples.

## Visualize

Having built our pipeline, we need a good way to understand its structure.
Seeing a graph of connected stages would help. DVC lets you do so without
leaving the terminal!

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
              *
              *
              *
          +-------+
          | train |
          +-------+
```

> Refer to `dvc dag` to explore other ways this command can visualize a
> pipeline.
