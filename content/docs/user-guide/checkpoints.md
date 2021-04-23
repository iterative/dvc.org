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

[The way checkpoints are implemented by DVC](/blog/experiment-refs) utilizes
_ephemeral_ experiment commits and experiment branches within DVC. They are
created using the metadata from experiments and are tracked with the `exps`
custom Git reference.

You can add experiments to your Git history by committing the experiment you
want to track, which you'll see later in this tutorial.

## Setting up the project

This tutorial is going to cover how to implement checkpoints in a ML project
using DVC. We're going to train a model to identify handwritten digits based on
the MNIST dataset.

You can follow along with the steps here or you can clone the repo directly from
GitHub and play with it. To clone the repo, run the following commands.

```bash
git clone https://github.com/iterative/checkpoints-tutorial
cd checkpoints-tutorial
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

In the `dvc.yaml` file, we need to add a few things to get our checkpoints and
metrics tracking setup. First we'll add metrics tracking to our experiments. At
the end of the file, add the following lines.

```yaml
live:
  dvclive:
    summary: true
    html: true
```

Your `dvc.yaml` should look similar to this now.

```yaml
---
plots:
  - predictions.json:
      cache: false
      template: confusion
      x: actual
      y: predicted
live:
  dvclive:
    summary: true
    html: true
```

Now we'll set up checkpoints. Below the `model.pt`, add the following code:
`checkpoint: true`. This enables checkpoints at the pipeline level. Your
`dvc.yaml` should look like this now.

```yaml
stages:
  download:
    cmd: python download.py
    deps:
      - download.py
    outs:
      - data/MNIST
  train:
    cmd: python train.py
    deps:
      - data/MNIST
      - train.py
    params:
      - seed
      - lr
      - weight_decay
    outs:
      - model.pt:
          checkpoint: true
    plots:
      - predictions.json:
          cache: false
          template: confusion
          x: actual
          y: predicted
    live:
      dvclive:
        summary: true
        html: true
```

The checkpoints need to be enabled in DVC at the pipeline level. The
`--checkpoint` option of the `dvc stage add` command defines the checkpoint file
or directory. This will create a new stage with checkpoints enabled, but does
not update existing stages.

If you want to update an existing stage, adding the `-f` option to the
`dvc stage add --checkpoint` command will force an overwrite of the current
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
model. In the terminal, you'll see the training code being executed and you'll
see the metrics being recorded.

```dvc
Running stage 'train':
> python train.py
Epoch 1: loss=0.4989388585090637
Epoch 1: acc=0.8481
Epoch 2: loss=0.3318292796611786
Epoch 2: acc=0.9037
Epoch 3: loss=0.21992072463035583
```

Now we need to enable checkpoints at the pipeline level. We are interested in
tracking the metrics along with each checkpoint, so we'll need to add a few
lines of code.

In the `train.py` file, update the following lines of code in the `main` method
inside of the training epoch loop.

```python
for k, v in metrics.items():
    print('Epoch %s: %s=%s'%(i, k, v))
    dvclive.log(k, v)
dvclive.next_step()
```

By adding the two `dvclive` methods to our training epoch loop, we are enabling
checkpoints in our code and recording the training metrics at each of those
checkpoints.

Having the number of training epochs defined will prevent your training from
running indefinitely. You can also hit `Ctrl + C` to stop creating new
checkpoints if the number of epochs are not defined.

### Manually adding checkpoints

You also have the option to implement checkpoints in code with the
`make_checkpoints()` method if you don't want to use `dvclive` in your code.
This manually adds checkpoints for you, but it won't generate metrics for you.

If you use `dvclive.next_step()`, you don't need to use `make_checkpoints()`.
One or the other will give you checkpoints.

_If you don't define a number of epochs to run, checkpoints will be created
indefinitely until you terminate the code in the terminal. `Ctrl + C` will end
the process._

### Adding checkpoints conditionally

You do have the option of adding checkpoints conditionally. You might be running
thousands of training epochs and you only want to save after a number of epochs
have run. Let's say you want to save every 100th checkpoint.

Inside of the `main` method, where we have defined the training epochs, let's
add this condition.

```python
# Evaluate and checkpoint.
if i % 100 == 0:
    metrics = evaluate(model, x_test, y_test)
    for k, v in metrics.items():
        dvclive.log(k, v)
    dvclive.next_step()
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
┏━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━┳━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━┳━━━━━━━┳━━━━━━━━━━━━━━┓
┃ Experiment    ┃ Created      ┃ step ┃     loss ┃    acc ┃ seed   ┃ lr    ┃ weight_decay ┃
┡━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━╇━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━╇━━━━━━━╇━━━━━━━━━━━━━━┩
│ workspace     │ -            │    9 │ 0.066135 │ 0.9792 │ 473987 │ 0.001 │ 0            │
│ full_pipeline │ Apr 20, 2021 │    - │        - │      - │ 473987 │ 0.001 │ 0            │
│ │ ╓ exp-263da │ 12:06 PM     │    9 │ 0.066135 │ 0.9792 │ 473987 │ 0.001 │ 0            │
│ │ ╟ 0391730   │ 12:05 PM     │    8 │ 0.066629 │ 0.9783 │ 473987 │ 0.001 │ 0            │
│ │ ╟ 92042bd   │ 12:05 PM     │    7 │ 0.082436 │ 0.9747 │ 473987 │ 0.001 │ 0            │
│ │ ╟ a557ace   │ 12:05 PM     │    6 │  0.08161 │ 0.9749 │ 473987 │ 0.001 │ 0            │
│ │ ╟ 114d93f   │ 12:05 PM     │    5 │ 0.088654 │ 0.9716 │ 473987 │ 0.001 │ 0            │
│ │ ╟ 3289b4b   │ 12:05 PM     │    4 │  0.13659 │ 0.9574 │ 473987 │ 0.001 │ 0            │
│ │ ╟ e32a023   │ 12:04 PM     │    3 │  0.16031 │ 0.9507 │ 473987 │ 0.001 │ 0            │
│ │ ╟ cc52edc   │ 12:04 PM     │    2 │  0.21992 │ 0.9345 │ 473987 │ 0.001 │ 0            │
│ │ ╟ 6d2e1d9   │ 12:04 PM     │    1 │  0.33183 │ 0.9037 │ 473987 │ 0.001 │ 0            │
│ ├─╨ d121d33   │ 12:04 PM     │    0 │  0.49894 │ 0.8481 │ 473987 │ 0.001 │ 0            │
└───────────────┴──────────────┴──────┴──────────┴────────┴────────┴───────┴──────────────┘
```

## Starting from an existing checkpoint

Since you have all of these different checkpoints, you might want to resume
training from a particular one. For example, maybe your accuracy started
decreasing at a certain checkpoint and you want to make some changes to fix
that. You can start training from any existing checkpoint with the following
command.

If you want to start a new experiment based on an existing checkpoint, you can
run `dvc exp apply 574bdc3 && dvc exp run` where _574bdc3_ is the id of the
checkpoint you want to reference.

You'll be able to see where the experiment starts from the existing checkpoint
with the `dvc exp show` command. You should seem something similar to this in
your terminal.

```dvc
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━┳━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━┳━━━━━━━┳━━━━━━━━━━━━━━┓
┃ Experiment            ┃ Created      ┃ step ┃     loss ┃    acc ┃ seed   ┃ lr    ┃ weight_decay ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━╇━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━╇━━━━━━━╇━━━━━━━━━━━━━━┩
│ workspace             │ -            │   19 │ 0.048277 │ 0.9854 │ 473987 │ 0.001 │ 0            │
│ full_pipeline         │ Apr 20, 2021 │    - │        - │      - │ 473987 │ 0.001 │ 0            │
│ │ ╓ exp-3c7a8         │ 01:41 PM     │   19 │ 0.048277 │ 0.9854 │ 473987 │ 0.001 │ 0            │
│ │ ╟ a4d64fc           │ 01:41 PM     │   18 │ 0.049162 │ 0.9836 │ 473987 │ 0.001 │ 0            │
│ │ ╟ 4067622           │ 01:41 PM     │   17 │ 0.050389 │ 0.9823 │ 473987 │ 0.001 │ 0            │
│ │ ╟ 05a0883           │ 01:41 PM     │   16 │ 0.065079 │ 0.9808 │ 473987 │ 0.001 │ 0            │
│ │ ╟ c23a6e0           │ 01:41 PM     │   15 │  0.05095 │ 0.9831 │ 473987 │ 0.001 │ 0            │
│ │ ╟ a8ed9aa           │ 01:40 PM     │   14 │ 0.056475 │ 0.9819 │ 473987 │ 0.001 │ 0            │
│ │ ╟ 0b5c7f0           │ 01:40 PM     │   13 │ 0.054636 │ 0.9817 │ 473987 │ 0.001 │ 0            │
│ │ ╟ 6c4523d           │ 01:40 PM     │   12 │ 0.060063 │  0.982 │ 473987 │ 0.001 │ 0            │
│ │ ╟ 54bca46           │ 01:40 PM     │   11 │  0.07912 │ 0.9747 │ 473987 │ 0.001 │ 0            │
│ │ ╟ c60fe61 (574bdc3) │ 01:40 PM     │   10 │ 0.082944 │ 0.9728 │ 473987 │ 0.001 │ 0            │
│ │ ╓ exp-e81d6         │ 01:30 PM     │    9 │ 0.066135 │ 0.9792 │ 473987 │ 0.001 │ 0            │
│ │ ╟ 34b1d6f           │ 01:30 PM     │    8 │ 0.066629 │ 0.9783 │ 473987 │ 0.001 │ 0            │
│ │ ╟ c048966           │ 01:30 PM     │    7 │ 0.082436 │ 0.9747 │ 473987 │ 0.001 │ 0            │
│ │ ╟ 2910f35           │ 01:30 PM     │    6 │  0.08161 │ 0.9749 │ 473987 │ 0.001 │ 0            │
│ │ ╟ 255d3aa           │ 01:30 PM     │    5 │ 0.088654 │ 0.9716 │ 473987 │ 0.001 │ 0            │
```

The existing checkpoint is referenced at the beginning of the new experiment.
The new experiment is referred to as a modified experiment because it's taking
existing data and using it as the starting point.

### Metrics diff

When you've run all the experiments you want to and you are ready to compare
metrics between checkpoints, you can run the command:
`dvc metrics diff exp-3c7a8 c23a6e0`. You'll see something similart to this in
your terminal. \_Make sure that you replace `exp-3c7a8` with the experiment
branch in your table and replace `c23a6e0` with the checkpoint id you want to
see.

```dvc
Path          Metric    Old      New      Change
dvclive.json  acc       0.9854   0.9831   -0.0023
dvclive.json  loss      0.04828  0.05095  0.00267
dvclive.json  step      19       15       -4
```

### Looking at plots

You also have the option to generate plots to visualize the metrics about your
training epochs. Running `dvc plots diff c60fe61 a4d64fc`, where `c60fe61` and
`a4d64fc` are the checkpoint ids you want to compare, will generate a
`plots.html` file that you can open in a browser and it will display plots for
you similar to the ones below.

![Plots generated from running experiments on MNIST dataset using DVC](/img/checkpoints_plots.png)
_The results here won't show anything interesting because the model increases in
accuracy so fast._

## Resetting checkpoints

Usually when you start training a model, you won't begin with accuracy this
high. There might be a time when you want to remove all of the existing
checkpoints to start the training from scratch. You can reset your checkpoints
with the following command: `dvc exp run --reset`.

This resets all of the existing checkpoints and re-runs the code to generate a
new set of checkpoints under a new experiment branch.

```dvc
┏━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━┳━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━┳━━━━━━━┳━━━━━━━━━━━━━━┓
┃ Experiment    ┃ Created      ┃ step ┃     loss ┃    acc ┃ seed   ┃ lr    ┃ weight_decay ┃
┡━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━╇━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━╇━━━━━━━╇━━━━━━━━━━━━━━┩
│ workspace     │ -            │    9 │ 0.066135 │ 0.9792 │ 473987 │ 0.001 │ 0            │
│ full_pipeline │ Apr 20, 2021 │    - │        - │      - │ 473987 │ 0.001 │ 0            │
│ │ ╓ exp-e81d6 │ 01:30 PM     │    9 │ 0.066135 │ 0.9792 │ 473987 │ 0.001 │ 0            │
│ │ ╟ 34b1d6f   │ 01:30 PM     │    8 │ 0.066629 │ 0.9783 │ 473987 │ 0.001 │ 0            │
│ │ ╟ c048966   │ 01:30 PM     │    7 │ 0.082436 │ 0.9747 │ 473987 │ 0.001 │ 0            │
│ │ ╟ 2910f35   │ 01:30 PM     │    6 │  0.08161 │ 0.9749 │ 473987 │ 0.001 │ 0            │
│ │ ╟ 255d3aa   │ 01:30 PM     │    5 │ 0.088654 │ 0.9716 │ 473987 │ 0.001 │ 0            │
│ │ ╟ c976c6f   │ 01:29 PM     │    4 │  0.13659 │ 0.9574 │ 473987 │ 0.001 │ 0            │
│ │ ╟ 0bdcd86   │ 01:29 PM     │    3 │  0.16031 │ 0.9507 │ 473987 │ 0.001 │ 0            │
│ │ ╟ 574bdc3   │ 01:29 PM     │    2 │  0.21992 │ 0.9345 │ 473987 │ 0.001 │ 0            │
│ │ ╟ d0a150d   │ 01:29 PM     │    1 │  0.33183 │ 0.9037 │ 473987 │ 0.001 │ 0            │
│ ├─╨ 239affa   │ 01:29 PM     │    0 │  0.49894 │ 0.8481 │ 473987 │ 0.001 │ 0            │
│ │ ╓ exp-263da │ 01:19 PM     │   19 │ 0.048277 │ 0.9854 │ 473987 │ 0.001 │ 0            │
│ │ ╟ 0391730   │ 12:05 PM     │    8 │ 0.066629 │ 0.9783 │ 473987 │ 0.001 │ 0            │
│ │ ╟ 92042bd   │ 12:05 PM     │    7 │ 0.082436 │ 0.9747 │ 473987 │ 0.001 │ 0            │
│ │ ╟ a557ace   │ 12:05 PM     │    6 │  0.08161 │ 0.9749 │ 473987 │ 0.001 │ 0            │
│ │ ╟ 114d93f   │ 12:05 PM     │    5 │ 0.088654 │ 0.9716 │ 473987 │ 0.001 │ 0            │
│ │ ╟ 3289b4b   │ 12:05 PM     │    4 │  0.13659 │ 0.9574 │ 473987 │ 0.001 │ 0            │
│ │ ╟ e32a023   │ 12:04 PM     │    3 │  0.16031 │ 0.9507 │ 473987 │ 0.001 │ 0            │
│ │ ╟ cc52edc   │ 12:04 PM     │    2 │  0.21992 │ 0.9345 │ 473987 │ 0.001 │ 0            │
│ │ ╟ 6d2e1d9   │ 12:04 PM     │    1 │  0.33183 │ 0.9037 │ 473987 │ 0.001 │ 0            │
│ ├─╨ d121d33   │ 12:04 PM     │    0 │  0.49894 │ 0.8481 │ 473987 │ 0.001 │ 0            │
└───────────────┴──────────────┴──────┴──────────┴────────┴────────┴───────┴──────────────┘
```

We can also remove all of the experiments we don't promote to our Git workspace
with the following command: `dvc exp gc --workspace --force`.

## Adding checkpoints to Git

When you terminate training, you'll see a few commands in the terminal that will
allow you to add these changes to Git.

```dvc
To track the changes with git, run:

        git add dvclive.json dvc.yaml .gitignore train.py dvc.lock

Reproduced experiment(s): exp-263da
Experiment results have been applied to your workspace.

To promote an experiment to a Git branch run:

        dvc exp branch <exp>
```

You can run the following command to promote your experiments to the Git
workspace.

```bash
git add dvclive.json dvc.yaml .gitignore train.py dvc.lock
```

You can take a look at what will be commited to your Git history by running
`git status`. You should see something similar to this in the terminal.

```git
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        new file:   .gitignore
        new file:   dvc.lock
        new file:   dvclive.json

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        data/
        dvclive.html
        dvclive/
        model.pt
        plots.html
        predictions.json
```
