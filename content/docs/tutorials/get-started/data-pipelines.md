# Data Pipelines

Versioning large data files and directories for data science is great, but not
enough. How is data filtered, transformed, or used to train ML models? DVC
introduces a mechanism to capture _data pipelines_ — **series of data
processes** that produce a final result.

DVC pipelines and their data can also be easily versioned (using Git). This
allows you to better organize your project, and reproduce your workflow and
results later exactly as they were built originally!

<details>

### 👉 Expand to prepare the project

Get the sample project from Github with:

```dvc
$ git clone https://github.com/iterative/example-get-started
$ cd example-get-started
$ git checkout '4-update-data'
$ dvc pull
```

</details>

## Pipeline stages

Use `dvc run` to create _stages_. These represent processes (source code tracked
with Git) that form the **steps of a pipeline**. Staged also connect such code
to its data input and output. Let's transform a Python script into a
[stage](/doc/command-reference/run):

<details>

### 👉 Expand to download example code

Get the sample code like this:

```dvc
$ wget https://code.dvc.org/get-started/code.zip
$ unzip code.zip
$ rm -f code.zip
$ ls src
cleanup.py  evaluate.py  featurization.py
prepare.py  requirements.txt  train.py
```

Now let's install the requirements:

> We **strongly** recommend creating a
> [virtual environment](https://packaging.python.org/tutorials/installing-packages/#creating-virtual-environments)
> first.

```dvc
$ pip install -r src/requirements.txt
```

Please also add or commit the source code directory with Git at this point.

</details>

```dvc
$ dvc run -f prepare.dvc \
          -d src/prepare.py -d data/data.xml \
          -o data/prepared \
          python src/prepare.py data/data.xml data/prepared
```

A [`dvc.yaml` file](/doc/user-guide/dvc-files-and-directories#dvcyaml-file) is
generated. It includes information about the command we ran
(`python src/prepare.py`), its <abbr>dependencies</abbr>, and
<abbr>outputs</abbr>.

<details>

### Expand to see what happened internally

The command options used above mean the following:

- `-f prepare.dvc` specifies a name for the stage file. It's optional but we
  recommend using it to make your project structure more readable.

- `-d src/prepare.py` and `-d data/data.xml` mean that the stage depends on
  these files to work. Notice that the source code itself is marked as a
  dependency. If any of these files change later, DVC will know that this stage
  needs to be [reproduced](#reproduce).

- `-o data/prepared` specifies an output directory for this script, which writes
  two files in it. This is how the <abbr>workspace</abbr> should look like now:

  ```diff
      .
      ├── data
      │   ├── data.xml
      │   ├── data.xml.dvc
  +   │   └── prepared
  +   │       ├── test.tsv
  +   │       └── train.tsv
  +   ├── prepare.dvc
      └── src
          ├── ...
  ```

- The last line, `python src/prepare.py ...`, is the command to run in this
  stage, and it's saved to the stage file, as shown below.

The resulting import stage `prepare.dvc` contains all of the information above:

```yaml
cmd: python src/prepare.py data/data.xml data/prepared
deps:
  - md5: 1a18704abffac804adf2d5c4549f00f7
    path: src/prepare.py
  - md5: a304afb96060aad90176268345e10355
    path: data/data.xml
outs:
  - md5: 6836f797f3924fb46fcfd6b9f6aa6416.dir
    path: data/prepared
    cache: true
```

</details>

### Tracking and versioning stages

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

Let's create a second stage chained to the outputs of `prepare.dvc`, to perform
feature extraction. And a third one for training a machine learning model, based
on the features:

```dvc
$ dvc run -f featurize.dvc \
          -d src/featurization.py -d data/prepared \
          -o data/features \
          python src/featurization.py data/prepared data/features

$ dvc run -f train.dvc \
          -d src/train.py -d data/features \
          -o model.pkl \
          python src/train.py data/features model.pkl
```

This would be a good point to commit the changes with Git. This includes any
`.gitignore` files, and `dvc.yaml` — which describes our pipeline.

> 📖 See also the `dvc pipeline` command.

## Reproduce

Imagine you're just cloning the <abbr>repository</abbr> created so far, in
another computer. It's extremely easy for anyone to reproduce the result
end-to-end, by using `dvc repro`.

<details>

### 👉 Expand to simulate a fresh clone of this repo

Move to another location in your file system and do this:

```dvc
$ git clone https://github.com/iterative/example-get-started
$ cd example-get-started
$ git checkout 7-train
```

</details>

```dvc
$ dvc repro train.dvc
```

`train.dvc` is used because it's the last stage file so far; It describes what
code and data to use to regenerate a final result (ML model). For stages that
<abbr>output</abbr> any of its <abbr>dependencies</abbr>, we can in turn get the
same info, and so on.

`dvc repro` rebuilds this [dependency graph](#dependency-graphs-dags) and
executes the necessary commands to rebuild all the pipeline
<abbr>artifacts</abbr>.

## Visualize

Having built our pipeline, we need a good way to understand its structure.
Seeing a graph of connected stage files would help. DVC lets you do just that,
without leaving the terminal!

```dvc
$ dvc pipeline show --ascii train.dvc
     +-------------------+
     | data/data.xml.dvc |
     +-------------------+
               *
               *
               *
        +-------------+
        | prepare.dvc |
        +-------------+
               *
               *
               *
       +---------------+
       | featurize.dvc |
       +---------------+
               *
               *
               *
         +-----------+
         | train.dvc |
         +-----------+
```

> We are using the `--ascii` option above to better illustrate this pipeline.
> Please, refer to `dvc pipeline show` to explore other options this command
> supports.
