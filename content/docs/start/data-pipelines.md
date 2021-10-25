---
title: 'Get Started: Data Pipelines'
description: 'Learn how to build and use DVC pipelines to capture, organize,
version, and reproduce your data science and machine learning workflows.'
---

# Get Started: Data Pipelines

> > ⁉️ It may be worthwhile to start with the question: "Why pipelines?"

Versioning large data files and directories for data science is great, but not
enough. How is data filtered, transformed, or used to train ML models? DVC
introduces a mechanism to capture _data pipelines_ — series of data processes
that produce a final result.

> > ⁉️ What is data process? Why do we tie "pipelines" with "code" or "data"
> > here? They are more general ideas, we can have a pipeline that downloads
> > data from a URL using `wget` and checks whether it has changed, for example.
> > (like `dvc get` or `dvc import-url`, but simpler.)

> > I see that we are introducing pipelines to an ML/DS audience, but the idea
> > is more general and I believe we can tell this here. It's also possible to
> > tell this within ML/DS context in broader terms.

DVC pipelines and their data can also be easily versioned (using Git). This
allows you to better organize projects, and reproduce your workflow and results
later — exactly as they were built originally! For example, you could capture a
simple [ETL workflow][etl], organize a data science project, or build a detailed
machine learning pipeline.

[etl]: https://en.wikipedia.org/wiki/Extract,_transform,_load

> > We need a figure here.

Watch and learn, or follow along with the code example below!

https://youtu.be/71IGzyH95UY

> > ✍️ DVC has features to handle pipelines easily. You can create stages
> > associated with commands, code, data and (hyper)parameters. It can run the
> > commands, and cache the outputs. DVC handles relationships between these
> > stages, so when these associated elements change, the stage is invalidated
> > and run. If no dependencies are changed, it can report this and reuse the
> > cached results.

Use `dvc stage add` to create _stages_. These represent processes (source code
tracked with Git) which form the steps of a _pipeline_.

> > ⁉️ Adding _data process_ to the concepts doesn't seem to serve well. Instead
> > we can continue like: "Stages represent commands to run, along with their
> > dependencies like data and code files, and outputs like model and plot
> > files."

> > ⁉️ I believe we don't need the following sentence if we write as the
> > previous one.

Stages also connect code to its corresponding data _input_ and _output_.

<details>

### ⚙️ Expand to download example code.

> > ⁉️ I think it might be easier to grasp the concept if we use a simpler
> > pipeline with 3 stages, with not many parameters, metrics and such.

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

> > ⁉️ The first stage we create may be a simpler one.

```dvc
$ dvc stage add -n prepare \
                -p prepare.seed,prepare.split \
                -d src/prepare.py -d data/data.xml \
                -o data/prepared \
                python src/prepare.py data/data.xml
```

> > ⁉️ We can move `dvc.yaml` discussion in a hidden section.

A `dvc.yaml` file is generated. It includes information about the command we run
(`python src/prepare.py data/data.xml`), its <abbr>dependencies</abbr>, and
<abbr>outputs</abbr>.

<details>

### 💡 Expand to see what happens under the hood.

> > ⁉️ I think, the short descriptions of options can be in the main text
> > instead of `dvc.yaml` above. Also, the project should contain a simple
> > pipeline that starts with `-d` and `-o`, then add `-p`, `-m` to the mix in a
> > later stage. The first example of `stage add` is too complex here.

The command options used above mean the following:

- `-n prepare` specifies a name for the stage. If you open the `dvc.yaml` file
  you will see a section named `prepare`.

- `-p prepare.seed,prepare.split` defines special types of dependencies —
  [parameters](/doc/command-reference/params). We'll get to them later in the
  [Metrics, Parameters, and Plots](/doc/start/metrics-parameters-plots) page,
  but the idea is that the stage can depend on field values from a parameters
  file (`params.yaml` by default):

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

- The last line, `python src/prepare.py data/data.xml` is the command to run in
  this stage, and it's saved to `dvc.yaml`, as shown below.

The resulting `prepare` stage contains all of the information above:

```yaml
stages:
  prepare:
    cmd: python src/prepare.py data/data.xml
    deps:
      - src/prepare.py
      - data/data.xml
    params:
      - prepare.seed
      - prepare.split
    outs:
      - data/prepared
```

</details>

> > ⁉️ The following information can also be hidden, or deleted. We assume this
> > GS trail will be standalone, no need to mention `dvc add` here.

There's no need to use `dvc add` for DVC to track stage outputs (`data/prepared`
in this case); `dvc stage add` and `dvc exp run` takes care of this. You only
need to run `dvc push` if you want to save them to
[remote storage](/doc/start/data-and-model-versioning#storing-and-sharing),
(usually along with `git commit` to version `dvc.yaml` itself).

> > ⁉️ Here, it may be more natural to tell the Run-Cache and `dvc push` as
> > pushing "pipeline artifacts" instead of "storing and sharing".

> > `dvc push` can push the individual stages, and their associated code and
> > data, so you don't have to re-run them in other machines.

## Dependency graphs (DAGs)

By using `dvc stage add` multiple times, and specifying <abbr>outputs</abbr> of
a stage as <abbr>dependencies</abbr> of another one, we can describe a sequence
of commands which gets to a desired result. This is what we call a _data
pipeline_ or
[_dependency graph_](https://en.wikipedia.org/wiki/Directed_acyclic_graph).

> > ⁉️ All pipelines are DAGs, but not all DAGs are pipelines, so these two are
> > not identical. DAG reference seems complicating, rather than simplifying to
> > me.

Let's create a second stage chained to the outputs of `prepare`, to perform
feature extraction:

> > ⁉️ The second stage is almost identical with the first. It may be necessary
> > for the project, but pedagogically we're spending reader's attention here
> > unnecessarily here.

```dvc
$ dvc stage add -n featurize \
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

> > ⁉️ Another pipeline from the same. The first three stages look almost
> > identical.

Let's add the training itself. Nothing new this time; just the same
`dvc stage add` command with the same set of options:

```dvc
$ dvc stage add -n train \
                -p train.seed,train.n_est,train.min_split \
                -d src/train.py -d data/features \
                -o model.pkl \
                python src/train.py data/features model.pkl
```

> > ⁉️ The wording below is a bit _distrustful._ In case of an error, DVC should
> > report it.

Please check the `dvc.yaml` again, it should have one more stage now.

</details>

This should be a good time to commit the changes with Git. These include
`.gitignore`, `dvc.lock`, and `dvc.yaml` — which describe our pipeline.

## Run the pipeline

The whole point of creating this `dvc.yaml` file is the ability to easily
reproduce a pipeline:

```dvc
$ dvc exp run
```

<details>

### ⚙️ Expand to have some fun with it.

Let's try to play a little bit with it. First, let's try to change one of the
parameters for the training stage:

1. Open `params.yaml` and change `n_est` to `100`, and
2. (re)run `dvc exp run`.

> > Link to experiments trail here

You should see:

```dvc
$ dvc exp run
Stage 'prepare' didn't change, skipping
Stage 'featurize' didn't change, skipping
Running stage 'train' with command: ...
```

DVC detected that only `train` should be run, and skipped everything else! All
the intermediate results are being reused.

Now, let's change it back to `50` and run `dvc exp run` again:

> > It looks these manual changes are a bit tedious. We can replace these with
> > code or data changes that can't be captured with `dvc exp run -S`

```dvc
$ dvc exp run
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

DVC pipelines (`dvc.yaml` file, `dvc stage add`, and `dvc exp run` commands)
solve a few important problems:

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
