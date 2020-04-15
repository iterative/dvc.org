# Data Pipelines

Support for **pipelines** is one of the key benefits of using DVC over simpler
large file version control tools. _Data pipelines_ are well-defined series of
data processing stages that produce some result.

The pipeline in this tutorial explores a simple natural language processing
(NLP) problem: to predict tags for a given Stack Overflow question. This is done
in several stages, as shown in the figure below.

![](/img/example-flow-2x.png) _Data modeling overview_

> This is a simplified version of our [Deep Dive Tutorial](/doc/tutorials/deep).

<details>

### Expand to prepare the project

If you just followed through the
[versioning](/doc/tutorials/get-started/versioning-basics) page of this
tutorial, you're all set. Otherwise, run these commands to get the project from
Github:

```dvc
$ git clone https://github.com/iterative/example-get-started
$ cd example-get-started
$ git checkout 4-import-data
$ dvc pull
```

</details>

## Stages

Data processing _stages_ are the nodes in the graph that forms our pipelines.
They're computational units, for example machine learning scripts, that can take
an input (dependency) and produce some result (output). Stage source code can be
versioned with a regular Git workflow; We will then add a layer of metadata on
top of it with DVC, to actually define each stage formally.

### Connect code and data

To go beyond versioning and sharing data, and achieve full reproducibility of
our stages and pipelines, we'll need a way to connect code with the data it
relates to.

<details>

### Expand to download example code

Let's first get some code to work with:

```dvc
$ wget https://code.dvc.org/get-started/code.zip
$ unzip code.zip
$ rm -f code.zip
```

Windows doesn't include the `wget` utility by default, but you can use the
browser to download `code.zip`. (Right-click
[this link](https://code.dvc.org/get-started/code.zip) and select
`Save Link As...` (Chrome). Save it into the <abbr>workspace</abbr>.

Your working directory should now look like this:

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

Having the `src/prepare.py` script in your repo, the following command
transforms it into a reproducible [stage](/doc/command-reference/run) for the ML
pipeline we're building:

```dvc
$ dvc run -f prepare.dvc \
          -d src/prepare.py -d data/data.xml \
          -o data/prepared \
          python src/prepare.py data/data.xml
```

`dvc run` generates the `prepare.dvc` _stage file_. It has the same
[format](/doc/user-guide/dvc-file-format) as the DVC-file we
[previously created](/doc/tutorials/get-started/versioning-basics#start-tracking-data)
to track `data.xml`, except that in this case it has additional information
about the command we're executing, it's <abbr>dependencies</abbr>, and
<abbr>outputs</abbr>.

<details>

### Expand to learn more about what just happened

This is how the result should look like now:

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
        ├── evaluate.py
        ├── featurization.py
        ├── prepare.py
        ├── requirements.txt
        └── train.py
```

This is how `prepare.dvc` looks like:

```yaml
cmd: python src/prepare.py data/data.xml
deps:
  - md5: b4801c88a83f3bf5024c19a942993a48
    path: src/prepare.py
  - md5: a304afb96060aad90176268345e10355
    path: data/data.xml
md5: c3a73109be6c186b9d72e714bcedaddb
outs:
  - cache: true
    md5: 6836f797f3924fb46fcfd6b9f6aa6416.dir
    metric: false
    path: data/prepared
wdir: .
```

The command options used above mean the following, for this particular example:

`-f prepare.dvc` specifies a name for the stage file (DVC-file). It's optional
but we recommend using it to make your project structure more readable.

`-d src/prepare.py` and `-d data/data.xml` mean that the stage depends on these
files to produce a result. When you run `dvc repro` next time (see
[Reproduce](#reproduce) section below) DVC will check these dependencies to
decide whether this stage is up to date or whether it should be executed again,
to regenerate its outputs.

`-o data/prepared` specifies an output directory, where the processed data will
be put in. The script creates two files in it – that will be used later to
generate features, train and evaluate the model.

The last line, `python src/prepare.py data/data.xml`, is the command to run in
this stage, and it's saved to the stage file as shown above.

Hopefully, `dvc run` (and `dvc repro`) will become intuitive after completing
this part of the tutorial! You can always refer to the the command references
for more details on their behavior and options.

</details>

You don't need to run `dvc add` to tell DVC to track output files
(`prepared/train.tsv` and `prepared/test.tsv`). `dvc run` takes care of this
already. You only need to run `dvc push` to save them to remote storage, usually
along with `git commit` to version the stage itself. Let's do just that:

```dvc
$ git add data/.gitignore prepare.dvc
$ git commit -m "Create data preparation stage"
$ dvc push
```

## Pipelines

By using `dvc run` multiple times, and specifying outputs of a command (stage)
as dependencies in another one, we can describe a sequence of commands that gets
to a desired result. This is what we call a _data pipeline_ or dependency graph.

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

This example is simplified just to show you a basic pipeline, see a more
advanced [example](/doc/tutorials/pipelines) or
[complete tutorial](/doc/tutorials/pipelines) to create an
[NLP](https://en.wikipedia.org/wiki/Natural_language_processing) pipeline
end-to-end.

> See also the `dvc pipeline` command.

## Visualize

Now that we have built our pipeline, we need a good way to visualize it to be
able to wrap our heads around it. DVC allows us to do that without leaving the
terminal, making the experience distraction-less.

> We are using the `--ascii` option below to better illustrate this pipeline.
> Please, refer to `dvc pipeline show` to explore other options this command
> supports (e.g. `.dot` files that can be used then in other tools).

### Stages

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

### Commands

```dvc
$ dvc pipeline show --ascii train.dvc --commands
          +-------------------------------------+
          | python src/prepare.py data/data.xml |
          +-------------------------------------+
                          *
                          *
                          *
   +---------------------------------------------------------+
   | python src/featurization.py data/prepared data/features |
   +---------------------------------------------------------+
                          *
                          *
                          *
          +---------------------------------------------+
          | python src/train.py data/features model.pkl |
          +---------------------------------------------+
```

### Outputs

```dvc
$ dvc pipeline show --ascii train.dvc --outs
          +---------------+
          | data/data.xml |
          +---------------+
                  *
                  *
                  *
          +---------------+
          | data/prepared |
          +---------------+
                  *
                  *
                  *
          +---------------+
          | data/features |
          +---------------+
                  *
                  *
                  *
            +-----------+
            | model.pkl |
            +-----------+
```

## Reproduce

Imagine a colleague just cloned the Git repo that has been created so far in
another computer. This can be simulated by cloning our example-get-started repo
from Github, and checking out the `7-train` tag:

```dvc
$ cd ~
$ git clone https://github.com/iterative/example-get-started
$ cd example-get-started
$ git checkout 7-train
```

It's now extremely easy for anyone to reproduce the result end-to-end:

```dvc
$ dvc pull data/data.xml  # Get the initial raw data.
$ dvc repro train.dvc     # Regenerate everything else.
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
