---
title: Switching the Dataset for Your Pre-trained Models
date: 2021-09-14
description: |
  You can easily make changes to your dataset using DVC to handle data versioning.
descriptionLong: |
  When there are changes to your dataset, it helps to be able to track them with your models and DVC helps with data versioning.
picture: 2021-09-14/cats-and-dogs.png
pictureComment: Switching the Dataset for Your Pre-trained Models
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/tuning-hyperparameters-with-reproducible-experiments/821
tags:
  - MLOps
  - DVC
  - Git
  - Experiments
  - Pre-trained models
---

## Intro

You might be in the middle of training a model and then the business problem
shifts. Now you have this model that has been going through the training process
with one dataset and you need to use a different dataset.

There's likely something that your model learned that can be useful on this new
dataset, so you might not have to restart the entire training process. We'll do
an example of updating a pre-trained model to use a different dataset with DVC.
By the end of this, you should see how you can handle this quickly and start
running new experiments to get a better model.

## The original pre-trained model

For this post, we'll be changing the dataset from bees and ants to cats and
dogs. You can clone
[the GitHub repo](https://github.com/iterative/pretrained-model-demo) and check
out [this post](https://dvc.org/blog/transfer-learning-experiments) on how we
experimented with both AlexNet and SqueezeNet for an image classification model.

If you followed along with the transfer learning post, you'll know that the
models we're working with are both pre-trained models. They are both trained on
the [ImageNet dataset](https://www.image-net.org/) which has over 14 million
images. So we've already spent some time training these models on one dataset
and now we want to try with another.

We'll take the model training a step further and see what happens when we
completely change the dataset. Then compare the results to the model we get from
starting with AlexNet or SqueezeNet.

## Updating the dataset with DVC

To add the new cats and dogs dataset to the project, we'll use one of the DVC
commands.

```dvc
dvc get https://github.com/iterative/dataset-registry blog/cats-dogs
```

This downloads a sample dataset with images of cats and dogs. You can use this
command to download files or directories that are tracked by DVC or Git. This
command can be used from anywhere in the file system, as long as DVC is
installed.

Now we need to make a minor update to our `pretrained_model_tuner.py` script. We
need to update the location that the data is coming from.

```python
data_dir = "./cats-dogs/data/"
```

This is the directory that was downloaded from the DVC remote and it has images
for cats and dogs. The data is in a similar format to the ants and bees
directories so there aren't any other code changes we need to make.

## Running new experiments on SqueezeNet

With the updated data, we can start training with the existing model and see how
well the results are. To run a new experiment, open your terminal and make sure
you have a virtual environment enabled. Then run this command:

```dvc
dvc exp run
```

You should see a table with results similar to this.

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━┳━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━┓
┃ neutral:**Experiment**              ┃ neutral:**Created**      ┃ metric:**step** ┃     metric:**acc** ┃    metric:**loss** ┃ metric:**training_time** ┃ metric:**val_acc** ┃ metric:**val_loss** ┃ param:**lr**    ┃ param:**momentum** ┃ param:**model_name** ┃ param:**num_classes** ┃ param:**batch_size** ┃ param:**num_epochs** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━╇━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━┩
│ **workspace**               │ **-**            │    **4** │ **0.92152** │ **0.19878** │        **285.73** │ **0.98639** │  **0.07654** │ **0.001** │ **0.09**     │ **squeezenet** │ **2**           │ **8**          │ **5**          │
│ **main**                    │ **Aug 23, 2021** │    **-** │       **-** │       **-** │             **-** │       **-** │        **-** │ **0.001** │ **0.09**     │ **squeezenet** │ **2**           │ **8**          │ **5**          │
│ │ ╓ 2aa1a21 [exp-cf53a] │ 03:16 PM     │    4 │ 0.92152 │ 0.19878 │        285.73 │ 0.98639 │  0.07654 │ 0.001 │ 0.09     │ squeezenet │ 2           │ 8          │ 5          │
│ │ ╟ 50db8c9             │ 03:15 PM     │    3 │ 0.89367 │  0.2482 │        222.05 │ 0.97279 │  0.10205 │ 0.001 │ 0.09     │ squeezenet │ 2           │ 8          │ 5          │
│ │ ╟ af0d5ce             │ 03:14 PM     │    2 │ 0.88608 │ 0.29015 │        159.61 │ 0.97279 │  0.10118 │ 0.001 │ 0.09     │ squeezenet │ 2           │ 8          │ 5          │
│ │ ╟ 3507269             │ 03:13 PM     │    1 │ 0.83544 │ 0.35114 │        96.977 │ 0.93197 │  0.21541 │ 0.001 │ 0.09     │ squeezenet │ 2           │ 8          │ 5          │
│ ├─╨ 50964cb             │ 03:12 PM     │    0 │ 0.73924 │ 0.50988 │        35.207 │ 0.94558 │  0.18173 │ 0.001 │ 0.09     │ squeezenet │ 2           │ 8          │ 5          │
└─────────────────────────┴──────────────┴──────┴─────────┴─────────┴───────────────┴─────────┴──────────┴───────┴──────────┴────────────┴─────────────┴────────────┴────────────┘
```

The SqueezeNet model did really well on the cats and dogs data! Let's check out
how the AlexNet model will perform. We'll do that with another DVC command.

## Changing the model to AlexNet

In this command, we'll update the `model_name` hyperparameter and we'll reset
our experiments.

_Since we're running experiments with checkpoints we have to reset the
checkpoints or else the experiment will continue training from the last
checkpoint._

```dvc
dvc exp run --reset -S model_name=alexnet
```

This sets the new model to AlexNet and we start training from scratch. To make
the table easier to read, we'll show a subset of all the columns avaiable.
Here's what your table should look like after you run this command to show it:

```dvc
dvc exp show --no-timestamp --include-params lr,momentum,model_name
```

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━┳━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━━┓
┃ neutral:**Experiment**              ┃ metric:**step** ┃     metric:**acc** ┃    metric:**loss** ┃ metric:**training_time** ┃ metric:**val_acc** ┃ metric:**val_loss** ┃ param:**lr**    ┃ param:**momentum** ┃ param:**model_name** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━╇━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━━┩
│ **workspace**               │    **4** │  **0.9519** │ **0.14025** │        **253.63** │ **0.96599** │ **0.083774** │ **0.001** │ **0.09**     │ **alexnet**    │
│ **main**                    │    **-** │       **-** │       **-** │             **-** │       **-** │        **-** │ **0.001** │ **0.09**     │ **squeezenet** │
│ │ ╓ 29a86ed [exp-5b8ed] │    4 │  0.9519 │ 0.14025 │        253.63 │ 0.96599 │ 0.083774 │ 0.001 │ 0.09     │ alexnet    │
│ │ ╟ d4cb472             │    3 │ 0.94684 │ 0.16196 │        195.99 │ 0.96599 │ 0.078774 │ 0.001 │ 0.09     │ alexnet    │
│ │ ╟ 42f73c3             │    2 │  0.9443 │ 0.16979 │        141.24 │ 0.96599 │  0.07966 │ 0.001 │ 0.09     │ alexnet    │
│ │ ╟ da7649a             │    1 │ 0.92911 │ 0.20591 │          84.2 │ 0.97279 │  0.09051 │ 0.001 │ 0.09     │ alexnet    │
│ ├─╨ 2bd9e1c             │    0 │ 0.82532 │ 0.35116 │        29.487 │ 0.97279 │  0.09532 │ 0.001 │ 0.09     │ alexnet    │
│ │ ╓ 2aa1a21 [exp-cf53a] │    4 │ 0.92152 │ 0.19878 │        285.73 │ 0.98639 │  0.07654 │ 0.001 │ 0.09     │ squeezenet │
│ │ ╟ 50db8c9             │    3 │ 0.89367 │  0.2482 │        222.05 │ 0.97279 │  0.10205 │ 0.001 │ 0.09     │ squeezenet │
```

## Conclusion

When you want to change large datasets quickly and start tracking how they
affect our model, using a DVC remote makes it easy to do so on different
computers. You'll be able to quickly upload and download GBs of data and see how
changes affect individual experiments.
