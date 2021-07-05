---
title: 'Get Started: Experiments'
---

# Get Started with Experiments

<abbr>Experiments</abbr> proliferate quickly in ML projects where there are many
parameters to tune or other permutations of the code. We can organize such
projects and keep only what we ultimately need with `dvc experiments`. DVC can
track experiments for you so there's no need to commit each one to Git. This way
your repo doesn't become polluted with all of them. You can discard experiments
once they're no longer needed.

Previously, we learned how to tune [ML pipelines](/doc/start/data-pipelines) and
[compare the changes](/doc/start/metrics-parameters-plots). Let's further
increase the number of features in the `featurize` stage to see how it compares.

In this section, we will explore the basic features of DVC experiment management
with `[get-started-experiments]` project.

get-started-experiments: https://github.com/iterative/get-started-experiments

<details>
## Installing and Configuring the Project

These commands are run in the `[get-started-experiments]` project. You can run
the commands in this document after cloning the repository and installing the
requirements.

### Clone the project and create virtual environment

Please clone the project and create a virtual environment.

> We create a virtual environment to keep the libraries we use isolated from the
> rest of your system. This prevents version conflicts.

```dvc
$ git clone https://github.com/iterative/get-started-experiments -b source-code
$ cd get-started-experiments
$ virtualenv .venv
$ . .venv/bin/activate
$ python -m pip install -r requirements.txt
```

### Get the data set

The repository you cloned doesn't contain the dataset. In order to get
`fashion-mnist.tar.gz` from the `dataset-registry`, we use `dvc get` to download
the missing data files. `dvc get` is similar to `wget` but works with Git+DVC
repositories to download binary files.

```dvc
$ dvc get https://github.com/iterative/dataset-registry \
          fashion-mnist/images.tar.gz -o data/images.tar.gz
```

Then we extract this file that contains labeled images.

```dvc
$ tar -xvzf data/images.tar.gz --directory data/
```

### Specifying the experiment

We first initialize DVC inside the project to create an experiment.

```dvc
$ dvc init
```

Now, we can add the dataset to the project:

```dvc
$ dvc add data/images
```

This creates a `data/images.dvc` file that contains all the relevant metadata of
the directory. You can add and commit the corresponding `.dvc` file and changes
in `.gitignore` that hides the `data/images/` directory from Git.

```dvc
$ git add data/.gitignore data/images.dvc
$ git commit -m "Dataset added"
```

DVC experiments are run by specifying their commands, outputs, parameters and
dependencies. We add an experiment command by `dvc stage add`.

```dvc
$ dvc stage add -n train \
                -p model.conv_units \
                -p train.epochs \
                -d data/images \
                -m metrics.json \
                python3 src/train.py
```

The command tells DVC to create an experiment named `train`, with two parameters
and a data dependency to `data/images`. The command produces `metrics.json` as a
special type of output.

DVC creates `dvc.yaml` file and modifies `.gitignore` for Git to ignore certain
artifacts.

```dvc
$ git add dvc.yaml .gitignore
$ git commit -m "added data and the experiment"
```

DVC is ready to run the experiments now!

</details>

## Running the experiment with default parameters

The purpose of `dvc exp` commands is to run the pipeline for ephemeral
experiments. By _ephemeral_ we mean the experiments can be run without
committing parameter and dependency changes to Git. Instead the artifacts
produced for each experiment is tracked by DVC and persisted on demand.

Running the experiment with default hyperparameter values requires only the
command:

```dvc
$ dvc exp run
...
Reproduced experiment(s): exp-7683f
Experiment results have been applied to your workspace.

To promote an experiment to a Git branch run:

        dvc exp branch <exp>
```

It runs the pipeline starting from the basic dependencies and produces
`metrics.json` file for the default state.

<details>

### If you used `dvc repro` before

Earlier versions of DVC uses `dvc repro` to run the pipeline. If you already
have a DVC project, you may be used to `dvc repro`.

In DVC 2.0 `dvc exp run` supersedes `dvc repro`. Both of these commands run the
pipeline.

We use `dvc repro` to run the pipeline as found in the <abbr>workspace</abbr>.
All the parameters and dependencies are retrieved from the current workspace. It
doesn't use any special objects to track the experiments. When you have large
number of experiments that you don't want to commit into Git, it's better to use
`dvc exp run`. It allows to change the parameters quickly, can track the history
of artifacts and has facilities to compare these experiments easily.

`dvc repro` is still available to run the pipeline that don't need these extra
features.

</details>

## Running the experiment by setting parameters

Now let's do some more experimentation.

DVC allows to update the parameters defined in the pipeline without modifying
the files manually. We use this feature to set the convolutional units in
`train.py`.

```dvc
$ dvc exp run --set-param model.conv_units=24
...
Reproduced experiment(s): exp-6c06d
Experiment results have been applied to your workspace.

To promote an experiment to a Git branch run:

        dvc exp branch <exp>
```

When you run `dvc exp run` with `--set-param`, it updates the parameter file. We
can see the effect of it by looking at the diff.

```dvc
$ git diff params.yaml
```

```git
-model:
-  conv_units: 16
+model:
+  conv_units: 24
```

## Run multiple experiments in parallel

Instead of running the experiments one-by-one, we can define them first to run
them in a batch. This is especially handy when you have long running
experiments.

We add experiments to the queue using the `--queue` option of `dvc exp run`. We
also use `-S` (`--set-param`) to set a value for the parameter.

````dvc
$ dvc exp run --queue -S model.conv_units=32
Queued experiment '6518f17' for future execution.
$ dvc exp run --queue -S model.conv_units=64
Queued experiment '30eb9b2' for future execution.
$ dvc exp run --queue -S model.conv_units=128
Queued experiment 'ac66940' for future execution.
$ dvc exp run --queue -S model.conv_units=256
Queued experiment '8bb6049' for future execution.```

Next, run all (`--run-all`) queued experiments in parallel (using `--jobs`):

```dvc
$ dvc exp run --run-all --jobs 2
TK
````

## Comparing experiments

The pipeline is run several times with different parameters. To compare all of
these experiments, we use `dvc exp show`. This command presents the parameters
and metrics produced in experiments in a nicely formatted table.

```dvc
$ dvc exp show
```

TK

By default it shows all the parameters and the metrics along with the timestamp.
If you have large number of parameters, metrics or experiments, this may lead to
a cluttered view. You can limit the table to specific metrics, or parameters, or
hide the timestamp column with `--include-metrics`, `--include-params`, or
`--no-timestamp` options of the command, respectively.

```dvc
$ dvc exp show --no-timestamp --include-params conv_units --include-metrics acc
TK
```

## Persisting experiments

After selecting a experiments from the table, you can commit the hyperparameters
and other dependencies that produced this successful experiment to your Git
history.

`dvc exp apply` brings back all specific artifacts and parameters from the
experiment to the <abbr>workspace</abbr>.

```dvc
$ dvc exp apply
TK
```

We can see the changes in the repository and commit them to Git.

```dvc
$ git diff
$ git add .
$ git commit -m "Successful experiment"
```

It may also be desirable to commit a particular experiment to a Git branch
directly, without bringing to the workspace.

```dvc
$ dvc exp branch exp-
TK
```

## Go Further

There are many other features of `dvc exp`, like cleaning up the unused
experiments, sharing them without committing into Git or getting differences
between two experiments.

Please see the section on
[Experiment Management](/doc/user-guide/experiment-management) in the User's
Guide or `dvc exp` and subcommands in the Command Reference.
