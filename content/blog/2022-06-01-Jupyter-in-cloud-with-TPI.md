---
title: Jupyter Notebooks in any cloud with TPI
date: 2022-06-01
description: Lorem ipsum dolor sit amet
descriptionLong: >
  Lorem ipsum dolor sit amet
picture: 2022-06-01/tpi-jupyter-cover.jpeg
author: rob_dewit
# commentsUrl: https://discuss.dvc.org/t/training-and-saving-models-with-cml-on-a-self-hosted-aws-ec2-runner/1155
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

# Introduction and problem statement

- Jupyter Notebooks are the industry standard
- Don't want to be limited by local specs
- - Solution: cloud computing
- - Troubles: difficult to host

There are of course SaaS-solutions that provide notebooks hosted in clouds, such
as Google Colab and Amazon SageMaker. While they certainly aren't without merit,
they come with a few downsides:

- Expensive
- Closed-off
- - Can't combine Colab with S3 data or vice versa
- - Can't install custom packages (Colab, SageMaker does support this)
- Limitations to hardware

Iterative provides an alternative to these services in the form of TPI
(Terraform Provider Iterative). This Terraform plugin gives us the ability to
easily launch Jupyter workspaces on any cloud provider, without needing to be a
cloud expert.

- Free and open
- Cheaper cloud costs: no waste
- Modular:
- Developer-first experience


## Downsides to Google Colab
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
- Download data for every training instance (100Gb takes 20 minutes)

# Solution: TPI

## Benefits

- Ease of use
- Pricing

# Example

