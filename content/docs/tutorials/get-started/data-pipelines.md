# Data Pipelines

![](/img/example-flow-2x.png) _Data modeling overview_

<details>

### 👉 Expand to prepare the project

If you just followed through the
[versioning](/doc/tutorials/get-started/data-versioning) page, cleanup any
uncommitted changes with:

```dvc
$ git reset --hard
$ dvc checkout
```

Otherwise, get the project from Github with:

```dvc
$ git clone https://github.com/iterative/example-get-started
$ cd example-get-started
$ git checkout 4-update-data
$ dvc pull
```

</details>

## Pipeline stages

Use `dvc run` to create _stages_. These can connect DVC-tracked data with the
project's source code (tracked with Git). Let's transform a Python script into a
[stage](/doc/command-reference/run):

<details>

### 👉 Expand to download example code

Get the sample code like this, if you haven't:

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

Please also stage or commit the source code directory with Git at this point.

</details>

```dvc
$ dvc run -f prepare.dvc \
          -d src/prepare.py -d data/data.xml \
          -o data/prepared \
          python src/prepare.py data/data.xml data/prepared
```

The `prepare.dvc` _stage file_ is generated. It has the same
[format](/doc/user-guide/dvc-metafile-formats) as the DVC-file we created
previously to [tack data](/doc/tutorials/get-started/data-versioning#changes),
but it additionally includes information about the command we ran
(`python src/prepare.py`), the <abbr>dependencies</abbr>, and
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

There's no need to use `dvc add` for DVC to track stage outputs (`data/prepared`
in this case); `dvc run` already took care of this. You only need to run
`dvc push` if you want to save them to
[remote storage](/doc/tutorials/get-started/data-versioning#backing-up--sharing),
(usually along with `git commit` to version the stage file itself).

## Dependency graphs (DAGs)

By using `dvc run` multiple times, and specifying <abbr>outputs</abbr> of a
stage as <abbr>dependencies</abbr> of another one, we can describe a sequence of
commands that gets to a desired result. This is what we call a _data pipeline_
or [_dependency graph_](https://en.wikipedia.org/wiki/Directed_acyclic_graph).

Let's create a second stage chained to the outputs of `prepare.dvc`, to perform
feature extraction. And a third one (chained to the outputs of `featurize.dvc`)
for training an ML model based on the features:

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

Let's commit the changes, including the stage files (DVC-file) that describe our
pipeline so far:

```dvc
$ git add data/.gitignore .gitignore featurize.dvc train.dvc
$ git commit -m "Create featurization & training stages (full ML pipeline)"
```

> See also the `dvc pipeline` command.

## Reproduce

Imagine you're just cloning the <abbr>repository</abbr> created so far, in
another computer. This can be simulated by checking out the `7-train` tag of our
[example-get-started](https://github.com/iterative/example-get-started) repo:

```dvc
$ cd ~
$ git clone https://github.com/iterative/example-get-started
$ cd example-get-started
$ git checkout 7-train
$ dvc unlock data/data.xml.dvc
```

It's now extremely easy for anyone to reproduce the result end-to-end:

```dvc
$ dvc repro train.dvc
```

`train.dvc` is the last stage file in the pipeline so far. It describes which
source code and data files to use, and what command to run to get the resulting
model file. For each data file or directory it depends on, we can in turn do the
same analysis: find the stage that includes the data among its outputs, get
dependencies and commands, etc.

`dvc repro` essentially builds a dependency graph, detects stages with modified
dependencies or missing outputs and recursively executes stage commands (nodes
in this graph or pipeline). Thus, `dvc run` and `dvc repro` provide the ability
to reproduce experiments and entire <abbr>projects</abbr> with ease.

## Visualize

Now that we have built our pipeline, we need a good way to visualize it. Seeing
the graph of connected stages would help wrap our minds around it. DVC allows us
to do that without leaving the terminal, making the experience distraction-less.

> We are using the `--ascii` option below to better illustrate this pipeline.
> Please, refer to `dvc pipeline show` to explore other options this command
> supports (e.g. `.dot` files that can be used then in other tools).

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
