# Checkpoints

<!--
## Checkpoints

To track successive steps in a longer or deeper <abbr>experiment</abbr>, you can
register checkpoints from your code. Each `dvc exp run` will resume from the
last checkpoint.

Checkpoints provide a way to train models iteratively, keeping the metrics,
models and other artifacts associated with each epoch.

### Adding checkpoints to the pipeline

There are various ways to add checkpoints to a project. In common, these all
involve marking a stage <abbr>output</abbr> with `checkpoint: true` in
`dvc.yaml`. This is needed so that the experiment can resume later, based on the
<abbr>cached</abbr> output(s).

If you are adding a new stage with `dvc stage add`, you can mark its output(s)
with `--checkpoints` (`-c`) option. DVC will add a `checkpoint: true` to the
stage output in `dvc.yaml`.

Otherwise, if you are adding a checkpoint to an already existing project, you
can edit `dvc.yaml` and add a `checkpoint: true` to the stage output as shown
below:

```yaml
stages:
  ...
  train:
    ...
    outs:
      - model.pt:
          checkpoint: true
  ...
```

### Adding checkpoints to Python code

DVC is agnostic when it comes to the language you use in your project.
Checkpoints are basically a mechanism to associate outputs of a pipeline with
its metrics. Reading the model from previous iteration and writing a new model
as a file are not handled by DVC. DVC captures the signal produced by the
machine learning experimentation code and stores each successive checkpoint.

> 💡 DVC provides several automated ways to capture checkpoints for popular ML
> libraries in [DVClive](https://dvc.org/doc/dvclive). It may be more productive
> to use checkpoints via DVClive. Here we discuss adding checkpoints to a
> project manually.

If you are writing the project in Python, the easiest way to signal DVC to
capture the checkpoint is to use `dvc.api.make_checkpoint()` function. It
creates a checkpoint and records all artifacts changed after the previous
checkpoint as another experiment.

The following snippet shows an example that uses a Keras custom callback class.
The callback signals DVC to create a checkpoint at the end of each checkpoint.

```python
class DVCCheckpointsCallback(tf.keras.callbacks.Callback):
    def on_epoch_end(self, epoch, logs=None):
            dvc.api.make_checkpoint()
...

history = model.fit(
          ...
        callbacks=[DVCCheckpointsCallback(), ...]
        )
```

A similar approach can be taken in PyTorch when using a loop to train a model:

```python
   for epoch in range(1, EPOCHS+1):
      ...
      for x_batch, y_batch in train_loader:
          train(model, x_batch, y_batch)
      torch.save(model.state_dict(), "model.pt")
      # Evaluate and checkpoint.
      evaluate(model, x_test, y_test)
      dvc.api.make_checkpoint()
    ...
```

Even if you're not using these libraries, you can use checkpoints in your
project at each epoch/step by first recording all intermediate artifacts and
metrics, then calling `dvc.api.make_checkpoint()`.

### Adding checkpoints to non-Python code

If you use another language in your project, you can mimic the behavior of
`make_checkpoint`. In essence `make_checkpoint` creates a special file named
`DVC_CHECKPOINT` inside `.dvc/tmp/` to signal DVC, and waits the file to be
removed.

```r

dvcroot <- Sys.getenv("DVC_ROOT")

if (dvcroot != "") {
    signalfilepath = file.path(dvcroot, ".dvc", "tmp", "DVC_CHECKPOINT")
    file.create(signalfilepath)
    while (file.exists(signalfilepath)) {
      Sys.sleep(0.01)
    }

}

```

The following Julia snippet creates a signal file to create a checkpoint.

```julia

dvc_root =  get(ENV, "DVC_ROOT", "")

if dvc_root != ""
   signal_file_path = joinpath(dvc_root, ".dvc", "tmp", "DVC_CHECKPOINT")
   open(signal_file_path, "w") do io
           write(io, "")
   end;
   while isfile(signal_file_path)
        sleep()
   end;
```

<details>

### How are checkpoints captured?

Instead of a single commit, checkpoint experiments have multiple commits under
the custom Git reference (in `.git/refs/exps`), similar to a branch.

</details>
-->

ML checkpoints are an important part of deep learning because ML engineers like
to save the model files at certain points during a training process.

With DVC experiments and checkpoints, you can:

- Implement the best practice in deep learning to save your model weights as
  checkpoints.
- Track all code and data changes corresponding to the checkpoints.
- See when metrics start diverging and revert to the optimal checkpoint.
- Automate the process of tracking every training epoch.

[The way checkpoints are implemented by DVC](/blog/experiment-refs) utilizes
_ephemeral_ experiment commits and experiment branches within DVC. They are
created using the metadata from experiments and are tracked with the `exps`
custom Git reference.

You can add experiments to your Git history by committing the experiment you
want to track, which you'll see later in this tutorial.

This tutorial is going to cover how to implement checkpoints in an ML project
using DVC. We're going to train a model to identify handwritten digits based on
the MNIST dataset.

https://youtu.be/PcDo-hCvYpw

<details>

## ⚙️ Setting up the project

You can follow along with the steps here or you can clone the repo directly from
GitHub and play with it. To clone the repo, run the following commands.

```bash
$ git clone https://github.com/iterative/checkpoints-tutorial
$ cd checkpoints-tutorial
```

It is highly recommended you create a virtual environment for this example. You
can do that by running:

```bash
$ python3 -m venv .venv
```

Once your virtual environment is installed, you can start it up with one of the
following commands.

- On Mac/Linux: `source .venv/bin/activate`
- On Windows: `.\.venv\Scripts\activate`

Once you have your environment set up, you can install the dependencies by
running:

```bash
$ pip install -r requirements.txt
```

This will download all of the packages you need to run the example. Now you have
everything you need to get started with experiments and checkpoints.

</details>

## Setting up a DVC pipeline

DVC versions data and it also can version the machine learning model weights
file as checkpoints during the training process. To enable this, you will need
to set up a DVC pipeline to train your model.

Adding a DVC pipeline only takes a few commands. At the root of the project,
run:

```dvc
$ dvc init
```

This sets up the files you need for your DVC pipeline to work.

Now we need to add a stage for training our model within a DVC pipeline. We'll
do that with `dvc stage add`, which we'll explain more later. For now, run the
following command:

```dvc
$ dvc stage add --name train --deps data/MNIST --deps train.py \
              --checkpoints model.pt --plots-no-cache predictions.json \
              --params seed,lr,weight_decay --live dvclive python train.py
```

The `--live dvclive` option enables our special logger [DVCLive](/doc/dvclive),
which helps you register checkpoints from your code.

The checkpoints need to be enabled in DVC at the pipeline level. The
`-c / --checkpoint` option of the `dvc stage add` command defines the checkpoint
file or directory. The checkpoint file, _model.pt_, is an output from one
checkpoint that becomes a dependency for the next checkpoint, such as the model
weights file.

The rest of the `dvc stage add` command sets up our dependencies for running the
training code, which parameters we want to track (which are defined in the
_params.yaml_), some configurations for our plots, showing the training metrics,
and specifying where the logs produced by the training process will go.

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
      - lr
      - seed
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

Before we go any further, this is a great point to add these changes to your Git
history. You can do that with the following commands:

```bash
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
other imports:

```python
import dvclive
```

> It's also possible to use DVC's Python API to register checkpoints, or to use
> custom code to do so. See `dvc.api.make_checkpoint()` for details.

Then update the following lines of code in the `main` method inside of the
training epoch loop.

```git
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

You can read about what the line `dvclive.log(k, v)` does in the
[`dvclive.log()`](/doc/dvclive/api-reference/log) reference.

The [`dvclive.next_step()`](/doc/dvclive/api-reference/next_step) line tells DVC
that it can take a snapshot of the entire workspace and version it with Git.
It's important that with this approach only code with metadata is versioned in
Git (as an ephemeral commit), while the actual model weight file will be stored
in the DVC data cache.

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

file:///Users/milecia/Repos/checkpoints-tutorial/dvclive.html
Epoch 2: loss=1.25374174118042
Epoch 2: acc=0.7738
Updating lock file 'dvc.lock'
Checkpoint experiment iteration '963b396'.

file:///Users/milecia/Repos/checkpoints-tutorial/dvclive.html
Epoch 3: loss=0.7242147922515869
Epoch 3: acc=0.8284
Updating lock file 'dvc.lock'
Checkpoint experiment iteration 'd630b92'.

file:///Users/milecia/Repos/checkpoints-tutorial/dvclive.html
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

## Viewing checkpoints

You can see a table of your experiments and checkpoints in the terminal by
running:

```dvc
$ dvc exp show
```

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━┳━━━━━━━━━┳━━━━━━━━┳━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━┓
┃ Experiment              ┃ Created  ┃ step ┃ loss    ┃ acc    ┃ seed   ┃ lr     ┃ weight_decay ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━╇━━━━━━━━━╇━━━━━━━━╇━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━┩
│ workspace               │ -        │ 6    │ 0.33246 │ 0.9044 │ 473987 │ 0.0001 │ 0            │
│ main                    │ 01:19 PM │ -    │ -       │ -      │ 473987 │ 0.0001 │ 0            │
│ │ ╓ d90179a [exp-02ba1] │ 01:24 PM │ 6    │ 0.33246 │ 0.9044 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ 5eb4025             │ 01:24 PM │ 5    │ 0.36601 │ 0.8943 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ d665a31             │ 01:24 PM │ 4    │ 0.41666 │ 0.8777 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ 0911c09             │ 01:24 PM │ 3    │ 0.50835 │ 0.8538 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ d630b92             │ 01:23 PM │ 2    │ 0.72421 │ 0.8284 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ 963b396             │ 01:23 PM │ 1    │ 1.2537  │ 0.7738 │ 473987 │ 0.0001 │ 0            │
│ ├─╨ d99d81c             │ 01:23 PM │ 0    │ 1.9428  │ 0.5715 │ 473987 │ 0.0001 │ 0            │
└─────────────────────────┴──────────┴──────┴─────────┴────────┴────────┴────────┴──────────────┘
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

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━┳━━━━━━━━━┳━━━━━━━━┳━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━┓
┃ Experiment              ┃ Created  ┃ step ┃ loss    ┃ acc    ┃ seed   ┃ lr     ┃ weight_decay ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━╇━━━━━━━━━╇━━━━━━━━╇━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━┩
│ workspace               │ -        │ 8    │ 0.83515 │ 0.8185 │ 473987 │ 1e-05  │ 0            │
│ main                    │ 01:19 PM │ -    │ -       │ -      │ 473987 │ 0.0001 │ 0            │
│ │ ╓ 726d32f [exp-3b52b] │ 01:38 PM │ 8    │ 0.83515 │ 0.8185 │ 473987 │ 1e-05  │ 0            │
│ │ ╟ 3f8efc5             │ 01:38 PM │ 7    │ 0.88414 │ 0.814  │ 473987 │ 1e-05  │ 0            │
│ │ ╟ 23f04c2             │ 01:37 PM │ 6    │ 0.9369  │ 0.8105 │ 473987 │ 1e-05  │ 0            │
│ │ ╟ d810ed0             │ 01:37 PM │ 5    │ 0.99302 │ 0.804  │ 473987 │ 1e-05  │ 0            │
│ │ ╟ 3e46262             │ 01:37 PM │ 4    │ 1.0528  │ 0.799  │ 473987 │ 1e-05  │ 0            │
│ │ ╟ bf580a5             │ 01:37 PM │ 3    │ 1.1164  │ 0.7929 │ 473987 │ 1e-05  │ 0            │
│ │ ╟ ea2d11b (963b396)   │ 01:37 PM │ 2    │ 1.1833  │ 0.7847 │ 473987 │ 1e-05  │ 0            │
│ │ ╓ d90179a [exp-02ba1] │ 01:24 PM │ 6    │ 0.33246 │ 0.9044 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ 5eb4025             │ 01:24 PM │ 5    │ 0.36601 │ 0.8943 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ d665a31             │ 01:24 PM │ 4    │ 0.41666 │ 0.8777 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ 0911c09             │ 01:24 PM │ 3    │ 0.50835 │ 0.8538 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ d630b92             │ 01:23 PM │ 2    │ 0.72421 │ 0.8284 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ 963b396             │ 01:23 PM │ 1    │ 1.2537  │ 0.7738 │ 473987 │ 0.0001 │ 0            │
│ ├─╨ d99d81c             │ 01:23 PM │ 0    │ 1.9428  │ 0.5715 │ 473987 │ 0.0001 │ 0            │
└─────────────────────────┴──────────┴──────┴─────────┴────────┴────────┴────────┴──────────────┘
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
Path          Metric    Old      New      Change
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

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━┳━━━━━━━━━┳━━━━━━━━┳━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━┓
┃ Experiment              ┃ Created  ┃ step ┃ loss    ┃ acc    ┃ seed   ┃ lr     ┃ weight_decay ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━╇━━━━━━━━━╇━━━━━━━━╇━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━┩
│ workspace               │ -        │ 6    │ 2.0912  │ 0.5607 │ 473987 │ 1e-05  │ 0            │
│ main                    │ 01:19 PM │ -    │ -       │ -      │ 473987 │ 0.0001 │ 0            │
│ │ ╓ b21235e [exp-6c6fa] │ 01:56 PM │ 6    │ 2.0912  │ 0.5607 │ 473987 │ 1e-05  │ 0            │
│ │ ╟ 53e5d64             │ 01:56 PM │ 5    │ 2.1385  │ 0.5012 │ 473987 │ 1e-05  │ 0            │
│ │ ╟ 7e0e0fe             │ 01:56 PM │ 4    │ 2.1809  │ 0.4154 │ 473987 │ 1e-05  │ 0            │
│ │ ╟ f7eafc5             │ 01:55 PM │ 3    │ 2.2177  │ 0.2518 │ 473987 │ 1e-05  │ 0            │
│ │ ╟ dcfa3ff             │ 01:55 PM │ 2    │ 2.2486  │ 0.1264 │ 473987 │ 1e-05  │ 0            │
│ │ ╟ bfd54b4             │ 01:55 PM │ 1    │ 2.2736  │ 0.1015 │ 473987 │ 1e-05  │ 0            │
│ ├─╨ 189bbcb             │ 01:55 PM │ 0    │ 2.2936  │ 0.0892 │ 473987 │ 1e-05  │ 0            │
│ │ ╓ 726d32f [exp-3b52b] │ 01:38 PM │ 8    │ 0.83515 │ 0.8185 │ 473987 │ 1e-05  │ 0            │
│ │ ╟ 3f8efc5             │ 01:38 PM │ 7    │ 0.88414 │ 0.814  │ 473987 │ 1e-05  │ 0            │
│ │ ╟ 23f04c2             │ 01:37 PM │ 6    │ 0.9369  │ 0.8105 │ 473987 │ 1e-05  │ 0            │
│ │ ╟ d810ed0             │ 01:37 PM │ 5    │ 0.99302 │ 0.804  │ 473987 │ 1e-05  │ 0            │
│ │ ╟ 3e46262             │ 01:37 PM │ 4    │ 1.0528  │ 0.799  │ 473987 │ 1e-05  │ 0            │
│ │ ╟ bf580a5             │ 01:37 PM │ 3    │ 1.1164  │ 0.7929 │ 473987 │ 1e-05  │ 0            │
│ │ ╟ ea2d11b (963b396)   │ 01:37 PM │ 2    │ 1.1833  │ 0.7847 │ 473987 │ 1e-05  │ 0            │
│ │ ╓ d90179a [exp-02ba1] │ 01:24 PM │ 6    │ 0.33246 │ 0.9044 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ 5eb4025             │ 01:24 PM │ 5    │ 0.36601 │ 0.8943 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ d665a31             │ 01:24 PM │ 4    │ 0.41666 │ 0.8777 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ 0911c09             │ 01:24 PM │ 3    │ 0.50835 │ 0.8538 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ d630b92             │ 01:23 PM │ 2    │ 0.72421 │ 0.8284 │ 473987 │ 0.0001 │ 0            │
│ │ ╟ 963b396             │ 01:23 PM │ 1    │ 1.2537  │ 0.7738 │ 473987 │ 0.0001 │ 0            │
│ ├─╨ d99d81c             │ 01:23 PM │ 0    │ 1.9428  │ 0.5715 │ 473987 │ 0.0001 │ 0            │
└─────────────────────────┴──────────┴──────┴─────────┴────────┴────────┴────────┴──────────────┘
```

## Adding checkpoints to Git

When you terminate training, you'll see a few commands in the terminal that will
allow you to add these changes to Git.

```
To track the changes with git, run:

        git add dvclive.json dvc.yaml .gitignore train.py dvc.lock

Reproduced experiment(s): exp-263da
Experiment results have been applied to your workspace.

To promote an experiment to a Git branch run:

        dvc exp branch <exp>
```

You can run the following command to save your experiments to the Git history.

```bash
$ git add dvclive.json dvc.yaml .gitignore train.py dvc.lock
```

You can take a look at what will be committed to your Git history by running:

```bash
$ git status
```

You should see something similar to this in your terminal.

```
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

All that's left is to commit these changes with the following command:

```bash
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
