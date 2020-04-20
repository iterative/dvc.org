# Data Pipelines

This layer of DVC provides the ability to register data processing or modeling
workflows or _pipelines_ that can be easily managed and reproduced later.

![](/img/example-flow-2x.png) _Data modeling overview_

<details>

### Expand to prepare the project

If you just followed through the
[versioning](/doc/tutorials/get-started/data-versioning) part of this tutorial,
you're all set. Otherwise, run these commands to get the project from Github:

```dvc
$ git clone https://github.com/iterative/example-get-started
$ cd example-get-started
$ git checkout 4-import-data
$ dvc pull
```

</details>

> The pipeline in this tutorial explores a simple
> [NLP](https://en.wikipedia.org/wiki/Natural_language_processing) problem: to
> predict tags for a given Stack Overflow question. It's a simplified version of
> our [Deep Dive Tutorial](/doc/tutorials/deep).

## Stages

The steps that form a pipeline are called _stages_. They record the connection
between data (tracked with DVC) and code (tracked directly with Git).

<details>

### Expand to download example code

Let's first get some code to work with:

```dvc
$ wget https://code.dvc.org/get-started/code.zip
$ unzip code.zip
$ rm -f code.zip
```

> Windows doesn't include the `wget` utility by default, but you can use the
> browser to download `code.zip`. (Right-click
> [this link](https://code.dvc.org/get-started/code.zip) and select
> `Save Link As...` (Chrome). Save it into the <abbr>workspace</abbr>.

> 💡 Please also review
> [Running DVC on Windows](/doc/user-guide/running-dvc-on-windows) for important
> tips to improve your experience using DVC on Windows.

Your workspace should now look like this:

```dvc
$ tree
.
├── data
│   ├── data.xml
│   └── data.xml.dvc
└── src
    ├── evaluate.py
    ├── featurization.py
    ├── prepare.py
    ├── requirements.txt
    └── train.py
```

Now let's install the requirements. But before we do that, we **strongly**
recommend creating a
[virtual environment](https://packaging.python.org/tutorials/installing-packages/#creating-virtual-environments):

```dvc
$ virtualenv -p python3 .env
$ echo ".env/" >> .gitignore
$ source .env/bin/activate
$ pip install -r src/requirements.txt
```

Optionally, save the progress with Git:

```dvc
$ git add .
$ git commit -m "Add source code files to repo"
```

</details>

The following command transforms the `src/prepare.py` script into a
[stage](/doc/command-reference/run):

```dvc
$ dvc run -f prepare.dvc \
          -d src/prepare.py -d data/data.xml \
          -o data/prepared \
          python src/prepare.py data/data.xml
```

`dvc run` generates the `prepare.dvc` _stage file_. It has the same
[format](/doc/user-guide/dvc-file-format) as the `data/data.xml.dvc` DVC-file we
[created previously](/doc/tutorials/get-started/data-versioning#start-tracking-data),
but it includes additional information about the command we ran (last line
above), it's <abbr>dependencies</abbr> (`-d`), and <abbr>outputs</abbr> (`-o`).

<details>

### Expand to learn more about what just happened

The command options used above mean the following:

- `-f prepare.dvc` specifies a name for the stage file. It's optional but we
  recommend using it to make your project structure more readable.

- `-d src/prepare.py` and `-d data/data.xml` mean that the stage depends on
  these files to work. Notice that the source code itself is marked as a stage
  dependency.

- `-o data/prepared` specifies the output directory where this script writes to.
  It creates two files in it (that will be used later down the
  [pipeline](#pipelines)), as shown below.

- The last line, `python src/prepare.py data/data.xml`, is the command to run in
  this stage, and it's saved to the stage file (`cmd` field) as shown below.

This is how the changes in your <abbr>workspace</abbr> should look like now:

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

These are the contents of `prepare.dvc`:

```yaml
md5: 645d5baf13fb4404e17d77a2cf7461c4
cmd: python src/prepare.py data/data.xml
deps:
  - md5: 1a18704abffac804adf2d5c4549f00f7
    path: src/prepare.py
  - md5: a304afb96060aad90176268345e10355
    path: data/data.xml
outs:
  - md5: 6836f797f3924fb46fcfd6b9f6aa6416.dir
    path: data/prepared
    cache: true
    metric: false
    persist: false
```

</details>

There's no need to use `dvc add` for DVC to track stage outputs (`data/prepared`
directory in this case); `dvc run` already took care of this. You only need to
run `dvc push` to save them to
[remote-storage](/doc/tutorials/get-started/data-versioning#configure-remote-storage),
usually along with `git commit` to version the stage file itself:

```dvc
$ git add data/.gitignore prepare.dvc
$ git commit -m "Create data preparation stage"
$ dvc push
```

## Pipelines

By using `dvc run` multiple times, and specifying outputs of a stage as
dependencies in another one, we can describe a sequence of commands that gets to
a desired result. This is what we call a _data pipeline_ or dependency graph.

Let's create a second stage chained to the outputs of `prepare.dvc`, to perform
feature extraction:

```dvc
$ dvc run -f featurize.dvc \
          -d src/featurization.py -d data/prepared \
          -o data/features \
          python src/featurization.py \
                 data/prepared data/features
```

And a third chained stage for training:

```dvc
$ dvc run -f train.dvc \
          -d src/train.py -d data/features \
          -o model.pkl \
          python src/train.py data/features model.pkl
```

Let's commit the changes, including the stage files (DVC-file) that describe our
pipeline so far:

```dvc
$ git add data/.gitignore .gitignore featurize.dvc train.dvc
$ git commit -m "Create featurization and training stages"
$ dvc push
```

> See also the `dvc pipeline` command.

## Reproduce

Imagine you're just cloning the <abbr>repository</abbr> created so far, in
another computer. This can be simulated by cloning our
[example-get-started](https://github.com/iterative/example-get-started) repo
from Github, and checking out the `7-train` tag:

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
in this graph or pipeline).

Thus, `dvc run` and `dvc repro` provide a powerful framework for _reproducible
experiments_ and **reproducible <abbr>projects</abbr>**.

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
