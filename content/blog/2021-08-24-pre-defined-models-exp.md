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
[this repo](https://github.com/iterative/pretrained-model-demo).

In the `pretrained_model_tuner.py` file, you'll find the code that defines both
the AlexNet and SqueezeNet models. We start by initializing these models so we
can get the number of model features and the input size we need for fine-tuning.

You can find the original code and tutorial over at
[this post](https://pytorch.org/tutorials/beginner/finetuning_torchvision_models_tutorial.html).

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
    metrics:
      - results.json:
          cache: false
```

The reason we need this `dvc.yaml` file is so DVC knows what to pay attention to
in our workflow. It will start managing data, understand which metrics to pay
attention to, and what the expected output for each step is.

You'll typically add stages to `dvc.yaml` using the `dvc stage add` command.
That would look similar to this:

```dvc
$ dvc stage add --name train \
--deps data/hymenoptera \
--deps pretrained_model_tuner.py \
--params lr,momentum,model_name,num_classes,batch_size,num_epochs \
--checkpoints model.pt \
--live dvclive \
python pretrained_model_tuner.py
```

Let's break down the different parts of this command.

- `--name` is the title of the stage
- `--deps` short for dependencies, defines the files and directories that a
  stage needs in order to run
- `--params` defines the hyperparameters for the model
- `--checkpoints` enables checkpoints inside DVC experiments to collect metrics
  from each training epoch
- `--live` enables `dvclive` logging

After the `dvclive` specification, there's the
`python pretrained_model_tuner.py` and this defines the command for executing
the training script.

With the `train` stage defined, let's look at where the metrics actually come
from in the code. If you open `pretrained_model_tuner`, you'll see a line where
we dump the accuracy and loss for the training epochs into the `results.json`
file. We're also saving the model on the epoch run and recording metrics for
each epoch using `dvclive` logging.

```python
if phase == 'train':
    with open("results.json", "w") as fd:
        json.dump({'acc': '{:.4f}'.format(epoch_acc), 'loss': '{:.4f}'.format(epoch_loss)}, fd, indent=4)

        torch.save(model.state_dict(), "model.pt")

        dvclive.log('acc', epoch_acc.item())
        dvclive.log('loss', epoch_loss)
        dvclive.log('training_time', epoch_time_elapsed)

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
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━┳━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━┓
┃ neutral:**Experiment**              ┃ neutral:**Created**  ┃ metric:**step** ┃     metric:**acc** ┃    metric:**loss** ┃ metric:**training_time** ┃ param:**lr**   ┃ param:**momentum** ┃ param:**model_name** ┃ param:**num_classes** ┃ param:**batch_size** ┃ param:**num_epochs** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━╇━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━┩
│ **workspace**               │ -        │    **4** │ **0.91803** │  **33.434** │        **225.35** │ **0.9**  │ **0.35**     │ **alexnet**    │ 2           │ 8          │ 5          │
│ **main**                    │ **10:27 AM** │    **1** │ **0.88525** │ **0.28284** │        **82.143** │ **0.01** │ **0.09**     │ **squeezenet** │ **2**           │ **8**          │ **2**          │
│ │ ╓ a9b7e7c [exp-2e1e1] │ 10:33 AM │    4 │ 0.91803 │  33.434 │        225.35 │ 0.9  │ 0.35     │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ 71d1e30             │ 10:32 AM │    4 │ 0.91803 │  33.434 │        225.35 │ 0.9  │ 0.35     │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ 18c6b09             │ 10:31 AM │    3 │ 0.92623 │  23.869 │        175.51 │ 0.9  │ 0.35     │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ bb2154d             │ 10:31 AM │    2 │ 0.84426 │  52.716 │        125.56 │ 0.9  │ 0.35     │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ 4e2f7c4             │ 10:30 AM │    1 │ 0.86066 │  67.566 │        75.783 │ 0.9  │ 0.35     │ alexnet    │ 2           │ 8          │ 5          │
│ ├─╨ 6ad572d             │ 10:29 AM │    0 │    0.75 │  102.48 │         25.17 │ 0.9  │ 0.35     │ alexnet    │ 2           │ 8          │ 5          │
└─────────────────────────┴──────────┴──────┴─────────┴─────────┴───────────────┴──────┴──────────┴────────────┴─────────────┴────────────┴────────────┘
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
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━┳━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━┓
┃ neutral:**Experiment**              ┃ neutral:**Created**  ┃ metric:**step** ┃     metric:**acc** ┃    metric:**loss** ┃ metric:**training_time** ┃ param:**lr**   ┃ param:**momentum** ┃ param:**model_name** ┃ param:**num_classes** ┃ param:**batch_size** ┃ param:**num_epochs** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━╇━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━┩
│ **workspace**               │ -        │    **9** │ **0.93033** │ **0.18789** │        **230.64** │ **0.009** │ **0.017**    │ **alexnet**    │ **2**           │ **8**          │ **5**          │
│ **main**                    │ **10:27 AM** │    **1** │ **0.88525** │ **0.28284** │        **82.143** │ **0.01**  │ **0.09**     │ **squeezenet** │ **2**           │ **8**          │ **2**          │
│ │ ╓ a08e6af [exp-3d114] │ 10:53 AM │    9 │ 0.93033 │ 0.18789 │        230.64 │ 0.009 │ 0.017    │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ 8d8b6ce             │ 10:53 AM │    9 │ 0.93033 │ 0.18789 │        230.64 │ 0.009 │ 0.017    │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ cb2d304             │ 10:52 AM │    8 │ 0.88115 │ 0.43169 │        179.65 │ 0.009 │ 0.017    │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ 8f6728f             │ 10:51 AM │    7 │ 0.89754 │ 0.31478 │        127.99 │ 0.009 │ 0.017    │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ d201d91             │ 10:51 AM │    6 │ 0.88115 │ 0.41676 │        77.618 │ 0.009 │ 0.017    │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ 5de3429 (a9b7e7c)   │ 10:50 AM │    5 │ 0.81557 │ 0.65929 │        25.803 │ 0.009 │ 0.017    │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╓ a9b7e7c [exp-2e1e1] │ 10:33 AM │    4 │ 0.91803 │  33.434 │        225.35 │ 0.9   │ 0.35     │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ 71d1e30             │ 10:32 AM │    4 │ 0.91803 │  33.434 │        225.35 │ 0.9   │ 0.35     │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ 18c6b09             │ 10:31 AM │    3 │ 0.92623 │  23.869 │        175.51 │ 0.9   │ 0.35     │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ bb2154d             │ 10:31 AM │    2 │ 0.84426 │  52.716 │        125.56 │ 0.9   │ 0.35     │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ 4e2f7c4             │ 10:30 AM │    1 │ 0.86066 │  67.566 │        75.783 │ 0.9   │ 0.35     │ alexnet    │ 2           │ 8          │ 5          │
│ ├─╨ 6ad572d             │ 10:29 AM │    0 │    0.75 │  102.48 │         25.17 │ 0.9   │ 0.35     │ alexnet    │ 2           │ 8          │ 5          │
└─────────────────────────┴──────────┴──────┴─────────┴─────────┴───────────────┴───────┴──────────┴────────────┴─────────────┴────────────┴────────────┘
```

Finding good values for hyperparameters can take a few iterations, even when
you're working with a pretrained model. So we'll run one more experiment to
fine-tune this AlexNet model. This time we'll do it using the `--set-param`
option.

```dvc
$ dvc exp run --set-param lr=0.025 --set-param momentum=0.5 --set-param num_epochs=2
```

The updated table will have values similar to this.

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━┳━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━┓
┃ neutral:**Experiment**              ┃ neutral:**Created**  ┃ metric:**step** ┃     metric:**acc** ┃    metric:**loss** ┃ metric:**training_time** ┃ param:**lr**   ┃ param:**momentum** ┃ param:**model_name** ┃ param:**num_classes** ┃ param:**batch_size** ┃ param:**num_epochs** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━╇━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━┩
│ **workspace**               │ -        │   **11** │ **0.86885** │  **2.0228** │        **76.401** │ **0.025** │ **0.5**      │ **alexnet**    │ **2**           │ **8**          │ **2**          │
│ **main**                    │ **10:27 AM** │    **1** │ **0.88525** │ **0.28284** │        **82.143** │ **0.01**  │ **0.09**     │ **squeezenet** │ **2**           │ **8**          │ **2**          │
│ │ ╓ 3c943f9 [exp-8ee91] │ 10:58 AM │   11 │ 0.86885 │  2.0228 │        76.401 │ 0.025 │ 0.5      │ alexnet    │ 2           │ 8          │ 2          │
│ │ ╟ c00a0d9             │ 10:58 AM │   11 │ 0.86885 │  2.0228 │        76.401 │ 0.025 │ 0.5      │ alexnet    │ 2           │ 8          │ 2          │
│ │ ╟ 5164d1e (a08e6af)   │ 10:57 AM │   10 │    0.75 │  3.2936 │         25.18 │ 0.025 │ 0.5      │ alexnet    │ 2           │ 8          │ 2          │
│ │ ╓ a08e6af [exp-3d114] │ 10:53 AM │    9 │ 0.93033 │ 0.18789 │        230.64 │ 0.009 │ 0.017    │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ 8d8b6ce             │ 10:53 AM │    9 │ 0.93033 │ 0.18789 │        230.64 │ 0.009 │ 0.017    │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ cb2d304             │ 10:52 AM │    8 │ 0.88115 │ 0.43169 │        179.65 │ 0.009 │ 0.017    │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ 8f6728f             │ 10:51 AM │    7 │ 0.89754 │ 0.31478 │        127.99 │ 0.009 │ 0.017    │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ d201d91             │ 10:51 AM │    6 │ 0.88115 │ 0.41676 │        77.618 │ 0.009 │ 0.017    │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ 5de3429 (a9b7e7c)   │ 10:50 AM │    5 │ 0.81557 │ 0.65929 │        25.803 │ 0.009 │ 0.017    │ alexnet    │ 2           │ 8          │ 5          │
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

Let's run one experiment with `dvc exp run` just to show the difference in the
metrics between the two models. You should see results similar to this in your
table.

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━┳━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━┓
┃ neutral:**Experiment**              ┃ neutral:**Created**  ┃ metric:**step** ┃     metric:**acc** ┃    metric:**loss** ┃ metric:**training_time** ┃ param:**lr**   ┃ param:**momentum** ┃ param:**model_name** ┃ param:**num_classes** ┃ param:**batch_size** ┃ param:**num_epochs** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━╇━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━┩
│ **workspace**               │ -        │   **13** │ **0.86066** │ **0.36708** │        **87.417** │ **0.025** │ **0.5**      │ **squeezenet** │ **2**           │ **8**          │ **2**          │
│ **main**                    │ **10:27 AM** │    **1** │ **0.88525** │ **0.28284** │        **82.143** │ **0.01**  │ **0.09**     │ **squeezenet** │ **2**           │ **8**          │ **2**          │
│ │ ╓ ca84fbb [exp-7aacc] │ 11:28 AM │   13 │ 0.86066 │ 0.36708 │        87.417 │ 0.025 │ 0.5      │ squeezenet │ 2           │ 8          │ 2          │
│ │ ╟ a13e12d             │ 11:27 AM │   13 │ 0.86066 │ 0.36708 │        87.417 │ 0.025 │ 0.5      │ squeezenet │ 2           │ 8          │ 2          │
│ │ ╟ e13e677 (3c943f9)   │ 11:26 AM │   12 │  0.7418 │ 0.58166 │        29.316 │ 0.025 │ 0.5      │ squeezenet │ 2           │ 8          │ 2          │
│ │ ╓ 3c943f9 [exp-8ee91] │ 10:58 AM │   11 │ 0.86885 │  2.0228 │        76.401 │ 0.025 │ 0.5      │ alexnet    │ 2           │ 8          │ 2          │
│ │ ╟ c00a0d9             │ 10:58 AM │   11 │ 0.86885 │  2.0228 │        76.401 │ 0.025 │ 0.5      │ alexnet    │ 2           │ 8          │ 2          │
│ │ ╟ 5164d1e (a08e6af)   │ 10:57 AM │   10 │    0.75 │  3.2936 │         25.18 │ 0.025 │ 0.5      │ alexnet    │ 2           │ 8          │ 2          │
│ │ ╓ a08e6af [exp-3d114] │ 10:53 AM │    9 │ 0.93033 │ 0.18789 │        230.64 │ 0.009 │ 0.017    │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ 8d8b6ce             │ 10:53 AM │    9 │ 0.93033 │ 0.18789 │        230.64 │ 0.009 │ 0.017    │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ cb2d304             │ 10:52 AM │    8 │ 0.88115 │ 0.43169 │        179.65 │ 0.009 │ 0.017    │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ 8f6728f             │ 10:51 AM │    7 │ 0.89754 │ 0.31478 │        127.99 │ 0.009 │ 0.017    │ alexnet    │ 2           │ 8          │ 5          │
```

The newest experiment has an accuracy that's significantly different since we
switched models. That tells us that the hyperparameter values that were good for
AlexNet might not work the best for SqueezeNet.

So we'll need to run a few experiments to find the best hyperparameter values.
This time, we'll take advantage of queues in DVC to set up the experiments and
then run them at the same time. To set up a queue, we'll run this command.

```dvc
$ dvc exp run --queue --set-param lr=0.0001 --set-param momentum=0.9 --set-param num_epochs=2
```

Running this sets up an experiment for future execution so we'll go ahead a run
this command one more time with different values.

```dvc
$ dvc exp run --queue --set-param lr=0.001 --set-param momentum=0.09 --set-param num_epochs=2
```

You can check out the details for the queues you have in place by looking at the
experiments table with `dvc exp show`. You'll see something like this.

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━┳━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━┓
┃ neutral:**Experiment**              ┃ neutral:**Created**  ┃ metric:**step** ┃     metric:**acc** ┃    metric:**loss** ┃ metric:**training_time** ┃ param:**lr**   ┃ param:**momentum** ┃ param:**model_name** ┃ param:**num_classes** ┃ param:**batch_size** ┃ param:**num_epochs** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━╇━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━┩
│ **workspace**               │ -        │   **13** │ **0.86066** │ **0.36708** │        **87.417** │ **0.025** │ **0.5**      │ **squeezenet** │ **2**           │ **8**          │ **2**          │
│ **main**                    │ **10:27 AM** │    **1** │ **0.88525** │ **0.28284** │        **82.143** │ **0.01**  │ **0.09**     │ **squeezenet** │ **2**           │ **8**          │ **2**          │
│ │ ╓ ca84fbb [exp-7aacc] │ 11:28 AM │   13 │ 0.86066 │ 0.36708 │        87.417 │ 0.025 │ 0.5      │ squeezenet │ 2           │ 8          │ 2          │
│ │ ╟ a13e12d             │ 11:27 AM │   13 │ 0.86066 │ 0.36708 │        87.417 │ 0.025 │ 0.5      │ squeezenet │ 2           │ 8          │ 2          │
│ │ ╟ e13e677 (3c943f9)   │ 11:26 AM │   12 │  0.7418 │ 0.58166 │        29.316 │ 0.025 │ 0.5      │ squeezenet │ 2           │ 8          │ 2          │
│ │ ╓ 3c943f9 [exp-8ee91] │ 10:58 AM │   11 │ 0.86885 │  2.0228 │        76.401 │ 0.025 │ 0.5      │ alexnet    │ 2           │ 8          │ 2          │
│ │ ╟ c00a0d9             │ 10:58 AM │   11 │ 0.86885 │  2.0228 │        76.401 │ 0.025 │ 0.5      │ alexnet    │ 2           │ 8          │ 2          │
│ │ ╟ 5164d1e (a08e6af)   │ 10:57 AM │   10 │    0.75 │  3.2936 │         25.18 │ 0.025 │ 0.5      │ alexnet    │ 2           │ 8          │ 2          │
│ │ ╓ a08e6af [exp-3d114] │ 10:53 AM │    9 │ 0.93033 │ 0.18789 │        230.64 │ 0.009 │ 0.017    │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ 8d8b6ce             │ 10:53 AM │    9 │ 0.93033 │ 0.18789 │        230.64 │ 0.009 │ 0.017    │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ cb2d304             │ 10:52 AM │    8 │ 0.88115 │ 0.43169 │        179.65 │ 0.009 │ 0.017    │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ 8f6728f             │ 10:51 AM │    7 │ 0.89754 │ 0.31478 │        127.99 │ 0.009 │ 0.017    │ alexnet    │ 2           │ 8          │ 5          │
│ ├── *e3d7319            │ 11:37 AM │    - │       - │       - |             - | 0.001 │ 0.09     │ squeezenet | 2           | 8          | 5          |
│ ├── *e3d7319            │ 11:37 AM │    - │       - │       - |             - | 0.0001│ 0.9      │ squeezenet | 2           | 8          | 5          |
```

Then you can execute all of the queues with this command.

```dvc
$ dvc exp run --run-all
```

Now if you take a look at your table, you'll see the metrics from those 3
experiments.

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━┳━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━┓
┃ neutral:**Experiment**              ┃ neutral:**Created**  ┃ metric:**step** ┃     metric:**acc** ┃    metric:**loss** ┃ metric:**training_time** ┃ param:**lr**   ┃ param:**momentum** ┃ param:**model_name** ┃ param:**num_classes** ┃ param:**batch_size** ┃ param:**num_epochs** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━╇━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━┩
│ workspace               │ -        │    3 │ 0.78279 │ 0.48124 │        88.973 │ 0.001  │ 0.09     │ squeezenet │ 2           │ 8          │ 2          │
│ main                    │ 10:27 AM │    1 │ 0.88525 │ 0.28284 │        82.143 │ 0.01   │ 0.09     │ squeezenet │ 2           │ 8          │ 2          │
│ │ ╓ 15859d7 [exp-690c7] │ 11:36 AM │    3 │ 0.78279 │ 0.48124 │        88.973 │ 0.001  │ 0.09     │ squeezenet │ 2           │ 8          │ 2          │
│ │ ╟ 645d45a             │ 11:36 AM │    3 │ 0.78279 │ 0.48124 │        88.973 │ 0.001  │ 0.09     │ squeezenet │ 2           │ 8          │ 2          │
│ │ ╟ 1afd3bb (7093d95)   │ 11:35 AM │    2 │ 0.63934 │ 0.66733 │        30.442 │ 0.001  │ 0.09     │ squeezenet │ 2           │ 8          │ 2          │
│ │ ╓ 7093d95 [exp-41d7d] │ 11:34 AM │    1 │ 0.79508 │ 0.48292 │        86.662 │ 0.0001 │ 0.9      │ squeezenet │ 2           │ 8          │ 2          │
│ │ ╟ 18d59c4             │ 11:34 AM │    1 │ 0.79508 │ 0.48292 │        86.662 │ 0.0001 │ 0.9      │ squeezenet │ 2           │ 8          │ 2          │
│ ├─╨ dfcca98             │ 11:33 AM │    0 │ 0.54508 │  0.7349 │        30.123 │ 0.0001 │ 0.9      │ squeezenet │ 2           │ 8          │ 2          │
│ │ ╓ ca84fbb [exp-7aacc] │ 11:28 AM │   13 │ 0.86066 │ 0.36708 │        87.417 │ 0.025  │ 0.5      │ squeezenet │ 2           │ 8          │ 2          │
│ │ ╟ a13e12d             │ 11:27 AM │   13 │ 0.86066 │ 0.36708 │        87.417 │ 0.025  │ 0.5      │ squeezenet │ 2           │ 8          │ 2          │
│ │ ╟ e13e677 (3c943f9)   │ 11:26 AM │   12 │  0.7418 │ 0.58166 │        29.316 │ 0.025  │ 0.5      │ squeezenet │ 2           │ 8          │ 2          │
│ │ ╓ 3c943f9 [exp-8ee91] │ 10:58 AM │   11 │ 0.86885 │  2.0228 │        76.401 │ 0.025  │ 0.5      │ alexnet    │ 2           │ 8          │ 2          │
│ │ ╟ c00a0d9             │ 10:58 AM │   11 │ 0.86885 │  2.0228 │        76.401 │ 0.025  │ 0.5      │ alexnet    │ 2           │ 8          │ 2          │
│ │ ╟ 5164d1e (a08e6af)   │ 10:57 AM │   10 │    0.75 │  3.2936 │         25.18 │ 0.025  │ 0.5      │ alexnet    │ 2           │ 8          │ 2          │
│ │ ╓ a08e6af [exp-3d114] │ 10:53 AM │    9 │ 0.93033 │ 0.18789 │        230.64 │ 0.009  │ 0.017    │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ 8d8b6ce             │ 10:53 AM │    9 │ 0.93033 │ 0.18789 │        230.64 │ 0.009  │ 0.017    │ alexnet    │ 2           │ 8          │ 5          │
│ │ ╟ cb2d304             │ 10:52 AM │    8 │ 0.88115 │ 0.43169 │        179.65 │ 0.009  │ 0.017    │ alexnet    │ 2           │ 8          │ 5          │
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
