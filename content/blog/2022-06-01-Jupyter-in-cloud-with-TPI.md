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
Terraform plugin gives us the ability to easily launch Jupyter workspaces on any
cloud provider, without needing to be a cloud expert.

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

Before ...
# Guide

Lorem ipsum

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
