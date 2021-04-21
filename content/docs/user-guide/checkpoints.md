# Checkpoints

ML checkpoints are an important part of deep learning because ML engineers like
to save the model files at certain points during a training process.

With DVC experiments and checkpoints, you can:

- Implement the best practice in deep learning to save your model weights as
  checkpoints.
- Add reproducibility to the messy deep learning process.
- Track all code and data changes corresponded to the checkpoints.
- Return a report when metrics start diverging.

You can also automate the process of tracking every training epoch, return to
any previous checkpoint, see when metrics converge or when the learning rate
needs to be adjusted, and even recover model weights, parameters, and code. When
you adjust parameters and code, DVC tracks those changes for you without adding
a lot of commits to your workspace.

The way checkpoints are implemented by DVC utilizes _ephemeral_ experiment
commits and experiment branches within DVC. They are created using the metadata
from experiments and are tracked with the `exps` custom Git reference.

You can add experiments to your Git history by committing the experiment you
want to track, which you'll see later in this tutorial.

## Setting up the project

This tutorial is going to cover how to implement checkpoints in a ML project
using DVC. We're going to train a model to identify handwritten digits based on
the MNIST dataset.

You can follow along with the steps here or you can clone the repo directly from
GitHub and play with it. To clone the repo, run the following commands.

```bash
git clone https://github.com/iterative/dvc-checkpoints-mnist
cd dvc-checkpoints-mnist
```

It is highly recommended you create a virtual environment for this example. You
can do that by running: `python3 -m venv .venv`.

Once your virtual environment is installed, you can start it up with one of the
following commands.

- On Mac/Linux: `source .venv/bin/activate`
- On Windows: `.\.venv\Scripts\activate`

Once you have your environment set up, you can install the dependencies by
running: `pip install -r requirements.txt`. This will download all of the
packages you need to run the example. Now you have everything you need to get
started with experiments and checkpoints.

## Enabling DVC pipelines for checkpoint experiments

In the `dvc.yaml` file, you'll see `checkpoint: true` under the model file in
the `outs` level. This enables checkpoints at the pipeline level. It should look
like this.

```yaml
stages:
  train:
    cmd: python train.py
    deps:
      - train.py
    outs:
      - model.pt:
          checkpoint: true
    live:
      dvclive:
        summary: true
        html: true
```

You can also enable checkpoints at the pipeline level by running the command:
`dvc stage add -n name_of_stage --checkpoints model.pt`. This will create a new
stage with checkpoints enabled, but does not update existing stages.

If you want to update an existing stage, run the command:
`dvc stage add -f --checkpoint`. This will force an overwrite of the current
stage and update it with checkpoints enabled.

Now that you know how to enable checkpoints in a DVC pipeline, let's move on to
setting up checkpoints in your code.

## Registering checkpoints in your code

Take a look at the _train.py_ file and you'll see how we train a convolutional
neural network to classify handwritten digits. The main area of this code most
relevant to checkpoints is when we iterate over the training epochs.

This is where DVC will be able to track our metrics over time and where we will
add our checkpoints to give us the points in time with our model that we can
switch between.

To run this code, run the `dvc exp run` command and it will start training the
model. In the terminal, you'll see the MNIST data being fetched from a remote
source and then a _dvc.lock_ file will be generated and you'll see the first
checkpoint being created.

```dvc
Downloading https://ossci-datasets.s3.amazonaws.com/mnist/train-images-idx3-ubyte.gz
Downloading https://ossci-datasets.s3.amazonaws.com/mnist/train-images-idx3-ubyte.gz to data/MNIST/raw/train-images-idx3-ubyte.gz
9913344it [00:00, 14169693.99it/s]
Extracting data/MNIST/raw/train-images-idx3-ubyte.gz to data/MNIST/raw

...

Done!
Generating lock file 'dvc.lock'
Updating lock file 'dvc.lock'
Checkpoint experiment iteration '8747b08'.
```

Since this is the first run of this project with checkpoints enabled, a new
checkpoint file will be created. Each time an epoch completes, a new checkpoint
is added to that file. In the code, you'll find the `dvclive.next_step()` method
in the training epochs. This line is how checkpoints are created.

To take advantage of checkpoints without as much overhead as the
`dvclive.next_step()` method creates, we can replace it with the
`make_checkpoint()` method.

First, import the method into the code.

`from dvc.api import make_checkpoint`

We're going to change a few things in the training epoch part of the code. We'll
remove the following lines of code:

```python
metrics = evaluate(model, x_test, y_test)
for metric, value in metrics.items():
    dvclive.log(metric, value)
dvclive.next_step()
```

Then replace them with this code:

```python
evaluate(model, x_test, y_test)
make_checkpoint()
```

We've updated the way we record our metrics and now we're using the
`make_checkpoint()` method to generate our checkpoints throughout training.
There's also a small update we need to make to the `evaluate` method so that we
are saving our data correctly.

Instead of returning the metrics for `dvclive` to work with, we're going to save
them to a file. In the `evaluate` method, replace this code:

```python
return metrics
```

With the following code:

```python
with open("metrics.json", "w") as f:
    json.dump(metrics, f)
```

_If you don't define a number of epochs to run, checkpoints will be created
indefinitely until you terminate the code in the terminal. `Ctrl + C` will end
the process._

_If you use `dvclive.next_step()`, you don't need to use `make_checkpoints()`.
One or the other will give you checkpoints._

### Adding checkpoints conditionally

You do have the option of adding checkpoints conditionally. You might be running
thousands of training epochs and you only want to save after a number of epochs
have run. Let's say you want to save every 100th checkpoint.

Inside of the `main` method, where we have defined the training epochs, let's
add this condition.

```python
# Evaluate and checkpoint.
if i % 100 == 0:
    evaluate(model, x_test, y_test)
    make_checkpoint()
```

Now we are conditionally saving checkpoints after a set number of runs have been
completed. For the sake of this tutorial, we're going to remove that condition
for everything going forward. We just wanted to make sure you know that you are
able to do this and you don't have to save every checkpoint.

## Running experiments

With checkpoints enabled and working in our code, let's run the experiment
again. You can run an experiment with the `dvc exp run` command. Since we've
already run this code before, it will pick up training from the previous
checkpoint and continue from there.

You'll see output similar to this in your terminal while the training process is
going on.

```dvc
Checkpoint experiment iteration '0ddae2a'.
Updating lock file 'dvc.lock'
Checkpoint experiment iteration '71d4d82'.
Updating lock file 'dvc.lock'
Checkpoint experiment iteration 'f59dca5'.
Updating lock file 'dvc.lock'
Checkpoint experiment iteration '08d7ab2'.
Updating lock file 'dvc.lock'
Checkpoint experiment iteration 'bcd3a62'.
Updating lock file 'dvc.lock'
Checkpoint experiment iteration '3cf9691'.
Updating lock file 'dvc.lock'
```

Once your epochs are finished, it's time to take a look at the metrics we're
working with.

## Viewing checkpoints

You can see a table of your experiments and checkpoints in the terminal by
running `dvc exp show`. The accuracy on our current checkpoints will be high
because we've already run them twice and training always picks up from the last
checkpoint.

```dvc
┏━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━┓
┃ Experiment      ┃ Created  ┃    acc ┃
┡━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━┩
│ workspace       │ -        │  0.984 │
│ live            │ 08:01 AM │      - │
│ │ ╓ exp-84f52   │ 10:48 AM │  0.984 │
│ │ ╟ d9c5f03     │ 10:48 AM │ 0.9851 │
│ │ ╟ a9925e8     │ 10:47 AM │  0.984 │
│ │ ╟ 3cf9691     │ 10:47 AM │  0.983 │
│ │ ╟ bcd3a62     │ 10:47 AM │ 0.9835 │
│ │ ╟ 08d7ab2     │ 10:47 AM │ 0.9837 │
│ │ ╟ f59dca5     │ 10:47 AM │ 0.9791 │
│ │ ╟ 71d4d82     │ 10:46 AM │ 0.9804 │
│ │ ╟ 0ddae2a     │ 10:46 AM │ 0.9808 │
│ ├─╨ 1e521e3     │ 10:46 AM │ 0.9752 │
└─────────────────┴──────────┴────────┘
```

## Resetting checkpoints

Usually when you start training a model, you won't begin with accuracy this
high. There might be a time when you want to remove all of the existing
checkpoints to start the training from scratch. You can reset your checkpoints
with the following command: `dvc exp run --reset`.

This resets all of the existing checkpoints and re-runs the code to generate a
new set of checkpoints under a new experiment branch.

```dvc
┏━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━┓
┃ Experiment      ┃ Created  ┃    acc ┃
┡━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━┩
│ workspace       │ -        │ 0.9771 │
│ live            │ 08:01 AM │      - │
│ │ ╓ exp-b5c32   │ 11:48 AM │ 0.9771 │
│ │ ╟ 8bade3a     │ 11:48 AM │  0.979 │
│ │ ╟ 80c3e33     │ 11:48 AM │  0.974 │
│ │ ╟ 9f1781c     │ 11:47 AM │ 0.9708 │
│ │ ╟ 8bd613a     │ 11:47 AM │ 0.9703 │
│ │ ╟ afc8805     │ 11:47 AM │ 0.9641 │
│ │ ╟ 6750eb6     │ 11:47 AM │ 0.9521 │
│ │ ╟ ed3bd51     │ 11:47 AM │ 0.9271 │
│ │ ╟ 3aa1b03     │ 11:46 AM │ 0.9157 │
│ ├─╨ dcaeee6     │ 11:46 AM │ 0.8572 │
│ │ ╓ exp-84f52   │ 10:48 AM │  0.984 │
│ │ ╟ d9c5f03     │ 10:48 AM │ 0.9851 │
│ │ ╟ a9925e8     │ 10:47 AM │  0.984 │
│ │ ╟ 3cf9691     │ 10:47 AM │  0.983 │
│ │ ╟ bcd3a62     │ 10:47 AM │ 0.9835 │
│ │ ╟ 08d7ab2     │ 10:47 AM │ 0.9837 │
│ │ ╟ f59dca5     │ 10:47 AM │ 0.9791 │
│ │ ╟ 71d4d82     │ 10:46 AM │ 0.9804 │
│ │ ╟ 0ddae2a     │ 10:46 AM │ 0.9808 │
│ ├─╨ 1e521e3     │ 10:46 AM │ 0.9752 │
└─────────────────┴──────────┴────────┘
```

We can also remove all of the experiments we don't promote to our Git workspace
with the following command: `dvc exp gc --workspace --force`.

## Starting from an existing checkpoint

Since you have all of these different checkpoints, you might want to resume
training from a particular one. For example, maybe your accuracy started
decreasing at a certain checkpoint and you want to make some changes to fix
that. You can start training from any existing checkpoint with the following
command.

If you want to start a new experiment based on an existing checkpoint, you can
run `dvc exp run --rev 0fff9ff` where _0fff9ff_ is the id of the checkpoint you
want to reference.

You'll be able to see where the experiment starts from the existing checkpoint
with the `dvc exp show` command. You should seem something similar to this in
your terminal.

```dvc
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━┓
┃ Experiment            ┃ Created      ┃    acc ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━┩
│ workspace             │ -            │  0.984 │
│ make_checkpoint       │ Apr 20, 2021 │      - │
│ │ ╓ exp-bf633         │ 08:47 AM     │  0.984 │
│ │ ╟ a012471           │ 08:47 AM     │ 0.9851 │
│ │ ╟ f8f88de           │ 08:47 AM     │  0.984 │
│ │ ╟ bf99e9c           │ 08:47 AM     │  0.983 │
│ │ ╟ 920c3bb           │ 08:47 AM     │ 0.9835 │
│ │ ╟ 8461894           │ 08:47 AM     │ 0.9837 │
│ │ ╟ 02059db           │ 08:46 AM     │ 0.9791 │
│ │ ╟ b802041           │ 08:46 AM     │ 0.9804 │
│ │ ╟ 9243729           │ 08:46 AM     │ 0.9808 │
│ │ ╟ 64f1b50 (0fff9ff) │ 08:46 AM     │ 0.9752 │
│ │ ╓ exp-59edb         │ Apr 20, 2021 │ 0.9771 │
│ │ ╟ 9f5b812           │ Apr 20, 2021 │  0.979 │
│ │ ╟ 54a30b8           │ Apr 20, 2021 │  0.974 │
│ │ ╟ 97126cc           │ Apr 20, 2021 │ 0.9708 │
```

The existing checkpoint is referenced at the beginning of the new experiment.
The new experiment is referred to as a modified experiment because it's taking
existing data and using it as the starting point.

### Metrics diff

When you've run all the experiments you want to and you want to compare metrics
between checkpoints, you can run the command: `dvc metrics diff`. You'll see
something similart to this in your terminal.

```dvc
Path          Metric    Old    New     Change
metrics.json  acc       —      0.9771  —
```

### Looking at plots

**Add stuff for plots here**

## Adding checkpoints to your Git workspace

When the final epoch has run, you'll see a few commands in the terminal that
will allow you to add these changes to Git.

```dvc
To track the changes with git, run:

        git add dvclive.json dvc.yaml .gitignore train.py dvc.lock

Reproduced experiment(s): exp-58160
Experiment results have been applied to your workspace.

To promote an experiment to a Git branch run:

        dvc exp branch <exp>
```

You could also run the following command to promote your experiments to the Git
workspace.

```bash
dvc exp apply exp-58160
git add .
git commit -m 'optimize model'
```
