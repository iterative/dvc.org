---
title: CML self-hosted runners on demand with GPUs
date: 2020-08-07
description: |
  Use your own GPUs with GitHub Actions & GitLab for continuous machine learning.
descriptionLong: |
  Training models often requires special hardware, like extra memory or GPUs. 
  How can we make a CI/CD pipeline with this hardware? 
  Find out how to set up your own self-hosted runners on-demand with GPUs for fast 
  training.
picture: 2020-08-07/header.png
author: david_g_ortega
commentsUrl: https://discuss.dvc.org/t/cml-self-hosted-runners-on-demand-with-gpus/462
tags:
  - CML
  - Continuous Machine Learning
  - GPUs
  - Self-hosted Runner
  - Reproducibility
  - Tutorial
---

When creating your CI/CD workflow for a machine learning (ML) project, you might
find that by default, neither GitHub Actions nor GitLab CI provides the
computing capabilities you need- like GPUs, high memory instances, or multiple
cores.

To overcome this hardware hurdle, one practical approach is to use self-hosted
runners: runners that you manage, but are accessible to your CI/CD system for
executing jobs. It could be an EC2 instance or the GPU under your desk. In our
[recently-released project](https://dvc.org/blog/cml-release), Continuous
Machine Learning (CML), our Docker image acts as a thin wrapper over GitLab and
GitHub runners, adding some extra capabilities.

Here are some benefits of using CML with a self-hosted runner:

1.  **Easy to use.** Working the same way for both GitLab and GitHub.

2.  **Get out of dependency hell.** We tend to install packages (on top of
    packages, on top of packages…) while we‘re experimenting with models. In ML
    in particular, we can be dependent on drivers AND libraries, and sometimes
    precise versions of them (CUDA and TensorFlow, anyone?). Your CI workflow
    will install all the dependencies in the containerised runner leaving your
    machine always clean.

3.  **Security.** If your repo is public your runners could be accesed by anyone
    that could add
    [scripts that exploits your machine](https://docs.github.com/en/actions/hosting-your-own-runners/about-self-hosted-runners#self-hosted-runner-security-with-public-repositories).
    With the containerised runner you are restricting the access to your real
    machine.

4.  **Gain reproducibility.** One of the biggest technical debts in the ML space
    is reproducibility. A few weeks post-experiment, we often discover that
    trying to put your model back in shape is a pain. Looking at our repo, it’s
    not obvious what data or training infrastructure or dependencies went into a
    given result. When you move your ML experiments into a CI/CD system you are
    making a contract of the dependencies and hardware used for your experiment.
    Having that contract isolated by the containerised runner, your experiment
    is perfectly reproducible by anyone in the future.

## Hands on GPU Self-hosted runners 101

### 1) Install nvidia drivers and nvidia-docker in your machine (ubuntu 18.04)

```dvc
$ curl -s -L https://nvidia.GitHub.io/nvidia-docker/gpgkey | sudo apt-key add - && \
  curl -s -L https://nvidia.GitHub.io/nvidia-docker/ubuntu18.04/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list && \
  sudo apt update && sudo apt install -y ubuntu-drivers-common  && \
  sudo ubuntu-drivers autoinstall  && \
  sudo apt install -y nvidia-container-toolkit && \
  sudo systemctl restart docker
```

You can test that your gpus are up and running with the following command:

```dvc
$ docker run --gpus all dvcorg/cml-py3 nvidia-smi
```

We should see something like this:
![](/uploads/images/2020-08-07/nvidia-smi-output.png)

### 2) Start your self-hosted runner

With CML docker images launching your own self-hosted runner is very easy. They
comes in two flavours, depending if you need python 2 or 3:

- dvcorg/cml:latest
- dvcorg/cml-py3:latest

These images have CML and DVC preinstalled (among other perks), plus CUDA
drivers. That's all. You can clone these images and add your own dependencies to
better mimic your own production environment.

```dvc
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

`RUNNER_REPO` is the url of your GitLab or GitHub repo. repo_token is the
personal token generated for your GitHub or GitLab repo. Note that for GitHub
you must check `workflow` along with `repo`.

If everything went fine we should see a runner registered in our repo.

![](/uploads/images/2020-08-07/registered-cml-runner-github.png)

![](/uploads/images/2020-08-07/registered-cml-runner-gitlab.png)

### 3) Setup your GitHub Actions or GitLab workflow yaml file to use the runner and commit your changes.

GitLab

```yaml
train:
  tags:
    - cml
    - gpu

  script:
    - echo 'Hi from CML!' >> report.md
    - cml-send-comment report.md
```

GitHub

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

Congrats! At this point you have done all the steps to have your GPUs up and
running with CML.

# Limitations and future directions

There are still some limitations to be solved at this stage:

- GitHub Actions
  [can’t run a workflow longer than 72 hours](https://docs.github.com/en/actions/getting-started-with-github-actions/about-github-actions#usage-limits).

- Self-hosted runners
  [don’t behave well when they disconnect from the repo](https://GitLab.com/GitLab-org/GitLab/-/issues/229851#note_390371734),
  limiting the possibilities with preemptible instances (also known as spot
  instances).

We’re working on these issues (see issues
[#161](https://github.com/iterative/cml/issues/161),
[#174](https://github.com/iterative/cml/issues/174), and
[#208](https://github.com/iterative/cml/issues/208)) both in terms of CML and
DVC capabilities. So keep watching this space for updates!

<hr />

We started CML to help teams deal with the complexity of ML more effectively-
continuous integration is a proven approach to keeping projects agile even as
the team size, number of experiments, and number of dependencies increase.
Treating experiments like potential new features in a software project opens up
many possibilities for improving our engineering practices. We’re looking
forward to an era when ML experiments can be created, logged, and merged into
production-ready code in minutes, not days or weeks.
