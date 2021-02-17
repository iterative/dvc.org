---
title: 'Pre-Release Notes: Automatically Train Models in the Cloud with CML'
date: 2021-02-17
description: |
  New features are here to make launching cloud 
  compute for continuous integration workflows 
  shorter, sweeter and easier than ever. Plus, 
  a new GitHub Action to setup CML means more 
  ways to use CML without our Docker container.
descriptionLong: |
  New features are here to make launching cloud 
  compute for continuous integration workflows 
  shorter, sweeter and easier than ever. Plus, 
  a new GitHub Action to setup CML means more 
  ways to use CML without our Docker container.
picture: 2021-02-17/gh_actions_art.png
author: elle_obrien
commentsUrl: https://discuss.dvc.org/t/cml-self-hosted-runners-on-demand-with-gpus/462
tags:
  - CML
  - Continuous Machine Learning
  - GitHub Actions
  - GitLab
  - Cloud
---

Today, we're pre-releasing some new features in Continuous Machine Learning, or
[CML](https://cml.dev)- our open source project to adapt popular continuous
integration (CI) systems like GitHub Actions and GitLab CI for data science.

Here's what you'll get:

## Brand new method to provision cloud compute for your CI workflows

In the initial CML release, we provided a method user Docker Machine to launch
instances on AWS, Azure and GCP from your GitHub Actions and GitLab CI
workflows. We've completely redone this recipe using Terraform and now it's
shorter, sweeter, and more powerful than ever!

Check out this example workflow to launch an EC2 instance from a GitHub Action
workflow and then train a model.

```yaml
name: 'Train in the cloud'
on: [push]

jobs:
  deploy-runner:
    runs-on: [ubuntu-latest]
    steps:
      - uses: iterative/setup-cml@v1
      - uses: actions/checkout@v2
      - name: deploy
        shell: bash
        env:
          repo_token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          cml-runner \
          --cloud aws \
          --cloud-region us-west \
          --cloud-type=t2.micro \
          --labels=cml-runner
  train-model:
    needs: deploy-runner
    runs-on: [self-hosted, cml-runner]
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        with:
          python-version: '3.x'
      - name: 'Train my model'
        run: |
          pip install -r requirements.txt
          python train.py
```

If you use CML functions in the `train-model` step, you can go even further and
get a closed loop- sending model training results from the EC2 instance to your
pull request or merge request! For example, if we expand the `train-model` step
to incorporate functions like `cml-publish` and `cml-send-comment`:

```yaml
train-model:
  needs: deploy-runner
  runs-on: [self-hosted, cml-runner]
  container: docker://dvcorg/cml-py3
  steps:
    - uses: actions/checkout@v2
    - name: 'Train a model'
      env:
        repo_token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
      run: |
        pip install -r requirements.txt
        python train.py

        echo "## Report from your EC2 Instance" > report.md
        cat metrics.txt >> report.md
        cml-publish "confusion_matrix.png" --md >> report.md
        cml-send-comment report.md
```

You'll get a pull request that looks something like this:

![](/uploads/images/2021-02-17/sample_pr.png)

All the code to replicate this example is up on a
[brand new demo repository](https://github.com/iterative/cml-runner-base-case).

### Our favorite details

The new `cml-runner` function lets you turn on instances, including GPU,
high-memory and sport instances, and kick off a new workflow using the hardware
and environment of your choice- and of course, it'll turn _off_ those instances
after a configurable timeout!

Another highlight: you can use whatever Docker container you'd like on your
instance. In the above example, we use our
[custom CML Docker container](https://github.com/iterative/cml/blob/master/docker/Dockerfile)
(because we like it!) - but you certainly don't have to! Whatever image you
choose, we highly recommend containerizing your environment for ultimate
reproducibility and security with CML.

You can also use the new `cml-runner` function to set up a local self-hosted
runner. On the local machine, you'll install CML as a package and then run:

```bash
$ cml-runner \
    --repo $your_project_repository_url \
    --token=$personal_access_token \
    --labels tf \
    --idle-timeout 180
```

Now your machine will be listening for workflows from your project repository.

## A New GitHub Action

One more thing: you might've noticed in our example workflow above that there's
a [new CML GitHub Action](https://github.com/iterative/cml-setup)! The new
Action helps you setup CML, giving you one more way to mix and match the CML
suite of functions with your preferred environment.

In addition to the CML library, including functions like `cml-send-comment`,
`cml-publish` and `cml-runner`, using the `setup-cml` Action also gives you DVC
and some of our favorite Vega Lite visualization tools. It's designed to be a
straightforward, all-in-one install. You'll add this to step to your workflow:

```yaml
steps:
  - uses: actions/checkout@v2
  - uses: iterative/cml-action@v1
```

[More details are in the docs!](https://github.com/iterative/setup-cml)

## Get ready for the release

We're inviting our community members to explore these new features in
anticipation of our upcoming, _official_ release in early March 2021. As always,
feedback is welcome by opening an issue on the
[CML GitHub repository](https://github.com/iterative/cml), as a comment here or
via our [Discord channel](https://discord.gg/bzA6uY7). We're excited to hear
what you think!
