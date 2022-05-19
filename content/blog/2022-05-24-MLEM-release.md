---
title: Pack and deploy your models with MLEM
date: 2022-05-24
description: >
  Introducing MLEM -- Machine Learning Engineering Management for Model
  Deployment and Management.
descriptionLong: >
  We’re excited to announce the launch of our latest open source offering, MLEM!
  MLEM is a tool that automatically extracts meta information like environment
  and frameworks from models and standardizes that information into a
  human-readable format within Git. ML teams can then use the model information
  for deployment into downstream production apps and services. MLEM easily
  connects to solutions like Heroku to dramatically decrease model deployment
  time.
picture: 2022-05-24/mlem-rocket.png
author: aguschin
# commentsUrl: TODO
tags:
  - Machine Learning
  - Deployment
  - Model Registry
---

We’re excited to announce the launch of our latest open source offering,
[MLEM](https://mlem.ai)! MLEM is a tool that automatically extracts meta
information like environment and frameworks from models and standardizes that
information into a human-readable format within Git. ML teams can then use the
model information for deployment into downstream production apps and services.
MLEM easily connects to solutions like Heroku to dramatically decrease model
deployment time.

We built MLEM to address issues that MLOps teams have around managing model
information as they move them from training and development to production and,
ultimately, retirement. MLEM is meant to help teams automate the collection of
information around how the model was trained, what the model is for, and
operational requirements around deployment.

Just like all our [other](https://dvc.org) [tools](https://cml.dev), MLEM uses
your Git service to store model information and connects with CI/CD solutions
for deployment (like Heroku). This Git-based model
([one of our core philosophies](https://iterative.ai/why-iterative/)) aligns
model operations and deployment with software development teams – information
and automation is all based on familiar DevOps tools – so that deploying any
model into production is that much faster.

With MLEM, ML teams get:

- Human-readable information about a model for search and documentation
- One-step automated deployment across any cloud
- Fast model registry setup based on Git

# Save

section with code

# Deploy

section with code

# Model registry

DVC+MLEM+GTO = MR - section with code

# What next?

Check out [MLEM on GitHub](https://github.com/iterative/mlem) today and let us
know what you think! MLEM is a core building block for a Git-based model
registry – for more information, visit our model registry page.

Resources:

- [Documentation](https://mlem.ai/doc)
- [MLEM website](https://mlem.ai)
- [MLEM on GitHub](https://github.com/iterative/mlem)
- Building an ML model registry

<!-- <admon type="warn">

This guide will result in a Jupyter server running on provisioned AWS hardware.
While TPI helps you do this as cheaply as possible, there are still costs
involved. Make sure you
[understand AWS pricing](https://aws.amazon.com/ec2/pricing/) to avoid unwelcome
charges to your credit card.

</admon> -->
