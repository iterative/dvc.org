---
title: Using Experiments to Improve Pre-trained Models
date: 2021-08-17
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

Trusting pre-trained models and replacing, then fine-tuning the head is a common
strategy in machine learning. You'll see this used quite a bit with image
classification with models like AlexNet or SqueezeNet. These have been trained
on the ImageNet dataset with over 14 million images so they have weights and
biases which gives machine learning engineers a great starting point for further
training.

In fine-tuning, we start with a pre-trained model and update all of the model’s
parameters for our new task, in essence re-training the whole model for our
specific application.

## Initialize the pre-trained model

We'll be fine-tuning the AlexNet model and the SqueezeNet model to work with an
image dataset containing bees and ants. You can find the code we're working with
in [this repo](https://github.com/iterative/pretrained-model-demo).

## Add a DVC pipeline

### Fine-tuning AlexNet

### Fine-tuning SqueezeNet

## Conclusion
