# Checkpoints

_New in DVC 2.0_

To track successive steps in a longer machine learning experiment, you can
register checkpoints from your code at runtime, for example to track the
progress with deep learning techniques. They can help you

- implement the best practice in deep learning to save your model weights as
  checkpoints.
- track all code and data changes corresponding to the checkpoints.
- see when metrics start diverging and revert to the optimal checkpoint.
- automate the process of tracking every training epoch.

Checkpoint [execution] can be stopped and resumed as needed. You interact with
them using the `--rev` and `--reset` options of `dvc exp run` (see also the
`checkpoint` field in `dvc.yaml` `outs`).

[execution]:
  /doc/user-guide/experiment-management/running-experiments#checkpoint-experiments

<details>

### ⚙️ How are checkpoints captured?

Instead of a single reference like [regular experiments], checkpoint experiments
have multiple commits under the custom Git reference (in `.git/refs/exps`),
similar to a branch.

[regular experiments]:
  /doc/user-guide/experiment-management/experiments-overview

</details>

Like with regular experiments, checkpoints can be
[committed to Git](#committing-checkpoints-to-git).

This guide covers how to implement checkpoints in an ML project using DVC. We're
going to train a model to identify handwritten digits based on the MNIST
dataset.

https://youtu.be/PcDo-hCvYpw

<details>

### ⚙️ Setting up the project

You can follow along with the steps here or you can clone the repo directly from
GitHub and play with it. To clone the repo, run the following commands.

```dvc
$ git clone https://github.com/iterative/checkpoints-tutorial
$ cd checkpoints-tutorial
```

It is highly recommended you create a virtual environment for this example. You
can do that by running:

```dvc
$ python3 -m venv .venv
```

Once your virtual environment is installed, you can start it up with one of the
following commands.

- On Mac/Linux: `source .venv/bin/activate`
- On Windows: `.\.venv\Scripts\activate`

Once you have your environment set up, you can install the dependencies by
running:

```dvc
$ pip install -r requirements.txt
```

This will download all of the packages you need to run the example.

To initialize this project as a <abbr>DVC repository</abbr>, use `dvc init`. Now
you have everything you need to get started with experiments and checkpoints.

</details>

## Setting up a DVC pipeline

DVC can version data as well as the ML model weights file in checkpoints during
the training process. To enable this, you will need to set up a
[DVC pipeline](/doc/start/data-pipelines) to train your model.

Now we need to add a training stage to `dvc.yaml` including `checkpoint: true`
in its <abbr>output</abbr>. This tells DVC which <abbr>cached</abbr> output(s)
to use to resume the experiment later (a circular dependency). We'll do this
with `dvc exp init`.

```dvc
$ dvc exp init \
--data 'data/MNIST' \
--code 'train.py' \
--live 'dvclive' \
--model 'model.pt' \
--type 'checkpoint' \
python train.py
```

The `--live` option configures where the [DVCLive](/doc/dvclive) logs (produced
by the training process) will go. `--type 'checkpoint'` is used to enable DVC
checkpoints. The checkpoint file, specified with `--model 'model.pt'`, is an output
from one checkpoint that becomes a dependency for the next checkpoint.

The other options (`--data` and `--code`) set up our dependencies for running the
training code, whose parameters we want to track (by default all inside
_params.yaml_).

After running the command above to setup your _train_ stage, your _dvc.yaml_
should have the following code.

```yaml
stages:
  train:
    cmd: python train.py
    deps:
      - data/MNIST
      - train.py
    params:
      - params.yaml:
    outs:
      - model.pt:
          checkpoint: true
    metrics:
      - dvclive.json:
          cache: false
          persist: true
    plots:
      - dvclive/scalars:
          cache: false
          persist: true
```

<admon type="warn">

Note that enabling checkpoints in a `dvc.yaml` file makes it incompatible with
`dvc repro`.

</admon>

Before we go any further, this is a great point to add these changes to your Git
history. You can do that with the following commands:

```dvc
$ git add .
$ git commit -m "created DVC pipeline"
```

Now that you know how to enable checkpoints in a DVC pipeline, let's move on to
setting up checkpoints in your code.

## Registering checkpoints in your code

Take a look at the `train.py` file and you'll see how we train a convolutional
neural network to classify handwritten digits. The main area of this code most
relevant to checkpoints is when we iterate over the training epochs.

This is where DVC will be able to track our metrics over time and where we will
add our checkpoints to give us the points in time with our model that we can
switch between.

Now we need to enable checkpoints at the code level. We are interested in
tracking the metrics along with each checkpoint, so we'll need to add a few
lines of code.

In the `train.py` file, import the [`dvclive`](/doc/dvclive) package with the
other imports::

```python
from dvclive import Live
```

<admon type="tip">

It's also possible to use DVC's Python API to register checkpoints, or to use
custom code to do so. See `dvc.api.make_checkpoint()` for details.

</admon>

Then update the following lines of code in the `main` method inside of the
training epoch loop.

```git
+ dvclive = Live()

# Iterate over training epochs.
for i in range(1, EPOCHS+1):
    # Train in batches.
    train_loader = torch.utils.data.DataLoader(
            dataset=list(zip(x_train, y_train)),
            batch_size=512,
            shuffle=True)
    for x_batch, y_batch in train_loader:
        train(model, x_batch, y_batch, params["lr"], params["weight_decay"])
    torch.save(model.state_dict(), "model.pt")
    # Evaluate and checkpoint.
    metrics = evaluate(model, x_test, y_test)
    for k, v in metrics.items():
        print('Epoch %s: %s=%s'%(i, k, v))
+       dvclive.log(k, v)
+   dvclive.next_step()
```

The line `torch.save(model.state_dict(), "model.pt")` updates the checkpoint
file.

You can read about what the line `dvclive.log(k, v)` does in the `Live.log()`
reference.

The `Live.next_step()` line tells DVC that it can take a snapshot of the entire
workspace and version it with Git. It's important that with this approach only
code with metadata is versioned in Git (as an ephemeral commit), while the
actual model weight file will be stored in the DVC data <abbr>cache</abbr>.

## Running experiments

With checkpoints enabled and working in our code, let's run the experiment. You
can run an experiment with the following command:

```dvc
$ dvc exp run
```

You'll see output similar to this in your terminal while the training process is
going on.

```
Epoch 1: loss=1.9428282976150513
Epoch 1: acc=0.5715
Generating lock file 'dvc.lock'
Updating lock file 'dvc.lock'
Checkpoint experiment iteration 'd99d81c'.

file:///Users/milecia/Repos/checkpoints-tutorial/dvclive_dvc_plots/index.html
Epoch 2: loss=1.25374174118042
Epoch 2: acc=0.7738
Updating lock file 'dvc.lock'
Checkpoint experiment iteration '963b396'.

file:///Users/milecia/Repos/checkpoints-tutorial/dvclive_dvc_plots/index.html
Epoch 3: loss=0.7242147922515869
Epoch 3: acc=0.8284
Updating lock file 'dvc.lock'
Checkpoint experiment iteration 'd630b92'.

file:///Users/milecia/Repos/checkpoints-tutorial/dvclive_dvc_plots/index.html
Epoch 4: loss=0.5083536505699158
Epoch 4: acc=0.8538
Updating lock file 'dvc.lock'
Checkpoint experiment iteration '0911c09'.

...
```

After a few epochs have completed, stop the training process with `[Ctrl] C`.
Now it's time to take a look at the metrics we're working with.

_If you don't have a number of training epochs defined and you don't terminate
the process, the experiment will run for 100 epochs._

### Caching checkpoints

We can automatically push the checkpoints' code & data to your Git & DVC remotes
while an experiment is running. To enable this, two environment variables need
to be set:

- `DVC_EXP_AUTO_PUSH`: Enable auto push (`true`, `1`, `y`, `yes`)
- `DVC_EXP_GIT_REMOTE`: Git repository (can be a URL or a name such as `origin`,
  `myremote`, etc.)

Note that a `dvc remote default` is also needed so that the corresponding data
can be pushed. With this configuration, `dvc exp push` will be done
automatically after every iteration.

⚠️ If either Git or DVC remotes are missing, the experiment will fail. However,
if a checkpoint push doesn't succeed (due to rate limiting etc.) a warning will
be printed, but the experiment will continue running as normal.

## Viewing checkpoints

You can see a table of your experiments and checkpoints in the terminal by
running:

```dvc
$ dvc exp show
```

```dvctable
 ───────────────────────────────────────────────────────────────────────────────────────────────
  neutral:**Experiment**                neutral:**Created**    neutral:**step**   metric:**loss**      metric:**acc**      param:**seed**     param:**lr**       param:**weight_decay**
 ───────────────────────────────────────────────────────────────────────────────────────────────
  workspace                 -          6      0.33246   0.9044   473987   0.0001   0
  main                      01:19 PM   -      -         -        473987   0.0001   0
  │ ╓ d90179a [exp-02ba1]   01:24 PM   6      0.33246   0.9044   473987   0.0001   0
  │ ╟ 5eb4025               01:24 PM   5      0.36601   0.8943   473987   0.0001   0
  │ ╟ d665a31               01:24 PM   4      0.41666   0.8777   473987   0.0001   0
  │ ╟ 0911c09               01:24 PM   3      0.50835   0.8538   473987   0.0001   0
  │ ╟ d630b92               01:23 PM   2      0.72421   0.8284   473987   0.0001   0
  │ ╟ 963b396               01:23 PM   1      1.2537    0.7738   473987   0.0001   0
  ├─╨ d99d81c               01:23 PM   0      1.9428    0.5715   473987   0.0001   0
 ───────────────────────────────────────────────────────────────────────────────────────────────
```

## Starting from an existing checkpoint

Since you have all of these different checkpoints, you might want to resume
training from a particular one. For example, maybe your accuracy started
decreasing at a certain checkpoint and you want to make some changes to fix
that.

First, we need to apply the checkpoint we want to begin our new experiment from.
To do that, run the following command:

```dvc
$ dvc exp apply 963b396
```

where _963b396_ is the id of the checkpoint you want to reference.

Next, we'll change the learning rate set in the _params.yaml_ to `0.000001` and
start a new experiment based on an existing checkpoint with the following
command:

```dvc
$ dvc exp run --set-param lr=0.00001
```

You'll be able to see where the experiment starts from the existing checkpoint
by running:

```dvc
$ dvc exp show
```

You should seem something similar to this in your terminal.

```dvctable
 ───────────────────────────────────────────────────────────────────────────────────────────────
  neutral:**Experiment**                neutral:**Created**    neutral:**step**   metric:**loss**      metric:**acc**      param:**seed**     param:**lr**       param:**weight_decay**
 ───────────────────────────────────────────────────────────────────────────────────────────────
  workspace                 -          8      0.83515   0.8185   473987   1e-05    0
  main                      01:19 PM   -      -         -        473987   0.0001   0
  │ ╓ 726d32f [exp-3b52b]   01:38 PM   8      0.83515   0.8185   473987   1e-05    0
  │ ╟ 3f8efc5               01:38 PM   7      0.88414   0.814    473987   1e-05    0
  │ ╟ 23f04c2               01:37 PM   6      0.9369    0.8105   473987   1e-05    0
  │ ╟ d810ed0               01:37 PM   5      0.99302   0.804    473987   1e-05    0
  │ ╟ 3e46262               01:37 PM   4      1.0528    0.799    473987   1e-05    0
  │ ╟ bf580a5               01:37 PM   3      1.1164    0.7929   473987   1e-05    0
  │ ╟ ea2d11b (963b396)     01:37 PM   2      1.1833    0.7847   473987   1e-05    0
  │ ╓ d90179a [exp-02ba1]   01:24 PM   6      0.33246   0.9044   473987   0.0001   0
  │ ╟ 5eb4025               01:24 PM   5      0.36601   0.8943   473987   0.0001   0
  │ ╟ d665a31               01:24 PM   4      0.41666   0.8777   473987   0.0001   0
  │ ╟ 0911c09               01:24 PM   3      0.50835   0.8538   473987   0.0001   0
  │ ╟ d630b92               01:23 PM   2      0.72421   0.8284   473987   0.0001   0
  │ ╟ 963b396               01:23 PM   1      1.2537    0.7738   473987   0.0001   0
  ├─╨ d99d81c               01:23 PM   0      1.9428    0.5715   473987   0.0001   0
 ───────────────────────────────────────────────────────────────────────────────────────────────
```

The existing checkpoint is referenced at the beginning of the new experiment.
The new experiment is referred to as a modified experiment because it's taking
existing data and using it as the starting point.

### Metrics diff

When you've run all the experiments you want to and you are ready to compare
metrics between checkpoints, you can run the command:

```dvc
$ dvc metrics diff d90179a 726d32f
```

Make sure that you replace `d90179a` and `726d32f` with checkpoint ids from your
table with the checkpoints you want to compare. You'll see something similar to
this in your terminal.

```
Path          Metric    d90179a  726d32f  Change
dvclive.json  acc       0.9044   0.8185   -0.0859
dvclive.json  loss      0.33246  0.83515  0.50269
dvclive.json  step      6        8        2
```

_These are the same numbers you see in the metrics table, just in a different
format._

### Looking at plots

You also have the option to generate plots to visualize the metrics about your
training epochs. Running:

```dvc
$ dvc plots diff d90179a 726d32f
```

where `d90179a` and `726d32f` are the checkpoint ids you want to compare, will
generate a `plots.html` file that you can open in a browser and it will display
plots for you similar to the ones below.

![Plots generated from running experiments on MNIST dataset using DVC](/img/checkpoints_plots.png)

## Resetting checkpoints

Usually when you start training a model, you won't begin with accuracy this
high. There might be a time when you want to remove all of the existing
checkpoints to start the training from scratch. You can reset your checkpoints
with the following command:

```dvc
$ dvc exp run --reset
```

This resets all of the existing checkpoints and re-runs the code to generate a
new set of checkpoints under a new experiment branch.

```dvctable
 ───────────────────────────────────────────────────────────────────────────────────────────────
  neutral:**Experiment**                neutral:**Created**    neutral:**step**   metric:**loss**      metric:**acc**      param:**seed**     param:**lr**       param:**weight_decay**
 ───────────────────────────────────────────────────────────────────────────────────────────────
  workspace                 -          6      2.0912    0.5607   473987   1e-05    0
  main                      01:19 PM   -      -         -        473987   0.0001   0
  │ ╓ b21235e [exp-6c6fa]   01:56 PM   6      2.0912    0.5607   473987   1e-05    0
  │ ╟ 53e5d64               01:56 PM   5      2.1385    0.5012   473987   1e-05    0
  │ ╟ 7e0e0fe               01:56 PM   4      2.1809    0.4154   473987   1e-05    0
  │ ╟ f7eafc5               01:55 PM   3      2.2177    0.2518   473987   1e-05    0
  │ ╟ dcfa3ff               01:55 PM   2      2.2486    0.1264   473987   1e-05    0
  │ ╟ bfd54b4               01:55 PM   1      2.2736    0.1015   473987   1e-05    0
  ├─╨ 189bbcb               01:55 PM   0      2.2936    0.0892   473987   1e-05    0
  │ ╓ 726d32f [exp-3b52b]   01:38 PM   8      0.83515   0.8185   473987   1e-05    0
  │ ╟ 3f8efc5               01:38 PM   7      0.88414   0.814    473987   1e-05    0
  │ ╟ 23f04c2               01:37 PM   6      0.9369    0.8105   473987   1e-05    0
  │ ╟ d810ed0               01:37 PM   5      0.99302   0.804    473987   1e-05    0
  │ ╟ 3e46262               01:37 PM   4      1.0528    0.799    473987   1e-05    0
  │ ╟ bf580a5               01:37 PM   3      1.1164    0.7929   473987   1e-05    0
  │ ╟ ea2d11b (963b396)     01:37 PM   2      1.1833    0.7847   473987   1e-05    0
  │ ╓ d90179a [exp-02ba1]   01:24 PM   6      0.33246   0.9044   473987   0.0001   0
  │ ╟ 5eb4025               01:24 PM   5      0.36601   0.8943   473987   0.0001   0
  │ ╟ d665a31               01:24 PM   4      0.41666   0.8777   473987   0.0001   0
  │ ╟ 0911c09               01:24 PM   3      0.50835   0.8538   473987   0.0001   0
  │ ╟ d630b92               01:23 PM   2      0.72421   0.8284   473987   0.0001   0
  │ ╟ 963b396               01:23 PM   1      1.2537    0.7738   473987   0.0001   0
  ├─╨ d99d81c               01:23 PM   0      1.9428    0.5715   473987   0.0001   0
 ───────────────────────────────────────────────────────────────────────────────────────────────
```

## Committing checkpoints to Git

When you terminate training, you'll see a few commands in the terminal that will
allow you to add these changes to Git, making them [persistent]:

[persistent]:
  /doc/user-guide/experiment-management/dvc-experiments#persistent-experiments

```dvc
To track the changes with git, run:

        git add dvclive.json dvc.yaml .gitignore train.py dvc.lock

...
```

Running the command above will stage the checkpoint experiment with Git. You can
take a look at what would be committed first with `git status`. You should see
something similar to this in your terminal:

```dvc
$ git status
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

All that's left to do is to `git commit` the changes:

```dvc
$ git commit -m 'saved files from experiment'
```

We can also remove all of the experiments we don't promote to our Git workspace
with the following command:

```dvc
$ dvc exp gc --workspace --force
```

Now that you know how to use checkpoints in DVC, you'll be able to resume
training from different checkpoints to try out new hyperparameters or code and
you'll be able to track all of the changes you make while trying to create the
best possible model.
