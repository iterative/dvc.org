---
title: CML Cloud Runners for Model Training in Bitbucket Pipelines
date: 2022-09-06
description:
  Use CML from a Bitbucket pipeline to provision an AWS EC2 instance and
  (re)train a machine learning model.
descriptionLong: >
  We can use CML to cheaply provision a cloud instance to train our model, push
  the model to our repository, and automatically terminate the instance
  afterward. In this guide, we will be exploring how to do so in conjunction
  with a Bitbucket repository and pipeline.
picture: 2022-09-06/header-cml-bitbucket.png
author: rob_dewit
commentsUrl: https://discuss.dvc.org/t/cml-cloud-runners-for-model-training-in-bitbucket-pipelines/1309
tags:
  - MLOps
  - Pipelines
  - CI/CD
  - Release
  - Tutorial
  - Reproducibility
  - DevOps
  - CML
  - Git
  - Bitbucket
  - Self-hosted runners
  - Cloud training
  - AWS
---

A while ago, we learned about
[training models in the cloud and saving them in Git](https://dvc.org/blog/CML-runners-saving-models-1).
We did so using [CML and GitHub Actions](https://cml.dev/doc/start/github).
GitLab is [also supported](https://cml.dev/doc/start/gitlab), and a
[recent CML release](https://github.com/iterative/cml/releases/tag/v0.16.0)
incorporated support for self-hosted runners in Bitbucket Pipelines: a good
excuse to revisit this topic and show how CML works in conjunction with
Bitbucket's CI/CD.

Using CML to provision cloud instances for our model (re)training has a number
of benefits:

- Bring Your Own Cloud: a single CML command connects your existing cloud to
  your existing CI/CD
- Cloud abstraction: CML handles the interaction with our cloud provider,
  removing the need to configure resources directly. We could even switch cloud
  providers by changing a single parameter
- Auto-termination: CML automatically terminates instances once they are no
  longer being used, reducing idle time (and costs)

# What we'll be doing

This guide will explore how we can use CML to (re)train models from one of our
Bitbucket pipelines. We will:

1. Provision an EC2 instance on Amazon Web Services (AWS) from a Bitbucket
   pipeline
2. Train a machine learning model on the provisioned instance
3. Open a pull request that adds the resulting model to our Bitbucket repository

While we could use Bitbucket's own runners for our model training, they have
[limited](https://support.atlassian.com/bitbucket-cloud/docs/limitations-of-bitbucket-pipelines/#LimitationsofBitbucketPipelines-Buildlimits)
memory, storage, and processing power. Self-hosted runners let us work around
these limitations: we can get a runner with specifications tailored to our
computing needs. CML greatly simplifies the setup and orchestration of these
runners.

Moreover, if our data is hosted by our cloud provider, using a runner on the
same cloud would be a logical approach to minimize data transfer costs and time.

<admon type="tip">

While we'll be using
[AWS](https://cml.dev/doc/self-hosted-runners?tab=AWS#cloud-compute-resource-credentials)
in this guide, CML works just as well with
[Google Cloud Platform](https://cml.dev/doc/self-hosted-runners?tab=GCP#cloud-compute-resource-credentials),
[Microsoft Azure](https://cml.dev/doc/self-hosted-runners?tab=Azure#cloud-compute-resource-credentials),
and
[on-premise](https://cml.dev/doc/self-hosted-runners#on-premise-local-runners)
machines. Of course, CML would need the appropriate credentials, but otherwise,
it takes care of the differing configuration for us.

</admon>

# Before we start

You can clone the repository for this guide
[here](https://bitbucket.org/iterative-ai/example_model_export_cml).

To help follow along, you may want to keep the
[Getting started section of the CML docs](https://cml.dev/doc/start/bitbucket)
open in another tab. The docs cover the following prerequisite steps you'll need
to take if you want to follow along with this blog post:

1. [Generate a `REPO_TOKEN` and set it as a repository variable](https://cml.dev/doc/self-hosted-runners?tab=Bitbucket#personal-access-token).
2. [Install the _Pull Request Commit Links app_ in your Bitbucket workspace](https://cml.dev/doc/ref/send-comment#bitbucket)

Additionally, you will need to take the following steps to allow Bitbucket to
provision AWS EC2 instances on your behalf:

1. [Create an `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` on AWS](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html#cli-configure-quickstart-creds)
2. [Add the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` as repository variables](https://support.atlassian.com/bitbucket-cloud/docs/variables-and-secrets/)

<admon type="warn">

In this example, we will be provisioning an `m5.2xlarge`
[AWS EC2 instance](https://aws.amazon.com/ec2/instance-types/). Note that this
instance is not included in the free tier, and Amazon
[will charge you for your usage](https://aws.amazon.com/ec2/pricing/on-demand/)
($0.45 per hour at the time of writing). To minimize cost, CML always terminates
the instance upon completion of the pipeline.

</admon>

# Implementing the CML Bitbucket pipeline

The main point of interest in the project repository is the
`bitbucket-pipelines.yml` file. Bitbucket will automatically recognize this file
as the one containing our pipeline configuration. In our case, we have defined
one pipeline (named `default`) that consists of two steps:

## Launch self-hosted runner

In the first step, we specify the runner we want to provision. We use a CML
docker image and configure a runner on a medium (`m`) instance. CML
[automatically translates this generic type to a cloud-specific one](https://registry.terraform.io/providers/iterative/iterative/latest/docs/resources/task#machine-type).
In the case of AWS, this corresponds with an `m5.2xlarge` instance.

We also specify the `--idle-timeout=30min` and `--reuse-idle` options. The first
of these specifies how long the provisioned instance should wait for jobs before
it is terminated. This ensures that we are not racking up costs due to our
instances running endlessly. With the latter, we ensure that a new instance is
only provisioned when a runner is not already available with the same label.
Combining these two options means that we can automatically scale up the number
of runners (if there are multiple pull requests in parallel) and scale down when
they are no longer required.

```yaml
- step:
    image: iterativeai/cml:0-dvc2-base1
    script:
      - |
        cml runner \
            --cloud=aws \
            --cloud-region=us-west \
            --cloud-type=m \
            --idle-timout=30min \
            --reuse-idle \
            --labels=cml.runner
```

<admon type="tip">

CML [has many more options](https://cml.dev/doc/ref/runner) that might pique
your interest. For example, you could use `--single` to terminate instances
right after completing one job. Or you could set a maximum bidding price for
spot instances with `--cloud-spot-price=...`. With these features, CML helps you
tailor instances precisely to your needs.

</admon>

## Train model on self-hosted runner

The second step in our pipeline defines the model training task. We specify that
this step should run on the `[self.hosted, cml.runner]` we provisioned above.
From here, our script defines the individual commands as we could also run them
in our local terminal.

```yaml
- step:
    runs-on: [self.hosted, cml.runner]
    image: iterativeai/cml:0-dvc2-base1
    # GPU not yet supported, see https://github.com/iterative/cml/issues/1015
    script:
      - pip install -r requirements.txt
      - python get_data.py
      - python train.py
      # Create pull request
      - cml pr model/random_forest.joblib

      # Create CML report
      - cat model/metrics.txt > report.md
      - echo '' >> report.md
      - echo '![Confusion Matrix](model/confusion_matrix.png)' >> report.md
      - cml send-comment --pr --update --publish report.md
```

First, we install our requirements, and then we run our data loading and model
training scripts. At this point, our runner contains our newly trained model.
However, we need to take a few extra steps to do something with that model.
Otherwise, our results would be lost when CML terminates the instance.

To add our model to our repository, we create a pull request with `cml pr`. We
also create a CML report that displays the model performance in the pull
request. We add the metrics and the confusion matrix created in `train.py` to
the report, and `cml send-comment` updates the description of the pull request
to the contents of `report.md` (i.e., our `metrics.txt` and confusion matrix).

![The model training report in the pull
request](../uploads/images/2022-09-06/pr-screenshot.png)_The
resulting pull request showing the model training report_

That's all there is to it! Once CML has created the pull request, we can merge
it on Bitbucket. CML will automatically terminate the cloud instance after its
specified idle time, thus saving us from high AWS expenses.

<admon type="tip">

You might be interested in storing the resulting model in a DVC remote, rather
than in your Git repository.
[Follow this guide to learn how to do so](https://iterative.ai/blog/CML-runners-saving-models-2).

</admon>

# Conclusions

CML allows us to incorporate our model training into our Bitbucket CI/CD. We can
define a pipeline to provision a cloud instance that meets our requirements and
then use the instance to train our model. The resulting model can be pushed to
our Git repository, along with a detailed report on our model's performance.

Because CML handles the interaction with our cloud provider of choice, we can
switch between different providers (AWS, Azure, or Google Cloud Project) by
changing a single line. Moreover, CML automatically reduces our cloud expenses
by terminating instances we are no longer using.

Now that we got started with CML in Bitbucket Pipelines, we can look toward some
of CML's more advanced features. It might be worth exploring CML's spot
recovery, for example, which can pick up training from the last epoch when a
script is randomly terminated. Or we might be interested in training models on
GPUs, which CML is also well-suited for.

These topics warrant their own guides, however. Keep an eye out for these
follow-ups on our blog, and make sure to let us know what you would like us to
cover next! You can let us know in the comments or by
[joining our Discord server](https://dvc.org/chat).

---

📰 [Join our Newsletter](https://share.hsforms.com/1KRL5_dTbQMKfV7nDD6V-8g4sbyq)
to stay up to date with news and contributions from the Community!
