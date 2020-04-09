# Connect Code and Data

Even in its basic scenarios, commands like `dvc add`, `dvc push`, `dvc pull`
described in the previous page could be used independently and provide a basic
useful framework to track, save and share models and large data files. To
achieve full reproducibility though, we'll have to connect code and
configuration with the data it processes to produce the result.

<details>

### Expand to prepare example code

If you've followed this _Get Started_ tutorial from the beginning, run these
commands to get the example code:

```dvc
$ wget https://code.dvc.org/get-started/code.zip
$ unzip code.zip
$ rm -f code.zip
```

Windows doesn't include the `wget` utility by default, but you can use the
browser to download `code.zip`. (Right-click
[this link](https://code.dvc.org/get-started/code.zip) and select
`Save Link As...` (Chrome). Save it into the project directory.

The workspace should now look like this:

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

Having installed the `src/prepare.py` script in your repo, the following command
transforms it into a reproducible [stage](/doc/command-reference/run) for the ML
pipeline we're building (described in the
[next chapter](/doc/tutorials/pipelines)).

```dvc
$ dvc run -f prepare.dvc \
          -d src/prepare.py -d data/data.xml \
          -o data/prepared \
          python src/prepare.py data/data.xml
```

`dvc run` generates the `prepare.dvc` DVC-file. It has the same
[format](/doc/user-guide/dvc-file-format) as the file we created in the
[previous section](/doc/tutorials/get-started/versioning-basics) to track
`data.xml`, except in this case it has additional information about the
`data/prepared` output (a directory where two files, `train.tsv` and `test.tsv`,
will be written to), and about the Python command that is required to build it.

<details>

### Expand to learn more about what has just happened

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

> `dvc run` is just the first of a set of DVC command required to generate a
> [pipeline](/doc/command-reference/pipeline), or in other words, instructions
> on how to build a ML model (data file) from previous data files (or
> directories).

Let's briefly mention what the command options used above mean for this
particular example:

`-f prepare.dvc` specifies a name for the DVC-file (pipeline stage). It's
optional but we recommend using it to make your project structure more readable.

`-d src/prepare.py` and `-d data/data.xml` mean that the `prepare.dvc` stage
file depends on them to produce the result. When you run `dvc repro` next time
(see next chapter) DVC will automatically check these dependencies and decide
whether this stage is up to date or whether it should be executed to regenerate
its outputs.

`-o data/prepared` specifies the output directory processed data will be put
into. The script creates two files in it – that will be used later to generate
features, train and evaluate the model.

And, the last line, `python src/prepare.py data/data.xml`, specifies a command
to run. This command is saved to the generated DVC-file, and used later by
`dvc repro`.

Hopefully, `dvc run` (and `dvc repro`) will become intuitive after a few more
Get Started chapters. You can always refer to the the command references for
more details on their behavior and options.

</details>

You don't need to run `dvc add` to track output files (`prepared/train.tsv` and
`prepared/test.tsv`) with DVC. `dvc run` takes care of this. You only need to
run `dvc push` (usually along with `git commit`) to save them to the remote when
you are done.

Let's commit the changes to save the stage we built:

```dvc
$ git add data/.gitignore prepare.dvc
$ git commit -m "Create data preparation stage"
$ dvc push
```

## Pipeline

Support for [pipelines](/doc/command-reference/pipeline) is the biggest
difference between DVC and other version control tools that can handle large
data files (e.g. `git lfs`). By using `dvc run` multiple times, and specifying
outputs of a command (stage) as dependencies in another one, we can describe a
sequence of commands that gets to a desired result. This is what we call a
**data pipeline** or dependency graph.

Let's create a second stage (after `prepare.dvc`, created in the previous
chapter) to perform feature extraction:

```dvc
$ dvc run -f featurize.dvc \
          -d src/featurization.py -d data/prepared \
          -o data/features \
          python src/featurization.py \
                 data/prepared data/features
```

And a third stage for training:

```dvc
$ dvc run -f train.dvc \
          -d src/train.py -d data/features \
          -o model.pkl \
          python src/train.py data/features model.pkl
```

Let's commit DVC-files that describe our pipeline so far:

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
able to wrap our heads around it. Luckily, DVC allows us to do that without
leaving the terminal, making the experience distraction-less.

We are using the `--ascii` option below to better illustrate this pipeline.
Please, refer to `dvc pipeline show` to explore other options this command
supports (e.g. `.dot` files that can be used then in other tools).

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

In the previous chapters, we described our first
[pipeline](/doc/command-reference/pipeline). Basically, we generated a number of
[stage files](/doc/command-reference/run)
([DVC-files](/doc/user-guide/dvc-file-format)). These stages define individual
commands to execute towards a final result. Each depends on some data (either
raw data files or intermediate results from previous stages) and code files.

If you just cloned the
[project](https://github.com/iterative/example-get-started), make sure you first
fetch the input data from DVC by calling `dvc pull`.

It's now extremely easy for you or your colleagues to reproduce the result
end-to-end:

```dvc
$ dvc repro train.dvc
```

> If you've just followed the previous chapters, the command above will have
> nothing to reproduce since you've recently executed all the pipeline stages.
> To easily try this command, clone this example
> [GitHub project](https://github.com/iterative/example-get-started) and run it
> from there.

`train.dvc` describes which source code and data files to use, and how to run
the command in order to get the resulting model file. For each data file it
depends on, we can in turn do the same analysis: find a corresponding DVC-file
that includes the data file in its outputs, get dependencies and commands, and
so on. It means that DVC can recursively build a complete sequence of commands
it needs to execute to get the model file.

`dvc repro` essentially builds a dependency graph, detects stages with modified
dependencies or missing outputs and recursively executes commands (nodes in this
graph or pipeline) starting from the first stage with changes.

Thus, `dvc run` and `dvc repro` provide a powerful framework for _reproducible
experiments_ and _reproducible projects_.
