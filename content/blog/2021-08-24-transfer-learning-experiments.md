---
title: Using Experiments for Transfer Learning
date: 2021-08-24
description: |
  You can work with pretrained models and fine-tune them with DVC experiments.
descriptionLong: |
  DVC experiments help fine-tune models by tracking code and data changes.
picture: 2021-08-24/pretrained-models.png
pictureComment: Using Experiments to Improve Pre-trained Models
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/using-experiments-for-transfer-learning/846
tags:
  - MLOps
  - Experiments
  - Reproducibility
  - DVC
---

## Intro

There are plenty of machine learning models available that have been trained to
solve one problem and the knowledge gained from that can be applied to a new,
yet related problem. For example, a model like AlexNet has been trained on
millions of images so you could potentially use this to classify cars, animals,
or even people. This is called
[transfer learning](https://towardsdatascience.com/a-comprehensive-hands-on-guide-to-transfer-learning-with-real-world-applications-in-deep-learning-212bf3b2f27a)
and it can save a lot of time on developing a model from scratch.

For us to take advantage of transfer learning, we can use fine-tuning to adopt
the model to our new problem. In many cases, we start by replacing the last
layer of the model. With the AlexNet example, this might mean the last layer was
previously used to classify cars but our new problem is classifying animals.

Even though we already have the bulk of the model defined, we'll still have to
do some experimentation to determine whether we need to replace more layers in
the model or if any other changes need to be made.

In this post, we'll go through an example of fine-tuning
[AlexNet](https://towardsdatascience.com/alexnet-the-architecture-that-challenged-cnns-e406d5297951)
and
[SqueezeNet](https://towardsdatascience.com/review-squeezenet-image-classification-e7414825581a)
to classify bees and ants. We'll use DVC to handle experiments for us and we'll
compare the results of both models at the end.

## Initialize the pre-trained model

We'll be fine-tuning the AlexNet model and the SqueezeNet model to classify
images of bees and ants. You can find the project we're working with in
[this repo](https://github.com/iterative/pretrained-model-demo), which is based
on the tutorial over at
[this post](https://pytorch.org/tutorials/beginner/finetuning_torchvision_models_tutorial.html).

In the `pretrained_model_tuner.py` file, you'll find the code that defines both
the AlexNet and SqueezeNet models. We start by initializing these models so we
can get the number of model features and the input size we need for fine-tuning.

Since the project has everything we need to initialize the models, we can start
training and comparing the differences between them with the ants/bees dataset.
Running experiments to get the best tuning for each model can make it difficult
to see which changes led to a better result. That's why we will be using DVC to
track changes in the code and the data.

## Adding the train stage

Stages in DVC let us define individual data processes and can be used to build
detailed machine learning pipelines. You have the ability to define the
different steps of model creation like preprocessing, featurization, and
training.

We currently have a `train` stage in the `dvc.yaml` file. If you take a look at
it, you'll see something like:

```yaml
stages:
  train:
    cmd: python pretrained_model_tuner.py
    deps:
      - data/hymenoptera_data
      - pretrained_model_tuner.py
    params:
      - lr
      - momentum
      - model_name
      - num_classes
      - batch_size
      - num_epochs
    outs:
      - model.pt:
          checkpoint: true
    live:
      results:
        summary: true
        html: true
```

The reason we need this `dvc.yaml` file is so DVC knows what to pay attention to
in our workflow. It will start managing data, understand which metrics to pay
attention to, and what the expected output for each step is.

You'll typically add stages to `dvc.yaml` using the `dvc stage add` command and
this is one of the ways you can add new stages or update existing ones.

With the `train` stage defined, let's look at where the metrics actually come
from in the code. If you open `pretrained_model_tuner`, you'll see a line where
we dump the accuracy and loss for the training epochs into the `results.json`
file. We're also saving the model on the epoch run and recording metrics for
each epoch using `dvclive` logging.

```python
if phase == 'train':
    torch.save(model.state_dict(), "model.pt")

    dvclive.log('acc', epoch_acc.item())
    dvclive.log('loss', epoch_loss)
    dvclive.log('training_time', epoch_time_elapsed)

...

dvclive.next_step()
```

This code is needed to let DVC access the metrics in the project because it will
read the metrics from the `dvclive.json` file.

Since we have several hyperparameters set in the `params.yaml`, we need to use
those values when we run the training stage. The following code makes the
hyperparameter values accessible in the `train` function.

```python
with open("params.yaml") as f:
    yaml=YAML(typ='safe')
    params = yaml.load(f)
```

With all of this in place, we can finally start running experiments to fine-tune
the two models.

## Fine-tuning AlexNet

You can find the code that initializes the AlexNet model in the
`initialize_model` function in `pretrained_model_tuner.py`. Since we have DVC
set up, we can jump straight into fine-tuning this model to see which
hyperparameters give us the best accuracy.

We'll run the first experiment with the following command.

```dvc
$ dvc exp run
```

This will execute the `pretrained_model_tuner.py` script and run for 5 epochs
since that's what we defined in `params.yaml`. When this finishes, you can check
out the metrics from this run with the current hyperparameter values.

```dvc
$ dvc exp show
```

You'll see a table similar to this.

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━┳━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━┓
┃ neutral:**Experiment**              ┃ neutral:**Created**  ┃ metric:**step** ┃ metric:**val_acc** ┃ metric:**val_loss** ┃     metric:**acc** ┃    metric:**loss** ┃ metric:**training_time** ┃ param:**lr**    ┃ param:**momentum** ┃ param:**model_name** ┃ param:**num_classes** ┃ param:**batch_size** ┃ param:**num_epochs** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━╇━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━┩
│ **workspace**               │ -        │    **9** │ **0.88889** │  **0.27292** │       - │       - │             - │ **0.001** │ **0.09**     │ **alexnet**    │ **2**           │ **8**          │ **5**          │
│ **main**                    │ **08:10 AM** │    - │       - │        - │       - │       - │             - │ **0.001** │ **0.09**     │ **alexnet**    │ **2**           │ **8**          │ **5**          │
│ │ ╓ 8b7ab89 [exp-1c07b] │ 08:16 AM │    9 │ 0.88889 │  0.27292 │       - │       - │             - │ 0.001 │ 0.09     │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ e44d51d             │ 08:15 AM │    8 │       - │        - │ 0.92213 │ 0.19708 │        231.47 │ 0.001 │ 0.09     │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ 4d90d9f             │ 08:15 AM │    7 │ 0.88889 │  0.28697 │       - │       - │             - │ 0.001 │ 0.09     │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ dc795b6             │ 08:15 AM │    6 │       - │        - │ 0.91393 │ 0.21766 │        180.48 │ 0.001 │ 0.09     │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ 8ac9f71             │ 08:14 AM │    5 │ 0.90196 │  0.27692 │       - │       - │             - │ 0.001 │ 0.09     │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ 62c417d             │ 08:14 AM │    4 │       - │        - │ 0.87295 │ 0.26793 │        128.89 │ 0.001 │ 0.09     │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ 207cc22             │ 08:13 AM │    3 │ 0.87582 │  0.29784 │       - │       - │             - │ 0.001 │ 0.09     │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ 028ea88             │ 08:13 AM │    2 │       - │        - │ 0.86885 │ 0.30376 │        77.708 │ 0.001 │ 0.09     │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ f3c571f             │ 08:12 AM │    1 │ 0.88235 │  0.31595 │       - │       - │             - │ 0.001 │ 0.09     │ alexnet    │ 2           │ 8          │ 5          │
│ ├─╨ 168c894             │ 08:12 AM │    0 │       - │        - │ 0.80738 │ 0.43822 │        25.962 │ 0.001 │ 0.09     │ alexnet    │ 2           │ 8          │ 5          │
└─────────────────────────┴──────────┴──────┴─────────┴──────────┴─────────┴─────────┴───────────────┴───────┴──────────┴────────────┴─────────────┴────────────┴────────────┘
```

Now let's update the hyperparameters and run another experiment. There are
several ways to do this with DVC:

- Change the hyperparameter values directly in `params.yaml`
- Update the values using the `--set-param` or the shorthand `-S` option on
  `dvc exp run`
- Queue multiple experiments with different values using the `--queue` option on
  `dvc exp run`

We'll do an example of each of these throughout the rest of this article.

Let's start by updating the hyperparameter values in `params.yaml`. You should
have these values in your file.

```yaml
lr: 0.009
momentum: 0.017
```

Now run another experiment with `dvc exp run`. To make the table more readable,
we're going to specify the parameters we want to show and take a look at the
metrics with:

```dvc
$ dvc exp show --no-timestamp --include-params lr,momentum,model_name
```

Your table should look something like this now. Since we're using checkpoints,
note that we continue training additional epochs on top of your previous
experiment. You'll see what it takes to start training from scratch later.

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━┳━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━━┓
┃ neutral:**Experiment**              ┃ metric:**step** ┃ metric:**val_acc** ┃ metric:**val_loss** ┃     metric:**acc** ┃    metric:**loss** ┃ metric:**training_time** ┃ param:**lr**    ┃ param:**momentum** ┃ param:**model_name** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━╇━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━━┩
│ **workspace**               │   **19** │ **0.87582** │  **0.57303** │       - │       - │             - │ **0.009** │ **0.017**    │ **alexnet**    │
│ **main**                    │    - │       - │        - │       - │       - │             - │ **0.001** │ **0.09**     │ **alexnet**    │
│ │ ╓ d5c5e75 [exp-a20d5] │   19 │ 0.87582 │  0.57303 │       - │       - │             - │ 0.009 │ 0.017    │ alexnet    │
│ │ ╟ e3fffdc             │   18 │       - │        - │ 0.90984 │ 0.33672 │        236.09 │ 0.009 │ 0.017    │ alexnet    │
│ │ ╟ ac25eba             │   17 │  0.8366 │  0.82729 │       - │       - │             - │ 0.009 │ 0.017    │ alexnet    │
│ │ ╟ 647ddb0             │   16 │       - │        - │ 0.93443 │ 0.21811 │         184.4 │ 0.009 │ 0.017    │ alexnet    │
│ │ ╟ b51270e             │   15 │ 0.86275 │  0.68551 │       - │       - │             - │ 0.009 │ 0.017    │ alexnet    │
│ │ ╟ f1cf689             │   14 │       - │        - │ 0.86885 │ 0.51194 │        131.21 │ 0.009 │ 0.017    │ alexnet    │
│ │ ╟ 46ed79e             │   13 │ 0.80392 │  0.88188 │       - │       - │             - │ 0.009 │ 0.017    │ alexnet    │
│ │ ╟ 689b044             │   12 │       - │        - │ 0.87295 │ 0.54763 │        78.024 │ 0.009 │ 0.017    │ alexnet    │
│ │ ╟ 4df370a             │   11 │ 0.73856 │   1.5563 │       - │       - │             - │ 0.009 │ 0.017    │ alexnet    │
│ │ ╟ eca8485 (8b7ab89)   │   10 │       - │        - │ 0.71311 │ 0.89845 │        25.839 │ 0.009 │ 0.017    │ alexnet    │
│ │ ╓ 8b7ab89 [exp-1c07b] │    9 │ 0.88889 │  0.27292 │       - │       - │             - │ 0.001 │ 0.09     │ alexnet    │
│ │ ╟ e44d51d             │    8 │       - │        - │ 0.92213 │ 0.19708 │        231.47 │ 0.001 │ 0.09     │ alexnet    │
│ │ ╟ 4d90d9f             │    7 │ 0.88889 │  0.28697 │       - │       - │             - │ 0.001 │ 0.09     │ alexnet    │
│ │ ╟ dc795b6             │    6 │       - │        - │ 0.91393 │ 0.21766 │        180.48 │ 0.001 │ 0.09     │ alexnet    │
│ │ ╟ 8ac9f71             │    5 │ 0.90196 │  0.27692 │       - │       - │             - │ 0.001 │ 0.09     │ alexnet    │
│ │ ╟ 62c417d             │    4 │       - │        - │ 0.87295 │ 0.26793 │        128.89 │ 0.001 │ 0.09     │ alexnet    │
│ │ ╟ 207cc22             │    3 │ 0.87582 │  0.29784 │       - │       - │             - │ 0.001 │ 0.09     │ alexnet    │
│ │ ╟ 028ea88             │    2 │       - │        - │ 0.86885 │ 0.30376 │        77.708 │ 0.001 │ 0.09     │ alexnet    │
│ │ ╟ f3c571f             │    1 │ 0.88235 │  0.31595 │       - │       - │             - │ 0.001 │ 0.09     │ alexnet    │
│ ├─╨ 168c894             │    0 │       - │        - │ 0.80738 │ 0.43822 │        25.962 │ 0.001 │ 0.09     │ alexnet    │
└─────────────────────────┴──────┴─────────┴──────────┴─────────┴─────────┴───────────────┴───────┴──────────┴────────────┘
```

Finding good values for hyperparameters can take a few iterations, even when
you're working with a pretrained model. So we'll run one more experiment to
fine-tune this AlexNet model. This time we'll do it using the `-S` option.

```dvc
$ dvc exp run -S lr=0.025 -S momentum=0.5 -S num_epochs=2
```

The updated table will have values similar to this.

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━┳━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━━┓
┃ neutral:**Experiment**              ┃ metric:**step** ┃ metric:**val_acc** ┃ metric:**val_loss** ┃     metric:**acc** ┃    metric:**loss** ┃ metric:**training_time** ┃ param:**lr**    ┃ param:**momentum** ┃ param:**model_name** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━╇━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━━┩
│ **workspace**               │   **23** │ **0.86928** │   **1.6821** │       - │       - │             - │ **0.025** │ **0.5**      │ **alexnet**    │
│ **main**                    │    - │       - │        - │       - │       - │             - │ **0.001** │ **0.09**     │ **alexnet**    │
│ │ ╓ 4a6297d [exp-3c236] │   23 │ 0.86928 │   1.6821 │       - │       - │             - │ 0.025 │ 0.5      │ alexnet    │
│ │ ╟ b34ee2c             │   22 │       - │        - │ 0.89754 │  1.8102 │        77.135 │ 0.025 │ 0.5      │ alexnet    │
│ │ ╟ 4f4d21a             │   21 │ 0.87582 │   2.2254 │       - │       - │             - │ 0.025 │ 0.5      │ alexnet    │
│ │ ╟ 6c0f09b (d5c5e75)   │   20 │       - │        - │  0.7623 │  2.9795 │        25.181 │ 0.025 │ 0.5      │ alexnet    │
│ │ ╓ d5c5e75 [exp-a20d5] │   19 │ 0.87582 │  0.57303 │       - │       - │             - │ 0.009 │ 0.017    │ alexnet    │
│ │ ╟ e3fffdc             │   18 │       - │        - │ 0.90984 │ 0.33672 │        236.09 │ 0.009 │ 0.017    │ alexnet    │
│ │ ╟ ac25eba             │   17 │  0.8366 │  0.82729 │       - │       - │             - │ 0.009 │ 0.017    │ alexnet    │
│ │ ╟ 647ddb0             │   16 │       - │        - │ 0.93443 │ 0.21811 │         184.4 │ 0.009 │ 0.017    │ alexnet    │
│ │ ╟ b51270e             │   15 │ 0.86275 │  0.68551 │       - │       - │             - │ 0.009 │ 0.017    │ alexnet    │
│ │ ╟ f1cf689             │   14 │       - │        - │ 0.86885 │ 0.51194 │        131.21 │ 0.009 │ 0.017    │ alexnet    │
```

If you take a look at the metrics and the corresponding hyperparameter values,
you'll see which direction you should try next with your values. That's one way
we can use DVC to fine-tune AlexNet for this particular dataset.

## Fine-tuning SqueezeNet

We'll switch over to fine-tuning SqueezeNet now that you've seen how the process
works in DVC. You'll need to update the `model_name` hyperparameter in
`params.yaml` to `squeezenet` if you're following along. The other
hyperparameter values can stay the same for now.

This is a good time to note that DVC is not only tracking the changes of your
hyperparameters for each experiment, it also tracks any code changes and dataset
changes as well.

Let's run one experiment with `dvc exp run --reset` just to show the difference
in the metrics between the two models. Remember, since we're using checkpoints
it continues training on top of the previous experiment. That's why we're using
the `--reset` option here so that we can start a fresh experiment for the new
model. You should see results similar to this in your table.

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━┳━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━━┓
┃ neutral:**Experiment**              ┃ metric:**step** ┃ metric:**val_acc** ┃ metric:**val_loss** ┃     metric:**acc** ┃    metric:**loss** ┃ metric:**training_time** ┃ param:**lr**    ┃ param:**momentum** ┃ param:**model_name** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━╇━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━━┩
│ **workspace**               │    **3** │ **0.84967** │  **0.40012** │       - │       - │             - │ **0.025** │ **0.5**      │ **squeezenet** │
│ **main**                    │    - │       - │        - │       - │       - │             - │ **0.001** │ **0.09**     │ **squeezenet** │
│ │ ╓ 8387747 [exp-39129] │    3 │ 0.84967 │  0.40012 │       - │       - │             - │ 0.025 │ 0.5      │ squeezenet │
│ │ ╟ 1d7c5db             │    2 │       - │        - │ 0.81148 │ 0.43031 │        84.909 │ 0.025 │ 0.5      │ squeezenet │
│ │ ╟ 9009129             │    1 │ 0.77778 │  0.52136 │       - │       - │             - │ 0.025 │ 0.5      │ squeezenet │
│ ├─╨ d32bd5c             │    0 │       - │        - │ 0.70082 │ 0.66132 │        28.955 │ 0.025 │ 0.5      │ squeezenet │
│ │ ╓ 4a6297d [exp-3c236] │   23 │ 0.86928 │   1.6821 │       - │       - │             - │ 0.025 │ 0.5      │ alexnet    │
│ │ ╟ b34ee2c             │   22 │       - │        - │ 0.89754 │  1.8102 │        77.135 │ 0.025 │ 0.5      │ alexnet    │
│ │ ╟ 4f4d21a             │   21 │ 0.87582 │   2.2254 │       - │       - │             - │ 0.025 │ 0.5      │ alexnet    │
│ │ ╟ 6c0f09b (d5c5e75)   │   20 │       - │        - │  0.7623 │  2.9795 │        25.181 │ 0.025 │ 0.5      │ alexnet    │
│ │ ╓ d5c5e75 [exp-a20d5] │   19 │ 0.87582 │  0.57303 │       - │       - │             - │ 0.009 │ 0.017    │ alexnet    │
```

The newest experiment has an accuracy that's significantly different since we
switched models. That tells us that the hyperparameter values that were good for
AlexNet might not work the best for SqueezeNet.

So we'll need to run a few experiments to find the best hyperparameter values.
This time, we'll take advantage of queues in DVC to set up the experiments and
then run them at the same time. To set up a queue, we'll run this command.

```dvc
$ dvc exp run --queue -S lr=0.0001 -S momentum=0.9 -S num_epochs=2
```

Running this sets up an experiment for future execution so we'll go ahead a run
this command one more time with different values.

```dvc
$ dvc exp run --queue -S lr=0.001 -S momentum=0.09 -S num_epochs=2
```

You can check out the details for the queues you have in place by looking at the
experiments table with `dvc exp show`. You'll see something like this.

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━┳━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━━┓
┃ neutral:**Experiment**              ┃ metric:**step** ┃ metric:**val_acc** ┃ metric:**val_loss** ┃     metric:**acc** ┃    metric:**loss** ┃ metric:**training_time** ┃ param:**lr**    ┃ param:**momentum** ┃ param:**model_name** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━╇━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━━┩
│ **workspace**               │    **3** │ **0.84967** │  **0.40012** │       - │       - │             - │ **0.025** │ **0.5**      │ **squeezenet** │
│ **main**                    │    - │       - │        - │       - │       - │             - │ **0.001** │ **0.09**     │ **squeezenet** │
│ │ ╓ 8387747 [exp-39129] │    3 │ 0.84967 │  0.40012 │       - │       - │             - │ 0.025 │ 0.5      │ squeezenet │
│ │ ╟ 1d7c5db             │    2 │       - │        - │ 0.81148 │ 0.43031 │        84.909 │ 0.025 │ 0.5      │ squeezenet │
│ │ ╟ 9009129             │    1 │ 0.77778 │  0.52136 │       - │       - │             - │ 0.025 │ 0.5      │ squeezenet │
│ ├─╨ d32bd5c             │    0 │       - │        - │ 0.70082 │ 0.66132 │        28.955 │ 0.025 │ 0.5      │ squeezenet │
│ │ ╓ 4a6297d [exp-3c236] │   23 │ 0.86928 │   1.6821 │       - │       - │             - │ 0.025 │ 0.5      │ alexnet    │
│ │ ╟ b34ee2c             │   22 │       - │        - │ 0.89754 │  1.8102 │        77.135 │ 0.025 │ 0.5      │ alexnet    │
│ │ ╟ 4f4d21a             │   21 │ 0.87582 │   2.2254 │       - │       - │             - │ 0.025 │ 0.5      │ alexnet    │
│ │ ╟ 6c0f09b (d5c5e75)   │   20 │       - │        - │  0.7623 │  2.9795 │        25.181 │ 0.025 │ 0.5      │ alexnet    │
│ │ ╓ d5c5e75 [exp-a20d5] │   19 │ 0.87582 │  0.57303 │       - │       - │             - │ 0.009 │ 0.017    │ alexnet    │
...

│ ├── *b40e6b1            │   -  │       - │        - │       - │       - │             - │ 0.0001│ 0.9      │ squeezenet │
│ ├── *9dee0b5            │   -  │       - │        - │       - │       - │             - │ 0.001 │ 0.09     │ squeezenet │
└─────────────────────────┴──────┴─────────┴──────────┴─────────┴─────────┴───────────────┴───────┴──────────┴────────────┘
```

Then you can execute all of the queues with this command.

```dvc
$ dvc exp run --run-all
```

Now if you take a look at your table, you'll see the metrics from those 3
experiments.

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━┳━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━━┓
┃ neutral:**Experiment**              ┃ metric:**step** ┃ metric:**val_acc** ┃ metric:**val_loss** ┃     metric:**acc** ┃    metric:**loss** ┃ metric:**training_time** ┃ param:**lr**    ┃ param:**momentum** ┃ param:**model_name** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━╇━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━━┩
│ **workspace**               │    **7** │ **0.83007** │   **0.3769** │       - │       - │             - │ **0.001**  │ **0.09**     │ **squeezenet** │
│ **main**                    │    - │       - │        - │       - │       - │             - │ **0.001**  │ **0.09**     │ **squeezenet** │
│ │ ╓ 9dee0b5 [exp-e26b3] │    7 │ 0.83007 │   0.3769 │       - │       - │             - │ 0.001  │ 0.09     │ squeezenet │
│ │ ╟ 1b415bd             │    6 │       - │        - │ 0.80328 │  0.4465 │        84.242 │ 0.001  │ 0.09     │ squeezenet │
│ │ ╟ 62c9dff             │    5 │ 0.77778 │  0.47377 │       - │       - │             - │ 0.001  │ 0.09     │ squeezenet │
│ │ ╟ fb6879a (b40e6b1)   │    4 │       - │        - │ 0.59016 │ 0.67604 │        28.232 │ 0.001  │ 0.09     │ squeezenet │
│ │ ╓ b40e6b1 [exp-3875f] │    3 │ 0.77124 │  0.48003 │       - │       - │             - │ 0.0001 │ 0.9      │ squeezenet │
│ │ ╟ dd29e75             │    2 │       - │        - │  0.7459 │  0.4984 │        83.944 │ 0.0001 │ 0.9      │ squeezenet │
│ │ ╟ 5f1aadb             │    1 │ 0.69935 │  0.58799 │       - │       - │             - │ 0.0001 │ 0.9      │ squeezenet │
│ ├─╨ 84c36bc             │    0 │       - │        - │ 0.56557 │ 0.74125 │         28.51 │ 0.0001 │ 0.9      │ squeezenet │
│ │ ╓ 8387747 [exp-39129] │    3 │ 0.84967 │  0.40012 │       - │       - │             - │ 0.025  │ 0.5      │ squeezenet │
│ │ ╟ 1d7c5db             │    2 │       - │        - │ 0.81148 │ 0.43031 │        84.909 │ 0.025  │ 0.5      │ squeezenet │
│ │ ╟ 9009129             │    1 │ 0.77778 │  0.52136 │       - │       - │             - │ 0.025  │ 0.5      │ squeezenet │
│ ├─╨ d32bd5c             │    0 │       - │        - │ 0.70082 │ 0.66132 │        28.955 │ 0.025  │ 0.5      │ squeezenet │
│ │ ╓ 4a6297d [exp-3c236] │   23 │ 0.86928 │   1.6821 │       - │       - │             - │ 0.025  │ 0.5      │ alexnet    │
```

Then you'll be able to make a decision on which way to go with your fine-tuning
efforts and make a decision on which model works best for your project. In this
case, it seems like SqueezeNet might be the winner!

You can take all of the DVC setup and apply this to your own custom fine-tuning
use case.

## Conclusion

When you're working with pretrained models, it can be hard to fine-tune them to
give you the results you need. You might end up replacing the last layer of the
model to fit your problem or you might need to dig deeper. Then you have to
consider updating the hyperparameter values until you get the best model you
can.

That's why it's important to research tools that make this process more
efficient. Using DVC to help with this kind of experimentation will give you the
ability to reproduce any experiment you run, making it easier to collaborate
with others on a project. It will also help you keep track of what you've
already tried in previous experiments.
