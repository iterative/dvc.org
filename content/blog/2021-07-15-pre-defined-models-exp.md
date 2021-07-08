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

Trusting pre-trained models (because you lack the compute power & time) and just
replacing & fine-tuning the head is a common strategy in machine learning. In
fine-tuning, we start with a pretrained model and update all of the model’s
parameters for our new task, in essence retraining the whole model.

## Initialize the pretrained model

## Reshape the final layer(s) to have the same number of outputs as the number of classes in the new dataset

## Define for the optimization algorithm which parameters we want to update during training

## Run the training step

## Conclusion
