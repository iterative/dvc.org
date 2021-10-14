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

In this section, we will explore the basic features of DVC experiment
management with `[get-started-experiments]` project. 

get-started-experiments: https://github.com/iterative/get-started-experiments

<details>
## Installing and Configuring the Project

These commands are run in the `[get-started-experiments]` project. You can run
the commands in this document after cloning the repository and installing the
requirements.

### Clone the project and create venv

Please clone the project and create a virtual environment. 

> We create a virtual environment to keep the libraries we use isolated from
> the rest of your system. This prevents version conflicts.

```dvc
$ git clone https://github.com/iterative/get-started-experiments -b source-code
$ cd get-started-experiments
$ virtualenv .venv
$ . .venv/bin/activate
$ python -m pip install -r requirements.txt
```

### Get the data set

The repository you cloned doesn't contain the dataset. In order to get
`fashion-mnist.tar.gz` from the `dataset-registry`, we use `dvc get` to
download the missing data files.  `dvc get` is similar to `wget` but works with
Git+DVC repositories to download binary files.

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

DVC experiments are run by specifying their commands, outputs, parameters and
dependencies. We add an experiment command by `dvc stage add`. 


```dvc
$ dvc stage add -n train \
                -p model.conv_units \
                -p train.conv_units \
                -d data/images \
                -m metrics.json \
                python3 train.py 
```

The command tells DVC to create an experiment named `train`, with two
parameters and a data dependency to `data/images`. The command produces
`metrics.json` as a special type of output. 

DVC creates `dvc.yaml` file and modifies `.gitignore` for Git to ignore certain
artifacts. 

```dvc
$ git add dvc.yaml .gitignore
$ git commit -m "added data and the experiment" 
```

</details>

## Running experiments 

### Running with default parameters

The purpose of `dvc exp` commands is to run the pipeline for ephemeral
experiments. By _ephemeral_ we mean the experiments can be run without
committing parameter and dependency changes to Git. Instead the artifacts
produced for each experiment is tracked by DVC and persisted on demand. 

Running the pipeline with default values requires only the command:

``` dvc
$ dvc exp run
TK
```

It runs the pipeline starting from the basic dependencies and produces
`metrics.json` file for the default state. 

<details>

### If you used `dvc repro` before

Earlier versions of DVC uses `dvc repro` to run the pipeline. If you already
have a DVC project, you may be used to `dvc repro`.

In DVC 2.0 `dvc exp run` supersedes `dvc repro`. Both of these commands run the pipeline.

We use `dvc repro` to run the pipeline as found in the <abbr>workspace</abbr>.
All the parameters and dependencies are retrieved from the current workspace.
It doesn't use any special objects to track the experiments.
	 
When you have large number of experiments that you don't want to commit into
Git, it's better to use `dvc exp run`. It allows to change the parameters
quickly, can track the history of artifacts and has facilities to compare
these experiments easily.

`dvc repro` is still available to run the pipeline that don't need these extra
features. 
 
</details>

### Running by setting parameters

Now let's do some more experimentation. 

DVC allows to update the parameters defined in the pipeline without modifying
the files manually. We use this feature to set the convolutional units in
`train.py`.

```dvc
$ dvc exp run --set-param conv_units=24 
TK
```

Note that the pipeline didn't run the earliest stage. Only the stages that
depend on the updated parameter and subsequent stages are run. 

When you run `dvc exp run` with `--set-param`, it updates the parameter file.
We can see the effect of it by looking at the diff. 

```dvc
$ git diff params.yaml
TK
```

### Run multiple experiments in parallel

Instead of running the experiments one-by-one, we can define them first to run
them in a batch. This is especially handy when you have long running
experiments. 

We add experiments to the queue using the `--queue` option of `dvc exp run`. We
also use `-S` (`--set-param`) to set a value for the parameter. 

``` dvc
$ dvc exp run --queue -S conv_units=32
$ dvc exp run --queue -S conv_units=64
$ dvc exp run --queue -S conv_units=128
$ dvc exp run --queue -S conv_units=256
```

Next, run all (`--run-all`) queued experiments in parallel (using `--jobs`):

```dvc
$ dvc exp run --run-all --jobs 2
TK
```

## Comparing experiments

The pipeline is run several times with different parameters. To compare all of
these experiments, we use `dvc exp show`. This command presents the parameters
and metrics produced in experiments in a nicely formatted table.

```dvc
$ dvc exp show
```
TK

By default it shows all the parameters and the metrics along with the
timestamp. If you have large number of parameters, metrics or experiments, this
may lead to a cluttered view. You can limit the table to specific metrics, or
parameters, or hide the timestamp column with `--include-metrics`,
`--include-params`, or `--no-timestamp` options of the command, respectively.

```dvc
$ dvc exp show --no-timestamp --include-params conv_units --include-metrics acc
TK
```

## Persisting experiments

After selecting a experiments from the table, you can commit the
hyperparameters and other dependencies that produced this successful experiment
to your Git history. 

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

## Go Further

You can continue to experiment with [the
project](https://github.com/iterative/get-started-experiments).  Please see the
`README.md` file of the project for these. Don't forget to [notify
us](https://dvc.org/chat) if you happen to find good parameters.

There are many other features of `dvc exp`, like cleaning up the unused
experiments, sharing them without committing into Git or getting differences
between two experiments.

Please see the section on [Experiment
Management](/doc/user-guide/experiment-management) in the User's Guide or `dvc
exp` and subcommands in the Command Reference. 
