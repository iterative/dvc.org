---
title: Using Experiments for Transfer Learning
date: 2021-08-24
description: |
You can work with pretrained models and fine-tune them with DVC experiments.
descriptionLong: |
Running experiments to get the best tuning for a model can make it difficult to see which changes led to a better result. That's why we will be using DVC to track changes in the code and the data.
picture: 2021-08-24/pretrained-models.png
pictureComment: Using Experiments to Improve Pre-trained Models
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/pretrained-model-experiments/727
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
or even people. This is called transfer learning and it can save a lot of time
on developing a model from scratch.

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
[this repo](https://github.com/iterative/pretrained-model-demo).

In the `pretrained_model_tuner.py` file, you'll find the code that defines both
the AlexNet and SqueezeNet models. We start by initializing these models so we
can get the number of model features and the input size we need for fine-tuning.

_You can find the original code and tutorial over at
[this post](https://pytorch.org/tutorials/beginner/finetuning_torchvision_models_tutorial.html)._

Since the project has everything we need to initialize the models, we can start
training and comparing the differences between them with the ants/bees dataset.
Running experiments to get the best tuning for each model can make it difficult
to see which changes led to a better result. That's why we will be using DVC to
track changes in the code and the data.

## Put DVC in place

Before we begin training, let's set up a DVC pipeline. We'll do that by running
the following command.

```dvc
$ dvc init
```

This creates the `.dvc/` directory for configuration, the default cache
location, and other necessary files and directories for DVC to work.

Make sure you set up a
[virtual environment](https://python.readthedocs.io/en/stable/library/venv.html)
and install the dependencies with:

```dvc
$ pip install -r requirements.txt
```

Now that you have DVC initialized, this is a good place to commit your changes.

```git
$ git status
$ git add .
$ git commit -m "added DVC pipeline"
```

With DVC in place, we need to add a stage to the pipeline so that we can train
the model with DVC tracking each experiment.

### Adding the train stage

Stages in DVC let us define individual data processes and can be used to build
detailed machine learning pipelines. You have the ability to define the
different steps of model creation like preprocessing, featurization, and
training.

We'll add a stage for the training step in this example. To do that, run:

```dvc
$ dvc stage add --name train \
 --deps data/hymenoptera_data \
 --deps pretrained_model_tuner.py \
 --metrics-no-cache \
 --params lr,momentum,model_name results.json \
 python pretrained_model_tuner.py
```

Let's break down the different parts of this command.

- `--name` is the title of the stage
- `--deps` short for dependencies, defines the files and directories that a
  stage needs in order to run
- `--params` defines the hyperparameters for the model
- `--metrics-no-cache` specifies the metrics file produced by the stage, but DVC
  doesn't track it

After the metrics specification, there's the `python pretrained_model_tuner.py`
and this defines the command for executing the training script.

This will generate a new stage in the `dvc.yaml` file. If you take a look at it,
you'll see something like:

```yaml
stages:
  train:
    cmd: python pretrained_model_tuner.py
    deps:
      - data/hymenoptera_data
      - pretrained_model_tuner.py
    metrics:
      - results.json:
          cache: false
```

With the `train` stage defined, let's look at where the metrics actually come
from in the code. If you open `pretrained_model_tuner`, you'll see a line where
we dump the accuracy and loss for the training epochs into the `results.json`
file.

```python
if phase == 'train':
    with open("results.json", "w") as fd:
        json.dump({'acc': '{:.4f}'.format(epoch_acc), 'loss': '{:.4f}'.format(epoch_loss)}, fd, indent=4)
```

This code is needed to let DVC access the metrics in the project because we have
set it to read the metrics from `results.json` in our `dvc.yaml`.

Since we have a couple of hyperparameters set in the `params.yaml`, we need to
use those values when we run the training stage. The following code makes the
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

This will execute the `pretrained_model_tuner.py` script and run for 2 epochs
since that's what we defined in the code. When this finishes, you can check out
the metrics from this run with the current hyperparameter values for the
learning rate and momentum.

```dvc
$ dvc exp show
```

You'll see a table similar to this.

```dvctable
┏━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━┓
┃ neutral:**Experiment** ┃ neutral:**Created**  ┃     metric:**acc** ┃    metric:**loss** ┃ param:**lr**     ┃ param:**momentum** ┃
┡━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━┩
│ **workspace**  │ -        │ **0.83607** │ **0.39861** │ **0.0003** │ **0.005**    │
│ main       │ 08:29 AM │       - │       - │ 0.0003 │ 0.005    │
└────────────┴──────────┴─────────┴─────────┴────────┴──────────┘
```

Now let's update the hyperparameters and run another experiment. There are
several ways to do this with DVC:

- Change the hyperparameter values directly in `params.yaml`
- Update the values using the `--set-param` option on `dvc exp run`
- Queue multiple experiments with different values using the `--queue` option on
  `dvc exp run`

We'll do an example of each of these throughout the rest of this article.

Let's start by updating the hyperparameter values in `params.yaml`. You should
have these values in your file.

```yaml
lr: 0.009
momentum: 0.017
```

Now run another experiment with `dvc exp run` and take a look at the metrics
with `dvc exp show`. Your table should look something like this now.

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━┓
┃ neutral:**Experiment** ┃ neutral:**Created**  ┃     metric:**acc** ┃    metric:**loss** ┃ param:**lr**     ┃ param:**momentum** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━┩
│ **workspace**               │ -        │ **0.86066** │ **0.37527** │ **0.009**  │ **0.017**    │
│ main                    │ 08:29 AM │       - │       - │ 0.0003 │ 0.005    │
│ └── 3902843 [exp-6b1b4] │ 08:48 AM │ 0.86066 │ 0.37527 │ 0.009  │ 0.017    │
└─────────────────────────┴──────────┴─────────┴─────────┴────────┴──────────┘
```

Finding good values for hyperparameters can take a few iterations, even when
you're working with a pretrained model. So we'll run one more experiment to
fine-tune this AlexNet model. This time we'll do it using the `--set-param`
option.

```dvc
$ dvc exp run --set-param lr=0.025 --set-param momentum=0.5
```

The updated table will have values similar to this.

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━┓
┃ neutral:**Experiment** ┃ neutral:**Created**  ┃     metric:**acc** ┃    metric:**loss** ┃ param:**lr**     ┃ param:**momentum** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━┩
│ **workspace**               │ -        │ **0.85246** │  **2.5168** │ **0.025**  │ **0.5**      │
│ main                    │ 08:29 AM │       - │       - │ 0.0003 │ 0.005    │
│ ├── 2be6821 [exp-32702] │ 08:53 AM │ 0.85246 │  2.5168 │ 0.025  │ 0.5      │
│ └── 3902843 [exp-6b1b4] │ 08:48 AM │ 0.86066 │ 0.37527 │ 0.009  │ 0.017    │
└─────────────────────────┴──────────┴─────────┴─────────┴────────┴──────────┘
```

If you take a look at the metrics and the corresponding hyperparameter values,
you'll see which direction you should try next with your values. That's one way
we can use DVC to fine-tune AlexNet for this particular dataset.

## Fine-tuning SqueezeNet

We'll switch over to fine-tuning SqueezeNet now that you've seen how the process
works in DVC. You'll need to update the `model_name` variable in
`pretrained_model_tuner.py` to `squeezenet` if you're following along. The
hyperparameter values can stay the same for now.

This is a good time to note that DVC is not only tracking the changes of your
hyperparameters for each experiment, it also tracks any code changes and dataset
changes as well.

Let's run one experiment with `dvc exp run` just to show the difference in the
metrics between the two models. You should see results similar to this in your
table.

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━┓
┃ neutral:**Experiment** ┃ neutral:**Created**  ┃     metric:**acc** ┃    metric:**loss** ┃ param:**lr**     ┃ param:**momentum** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━┩
│ **workspace**               │ -        │ **0.62295** │ **0.53952** │ **0.025**  │ **0.5**      │
│ main                    │ 08:29 AM │       - │       - │ 0.0003 │ 0.005    │
│ ├── ca8b999 [exp-1f15a] │ 08:59 AM │ 0.62295 │ 0.53952 │ 0.025  │ 0.5      │
│ ├── 2be6821 [exp-32702] │ 08:53 AM │ 0.85246 │  2.5168 │ 0.025  │ 0.5      │
│ └── 3902843 [exp-6b1b4] │ 08:48 AM │ 0.86066 │ 0.37527 │ 0.009  │ 0.017    │
└─────────────────────────┴──────────┴─────────┴─────────┴────────┴──────────┘
```

The newest experiment has an accuracy that's significantly different since we
switched models. That tells us that the hyperparameter values that were good for
AlexNet might not work the best for SqueezeNet.

So we'll need to run a few experiments to find the best hyperparameter values.
This time, we'll take advantage of queues in DVC to set up the experiments and
then run them at the same time. To set up a queue, we'll run this command.

```dvc
$ dvc exp run --queue --set-param lr=0.0001 --set-param momentum=0.9
```

Running this sets up an experiment for future execution so we'll go ahead a run
this command a couple more times with different values.

```dvc
$ dvc exp run --queue --set-param lr=0.001 --set-param momentum=0.09
$ dvc exp run --queue --set-param lr=0.01 --set-param momentum=0.009
```

You can check out the details for the queues you have in place by looking at the
experiments table with `dvc exp show`. You'll see something like this.

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━┓
┃ neutral:**Experiment** ┃ neutral:**Created**  ┃     metric:**acc** ┃    metric:**loss** ┃ param:**lr**     ┃ param:**momentum** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━┩
│ **workspace**               │ -        │       - │       - │ **0.0001** │ **0.9**      │
│ main                    │ 08:29 AM │       - │       - │ 0.0003 │ 0.005    │
│ ├── ca8b999 [exp-1f15a] │ 08:59 AM │ 0.62295 │ 0.53952 │ 0.025  │ 0.5      │
│ ├── 2be6821 [exp-32702] │ 08:53 AM │ 0.85246 │  2.5168 │ 0.025  │ 0.5      │
│ ├── 3902843 [exp-6b1b4] │ 08:48 AM │ 0.86066 │ 0.37527 │ 0.009  │ 0.017    │
│ ├── *41c1e46            │ 09:06 AM │       - │       - │ 0.01   │ 0.009    │
│ ├── *e3d7319            │ 09:06 AM │       - │       - │ 0.001  │ 0.09     │
│ └── *9cb439d            │ 09:05 AM │       - │       - │ 0.0001 │ 0.9      │
└─────────────────────────┴──────────┴─────────┴─────────┴────────┴──────────┘
```

Then you can execute all of the queues with this command.

```dvc
$ dvc exp run --run-all
```

Now if you take a look at your table, you'll see the metrics from those 3
experiments.

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━┓
┃ neutral:**Experiment** ┃ neutral:**Created**  ┃     metric:**acc** ┃    metric:**loss** ┃ param:**lr**     ┃ param:**momentum** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━┩
│ **workspace**               │ -        │ **0.88525** │ **0.30593** │ **0.01**   │ **0.009**    │
│ main                    │ 08:29 AM │       - │       - │ 0.0003 │ 0.005    │
│ ├── f434c5c [exp-20267] │ 09:25 AM │ 0.88525 │ 0.30593 │ 0.01   │ 0.009    │
│ ├── efc8194 [exp-6a178] │ 09:23 AM │ 0.77869 │ 0.43352 │ 0.001  │ 0.09     │
│ ├── 5d00dee [exp-2d5d4] │ 09:21 AM │ 0.78689 │ 0.46394 │ 0.0001 │ 0.9      │
│ ├── ca8b999 [exp-1f15a] │ 08:59 AM │ 0.62295 │ 0.53952 │ 0.025  │ 0.5      │
│ ├── 2be6821 [exp-32702] │ 08:53 AM │ 0.85246 │  2.5168 │ 0.025  │ 0.5      │
│ └── 3902843 [exp-6b1b4] │ 08:48 AM │ 0.86066 │ 0.37527 │ 0.009  │ 0.017    │
└─────────────────────────┴──────────┴─────────┴─────────┴────────┴──────────┘
```

Then you'll be able to make a decision on which way to go with your fine-tuning
efforts and make a decision on which model works best for your project. In this
case, it seems like SqueezeNet might be the winner!

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
