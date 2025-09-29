---
title: 'End-to-End Computer Vision API, Part 2: Local Experiments'
date: 2022-05-05
description: >
  In part 1, we talked about effective management and versioning of large
  datasets and the creation of reproducible ML pipelines.

  Here we'll learn about experiment management:  generation of many experiments
  by tweaking configurations and hyperparameters;  comparison of experiments
  based on their performance metrics; and persistence of the most promising ones

descriptionLong: |

  _This is the second part of a three-part series of posts:_
  - _Part 1: [Data Versioning and ML
  Pipelines](/blog/end-to-end-computer-vision-api-part-1-data-versioning-and-ml-pipelines)_
  - _Part 2: Local Experiments (this post)_
  - _Part 3: [Remote Experiments & CI/CD For
  Machine Learning](/blog/end-to-end-computer-vision-api-part-3-remote-exp-ci-cd)_


  In [part
  1](https://dvc.org/blog/end-to-end-computer-vision-api-part-1-data-versioning-and-ml-pipelines)
  of this series of posts, we introduced a solution to a common problem faced by
  companies  in the manufacturing industry: detecting defects from images of
  products moving along a production line.  The solution we proposed was a Deep
  Learning-based image segmentation model wrapped in a web API.  We talked about
  effective management and versioning of large datasets and the creation of
  reproducible ML pipelines.

  Here we'll learn about experiment management: generation of many experiments
  by tweaking configurations and hyperparameters;  comparison of experiments
  based on their performance metrics; and persistence of the most promising
  ones.
picture: 2022-05-05/e2e-cv-pt2-cover.png
author: alex_kim
commentsUrl: https://discuss.dvc.org/t/end-to-end-computer-vision/1178
tags:
  - Computer Vision
  - DVC
  - CML
  - CI/CD
  - Experiment Tracking
  - Tutorial
---

### Introduction

[Earlier](https://dvc.org/blog/end-to-end-computer-vision-api-part-1-data-versioning-and-ml-pipelines),
we built a pipeline that produces a trained Computer Vision model. Now we need a
way to efficiently tune its configuration and the hyperparameters of the model.
We want the ability to:

- Run many experiments and easily compare their results to pick the
  best-performing ones.
- Track the global history of the model's performance, and map each improvement
  to a particular change in code, configuration, or data.
- Zoom into the details of each training run to help us diagnose issues.

### Experiment Management

Our DVC pipeline relies on the parameters defined in
the[`params.yaml`](https://github.com/iterative/magnetic-tiles-defect/blob/main/params.yaml)
file in this case (see other possible file types
[here](https://dvc.org/doc/command-reference/params#description)). By loading
its contents in each stage, we can avoid hard-coded parameters. It also allows
rerunning the whole or parts of our pipeline under a different set of
parameters. The DVC pipeline YAML file
[`dvc.yaml`](https://github.com/iterative/magnetic-tiles-defect/blob/main/dvc.yaml)
supports a
[templating format](https://dvc.org/doc/user-guide/project-structure/pipelines-files#templating)
to insert values from different sources in the YAML structure itself.

DVC tracks which stages of the pipeline experienced changes and only reruns
those. By changes, we mean _everything_ that might affect the predictive
performance of your model like changes to the dataset, source code and/or
parameters. This not only ensures complete reproducibility but often
significantly reduces the time needed to rerun the whole pipeline while ensuring
consistent results on every rerun. For example, at first, we started with a
pixel accuracy metric (the percent of pixels in your image that are classified
correctly). Later, we realized that it might not be the best metric to track (as
described in
[this blog post](https://towardsdatascience.com/metrics-to-evaluate-your-semantic-segmentation-model-6bcb99639aa2)),
and we decided to include the Dice coefficient into our metrics. There is no
reason for us to rerun the often time-consuming data preprocessing and model
training stages if we want to incorporate these updates. DVC pipelines can skip
the execution of these stages without our explicit instructions:

```dvc
$ dvc exp run
Running stage 'check_packages':
> pipenv run pip freeze > requirements.txt
Stage 'data_load' didn't change, skipping
Stage 'data_split' didn't change, skipping
Stage 'train' didn't change, skipping
Running stage 'evaluate':
> python src/stages/eval.py --config=params.yaml
...
```

There is a super convenient set of
[Experiment Management](https://dvc.org/doc/user-guide/experiment-management)
features that make switching between reproducible experiments very easy without
adding failed experiments to your git history. Check out this
[blog post](https://dvc.org/blog/ml-experiment-versioning), which talks about
the idea of "ML Experiments as Code." That means treating experiments as you'd
treat code, that is, use git to track all changes in configs, metrics, and data
versions through text files. This approach removes the need for a separate
database/online service to store experiment metadata. If wanted to run a few
experiments with different scales of learning rate values (e.g. `0.1`, `0.01`
and `0.001`), we'd do that as follows:

```dvc
$ dvc exp run --set-param train.learning_rate=0.1
...
$ dvc exp run --set-param train.learning_rate=0.01
...
$ dvc exp run --set-param train.learning_rate=0.001
...
```

Optionally, you can delay the execution of the experiments by putting them in a
[queue](https://dvc.org/doc/user-guide/experiment-management/running-experiments#the-experiments-queue),
and execute them later with the `dvc exp run --run-all` command.

These local experiments are powered by Git references, and you can learn about
them in [this post](https://dvc.org/blog/experiment-refs). We can display all
experiments with the `dvc exp show` command:

```dvc
$ dvc exp show --only-changed --sort-by=dice_mean
```

```dvctable
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  neutral:**Experiment**                neutral:**Created**       metric:**train.loss**   metric:**valid.loss**   metric:**foreground.acc**   metric:**jaccard.coeff**   metric:**dice.multi**   metric:**dice_mean**   metric:**acc_mean**   param:**train.learning_rate**   param:**train.batch_size**   neutral:**models**
 ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  workspace                 -                 0.10356     0.069076          0.90321         0.75906      0.92371     0.70612    0.97689   0.01                  16                 5854528
  exp                       Apr 09, 2022      0.13305     0.087599          0.77803         0.66494      0.89084     0.70534    0.97891   0.01                  8                  6c513ae
  ├── 83a4975 [exp-2d80e]   Apr 09, 2022      0.11189     0.088695          0.86905         0.75296      0.92005     0.70612    0.97689   0.01                  16                 5854528
  ├── 675efb3 [exp-6c274]   Apr 09, 2022      0.10356     0.069076          0.90321         0.75906      0.92371     0.71492    0.98099   0.1                   16                 770745a
  └── c8b1857 [exp-04bcd]   Apr 09, 2022      0.11189     0.088695          0.86905         0.75296      0.92005     0.71619    0.98025   0.01                  8                  094c420
 ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```

Once we identify one or a few best ones (e.g., highest `dice_mean` score), we
can
[persist](https://dvc.org/doc/user-guide/experiment-management/persisting-experiments)
them by creating a branch out of an experiment:

```dvc
$ dvc exp branch exp-04bcd my-branch
Git branch 'my-branch' has been created from experiment 'exp-04bcd'.
To switch to the new branch run:
        git checkout my-branch
```

To track detailed information about the training process, we integrated
[DVCLive](https://dvc.org/doc/dvclive) into the training code by
[adding a callback object](https://github.com/iterative/magnetic-tiles-defect/blob/41a057cf9b9a4a738087c8ad046b99c21f4faf17/src/utils/train_utils.py#L45)
to the training function. DVCLive is a Python library for logging machine
learning metrics and other metadata in simple file formats, which is fully
compatible with DVC.

## Collaboration and Reporting with Iterative Studio

What if we needed to report the results to our team members or maybe hand over
the project to one of them? How do we communicate everything we did since the
conception of the project? What things resulted in the most significant
improvements? What things didn't seem to matter at all?

[Iterative Studio](https://studio.datachain.ai/) is a web-based application with
seamless integration with DVC for data and model management, experiment
tracking, visualization, and automation. It becomes especially valuable when
collaborating with others on the same project or when there's a need to
summarize the progress of the project through metrics and plots. All that's
needed is to connect the project's repository with Studio. Then Studio will
automatically parse all required information from `dvc.yaml`, `params.yaml`, and
other text files that DVC recognizes. The result will be a repository view. The
view for our project is
[here](https://studio.datachain.ai/user/alex000kim/views/magnetic-tiles-defect-5kozhnu9jo).
It displays commits, metrics, parameters, the remote location of data and models
tracked by DVC, and more.

In the screenshot below, you can see that we created a separate `exp` branch
that displays the results of the local experiments that we decided to upload to
our remote repository, like trying different learning rates and batch sizes.
Note that earlier, we discarded all local experiments whose performance we
weren't satisfied with.

![Studio view](../uploads/images/2022-05-05/studio_view.png '=800')

Below we can see the evolution of the key metrics and the value of the loss
function throughout training (enabled by the earlier integration of
[DVCLive](https://dvc.org/doc/dvclive)) for a set of selected commits.

![DVCLive metrics displayed in Studio](../uploads/images/2022-05-05/dvc_live_studio.png '=800')

Now, for example, if we see that the loss function hasn't reached a plateau
after a certain number of epochs, we'll try increasing this number. Or, even
worse, if we see the loss function growing over time, it'll be an indication
that our learning rate may be too high. In this case, we may generate a few
additional experiments with lower learning rate values, eventually picking the
one that achieves good model performance after a reasonable number of training
epochs.

## Summary

In this post, we talked about the following:

- How to run and view ML experiments locally and commit the most promising ones
  to the remote git repository
- How the integration of Iterative Studio with DVC enables collaboration,
  traceability, and reporting on projects with multiple team members
- How DVCLive allows us to peek into the training process and helps us decide
  what ideas to try next

What if we don't have a machine with a powerful GPU, and we'd like to take
advantage of our cloud infrastructure? What if we'd like to have a custom report
(with metrics, plots, and other visuals) accompany every commit/pull request on
GitHub? The third (and last) part of this series of posts will demonstrate how
another open-source tool from the Iterative ecosystem, [CML](https://cml.dev/),
addresses these issues.

---

📰 [Join our Newsletter](https://share.hsforms.com/1KRL5_dTbQMKfV7nDD6V-8g4sbyq)
to stay up to date with news and contributions from the Community!
