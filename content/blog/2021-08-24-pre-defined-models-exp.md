---
title: Using Experiments to Improve Pre-trained Models
date: 2021-08-24
description: |
There are times it will be easier to take a pretrained model and fine-tune it to work with your data. You can do that with DVC experiments.
descriptionLong: |
When you're working with a pretrained model and you want to test different fine-tuning values, using DVC experiments can help you do that faster.
picture: 2021-08-17/pretrained-models.png
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

In the `pretrained-model-tuner.py` file, you'll find the code that defines both
the AlexNet and SqueezeNet models. We start by initializing these models so we
can get the number of model features and the input size we need for fine-tuning.

Since the project has everything we need to initialize the models, we can start
training and comparing the differences between them with the ants/bees dataset.
Running experiments to get the best tuning for each model can make it difficult
to see which changes led to a better result. That's why will be using DVC to
track changes in the code and the data.

## Add a DVC pipeline

Before we begin training, let's set up a DVC pipeline. We'll do that by running
the following command.

```dvc
dvc init
```

This creates the `.dvc/` directory for configuration, the default cache
location, and other necessary files and directories for DVC to work.

Make sure you set up a
[virtual environment](https://python.readthedocs.io/en/stable/library/venv.html)
and install the dependencies with:

```bash
pip install -r requirements.txt
```

Now that you have DVC initialized, this is a good place to commit your changes.

```git
git status
git add .
git commit -m "added DVC pipeline"
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
dvc stage add --name train --deps data/hymenoptera_data --deps pretrained-model-tuner.py --metrics-no-cache results.json python pretrained-model-tuner.py
```

Let's break down the different parts of this command.

- `--name` is the title of the stage
- `--deps` defines the files and directories that a stage needs in order to run
- `--metrics-no-cache` specifies the metrics file produced by the stage, but DVC
  doesn't track it

After the metrics specification, there's the `python pretrained-model-tuner.py`
and this defines the command for executing the training script.

This will generate a new stage in the `dvc.yaml` file. If you take a look at it,
you'll see something like:

```yaml
stages:
  train:
    cmd: python pretrained-model-tuner.py
    deps:
      - data/hymenoptera_data
      - pretrained-model-tuner.py
    metrics:
      - results.json:
          cache: false
```

With the `train` stage defined, let's look at where the metrics actually come
from in the code. If you open `pretrained-model-tuner.py`, you'll see a line
where we dump the accuracy and loss for the training epochs into the
`results.json` file.

```python
if phase == 'train':
    with open("results.json", "w") as fd:
        json.dump({'acc': '{:.4f}'.format(epoch_acc), 'loss': '{:.4f}'.format(epoch_loss)}, fd, indent=4)
```

This is the only line that needed to let DVC work on the project because it's
expecting the accuracy and loss from each training run. With all of this in
place, we can finally start running experiments to fine-tune the two models.

## Fine-tuning AlexNet

## Fine-tuning SqueezeNet

## Conclusion
