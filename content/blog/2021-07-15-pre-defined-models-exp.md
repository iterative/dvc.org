---
title: Using Experiments to Improve Pre-trained Models
date: 2021-07-15
description: |

descriptionLong: |

picture: 2021-07-15/tuning-hyperparams.png
pictureComment: Using Experiments to Improve Pre-trained Models
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/predefined-model-experiments/727
tags:
  - MLOps
  - Git
  - Experiments
  - Reproducibility
---

## Intro

Trusting pre-trained models and replacing, then fine-tuning the head is a common
strategy in machine learning. You'll see this used quite a bit with image
classification with models like AlexNet or ResNet101. These have been trained on
the ImageNet dataset with over 14 million images so they have weights and biases
which gives us a great starting point for further training.

In fine-tuning, we start with a pre-trained model and update all of the model’s
parameters for our new task, in essence re-training the whole model for our
specific application.

## Initialize the pre-trained model

We'll be fine-tuning the AlexNet model to work

## Reshape the final layers to have the same number of outputs as the number of classes in the new dataset

## Define for the optimization algorithm which parameters we want to update during training

## Run the training step

## Conclusion
