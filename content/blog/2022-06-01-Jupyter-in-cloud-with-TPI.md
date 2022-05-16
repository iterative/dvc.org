---
title: Jupyter Notebooks in any cloud with TPI
date: 2022-06-01
description: Lorem ipsum dolor sit amet
descriptionLong: >
  Lorem ipsum dolor sit amet
picture: 2022-06-01/tpi-jupyter-cover.jpeg
author: rob_dewit
# commentsUrl: TODO
tags:
  - TPI
  - Jupyter Notebook
  - Cloud
  - AWS
---

<admon type="info">

This blog post is based on [@casperdcl's guide published over on
Hackernoon](https://hackernoon.com/using-jupytertensorboard-in-any-cloud-with-one-command).

</admon>

Jupyter Notebook is one of —if not the— most-used tools in data science. It
provides an intituitive and feature-packed developer experience, and for many
people is an indispensable tool when working on machine learning projects.

The most straightforward use is on a local machine. We switch to a virtual
environment, type in `jupyter notebook` in our terminal, and head over to
https://localhost:8888. We're good to go and ready to start prototyping!

This usage has one major downside, however: we're limited by the specs of our
local machine. While my laptop won't struggle too much training a classifier for
the IRIS dataset, it might become a limiting factor when working on an
alternative to GPT-3. And probably a little while before a project of that
scope.

The obvious solution to bypassing the limitations of our local machine is to
move our notebooks to the cloud. When running a notebook on AWS or Azure, we can
provision as beefy an instance as needed for our project. The downside to
cloud-hosted notebooks, however, is that they're more difficult to get up and
running. And any time spent setting up our development environment, is time we
can't spend on our actual ML project.

"Now wait a minute", you might say, "hasn't this problem long been solved by
SaaS-solutions like Google Colab and Amazon SageMaker Studio?"

To which I'd reply: "To an extent: yes. But while they certainly have their
merits, these solutions often have their own limitations which can become
problematic."

Here are three of the limitations imposed by SaaS-solutions such as Colab and
SageMaker:

- **Cost:** they are expensive to use. You're not only paying for the hardware,
  but also for using the platform.
- **Walled garden:** they tend to be baked into the ecosystem of the vendor.
  It's difficult and sometimes impossible to use infrastructure components from
  different vendors in conjunction with each other.
- **Hardware limitations:** they may still put a limit on the hardware available
  to you. Colab, for example, is capped at 25GB of RAM.

Iterative provides an alternative to these services in the form of [TPI
(Terraform Provider
Iterative)](https://github.com/iterative/terraform-provider-iterative). This
[Terraform](https://www.terraform.io/) plugin gives us the ability to easily
launch Jupyter workspaces on any cloud provider, without needing to be a cloud
expert.

Here are four benefits to TPI that might peak your interest:

- **Free and open:** TPI is completely open source and free to use
- **Lower cloud costs:** TPI automatically cleans up instances that are not
  being used. It also allows you to use spot instances, reducing your per-hour
  costs
- **Modular:** TPI can be used with a variety of cloud vendors, meaning you can
  use it regardless of what the rest of your stack looks like
- **Developer-first experience:** {{is this really a benefit for target audience
  i.e. data scientists?}}

In the guide below we will explore how to launch a Jupyter server using TPI,
allowing you to run notebooks on cloud instances. While we will be using AWS in
our example, you can use Azure or GCP with minor modifications.

# Prerequisites

Before you get started, make sure to take care of the following:

1. [Download the Terraform CLI tool](https://www.terraform.io/downloads)
1. [Set-up an AWS Account](https://aws.amazon.com/)
1. [Configure your AWS authentication
   credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
1. [Get a free ngrok account for port forwarding](https://ngrok.com/)
1. [Clone the example repository](https://github.com/iterative/blog-tpi-jupyter)

<admon type="warn">

The result of this guide will be a Jupyter server running on provisioned AWS
hardware. While TPI helps you do this as cheaply as possible, there are still
costs involved. Make sure you [understand AWS
pricing](https://aws.amazon.com/ec2/pricing/) to avoid unwelcome charges to your
credit card.

</admon>

# Guide

Once we have cloned the repository and navigated to it in our terminal, we only
need to run two commands. First, we use `terraform init` to initialize our
configuration files. After that, we simply run `terraform apply` to launch our
Jupyter server. That's all there as to it. TPI works its magic and within a few
minuts we will have our Jupyter environment ready.

"But wait, how do we access it?"

That's where ngrok comes in, which will generate URLs we can navigate to in
order to access our environment. Run `terraform refresh` to get these URLs once
TPI has finished provisioning the instance:

```yaml
Outputs:

urls = [
  "Jupyter Lab: https://8c62-54-173-120-3.ngrok.io/lab?token=...",
  "Jupyter Notebook: https://8c62-54-173-120-3.ngrok.io/tree?token=...",
  "TensorBoard: https://6d52-54-173-120-3.ngrok.io",
]
```

<admon type="info">

It may take a little while for TPI to provision the instance. If `terraform
refresh` returns `urls = []` as its output, just wait a few minutes and run it
again.

</admon>

Once we have accomplished everything we want to do in our notebook, we can
terminate the instance with `terraform destroy`. This ensures that we won't have
idle instances racking up our credit card bill.

# Under the hood

"Alright, easy enough, but what is actually happening?"



# Next steps: rethink this approach

Great! After going through this guide we know how to use TPI to launch Jupyter
servers with just a few commands. This means we are no longer limited by the
constraints of our local machine for prototyping machine learning projects!

"So where do we take this limitless work of wonder from here on out?"

This is the point at which I'm afraid I'll have to rain on our parade a little
bit. In all honesty I would disadvise from running Jupyter Notebooks in this
manner.

Jupyter Notebooks are a great tool for quick and easy prototyping. They do,
however, have a few downsides. For one, they are difficult to version properly.
As a result of this, it can be difficult to collaborate on one project without
model versions running out-of-sync. Moreover, _runs_ of the project are not
sufficiently reproducible: they require too many manual actions. [As Andrey
Cheptsov puts
it](https://mlopsfluff.dstack.ai/p/notebooks-and-mlops-choose-one?s=r):
"Notebooks and MLOps; choose one."

Again, for prototyping notebooks are great. But prototyping is something that is
typically done on our local machine. Once we get to a point where our needs
exceed the capacity of our laptop, the project is likely to be of such a scope
that we would benefit from an automated, well-versioned, reproducible pipeline.

That's why I recommend the following: rather than take the effort (however small
thanks to TPI) to set up a Jupyter server, take the effort to transform the
Notebook into an automated pipeline. This will make it much easier to do
multiple runs and compare results against each other.

"How do I go about this?", you ask?

We've got you covered! The [Iterative Tools for Data Scientists &
Analysts](https://learn.iterative.ai/course/data-scientist-path) course covers
this transformation extensively and is completely free to follow. It's easier to
accomplish than it may seem at first!

Of course this whole exercise wasn't for naught. We still explored how to use
TPI to great effect, and there are many use cases where that's helpful. For
example when we would want to execute an automated pipeline on a provisioned
instance. Take a look at [this
post](https://dvc.org/blog/local-experiments-to-cloud-with-tpi) for details on
how to do so!

<!-- ## Downsides to Google Colab

https://analyticsindiamag.com/explained-5-drawback-of-google-colab/#:~:text=Limited%20Space%20%26%20Time%3A%20The%20Google,the%20complex%20functions%20to%20execute.
https://towardsdatascience.com/why-i-moved-from-google-colab-and-amazon-sagemaker-to-saturn-cloud-675f0a51ece1

- Closed environment, only pre-approved packages
- Storage constraints: coopts Google Drive storage
- Entire GDrive accessible in Colab, so sharing exposes a lot of data
- Pricing https://colab.research.google.com/signup#
- Limits to specifications wrt memory and processing power
- Reproducibility/versioning difficult
- Not really Jupyter; renamed stuff
- No real-time collaboration

## Downsides to Amazon SageMaker

https://towardsdatascience.com/why-i-moved-from-google-colab-and-amazon-sagemaker-to-saturn-cloud-675f0a51ece1

- All data stored on S3 (problem with large datasets, e.g. images or videos)
- Download data for every training instance (100Gb takes 20 minutes) -->
