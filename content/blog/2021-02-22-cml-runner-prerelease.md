---
title:
  'CML Pre-Release Notes: Automatically Train Models in the Cloud with CML 0.3.0'
date: 2021-02-22
description: |
  New features are here to make launching cloud compute for continuous
  integration workflows shorter, sweeter and easier than ever. Plus, a new
  GitHub Action to setup CML means more ways to use CML without our Docker
  container.
descriptionLong: |
  New features are here to make launching cloud compute for continuous
  integration workflows shorter, sweeter and easier than ever. Plus, a new
  GitHub Action to setup CML means more ways to use CML without our Docker
  container.
picture: 2021-02-22/cover.png
author: elle_obrien
commentsUrl: https://discuss.dvc.org/t/cml-0-3-0-pre-release/685
tags:
  - CML
  - Continuous Machine Learning
  - GitHub Actions
  - GitLab CI
  - Terraform
---

Today, we're pre-releasing some new features in Continuous Machine Learning, or
[CML](https://cml.dev)—our open source project to adapt popular continuous
integration (CI) systems like GitHub Actions and GitLab CI for data science. CML
has become a popular tool for auto-generating ML model reports right in a GitHub
Pull Request and orchestrating resources for training models in the cloud.

Here's what's in today's pre-release:

## Brand new method to provision cloud compute for your CI workflows

After the initial CML release, we found ways to significantly simplify the
process of allocating resources in CI/CD. We developed a brand new CML command
`cml-runner` that hides much of the complexity of configuring and provisioning
an instance, keeping your workflows free of `bash` scripting clutter (until the
official release, docs are
[in development here](https://github.com/iterative/cml/blob/c2b96c461011f01ab2476e1542fb89d7229d150d/README.md)).
The new approach uses Terraform provider under the hood instead of Docker
Machine, as in the first version.

Check out this example workflow to launch an EC2 instance from a GitHub Action
workflow and then train a model. We hope you'll agree it's shorter, sweeter, and
more powerful than ever!

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
get a closed loop—sending model training results from the EC2 instance to your
pull request or merge request! For example, if we expand the `train-model` step
to incorporate functions like `cml-publish` and `cml-send-comment`:

```yaml
train-model:
  needs: deploy-runner
  runs-on: [self-hosted, cml-runner]
  container: docker://dvcorg/cml
  steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-python@v2
      with:
        python-version: '3.x'
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

![](/uploads/images/2021-02-22/sample_pr.png)

All the code to replicate this example is up on a
[brand new demo repository](https://github.com/iterative/cml-runner-base-case).

### Our favorite details

The new `cml-runner` function lets you turn on instances, including GPU,
high-memory and sport instances, and kick off a new workflow using the hardware
and environment of your choice—and of course, it'll turn _off_ those instances
after a configurable timeout! In the first CML release, this took
[more than 30 lines of code](https://github.com/iterative/cml_cloud_case/blob/master/.github/workflows/cml.yaml)
to configure. Now it's just one function.

Another highlight: you can use whatever Docker container you'd like on your
instance. In the above example, we use our
[custom CML Docker container](https://github.com/iterative/cml/blob/master/docker/Dockerfile)
(because we like it!)—but you certainly don't have to! Whatever image you
choose, we highly recommend containerizing your environment for ultimate
reproducibility and security with CML.

You can also use the new `cml-runner` function to set up a
[local self-hosted runner](https://docs.github.com/en/actions/hosting-your-own-runners/about-self-hosted-runners).
On your local machine or on-premise GPU cluster, you'll install CML as a package
and then run:

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

The new Action is designed to be a straightforward, all-in-one install that
gives you immediate use of functions like `cml-publish` and `cml-runner`. You'll
add this step to your workflow:

```yaml
steps:
  - uses: actions/checkout@v2
  - uses: iterative/cml-action@v1
```

[More details are in the docs!](https://github.com/iterative/setup-cml)

## Get ready for the release

We're inviting our community members to explore these new features in
anticipation of our upcoming, _official_ release. As always, feedback is welcome
by opening an issue on the
[CML GitHub repository](https://github.com/iterative/cml), as a comment here or
via our [Discord channel](https://discord.gg/bzA6uY7). We're excited to hear
what you think!
