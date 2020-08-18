---
title: ML Model Ensembling with Fast Iterations
date: 2017-08-23
description: |
  Here we'll talk about tools that help tackling common technical challenges of
  building pipelines for the ensemble learning.
descriptionLong: |
  In many real-world Machine Learning projects, there is a need to ensemble
  complex models as well as maintain pipelines. As we will demonstrate, DVC is a
  good tool that helps tackling common technical challenges of building
  pipelines for the ensemble learning.
picture: 2017-08-23/post-image.png
author: george_vyshnya
commentsUrl: https://discuss.dvc.org/t/ml-model-ensembling-with-fast-iterations/296
tags:
  - Best Practices
  - Model Ensembling
  - R
---

In a model ensembling setup, the final prediction is a composite of predictions
from individual machine learning algorithms. To make the best model composite,
you have to try dozens of combinations of weights for the model set. It takes a
lot of time to come up with the best one. That is why the iteration speed is
crucial in the ML model ensembling. We are going to make our research
reproducible by using [Data Version Control](http://dvc.org) tool -
([DVC](http://dvc.org)). It provides the ability to quickly re-run and replicate
the ML prediction result by executing just a single command `dvc repro`.

As we will demonstrate, DVC is a good tool that helps tackling common technical
challenges of building pipelines for the ensemble learning.

## Project Overview

In this case, we will build an R-based solution to attack the
supervised-learning regression problem to predict win sales per
[Predict Wine Sales](https://inclass.kaggle.com/c/pred-411-2016-04-u3-wine/)
Kaggle competition.

An ensemble prediction methodology will be used in the project. The weighted
ensemble of three models will be implemented, trained, and predicted from
(namely, these are Linear Regression, `GBM`, and `XGBoost`).

![](/uploads/images/2017-08-23/ensemble-prediction-methodology.png)

If properly designed and used, ensemble prediction can perform much better then
predictions of individual machine learning models composing the ensemble.

Prediction results will be delivered in a format of output CSV file that is
specified in the requirements to the
[Predict Wine Sales](https://inclass.kaggle.com/c/pred-411-2016-04-u3-wine/)
Kaggle competition (so called Kaggle submission file).

## Important Pre-Requisites

In order to try the materials of this
[repository](https://github.com/gvyshnya/DVC_R_Ensemble) in your environment,
the following software should be installed on your machine

- **_Python 3_** runtime environment for your OS (it is required to run DVC
  commands in the batch files)

- **_DVC_** itself (you can install it as a python package by simply doing the
  standard command in your command line prompt: `pip install dvc`)

- **_R_** **_3.4.x_** runtime environment for your OS

- **_git_** command-line client application for your OS

## Technical Challenges

The technical challenges of building the ML pipeline for this project were to
meet business requirements below

- Ability to conditionally trigger execution of 3 different ML prediction models

- Ability to conditionally trigger model ensemble prediction based on
  predictions of those 3 individual models

- Ability to specify weights of each of the individual model predictions in the
  ensemble

- Quick and fast redeployment and re-run of the ML pipeline upon frequent
  reconfiguration and model tweaks

- Reproducibility of the pipeline and forecasting results across the multiple
  machines and team members

The next sections below will explain how these challenges are addressed in the
design of ML pipeline for this project.

## ML Pipeline

The ML pipeline for this project is presented in the diagram below

![](/uploads/images/2017-08-23/ml-pipeline.png)

As you can see, the essential implementation of the solution is as follows

- [`preprocessing.R`](https://gist.github.com/gvyshnya/443424775b0150baac774cc6cf3cb1cc)
  handles all aspects of data manipulations and pre-processing (reading training
  and testing data sets, removing outliers, imputing NAs etc.) as well as stores
  refined training and testing set data as new files to reuse by model scripts

- 3 model scripts implement training and forecasting algorithms for each of the
  models selected for this project
  ([`LR.R`](https://gist.github.com/gvyshnya/7ec76316c24bc1b4f595ef1256f52d3a),
  [`GBM.R`](https://gist.github.com/gvyshnya/50e5ea3efa9771d2e7cc121c2f1a04e4),
  [`xgboost.R`](https://gist.github.com/gvyshnya/2e5799863f02fec652c194020da82dd3))

- [`ensemble.R`](https://gist.github.com/gvyshnya/84379d6a68fd085fe3a26aabad453e55)
  is responsible for the weighted ensemble prediction and the final output of
  the Kaggle submission file

- `config.R` is responsible for all of the conditional logic switches needed in
  the pipeline (it is included as a source to all of modeling and ensemble
  prediction scripts, to get this done)

There is a special note about lack of feature engineering for this project. It
was an intended specification related to the specifics of the dataset. The
existing features were quite instrumental to predict the target values ‘as is’.
Therefore it had been decided to follow the well-known
[Pareto principle](https://en.wikipedia.org/wiki/Pareto_principle) (interpreted
as “**_20% of efforts address 80% of issues_**”, in this case) and not to spend
more time on it.

**_Note_**: all `R` and batch files mentioned throughout this blog post are
available online in a separate GitHub
[repository](https://github.com/gvyshnya/DVC_R_Ensemble). You will be also able
to review more details on the implementation of each of the machine learning
prediction models there.

### Pipeline Configuration Management

All of the essential tweaks to conditional machine learning pipeline for this
project is managed by a configuration file. For ease of its use across solution,
it was implemented as an R code module (`config.R`), to be included to all model
training and forecasting. Thus the respective parameters (assigned as R
variables) will be retrieved by the runnable scripts, and the conditional logic
there will be triggered respectively.

This file is not intended to run from a command line (unlike the rest of the R
scripts in the project).

`gist:gvyshnya/918e94b06ebf222f6bb56ed26a5f44ee#config.R`

### Why Do We Need DVC?

As we all know, there is no way to build the ideal ML model with sound
prediction accuracy from the very beginning. You will have to continuously
adjust your algorithm/model implementations based on the cross-validation
appraisal until you yield the blooming results. This is especially true in the
ensemble learning where you have to constantly tweak not only parameters of the
individual prediction models but also the settings of the ensemble itself

- changing ensemble composition — adding or removing individual prediction
  models

- changing model prediction weights in the resulting ensemble prediction

Under such a condition, DVC will help you to manage your ensemble ML pipeline in
a really solid manner. Let’s consider the following real-world scenario

- Your team member changes the settings of `GBM` model and resubmit its
  implementation to (this is emulated by the commit
  [#8604103f0](https://github.com/gvyshnya/DVC_R_Ensemble/commit/27825d0732f72f07e7e4e48548ddb8a8604103f0),
  check sum `27825d0`)

- You rerun the entire ML pipeline on your computer, to get the newest
  predictions from `GBM` as well as the updated final ensemble prediction

- The results of the prediction appeared to be still not optimal thus someone
  changes the weights of individual models in the ensemble, assigning `GBM`
  higher weight vs. `xgboost` and `LR`

- After the ensemble setup changes committed (and updated `config.R` appeared in
  the repository, as emulated by the commit
  [#eb97612ce](https://github.com/gvyshnya/DVC_R_Ensemble/commit/5bcbe115afcb24886abb4734ff2da42eb97612ce),
  check sum `5bcbe11`), you re-run the model predictions and the final ensemble
  prediction on your machine once again

All that you need to do to handle the changes above is simply to keep running
your **DVC** commands per the script developed (see the section below). You do
not have to remember or know explicitly the changes being made into the project
codebase or its pipeline configuration. **DVC** will automatically check out
latest changes from the repo as well as make sure it runs only those steps in
the pipeline that were affected by the recent changes in the code modules.

### Orchestrating the Pipeline : DVC Command File

After we developed individual R scripts needed by different steps of our Machine
Learning pipeline, we orchestrate it together using DVC.

Below is a batch file illustrating how DVC manages steps of the machine learning
process for this project

`gist:gvyshnya/7f1b8262e3eb7a8b3c16dbfd8cf98644#dvc.bat`

If you then further edit ensemble configuration setup in `code/config.R`, you
can simply leverage the power of DVC as for automatic dependencies resolving and
tracking to rebuild the new ensemble prediction as follows

`gist:gvyshnya/9d80e51ba3d7aa5bd37d100ed82376ee`

## Summary

In this blog post, we worked through the process of building an ensemble
prediction pipeline using DVC. The essential key features of that pipeline were
as follows

- **_reproducibility_** — everybody on a team can run it on their premise

- **_separation of data and code_** — this ensured everyone always runs the
  latest versions of the pipeline jobs with the most up-to-date ‘golden copy’ of
  training and testing data sets

The helpful side effect of using DVC was you stop keeping in mind what was
changed on every step of modifying your project scripts or in the pipeline
configuration. Due to it maintaining the dependencies graph (DAG) automatically,
it automatically triggered the only steps that were affected by the particular
changes, within the pipeline job setup. It, in turn, provides the capability to
quickly iterate through the entire ML pipeline.

> As DVC brings proven engineering practices to often suboptimal and messy ML
> processes as well as helps a typical Data Science project team to eliminate a
> big chunk of common
> [DevOps overheads](https://blog.dataversioncontrol.com/data-version-control-in-analytics-devops-paradigm-35a880e99133),
> I found it extremely useful to leverage DVC on the industrial data science and
> predictive analytics projects.

## Further Reading

1. [Ensemble Learning and Prediction Introduction](https://en.wikipedia.org/wiki/Ensemble_learning)

2. [Using DVC in Machine Learning projects in Python](https://blog.dataversioncontrol.com/data-version-control-beta-release-iterative-machine-learning-a7faf7c8be67)

3. [Using DVC in Machine Learning projects in R](https://blog.dataversioncontrol.com/r-code-and-reproducible-model-development-with-dvc-1507a0e3687b)

4. [Kaggle Ensembling Guide](https://mlwave.com/kaggle-ensembling-guide/)
