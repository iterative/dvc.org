---
title: CML self-hosted runners on demand with GPUs
date: 2020-08-05
description: |
  Bring reproducibility and GPUs to your ML projects in Github or Gitlab pipelines with CML self-hosted runners.
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
  - Continuous Machine Learning
  - GPUs
  - Self-hosted Runner
  - Reproducibility
  - Tutorial
---

When setting your CI/CD workflow for your machine learning (ML) project you
might find that not Github nor Gitlab provides certain computing capabilities
like GPU, high memory, big processors... capabilities that really matter in some
machine learning (ML) problems.

To overcome this hardware hurdle, one practical approach is to use self-hosted
runners: runners that you manage, but are accessible to your CI/CD system for
executing jobs. It could be an EC2 instance or the GPU under your desk. In our
recently-released project, Continuous Machine Learning (CML), we’ve introduced a
tool called cloud-runner. It's a docker container that acts as a thin wrapper
over GitLab and GitHub runners, adding some extra capabilities.

Benefits of using CML cloud runner:

1.  Easy to use. Working the same way for both Gitlab and Github.

2.  Get out of dependency hell. We tend to install packages (on top of packages,
    on top of packages…) while we‘re experimenting with models. In ML in
    particular, we can be dependent on drivers AND libraries, and sometimes
    precise versions of them (CUDA and TensorFlow, anyone?). Your CI workflow
    will install all the dependencies in the containerised runner leaving your
    machine always clean.

3.  Security. If your repo is public your runners could be accesed by anyone
    that could add
    [scripts that exploits your machine](https://docs.github.com/en/actions/hosting-your-own-runners/about-self-hosted-runners#self-hosted-runner-security-with-public-repositories).
    With the containerised runner you are restrifying the access to your real
    machine.

4.  Gain reproducibility. One of the biggest technical debts in the ML space is
    reproducibility. A few weeks post-experiment, we often discover that trying
    to put your model back in shape is a pain. Looking at our repo, it’s not
    obvious what data or training infrastructure or dependencies went into a
    given result. When you move your ML experiments into a CI/CD system you are
    making a contract of the dependencies and hardware used for your experiment.
    Having that contract isolated by the containerised runner, your experiment
    is perfectly reproducible by anyone in the future.

## Hands on GPU Self-hosted runners 101

### 1) Install nvidia drivers and nvidia-docker in your machine (ubuntu 18.04)

```dvc
$ curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add - && \
  curl -s -L https://nvidia.github.io/nvidia-docker/ubuntu18.04/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list && \
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
![](/uploads/images/2020-08-05/nvidia-smi-output.png)

### 2) Start your self-hosted runner

With CML docker images launching your own self-hosted runner is very easy. They
comes in two flavours, depending if you need python 2 or 3:

- dvcorg/cml:latest
- dvcorg/cml-py3:latest

These images have CML and DVC preinstalled (among other perks), plus CUDA
drivers and Python 2.7. The cml-py3 image comes with Python 3.X as well. That's
all. You can clone these images and add your own dependencies to better mimic
your own production environment.

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

`RUNNER_REPO` is the url of your Gitlab or Github repo. repo_token is the
personal token generated for your Github or Gitlab repo. Note that for Github
you must check `workflow` along with `repo`.

If everything went fine we should see a runner registered in our repo.

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

Congrats! At this point you have done all the steps to have your GPUs up and
running with CML.

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
