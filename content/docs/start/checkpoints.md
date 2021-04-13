# Getting Started: Checkpoint

ML checkpoints are an important part of deep learning because ML engineers like
to save the model files at checkpoints during a training process and return back
when metrics start diverging.

With checkpoints in DVC, you can track every training epoch, return to any
previous checkpoint, see when metrics converge or when the learning rate needs
to be adjusted, and even recover model weights, parameters, and code. You also
have the ability to resume training from previous checkpoints. When you adjust
parameters and code, DVC tracks those changes for you.

## Adding checkpoints

When you want to add a checkpoint to your training process, this only one thing
you need to setup.

In your `dvc.yaml` file, add `checkpoint: true` to your `outs` under the model
file. It should look something like this.

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
      logs:
        summary: true
        html: true
```

Then you'll want to run your code using the `dvc exp run` command. This means
it'll start from the existing checkpoint outputs. That's it! Now you have
checkpoints active in your process. While your script is executing epoch runs,
you should see output in the terminal similar to this:

```dvc
Generating lock file 'dvc.lock'
Updating lock file 'dvc.lock'
Checkpoint experiment iteration 'fcefafb'.

file:///Users/Repos/dvc-checkpoints-mnist/dvclive.html
Updating lock file 'dvc.lock'
Checkpoint experiment iteration '39d1444'.

file:///Users/Repos/dvc-checkpoints-mnist/dvclive.html
Updating lock file 'dvc.lock'
Checkpoint experiment iteration '9b0bf16'.
```

_We don't use `dvc repro` for checkpoints because it doesn't know how to handle
checkpoints outputs and it will run the stage from scratch._

When you run the model again, it builds on top of the last checkpoint. That
means the model from the first run will be an input to the model in the second
run.

### Running checkpoints programatically

When you want integrate checkpoints into your training epochs so you don't have
to run `dvc exp run` each time, you'll need to use the `make_checkpoint`
function.

First, import the function into your script.

`from dvc.api import make_checkpoint`

You'll need a for-loop that has all of your training steps in and call
`make_checkpoint` at the end. This does the same thing as running `dvc exp run`
multiple times. You don't need to define a set number of epochs you want to run.
The code will keep running and making checkpoints until you hit `Ctrl+C` to stop
training. This will save the checkpoints that you have so far so you can take a
look at them.

If you know you'll be running a lot of epochs, you might decide to only make a
checkpoint after a certain number of epochs have occurred. You can do that by
adding a condition to your for-loop like the following.

```python
if i_ % 5 == 0:
    make_checkpoint()
```

## Viewing checkpoints

When you've run your training process for a number of epochs and you want to
take a look at your checkpoints, you can run `dvc exp show`. This will bring up
a table showing you the checkpoints as an experiment branch.

```dvc
┏━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━┳━━━━━━━━┓
┃ Experiment    ┃ Created  ┃ step ┃    acc ┃
┡━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━╇━━━━━━━━┩
│ workspace     │ -        │    9 │ 0.9771 │
│ live          │ 01:04 PM │    - │      - │
│ │ ╓ exp-d3528 │ 01:21 PM │    9 │ 0.9771 │
│ │ ╟ de0f0eb   │ 01:21 PM │    8 │  0.979 │
│ │ ╟ 05e3cea   │ 01:21 PM │    7 │  0.974 │
│ │ ╟ d0cd9ca   │ 01:20 PM │    6 │ 0.9708 │
│ │ ╟ 0f495c4   │ 01:20 PM │    5 │ 0.9703 │
│ │ ╟ 1131cba   │ 01:20 PM │    4 │ 0.9641 │
│ │ ╟ 359869d   │ 01:20 PM │    3 │ 0.9521 │
│ │ ╟ 9b0bf16   │ 01:20 PM │    2 │ 0.9271 │
│ │ ╟ 39d1444   │ 01:19 PM │    1 │ 0.9157 │
│ ├─╨ fcefafb   │ 01:19 PM │    0 │ 0.8572 │
└───────────────┴──────────┴──────┴────────┘
```

Depending on the metrics you have in place, it can also show the accuracy of the
model at each checkpoint.

These experiments have IDs associated with each of the checkpoints so you have a
reference to each epoch.

## Starting from an existing checkpoint

When you have checkpoints enabled in your `dvc.yaml` file, DVC will search for
any `ini.txt` files related to that stage. If DVC finds any of these files, it
will pick up the next training epoch based on the most recent checkpoint
`ini.txt` file.

If you want to start from a specific existing checkpoint, you'll need to run
`dvc exp run --rev 123455` where `12345` is the checkpoint ID for specific
checkpoint you want to start from. This creates a new experiment branch with a
different set of checkpoints, starting with the one you specified.

```dvc
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━┳━━━━━━━━┓
┃ Experiment            ┃ Created  ┃ step ┃    acc ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━╇━━━━━━━━┩
│ workspace             │ -        │    8 │ 0.9771 │
│ live                  │ 01:04 PM │    - │      - │
│ │ ╓ exp-6da78         │ 02:12 PM │    8 │ 0.9771 │
│ │ ╟ 5209799           │ 02:12 PM │    7 │ 0.9693 │
│ │ ╟ 2351030           │ 02:12 PM │    6 │ 0.9734 │
│ │ ╟ 604156c (7fa8f60) │ 02:12 PM │    5 │ 0.9562 │
│ │ ╓ exp-aba4c         │ 02:09 PM │    4 │ 0.9641 │
│ │ ╟ 873e398           │ 02:09 PM │    3 │ 0.9521 │
│ │ ╟ 7fa8f60           │ 02:09 PM │    2 │ 0.9271 │
│ │ ╟ 345f462           │ 02:09 PM │    1 │ 0.9157 │
│ ├─╨ ec28a11           │ 02:08 PM │    0 │ 0.8572 │
│ │ ╓ exp-d3528         │ 01:21 PM │    9 │ 0.9771 │
│ │ ╟ de0f0eb           │ 01:21 PM │    8 │  0.979 │
│ │ ╟ 05e3cea           │ 01:21 PM │    7 │  0.974 │
│ │ ╟ 9b0bf16           │ 01:20 PM │    2 │ 0.9271 │
│ │ ╟ 39d1444           │ 01:19 PM │    1 │ 0.9157 │
│ ├─╨ fcefafb           │ 01:19 PM │    0 │ 0.8572 │
└───────────────────────┴──────────┴──────┴────────┘
```

### Resetting checkpoints

When you need to completely retrain a model and you don't want to use any of the
existing checkpoints, you can get rid of all of them with the `--reset` flag.
Add this to the usual command for running DVC experiments and it looks like
this: `dvc exp run --reset`.

This removes the `model.pt` file and clears the `dvc.lock` file of any existing
checkpoints.
