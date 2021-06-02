---
title: 'Get Started: Checkpoints'
---

# Get Started: Checkpoints

During [experimentation](https://dvc.org/doc/start/experiments) it's important
to save the training history as the progress is not always linear. There are
points when _overfitting_ to the training set requires adjustment to the
hyperparameters and it's desirable to restart the experimentation from a good
point.

Along with experimentation features, DVC 2.0 introduced the _checkpoints_ that
may be used to store the training progress in special Git objects. Here we'll
cover how to add checkpoints to a deep learning project.

<details>

## 💡 Setting up the project

You can follow along with the steps here or you can clone the repo directly from
GitHub and play with it. To clone the repo, run the following commands.

```bash
$ git clone https://github.com/iterative/get-started-checkpoints -b basic
$ cd get-started-checkpoints
```

It is recommended you create a virtual environment for this example. You can do
that by running:

```bash
$ python3 -m venv .venv
```

Once your virtual environment is installed, you can start it up with one of the
following commands.

- On Mac/Linux: `source .venv/bin/activate`
- On Windows: `.\.venv\Scripts\activate`

Once you have your environment set up, install the dependencies by running:

```bash
$ pip install -r requirements.txt
```

This will download all of the packages you need to run the example. Now you have
everything you need to get started with experiments and checkpoints.

</details>

## Adding a checkpoint to the pipeline

We already have a pipeline that produces a model and evaluates this model with
the testing dataset. The testing dataset is also used at every epoch as the
verification data. We will add a checkpoint to the training stage by editing
`dvc.yaml`.

```yaml
train:
    ...
    outs:
    - models/fashion-mnist/model.h5
```

Checkpoints in DVC are defined by the _outputs._ When a stage produces an
output, e.g., _model_, we can specify a checkpoint on it, so that DVC stores
these outputs as special objects.

In order to specify `models/fashion-mnist/model.h5` as a checkpoint, we convert
the item into a YAML 1.2 dictionary key and specify `checkpoints: true` as an
element, like the following:

```yaml
train:
    ...
    outs:
    - models/fashion-mnist/model.h5:
        checkpoint: true
```

Now, when we run the pipeline:

```dvc
$ dvc exp run --set-param train.epochs=1
```

We get a new experiment consisting of a single epoch, and running again and
again stores each model file in separate experiments.

You can run the pipeline indefinitely:

```dvc
$ while true ; do dvc exp run -S train.epochs=1 ; done
```

Terminate it using `Ctrl-c` after a few epochs.

We can see various metrics of the pipeline by:

```dvc
$ dvc exp show --include-params=train.epoch \
               --include-metrics=categorical_accuracy,val_categorical_accuracy
```

### Updating the stage from the command line

We directly edited `dvc.yaml` because we already had a pipeline defined. In
practice, it may be better to specify the checkpoint when we first define the
stage. We use `-c/--checkpoint` option in `dvc stage add` to specify an output
as a checkpoint.

The previous `dvc.yaml` edit is identical with:

```dvc
$ dvc stage add --force                 \
    -n train                            \
    -d data/fashion-mnist/preprocessed/ \
    -d src/models.py                    \
    -d src/train.py                     \
    -p model.cnn.conv_kernel_size       \
    -p model.cnn.conv_units             \
    -p model.cnn.dense_units            \
    -p model.cnn.dropout                \
    -p model.mlp.activation             \
    -p model.mlp.units                  \
    -p model.name                       \
    -p model.optimizer                  \
    -p train.batch_size                 \
    -p train.epochs                     \
    -p train.seed                       \
    -p train.validation_split           \
    -c models/fashion-mnist/model.h5    \
    --plots-no-cache logs.csv
```

Note that we also supplied `--force` to update the stage already present in
`dvc.yaml`. When you first create the stage, you don't need to use `--force`.

## Selecting an experiment to use

As noted earlier and in the [experiments](https://dvc.org/doc/start/experiments)
tutorial, we use:

```dvc
$ dvc exp show --include-params train.epochs \
               --include-metrics loss,val_loss
```

The experiment where `loss` and `val_loss` start to diverge is usually
considered the point where the model begins to overfit the training data. Here
we see that `exp-TK` is the experiment this occurs.

You can also review the metrics produced by the training stage by:

```dvc
$ dvc exp diff exp-TK exp-TK
```

We would like to select the prior experiment to modify the hyperparameters:

```dvc
$ dvc exp apply exp-TK
```

Now we can commit the results to Git and push the experiment model to the DVC
remote.

```dvc
$ git add TK
$ git commit -m "Best experiment so far"
$ dvc push
```

## Reviewing plots

The training stage produces logs along with the model. These logs contain
various metrics and we can view them using `dvc plots`.

```dvc
$ dvc plots
```

The plots file is defined in `dvc.yaml` using `--plots-no-cache` option of
`dvc stage add`. `dvc exp run` copies the plots file along with the model to a
special Git object and we can see track the changes between experiments.

```dvc
$ dvc plots diff exp-TK exp-TK
```

## Caveats to use the `basic` checkpoints

In our code, the training stage loads a previous model and runs a training epoch
on it. Running the training again and again is similar to running the training
with multiple epochs. Had the training start from a fresh model in every
iteration, it would only run for the first epoch every time.

Also please we aware that the plots and metrics files are renewed in each
`dvc exp run`. This means, if you would like to get a trail of previous
experiments in each run, _appending_ to the metrics/plots/logs files is needed.
If the stage rewrites the logs files afresh every time, it only shows the logs
for that particular epoch.

## Other ways to use checkpoints

The example we used in this document is the most basic use of the checkpoints
features in DVC. There are other ways, for example using [`make_checkpoint`]()
API function for explicit checkpoints in each epoch _within the code_, or using
[Signal files] to ask DVC to record a checkpoint. We also have
[DVClive library]() that provides more convenient use of checkpoints.

## Going further

Now that you know how to use checkpoints in DVC, you'll be able to resume
training from different checkpoints to try out new hyperparameters or code.
There are many hyperparameters to try in
[get-started-checkpoints](https://github.com/iterative/get-started-checkpoints)
project. Please let us know how you improved the models using the
hyperparameters in [Discord](https://dvc.org/chat).
