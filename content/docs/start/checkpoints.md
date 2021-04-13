---
title: 'Get Started: Checkpoints'
---

# Get Started: Checkpoints

⚠️ This feature is only available in DVC 2.0 ⚠️

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
checkpoints active in your process.

_We don't use `dvc repro` for checkpoints because it doesn't know how to handle
checkpoints outputs and it will run the stage from scratch._

After your run completes, you can run `dvc exp show` to see the accuracy from
your metrics. When you run the model again, it builds on top of the last
checkpoint. That means the model from the first run will be an input to the
model in the second run.

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
a table showing you the checkpoints as an experiment branch. Depending on the
metrics you have in place, it can also show the accuracy of the model at each
checkpoint.

## Go to a previous checkpoint

If you have a checkpoint that you want to revert back to, you can do so by

## Start from an existing checkpoint

When you have checkpoints enabled in your `dvc.yaml` file, DVC will search for
any `ini.txt` files related to that stage. If DVC finds any of these files, it
will pick up the next training epoch based on the most recent checkpoint
`ini.txt` file.

If you want to start from a specific existing checkpoint, you'll need to run
`dvc exp ...`
