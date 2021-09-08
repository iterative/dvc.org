---
title: Adding More Data To Make A More Generic Model
date: 2021-09-14
description: |
  You can easily make changes to your dataset using DVC to handle data versioning. This will let you extend your models to handle
  more generic data.
descriptionLong: |
  When you have an existing model trained for one problem, you might want to extend it to handle other problems. When you have
  data versioning, it's easier to see which data additions make
  your model better or worse and then you can see where to make
  improvements.
picture: 2021-09-14/cats-and-dogs.png
pictureComment: Adding more data to your dataset for a more generic model
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/extending-models-with-more-data/881
tags:
  - MLOps
  - DVC
  - Git
  - Experiments
  - Data Versioning
---

## Intro

You might be in the middle of training a model and then the business problem
shifts. Now you have this model that has been going through the training process
with a specific dataset and you need to make the model more generic.

There's likely something that your model learned that can be useful on this new
dataset, so you might not have to restart the entire training process. We'll do
an example of updating a pre-trained model to use a broader dataset with DVC. By
the end of this, you should see how you can handle this quickly and start
running new experiments to get a more generic model.

## The original pre-trained model

For this post, we'll be making a more generic image classifier by taking the
dataset with bees and ants and adding cats and dogs. You can clone
[the GitHub repo](https://github.com/iterative/pretrained-model-demo) and check
out [this post](https://dvc.org/blog/transfer-learning-experiments) on how we
experimented with both AlexNet and SqueezeNet for an image classification model
with the bees and ants dataset.

If you followed along with the transfer learning post, you'll know that the
models we're working with are both pre-trained models. They are both trained on
the [ImageNet dataset](https://www.image-net.org/) which has over 14 million
images. So we've already spent some time tuning these models on one dataset and
now we're just extending it.

We'll take the models and see what happens as we slowly change the dataset. Then
we'll compare the results for the AlexNet and SqueezeNet model performance on
the new dataset.

## Updating the dataset with DVC

To add the new cats and dogs dataset to the project, we'll use this DVC command.

```dvc
dvc get https://github.com/iterative/dataset-registry blog/cats-dogs
```

This downloads a sample dataset with images of cats and dogs. You can use this
command to download files or directories that are tracked by DVC or Git. This
command can be used from anywhere in the file system, as long as DVC is
installed.

This will make a new directory called `./cats-dogs/data/` that was downloaded
from the DVC remote and it has images for cats and dogs. The data is in a
similar format to the ants and bees directories so there aren't any other code
changes we need to make.

We do need to slowly add in the new data though. For starters, we'll move the
`train` and `val` data for `cats` from the `/cats-dogs/data/` directory to the
corresponding directories in `data/hymenoptera_data`.

With this new data in place, we can start training our model.

## Running new experiments on SqueezeNet

With the updated data, we can start training with the SqueezeNet model and see
how good the results are. To run a new experiment, open your terminal and make
sure you have a virtual environment enabled. Then run this command:

```dvc
dvc exp run
```

Once the training epochs are finished, you should see a table with results
similar to this.

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

The SqueezeNet model did really well on the cats data! Let's check out how the
AlexNet model will perform. We'll do that with another DVC command.

## Changing the model to AlexNet

In this command, we'll update the `model_name` hyperparameter to `alexnet` and
we'll reset our experiments.

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

This model also did well with the addition of the `cats` data. Now let's go
ahead and make a commit here.

```dvc
git add .
git commit -m "added cats train and val data to the dataset"
```

Now we can add the `dogs` data to the training dataset.

## Adding the dogs data

We'll add the `train` and `val` sets for dogs to the corresponding directories
in `data/hymenoptera_data` and go through another experiment run for each of the
models.

### Training with the dogs data on AlexNet

With the dogs data in place, let's reset the experiment to run from the
beginning instead of building on the last run since we have new data.

```dvc
dvc exp run --reset
```

Now that the epochs have finished, let's take a look at the table again.

```dvc
dvc exp show --no-timestamp --include-params lr,momentum,model_name
```

TABLE GOES HERE

See how the performance changed when we added the dogs data? We'll need to run
more experiments with different hyperparameters and maybe some code changes in
order to find out if this model works as a generic classifier for these
creatures.

### Switching the model back to SqueezeNet

Let's see how SqueezeNet will perform with the addtion of the dog data. We'll
reset the experiment and update the `model_name` hyperparameter.

```dvc
dvc exp run --reset -S model_name=squeezenet
```

This will tell us which of the two models performed better. Take a look at the
metrics table now.

```dvc
dvc exp show --no-timestamp --include-params lr,momentum,model_name
```

TABLE GOES HERE

You'll see how this model performs similar to AlexNet and it will take more
experimentation to determine if either of these models is suitable for the
problem or if something else needs to be considered.

## Conclusion

When you want to change large datasets quickly and start tracking how they
affect our model, using a DVC remote makes it easy to do so on different
computers. You'll be able to quickly upload and download GBs of data and see how
changes affect individual experiments.
