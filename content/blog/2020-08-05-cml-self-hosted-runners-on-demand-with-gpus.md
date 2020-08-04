---
title: CML self-hosted runners on demand with GPUs
date: 2020-08-05
description: |
  Bring reproducibilty and GPUs to your ML projects in Github or Gitlab pipelines with CML self-hosted runners.
descriptionLong: |
  When we train our models we usually need special hardware like big memory or GPUs. 
  How can we provide our CI/CD pipeline with such hardware?
  Even more, how could we ensure the reproducibility of the experiment? 
  Find out how to set up your own self-hosted runners on demand with GPUs for fast training and ensuring reproducibility in this blog post!
picture: 2020-08-05/header.png
author: david_g_ortega
commentsUrl: https://discuss.dvc.org/t/cml-self-hosted-runners-on-demand-with-gpus/462
tags:
  - CML
  - GPUs
  - Self-hosted Runner
  - Continuous Machine Learning
  - Github
  - Gitlab
  - Reproducibility
  - Tutorial
---

Normally, CI/CD workflows are set up as a collection of jobs that are picked and
executed by runners hosted by your vendor (like GitHub or GitLab). When you
commit to your repo, a CI/CD system responds by starting a workflow and
assigning the job(s) to runners.

Sounds perfect! But you might find that your vendor doesn’t support certain
computing capabilities like GPU, high memory, big processors... capabilities
that really matter in some machine learning (ML) problems (you know what I’m
talking about if you’ve ever tried to do SVD on a gigantic matrix without enough
RAM, or train a deep neural network without a GPU). That makes building a
continuous ML workflow simply impossible without addressing special hardware
needs.

To overcome this hardware hurdle, one practical approach is to use self-hosted
runners: runners that you manage, but are accessible to your CI/CD system for
executing jobs. It could be an EC2 instance or the GPU under your desk. Both
GitHub and GitLab provide support and official docs for using self-hosted
runners.

In our recently-released project, Continuous Machine Learning (CML), we’re
creating ways to adapt tools you already know (like GitHub Actions & GitLab CI)
to ML. To specifically address this hardware issue, we’ve introduced a tool
called cloud-runner. It acts as a thin wrapper over GitLab and GitHub runners,
adding some extra capabilities to help you use self-hosted runners for ML
workflows.

With CML docker images launching your own self-hosted runner is very easy. They
comes in two flavours, depending if you need python 2 or 3:

- dvcorg/cml:latest
- dvcorg/cml-py3:latest

These images have CML and DVC preinstalled (among other perks), plus CUDA
drivers and Python 2.7. The cml-py3 image comes with Python 3.X as well. That's
all- you can clone these images and add your own dependencies to better mimic
your own production environment.

Using these runners will not only allow us to access special computing
capabilities as stated, will also help us with:

1.  Optimize resource usage. Using the CI/CD with our GPU hardware you can just
    focus on experimenting, not turning machines on and off. When your workflow
    automatically provisions runners, you maximize time and resources by only
    using compute time when you’re training.

2.  Get out of dependency hell. As data scientists, we tend to install packages
    (on top of packages, on top of packages…) while we‘re experimenting with
    models. In ML in particular, we can be dependent on drivers AND libraries,
    and sometimes precise versions of them (CUDA and TensorFlow, anyone?). This
    complexity makes it difficult to maintain a reproducible training
    environment that’s easy to rebuild on a moment’s notice and compare to your
    eventual production environment. Using a CI system that codifies

3.  Always know what you did. One of the biggest technical debts in the ML space
    is reproducibility. A few weeks post-experiment, we often discover that
    trying to put your model back in shape is a pain. Looking at our repo, it’s
    not obvious what data or training infrastructure or dependencies went into a
    given result. Having a record that an experiment happened isn’t the same as
    being able to recreate it. But just moving your ML experiments into a CI/CD
    system constrains the environment and hardware used for your experiment-the
    workflow is perfectly isolated by the containerised runner and perfectly
    reproducible by yourself in the future or even other peers.

Benefits of using CML cloud runner:

- Easy to install or use. Working the same way for both vendors.
- Maximise the use of your resources using the CI/CD.
- Reproducibility of your ML experiments. Resolving dependencies issues and
  tainted environments.

## Hands on GPU Self-hosted runners 101

### 1) Install nvidia drivers and nvidia-docker in your machine (ubuntu 18.04)

```sh
$ curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add - && \
  curl -s -L https://nvidia.github.io/nvidia-docker/ubuntu18.04/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list && \
  sudo apt update && sudo apt install -y ubuntu-drivers-common  && \
  sudo ubuntu-drivers autoinstall  && \
  sudo apt install -y nvidia-container-toolkit && \
  sudo systemctl restart docker
```

You can test that your gpus are up and running with the following command:

```sh
$ docker run --gpus all dvcorg/cml-gpu-py3-cloud-runner nvidia-smi
```

We should see something like this:
![](/uploads/images/2020-08-05/nvidia-smi-output.png)

### 2) Start your self-hosted runner

```sh
$ docker run --name myrunner -d --gpus all \
    -e RUNNER_IDLE_TIMEOUT=1800 \
    -e RUNNER_LABELS=cml,gpu \
    -e RUNNER_REPO=$my_repo_url \
    -e repo_token=$my_repo_token \
    dvcorg/cml-py3
```

where:

`RUNNER_IDLE_TIMEOUT` is the time in seconds that the runner is going to be idle
at most waiting for jobs to come, if no one comes the runner shuts down and
unregisters from your repo.

`RUNNER_LABELS` a comma delimited list of labels that we are setting in our
workflow that the jobs will wait for.

`RUNNER_REPO` is the url of your Gitlab or Github repo. repo_token is the
personal token generated for your Github or Gitlab repo. Note that for Github
you must check `workflow` along with `repo`.

If everything went fine we should see a runner registered in our repo correctly.

![](/uploads/images/2020-08-05/registered-cml-runner-github.png)

![](/uploads/images/2020-08-05/registered-cml-runner-gitlab.png)

### 3) Setup your Github Actions or Gitlab workflow yaml file to use the runner and commit your changes.

Gitlab

```yaml
train:
  tags:
    - cml
    - gpu

  script:
    - echo 'Hi from CML!' >> report.md
    - cml-send-comment report.md
```

Github

```yaml
name: train-my-model

on: [push]

jobs:
  train:
    runs-on: [self-hosted, cml, gpu]

    steps:
      - uses: actions/checkout@v2

      - name: cml_run
        run: |
          echo 'Hi from CML!' >> report.md
          cml-send-comment report.md
```

# Limitations and future directions

There are still some limitations to be solved at this stage: Github Actions
[can’t run a workflow longer than 72 hours](https://docs.github.com/en/actions/getting-started-with-github-actions/about-github-actions#usage-limits).

Self-hosted runners
[don’t behave well when they disconnect from the repo](https://gitlab.com/gitlab-org/gitlab/-/issues/229851#note_390371734),
limiting the possibilities with preemptible instances (also known as spot
instances).

We’re working on both these issues both in terms of CML and DVC capabilities. So
keep watching this space for updates!

We started CML to help teams deal with the complexity of ML more effectively-
continuous integration is a proven approach to keeping projects agile even as
the team size, number of experiments, and number of dependencies increase.
Treating experiments like potential new features in a software project opens up
many possibilities for improving our engineering practices. We’re looking
forward to an era when ML experiments can be created, logged, and merged into
production-ready code in minutes, not days or weeks.
