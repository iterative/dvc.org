---
title: 'Get Started: Experiments'
---

# Get Started: Experiments

⚠️ This feature is only available in DVC 2.0 ⚠️

<abbr>Experiments</abbr> proliferate quickly in ML projects where there are many
parameters to tune or other permutations of the code. We can organize such
projects and keep only what we ultimately need with `dvc experiments`. DVC can
track experiments for you so there's no need to commit each one to Git. This way
your repo doesn't become polluted with all of them. You can discard experiments
once they're no longer needed.

> 📖 See [Experiment Management](/doc/user-guide/experiment-management) for more
> information on DVC's approach.

## Running experiments

In the previous page, we learned how to tune
[ML pipelines](/doc/start/data-pipelines) and compare the changes. In this
section we'll use a [Get Started to Experiments project][gsexp] to illustrate
experimentation features in DVC 2.0

[gsexp]: https://github.com/iterative/get-started-experiments

<details>

### 🆕 Click here for the instructions to install the project

Please clone and create a virtual environment:

```console
git clone https://github.com/iterative/get-started-experiments
cd get-started-experiments
python -m venv .venv
. .venv/bin/activate
python -m pip install -r requirements.txt
```

Then you can `dvc pull` to get the dataset and run the commands in this
document. For detailed information on parameters and the project structure
please refer to the [project repository][gsexp].

</details>

`dvc exp run` makes it easy to change <abbr>hyperparameters</abbr> and run a new
experiment. We'll use it to search for parameters to increase the classification
performance of our model using [Fashion-MNIST][fmnist] dataset.

[fmnist]: https://github.com/zalandoresearch/fashion-mnist

> These commands are run in [`get-started-experiments`][gsexp] project. You can
> run these commands after cloning the repository and install the requirements.

In order to run a baseline experiment with the default parameters defined in
`params.yaml`:

```dvc
dvc exp run
```

![dvc exp run result screenshot](/img/doc/start/exp-ss-90252.png)

This resembles `dvc repro` without any command-line arguments. However, when
using `dvc repro` we need to update `params.yaml` manually, run the pipeline, if
the results are worth it commit them to DVC and Git. `dvc exp` automates this
process through its subcommands.

Let's see some metrics produced by this baseline experiment:

```dvc
$ dvc exp show --include-metrics categorical_accuracy \
               --include-params  model.name,model.cnn.conv_units
```

![dvc exp show result screenshot](/img/doc/start/exp-ss-63714.png)

Note that the experiment results are identical with the values checked-out from
Git. By default each experiment is given a name automatically. We can set the
name by the `--name/-n` argument.

Let's change the number of units in CNN and make another experiment:

```dvc
$ dvc exp run -n cnn-32 --set-param model.cnn.conv_units=32
'data/fashion-mnist/raw.dvc' didn't change, skipping
Stage 'prepare' didn't change, skipping
Stage 'preprocess' didn't change, skipping
Running stage 'train':
> python3 src/train.py
...
```

`--set-param/-S` argument of `dvc exp run` is used to set parameters in
`params.yaml`. DVC runs _only_ the stages that depend on these parameter values.
Parameter dependencies are defined via `dvc stage add` command and stored in
`dvc.yaml`.

<details>

### 💡 Expand to see what happens under the hood.

`dvc exp run` is similar to `dvc repro` but with some added conveniences for
running experiments. The `--set-param` (or `-S`) flag sets the values for
<abbr>parameters<abbr> as a shortcut for editing `params.yaml`.

Check that the `model.cnn.units` value has been updated in `params.yaml`:

```git
 model:
   cnn:
-    conv_units: 16
+    conv_units: 32
```

Any edits to <abbr>dependencies</abbr> (parameters or source code) will be
reflected in the experiment run.

</details>

`dvc exp diff` compares experiments:

```dvc
$ dvc exp diff
Path          Metric                Value    Change
metrics.json  PR                    0.96257  0.0024179
metrics.json  ROC                   0.99344  4.2617e-05
metrics.json  categorical_accuracy  0.9175   0.0074
metrics.json  false_negatives       927      -58
metrics.json  false_positives       710      -51
metrics.json  loss                  0.23387  -0.010393
metrics.json  precision             0.92743  0.0052689
metrics.json  recall                0.9073   0.0058
metrics.json  true_negatives        89290    51
metrics.json  true_positives        9073     58

Path         Param                 Value    Change
params.yaml  model.cnn.conv_units  32       16
```

## Queueing experiments

Instead of running the experiments one-by-one, we can define them without
executing. This is especially handy when you have long running experiments to
try.

We add experiments to the queue using `--queue` option of `dvc exp run`. Here,
we also set the names of experiments to observe the results clearly:

```dvc
$ dvc exp run --queue -n cnn-48 -S model.cnn.conv_units=48
$ dvc exp run --queue -n cnn-64 -S model.cnn.conv_units=64
$ dvc exp run --queue -n cnn-96 -S model.cnn.conv_units=96
$ dvc exp run --queue -n cnn-128 -S model.cnn.conv_units=128
```

Next, run all (`--run-all`) queued experiments in parallel (using `--jobs`):

```dvc
$ dvc exp run --run-all --jobs 2
...
Reproduced experiment(s): cnn-128, cnn-96, cnn-64, cnn-48
To apply the results of an experiment to your workspace run:

	dvc exp apply <exp>

To promote an experiment to a Git branch run:

	dvc exp branch <exp>
```

The command will run all queued experiments in a random order.

## Comparing many experiments

To compare all of these experiments, we need more than `diff`. `dvc exp show`
compares any number of experiments in one table:

```dvc
$ dvc exp show --no-timestamp \
               --include-params model.cnn.conv_units \
               --include-metrics categorical_accuracy
```

![dvc exp show screenshot](/img/doc/start/exp-ss-36794.png)

We can see that `cnn-64` performed best in `categorical_accuracy`.

> See `dvc exp show --help` for more info on its options.

## Persisting experiments

The metrics to optimize are usually domain or problem dependent. In these
experiments we are trying to optimize for `categorical_accuracy`. Let's keep
experiment with the highest `categorical_accuracy` score and ignore the rest.

`dvc exp apply` rolls back the <abbr>workspace<abbr> to the specified
experiment:

```dvc
$ dvc exp apply cnn-64
Changes for experiment 'cnn-64' have been applied to your workspace.
```

<details>

### 💡 Expand to see what happens under the hood.

`dvc exp apply` is similar to `dvc checkout`, but works with experiments
instead. DVC tracks everything in the pipeline for each experiment (parameters,
metrics, dependencies, and outputs), retrieving things later as needed.

Check that `metrics.json` reflects all the metrics produced by the experiment
now.

```json
{
  "loss": 0.2329215109348297,
  "categorical_accuracy": 0.9210000038146973,
  "precision": 0.9294813275337219,
  "recall": 0.9121000170707703,
  "ROC": 0.9929496645927429,
  "PR": 0.9643465280532837,
  "true_positives": 9121.0,
  "true_negatives": 89308.0,
  "false_positives": 692.0,
  "false_negatives": 879.0
}
```

</details>

Once an experiment has been applied to the workspace, it is no different from
reproducing the result without `dvc exp run`. Let's make it persistent in our
regular pipeline by committing it in our Git branch:

```dvc
$ git add dvc.lock params.yaml logs.csv metrics.json
$ git commit -m "Preserve the experiment with 64 Conv Units"

[main 84d1c8f] Preserve the experiment with 64 Conv Units
 4 files changed, 21 insertions(+), 21 deletions(-)
 rewrite logs.csv (91%)
```

## Sharing experiments

After committing the best experiments to our Git branch, we can
[store and share](/doc/start/data-and-model-versioning#storing-and-sharing) them
remotely like any other iteration of the pipeline.

```dvc
dvc push
git push
```

<details>

### 💡 Important information on storing experiments remotely.

The commands in this section require both a `dvc remote default` and a
[Git remote](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes). A
DVC remote stores the experiment data, and a Git remote stores the code,
parameters, and other metadata associated with the experiment. DVC supports
various types of remote storage (local file system, SSH, Amazon S3, Google Cloud
Storage, HTTP, HDFS, etc.). The Git remote is often a central Git server
(GitHub, GitLab, BitBucket, etc.).

</details>

`dvc exp push` enables storing and sharing any experiment remotely.

```dvc
$ dvc exp push gitremote cnn-64
Pushed experiment 'cnn-64' to Git remote 'gitremote'.
```

`dvc exp list` shows all experiments that have been saved.

```dvc
$ dvc exp list gitremote --all
experiments:
        cnn-64
```

`dvc exp pull` retrieves the experiment from a Git remote.

```dvc
$ dvc exp pull gitremote cnn-64
Pulled experiment 'cnn-64' from Git remote 'gitremote'.
```

> All these commands take a Git remote as an argument. A `dvc remote default` is
> also required to share the experiment data.

## Cleaning up

Let's take another look at the experiments table:

```dvc
$ dvc exp show --no-timestamp \
               --include-params model.cnn.conv_units \
               --include-metrics categorical_accuracy
```

![dvc exp show screenshot](/img/doc/start/exp-ss-35552.png)

Where did all the experiments go? By default, `dvc exp show` only shows
experiments since the last commit, but don't worry. The experiments remain
<abbr>cached</abbr> and can be shown or applied. For example, use `-n` to show
experiments from the previous _n_ commits:

```dvc
$ dvc exp show -n 2 --no-timestamp \
               --include-params model.cnn.conv_units \
               --include-metrics categorical_accuracy
```

![dvc exp show screenshot](/img/doc/start/exp-ss-68591.png)

Eventually, old experiments may clutter the experiments table.

`dvc exp gc` removes all references to old experiments:

```dvc
$ dvc exp gc --workspace
...
Removed 5 experiments. To remove unused cache files use 'dvc gc'.
$ dvc exp show -n 2 --no-timestamp \
               --include-params model.cnn.conv_units \
               --include-metrics categorical_accuracy
```

![dvc exp show screenshot](/img/doc/start/exp-ss-32408.png)

> `dvc exp gc` only removes references to the experiments, not the cached
> objects associated to them. To clean up the cache, use `dvc gc`.

## Going Further

You can continue to experiment with [the project][gsexp], there are many
parameters available to change, e.g., `noise` or `units` in Dense layer of the
network.
