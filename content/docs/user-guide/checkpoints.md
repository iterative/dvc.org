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

## Setting up a DVC pipeline

If you don't have a DVC pipeline setup in your project, adding one only takes a
few commands. At the root of the project, run `dvc init`. This sets up the files
you need for your DVC pipeline to work.

Next we'll add a stage to our pipeline to run our download the data we need for
training our model. In your terminal, run
`dvc stage add -n download -d download.py -o data/MNIST python download.py`.
This will create a _dvc.yaml_ file in your root directory.

The command we just ran creates a stage called _download_ with a dependency on
the _download.py_ file and it should output any results to the _data/MNIST_
directory.

Inside of the yaml file, you should see the following code.

```yaml
stages:
  download:
    cmd: python download.py
    deps:
      - download.py
    outs:
      - data/MNIST
```

Now we need to add a stage for training our model within a DVC pipeliene. We'll
do that with the following command:
`dvc stage add -n train -d data/MNIST -d train.py -c model.pt --plots-no-cache predictions.json -p seed,lr,weight_decay --live dvclive python train.py`

## Enabling DVC pipelines for checkpoint experiments

After running the command above to setup your _train_ stage, your _dvc.yaml_
should have the following code.

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
    live:
      dvclive:
        summary: true
        html: true
```

The checkpoints need to be enabled in DVC at the pipeline level. The
`-c / --checkpoint` option of the `dvc stage add` command defines the checkpoint
file or directory. This will create a new stage with checkpoints enabled, but
does not update existing stages.

The rest of the command `dvc stage add` sets up our dependencies for running the
training code, which parameters we want to track (which are defined in the
_params.yaml_), some configurations for our plots and showing the training
metrics.

We'll manually add a slight modification to the way our plots are handled. Add
the following lines to your _dvc.yaml_. This just changes the way our results
are shown after we've run some experiments.

```yaml
plots:
  - predictions.json:
      cache: false
      template: confusion
      x: actual
      y: predicted
```

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

In the `train.py` file, import the `dvclive` package with the other imports:
`import dvclive`. Then update the following lines of code in the `main` method
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

If you don't have a number of training epochs defined, the experiment will run
for 10 minutes. You can also hit `Ctrl + C` to stop creating new checkpoints if
the number of epochs are not defined.

## Running experiments

With checkpoints enabled and working in our code, let's run the experiment
again. You can run an experiment with the `dvc exp run` command. Since we've
already run this code before, it will pick up training from the previous
checkpoint and continue from there.

You'll see output similar to this in your terminal while the training process is
going on.

```dvc
Checkpoint experiment iteration 'd50c724'.
Updating lock file 'dvc.lock'
Checkpoint experiment iteration '29491a9'.
Updating lock file 'dvc.lock'
Checkpoint experiment iteration 'b3de55f'.
Updating lock file 'dvc.lock'
Checkpoint experiment iteration 'c4a46af'.
Updating lock file 'dvc.lock'
Checkpoint experiment iteration 'daf204c'.
Updating lock file 'dvc.lock'
Checkpoint experiment iteration 'bdb975c'.
Updating lock file 'dvc.lock'
Checkpoint experiment iteration '77dc46c'.
Updating lock file 'dvc.lock'
```

After a few epochs have completed, stop terminate the training process with
`Ctrl + C`. Now it's time to take a look at the metrics we're working with.

## Viewing checkpoints

You can see a table of your experiments and checkpoints in the terminal by
running `dvc exp show`. The accuracy on our current checkpoints will be high
because we've already run them twice and training always picks up from the last
checkpoint.

```dvc
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━┳━━━━━━━━━┳━━━━━━━━┳━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━┓
┃ Experiment            ┃ Created  ┃ step ┃    loss ┃    acc ┃ seed   ┃ lr     ┃ weight_decay ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━╇━━━━━━━━━╇━━━━━━━━╇━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━┩
│ workspace             │ -        │    7 │  0.3096 │ 0.9092 │ 473987 │ 0.0001 │ 0            │
│ main                  │ 04:49 PM │    - │       - │      - │ 473987 │ 0.001  │ 0            │
│ │ ╓ exp-4de2a         │ 05:03 PM │    7 │  0.3096 │ 0.9092 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ d50c724           │ 05:03 PM │    6 │ 0.33246 │ 0.9044 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ 29491a9           │ 05:02 PM │    5 │ 0.36601 │ 0.8943 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ b3de55f           │ 05:02 PM │    4 │ 0.41666 │ 0.8777 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ c4a46af           │ 05:02 PM │    3 │ 0.50835 │ 0.8538 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ daf204c           │ 05:02 PM │    2 │ 0.72421 │ 0.8284 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ bdb975c           │ 05:02 PM │    1 │  1.2537 │ 0.7738 │ 473987 │ 0.0001 │ 0            │
│ ├─╨ 77dc46c           │ 05:01 PM │    0 │  1.9428 │ 0.5715 │ 473987 │ 0.0001 │ 0            │
```

## Starting from an existing checkpoint

Since you have all of these different checkpoints, you might want to resume
training from a particular one. For example, maybe your accuracy started
decreasing at a certain checkpoint and you want to make some changes to fix
that. You can start training from any existing checkpoint with the following
command.

If you want to start a new experiment based on an existing checkpoint, you can
run `dvc exp apply b3de55f && dvc exp run` where _b3de55f_ is the id of the
checkpoint you want to reference.

You'll be able to see where the experiment starts from the existing checkpoint
with the `dvc exp show` command. You should seem something similar to this in
your terminal.

```dvc
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━┳━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━┓
┃ Experiment            ┃ Created      ┃ step ┃     loss ┃    acc ┃ seed   ┃ lr     ┃ weight_decay ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━╇━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━┩
│ workspace             │ -            │    5 │ 0.36601  │ 0.8943 │ 473987 │ 0.0001 │ 0            │
│ main                  │ 04:49 PM     │    - │       -  │      - │ 473987 │ 0.0001 │ 0            │
│ │ ╓ exp-d0b15         │ 05:10 PM     │    5 │ 0.36601  │ 0.8943 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ 9ac9e6a           │ 05:09 PM     │    4 │ 0.41666  │ 0.8777 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ b869efe           │ 05:09 PM     │    3 │ 0.50835  │ 0.8538 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ 422395e           │ 05:09 PM     │    2 │ 0.72421  │ 0.8284 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ 44e44a9           │ 05:09 PM     │    1 │  1.2537  │ 0.7738 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ c60fe61 (b3de55f) │ 01:40 PM     │   10 │ 0.082944 │ 0.9728 │ 473987 │ 0.0001 │ 0            │
│ │ ╓ exp-4de2a         │ 01:30 PM     │    9 │ 0.066135 │ 0.9792 │ 473987 │ 0.0001 │ 0            │
│ │ ╓ exp-4de2a         │ 05:03 PM     │    7 │  0.3096  │ 0.9092 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ d50c724           │ 05:03 PM     │    6 │ 0.33246  │ 0.9044 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ 29491a9           │ 05:02 PM     │    5 │ 0.36601  │ 0.8943 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ b3de55f           │ 05:02 PM     │    4 │ 0.41666  │ 0.8777 │ 473987 │ 0.0001 │ 0            │
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
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━┳━━━━━━━━━┳━━━━━━━━┳━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━┓
┃ Experiment            ┃ Created  ┃ step ┃    loss ┃    acc ┃ seed   ┃ lr     ┃ weight_decay ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━╇━━━━━━━━━╇━━━━━━━━╇━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━┩
│ workspace             │ -        │    4 │ 0.41666 │ 0.8777 │ 473987 │ 0.0001 │ 0            │
│ main                  │ 04:49 PM │    - │       - │      - │ 473987 │ 0.001  │ 0            │
│ │ ╓ exp-a75bb         │ 05:18 PM │    4 │ 0.41666 │ 0.8777 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ b8a4ceb           │ 05:18 PM │    3 │ 0.50835 │ 0.8538 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ 7b652b1           │ 05:17 PM │    2 │ 0.72421 │ 0.8284 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ cf0168f           │ 05:17 PM │    1 │  1.2537 │ 0.7738 │ 473987 │ 0.0001 │ 0            │
│ ├─╨ 8c7f40f           │ 05:17 PM │    0 │  1.9428 │ 0.5715 │ 473987 │ 0.0001 │ 0            │
│ │ ╓ exp-7fafd         │ 05:10 PM │    5 │ 0.36601 │ 0.8943 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ 9ac9e6a           │ 05:09 PM │    4 │ 0.41666 │ 0.8777 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ b869efe           │ 05:09 PM │    3 │ 0.50835 │ 0.8538 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ 422395e           │ 05:09 PM │    2 │ 0.72421 │ 0.8284 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ 44e44a9           │ 05:09 PM │    1 │  1.2537 │ 0.7738 │ 473987 │ 0.0001 │ 0            │
│ ├─╨ c6e11b4           │ 05:09 PM │    0 │  1.9428 │ 0.5715 │ 473987 │ 0.0001 │ 0            │
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

You can run the following command to save your experiments to the Git history.

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
