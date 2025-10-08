---
title:
  'End-to-End Computer Vision API, Part 1: Data Versioning and ML Pipelines'
date: 2022-05-03
description: >
  In most cases, training a well-performing Computer Vision (CV) model is not
  the hardest part of building a Computer Vision-based system.  The hardest
  parts are usually about incorporating this model into a maintainable
  application that runs in a production environment bringing value to the
  customers and our business.

descriptionLong: |

  _This is the first part of a three-part series of posts:_
  - _Part 1: Data Versioning and ML Pipelines (this post)_
  - _Part 2: [Local 
  Experiments](/blog/end-to-end-computer-vision-api-part-2-local-experiments)_
  - _Part 3: [Remote Experiments & CI/CD For 
  Machine Learning](/blog/end-to-end-computer-vision-api-part-3-remote-exp-ci-cd)_


  Lately, training a well-performing Computer Vision (CV) model in Jupyter
  Notebooks became fairly straightforward. You can use pre-trained Deep Learning
  models and high-level libraries like `fastai`, `keras`, `pytorch-lightning`
  etc., that abstract away much of the complexity. However, it's still hard to
  incorporate these models into a maintainable production application in a way
  that brings value to the customers and business. 

  Below we'll present the tools that naturally integrate with your git
  repository and makes this part of the process significantly easier.
picture: 2022-05-03/e2e-cv-pt1-cover.png
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

In this series of posts, we'll describe an approach that streamlines the
lifecycles stages of a typical Computer Vision project going from
proof-of-concept to configuration and parameter tuning to, finally, deployment
to the production environment.

Automatic defect detection is a common problem encountered in many industries,
especially manufacturing. A typical setup would include a conveyor belt that
moves some products along the production line and a camera installed above the
conveyor. The camera takes pictures of the products moving below and connects to
a computer that controls it. This computer needs to send raw images to some
defect detection service, receive information about the location and size of the
defects, if any, and may even control what happens to a defective product by
being connected to a robotic arm via a PLC (programmable logic controller).

As our demo project, we've selected a very common deployment pattern for this
setup: a CV model wrapped in a web API service. Specifically, we'll perform an
[image segmentation](https://ai.stanford.edu/~syyeung/cvweb/tutorial3.html) task
on a magnetic tiles dataset first introduced in this
[paper](https://www.researchgate.net/profile/Congying-Qiu/publication/327701995_Saliency_defect_detection_of_magnetic_tiles/links/5b9fd1bd45851574f7d25019/Saliency-defect-detection-of-magnetic-tiles.pdf)
and available in this GitHub
[repository](https://github.com/abin24/Magnetic-tile-defect-datasets.).

![A sample from the image segmentation dataset we used for this project. Top
row: images of magnetic tile surfaces. Bottom row: segmentation mask (white
pixels show defective areas)](../uploads/images/2022-05-03/dataset_sample.png '=800')

- This post (part 1) introduces the concepts of data versioning and ML pipelines
  as they apply to Computer Vision projects.
- Part 2 will focus on experiment tracking and management - key components
  needed for effective collaboration between team members.
- In part 3, you’ll learn how to easily move your model training workloads from
  a local machine to cloud infrastructure and set up proper CI/CD workflows for
  ML projects.

### Target Audience

We assume the target audience of this post to be technical folks who are
familiar with the general Computer Vision concepts, CI/CD processes, and Cloud
infrastructure. Familiarity with the Iterative ecosystem of tools such as
[DVC](https://dvc.org/), [CML](https://cml.dev/), and
[Studio](https://studio.datachain.ai/) is not required but would help with
understanding the nuances of our solution.

### Summary of the Solution

All the code for the project is stored in this GitHub
[repository](https://github.com/iterative/magnetic-tiles-defect).

The CV API solution that we are proposing can be summarized in the following
steps:

- Client service will submit the image to our API endpoint
- The image will be preprocessed to adhere to the specifications that our model
  expects
- The CV model will ingest the processed image and output its prediction image
  mask
- Some postprocessing will be applied to the image mask
- A reply back to the client with the output mask

The repository also contains code for the web application itself, which can be
found in the
[`app`](https://github.com/iterative/magnetic-tiles-defect/tree/main/app)
directory. While the web application is very simple, its implementation is
beyond the scope of this blog post. In short, we can say that it's based on the
[`FastAPI`](https://fastapi.tiangolo.com/) library, and we deploy it to the
Heroku platform through a Docker container defined in this
[`Dockerfile`](https://github.com/iterative/magnetic-tiles-defect/blob/main/Dockerfile).

![Simplified diagram of the CV API
solution](../uploads/images/2022-05-03/web_api_diagram.png '=800')

### Prerequisites for Reproduction

Feel free to fork the
[repository](https://github.com/iterative/magnetic-tiles-defect) if you'd like
to replicate our steps and deploy your own API service. Keep in mind that you'll
need to set up and configure the following:

- GitHub account and
  [GitHub application token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [`pipenv`](https://pipenv.pypa.io/en/latest/) installed locally
- AWS account,
  [access keys](https://aws.amazon.com/premiumsupport/knowledge-center/create-access-key/),
  and an
  [S3 bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/creating-bucket.html)
- Heroku account and
  [Heroku API key](https://help.heroku.com/PBGP6IDE/how-should-i-generate-an-api-key-that-allows-me-to-use-the-heroku-platform-api)

For security reasons, you'll need to set up all keys and tokens through
[GitHub secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets).
You'll also need to change the remote location (and its name) in the
[DVC config](https://github.com/iterative/magnetic-tiles-defect/blob/main/.dvc/config)
file for versioning data and other artifacts.

### Proof-of-Concept in Jupyter Notebooks

A typical ML project would start with data collection and/or labeling, but we
are skipping all this hard work because it was done for us by the researchers
who published the dataset.

We'll get right to the exciting part of training CV models in Jupyter notebooks
which you can find
[here](https://github.com/iterative/magnetic-tiles-defect/tree/main/notebooks).
In short, there we have three notebooks:

1. [`1_ProcessData.ipynb`](https://github.com/iterative/magnetic-tiles-defect/blob/main/notebooks/1_ProcessData.ipynb)
   downloads, processes, and organizes the data for easy loading into the
   training process later
1. [`2_TrainSegmentationModel.ipynb`](https://github.com/iterative/magnetic-tiles-defect/blob/main/notebooks/2_TrainSegmentationModel.ipynb)
   uses [`fastai`](https://github.com/fastai/fastai) Deep Learning framework to
   train an image segmentation model
1. [`3_Evaluate.ipynb`](https://github.com/iterative/magnetic-tiles-defect/blob/main/notebooks/3_Evaluate.ipynb)
   computes model performance on the test dataset

Jupyter Notebook is by far the most popular tool for quick exploratory work when
it comes to data analysis and modeling. However, it's not without
[its own limitations](https://www.youtube.com/watch?v=7jiPeIFXb6U). One of the
biggest issues of Jupyter is that it has no guardrails to ensure
reproducibility, e.g. hidden states of variables and objects as well as the
possibility to run cells out of order. While there are several projects that
attempt to alleviate some of these issues (notably,
[`nodebook`](https://github.com/stitchfix/nodebook),
[`papermill`](https://github.com/nteract/papermill),
[`nbdime`](https://github.com/jupyter/nbdime),
[`nbval`](https://github.com/computationalmodelling/nbval),
[`nbstripout`](https://github.com/kynan/nbstripout), and
[`nbQA`](https://github.com/nbQA-dev/nbQA)), they don’t solve them completely.

That's where the concepts of data versioning and ML pipelines come in.

### Data Versioning

In most ML projects, training data changes gradually over time as new training
instances (images in our case) get added while older ones might be removed.
Simply creating snapshots of our training data at the time of training (e.g.
labeling data directories with dates) quickly becomes unsustainable since these
snapshots will contain many duplicates. Additionally, tracking which data
directory was used to train each model becomes hard to manage very fast; and
linking data versions and models to their respective code versions complicates
things even further.

A much better approach is to:

1. track only the deltas between different versions of the datasets; and

2. have the project’s git repository store only the reference links to the data
   while the actual data is stored in a remote storage

This is exactly what we can do with [DVC](https://dvc.org/) by running only a
couple of DVC commands. In turn, DVC handles all the underlying complexity of
managing data versions, performing file deduplication, pushing and pulling
to/from different remote storage solutions and more.

Check out
[this tutorial](https://dvc.org/doc/use-cases/versioning-data-and-model-files/tutorial)
to learn more about data and model versioning with DVC.

![Diagram of how DVC performs data versioning
](https://editor.analyticsvidhya.com../uploads/86351git-dvc.png)

In this project, AWS S3 is our remote storage configured in the
[`.dvc/config`](https://github.com/iterative/magnetic-tiles-defect/blob/main/.dvc/config)
file. In other words, we store the images in an AWS bucket while only keeping
references to those files in our git repository.

### Refactoring Jupyter code into an ML pipeline

Another powerful set of DVC features is ML pipelines. An ML pipeline is a way to
codify and automate the workflow used to reproduce a machine learning model. A
pipeline consists of a sequence of stages.

First, we did some refactoring of our Jupyter code into individual and
self-contained modules:

- [`data_load.py`](https://github.com/iterative/magnetic-tiles-defect/blob/main/src/stages/data_load.py)
  downloads raw data locally
- [`data_split.py`](https://github.com/iterative/magnetic-tiles-defect/blob/main/src/stages/data_split.py)
  splits data into train and test subsets
- [`train.py`](https://github.com/iterative/magnetic-tiles-defect/blob/main/src/stages/train.py)
  uses [`fastai`](https://github.com/fastai/fastai) library to train a UNet
  model with a ResNet-34 encoder and saves it into a pickle file
- [`eval.py`](https://github.com/iterative/magnetic-tiles-defect/blob/main/src/stages/eval.py)
  evaluates the model's performance on the test subset

Specific execution commands, dependencies, and outputs of each stage are defined
in the pipeline file
[`dvc.yaml`](https://github.com/iterative/magnetic-tiles-defect/blob/main/dvc.yaml)
(more about pipelines files
[here](https://dvc.org/doc/user-guide/project-structure/pipelines-files)).

We've also added an optional
[`check_packages`](https://github.com/iterative/magnetic-tiles-defect/blob/main/dvc.yaml#L2)
stage that freezes the environment into a `requirements.txt` file containing all
python packages and their versions installed in the environment. We enabled the
[`always_changed`](https://dvc.org/doc/command-reference/run#--always-changed)
field in the configuration of this stage to ensure DVC reruns this stage every
time. All other stages have this text file as a dependency. Thus, the entire
pipeline will be rerun if anything about our python environment changes.

We can see the whole dependency graph (directed acyclic graph, to be exact)
using the [`dvc dag`](https://dvc.org/doc/command-reference/dag) command:

```dvc
$ dvc dag
                               +----------------+
                               | check_packages |
                          *****+----------------+
                    *****         *    **    **
               ****             **       **     ***
            ***               **            **      ***
+-----------+               **               *         ***
| data_load |             **                 *             *
+-----------+           **                   *             *
           ***        **                     *             *
              *     **                       *             *
               **  *                         *             *
          +------------+                     *             *
          | data_split |***                  *             *
          +------------+   ***               *             *
                  *            ***           *             *
                  *               ***        *             *
                  *                   **     *             *
                  **                    +-------+        ***
                    ***                 | train |     ***
                        ***             +-------+   ***
                            ***        **        ***
                               ***   **      ***
                                   **    ***
                                  +----------+
                                  | evaluate |
                                  +----------+
```

The entire pipeline can be easily reproduced with the `dvc exp run` command:

```dvc
$ dvc exp run
Running stage 'check_packages':
> python src/stages/check_pkgs.py --config=params.yaml
...
Running stage 'data_load':
> python src/stages/data_load.py --config=params.yaml
...
Running stage 'data_split':
> python src/stages/data_split.py --config=params.yaml
...
Running stage 'train':
> python src/stages/train.py --config=params.yaml
...
Running stage 'evaluate':
> python src/stages/eval.py --config=params.yaml
...
```

## Summary

In this first part of the blog post, we talked about the following:

- Common difficulties when building Computer Vision Web API for defect detection
- Pros and cons of exploratory work in Jupyter Notebooks
- Versioning data in remote storage with DVC
- Moving and refactoring the code from Jupyter Notebooks into DVC pipeline
  stages

In the second part, we’ll see how to get the most out of experiment tracking and
management by seamlessly integrating [DVC](https://github.com/iterative/dvc),
[DVCLive](https://github.com/iterative/dvclive), and
[Iterative Studio](https://studio.datachain.ai/).

---

📰 [Join our Newsletter](https://share.hsforms.com/1KRL5_dTbQMKfV7nDD6V-8g4sbyq)
to stay up to date with news and contributions from the Community!
