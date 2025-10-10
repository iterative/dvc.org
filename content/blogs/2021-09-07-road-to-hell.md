---
title: The Road to Hell Starts with Good MLOps Intentions
date: 2021-09-07
description: >
  Why we believe extending best practices of software engineering to machine
  learning projects will streamline ML and AI development and keep all of us off
  the road to hell.
descriptionLong: >
  Our philosophy on how ML and AI should be developed.  Why we believe extending
  the best practices of software engineering to the machine learning space will
  ultimately be the most effective solution for MLOps.
picture: 2021-09-07/hell.png
pictureComment: Let's avoid hell, shall we?
author: dmitry_petrov
commentsUrl: https://discuss.dvc.org/t/the-road-to-hell-starts-with-good-mlops-intentions/873
tags:
  - MLOps
  - DataOps
  - CI/CD
  - Company
---

Machine learning operations (MLOps) in the last year has emerged as a distinct
IT discipline for building machine learning (ML) or artificial intelligence (AI)
models. While at first blush that may seem like a viable method for automating
the building of AI models, in reality purveyors of MLOps platforms have a vested
interest in convincing organizations to acquire platforms that exist outside of
best DevOps practices that have already been proven to accelerate application
development.

AI models, however, are ultimately a software artifact like any other that needs
to be integrated within an application. The trouble with MLOps as it is most
often pursued today is data scientists are constructing AI models in almost
complete isolation from the rest of the organization. The hope is that somehow
when the AI model is completed it will magically be incorporated into an
application development workflow. Unfortunately for all concerned, the rate at
which applications are being developed using best DevOps practices rarely align
with the rate at which AI models are being constructed.

> "The trouble with MLOps as it is most often pursued today is data scientists
> are constructing AI models in almost complete isolation from the rest of the
> organization."

The result is not only a lot of wasted time and effort, the rate at which
digital business transformation initiatives that depend on AI models are rolled
out becomes a significant competitive disadvantage. In effect, the road to AI
hell is paved with good MLOps intentions.

While working as a data scientist at Microsoft, I saw firsthand how machine
learning and AI was traditionally implemented in an isolated fashion. That
unsatisfactory experience led to the launch of opensource Data Version Control
(DVC) and Continuous Machine Learning (CML) tools that integrate ML workflows
into best practices for software development. Instead of creating a separate
proprietary AI platform that needs to be acquired and maintained, the goal needs
to be to extend traditional software tools such as Git, collaboration and
continuous integration/continuous delivery (CI/CD) platforms to meet the needs
of both developers and ML engineers. The entire ML stack needs to be reinvented
in a way that makes it accessible to every developer.

![DVC Extension for VS Code](../uploads/images/2022-12-15/dvclive_exp_tracking.png)\_Check
out the [DVC Extension for VS
Code(https://marketplace.visualstudio.com/items?itemName=Iterative.dvc)

DVC and CML are open source tools to streamline the workflow of data scientists.
They integrate ML workflows into current practices for software development in a
way that eliminates the need for many features of proprietary AI platforms such
as AWS SageMaker, Microsoft Azure ML and Google Vertex AI by extending
traditional software tools like Git and CI/CD platforms to meet the needs of ML
researchers and ML engineers. In essence, they provide an open platform based on
best DevOps practices to operationalize ML and AI.

> "DVC and CML are open source tools that streamline the workflow of data
> scientists. They integrate ML workflows into current practices for software
> development in a way that eliminates the need for many features of proprietary
> AI platforms such as AWS SageMaker, Microsoft Azure ML and Google Vertex AI by
> extending traditional software tools like Git and CI/CD platforms to meet the
> needs of ML researchers and ML engineers."

MLOps is about operations and automation for ML and AI. It covers the entire
lifecycle of an ML process including labeling data, development, modeling, and
monitoring. Every ML/AI platform offers this functionality. However, our vision
for MLOps is different. We think it should be embedded within your DevOps
processes. It should be part of your engineering infrastructure, engineering
stack and engineering processes. ML requires additional tools. It’s just those
tools need to be incorporated into a larger toolchain.

The primary reason to do this is to interact more consistently with people from
the software engineering side and to reuse proven tools such as Git,
GitHub/GitLab and CI/CD systems. An ML silo that builds an AI model outside the
traditional application development process creates a divide that needs to be
bridged whenever a data scientist needs to collaborate with engineers. For
example, with a traditional AI platform, all the workflows are predefined. There
may be some opportunity to modify them, but for all intents and purposes, those
workflows are inflexible. That’s the wrong approach. Teams made up of data
scientists and developers should be able to define their own workflow based on
their business requirements and team preferences, just like they do today when
constructing any other software artifact. Rather than a platform forcing teams
to embrace a highly opinionated workflow, they can employ flexible tools such
Git, GitHub, and their existing CI tools as they see fit.

> "Teams made up of data scientists and developers should be able to define
> their own workflow based on their business requirements and team preferences,
> just like they today when constructing any other software artifact."

## How We Do It

When it comes to software engineering, everything in a workflow is based on the
version of the artifact. However, when working with large data sets, that
approach doesn’t work because there is no data versioning with existing tools.
We extend existing DevOps tools so that developers can version code in addition
to ML models.

In addition to allowing for data and modeling versioning, we also align data
scientists to the CI/CD process. This enables the data scientist to share code
and data with other members of the team in a way that actually works on their
machines! That’s critical because code is typically run through a third-party
platform to determine if it will run in a production environment. There is no
way to bring data into this process, which means there’s no real way to
determine whether a model works before deploying it. There are no ways to show
metrics. There are no ways to compare your metrics with your production metrics.
In this scenario, everything needs to be instrumented to attach required plots
to test. That takes a lot of time. We enable multiple plot points to be tested.
Finally, we provide a place to visualize and analyze data other than employing
Microsoft Excel spreadsheets. We extend traditional software engineering
functionality by providing a better system to visualize data right on top of
your GitHub, GitLab or BitBucket user interface.

> "We believe an open source-based workflow based on version control and CI
> tools will streamline machine learning in the same way software development
> has already been modernized."

## Conclusion

We believe an open source-based workflow based on version control and CI tools
will streamline machine learning in the same way software development has
already been modernized. If data scientists, engineers and developers can
accelerate the development of ML/AI models by reusing files, pipelines,
experiments and even entire models stored in a Git repository, the rate at which
AI will be infused into software will increase by several orders of magnitude
and, best of all, the road to AI hell is not taken.

---

_This post originally appeared in_
[The New Stack.](https://thenewstack.io/the-road-to-ai-hell-starts-with-good-mlops-intentions/)

📰 [Join our Newsletter](https://share.hsforms.com/1KRL5_dTbQMKfV7nDD6V-8g4sbyq)
to stay up to date with news and contributions from the Community!
