---
title: ML best practices in PyTorch dev conf 2018
date: 2018-10-18
description: |
  In the Machine Learning (ML) field tools and techniques for best practices are
  just starting to be developed.
descriptionLong: |
  In the Machine Learning (ML) field tools and techniques for best practices are
  just starting to be developed. At the PyTorch developer conference (PTDC-18),
  several speakers including **Jerome Pesenti, VP of AI from Facebook** and
  **Andrej Karpathy, Director of Tesla AI** spoke about best practices for
  machine learning development.
picture: 2018-10-18/post-image.jpeg
pictureComment: |
  The image source:
  [link](https://blog.hubspot.com/customers/bid/109553/5-Homepage-Design-Best-Practices)
author: dmitry_petrov
commentsUrl: https://discuss.dvc.org/t/ml-best-practices-in-pytorch-dev-conf-2018/294
tags:
  - Machine Learning
  - Best Practices
  - PyTorch
  - PTDC-18
---

The issues discussed included applying traditional software development
techniques like unit testing, CI/CD systems, automated deployment, version
control, and more to the ML field. In this blog post, we will go over the best
practices ideas from PTDC-18 and the future of ML tool developments.

## 1. Engineering practices from PyTorch developers

In the PTDC-18
[keynote speech](https://www.facebook.com/pytorch/videos/482401942168584/),
**Jerome Pesenti** described the motivation and goals of PyTorch project and
what the future of machine learning looks like.

### 1.1. ML tooling future

Regarding the future of ML, Jerome envisioned a “streamlined development, more
accessible tools, breakthrough hardware, and more”. Talking about the gap huge
gap between software engineering and ML engineering, Presenti said:

> Machine learning engineering is where we were in Software Engineering 20 years
> ago. A lot of things still need to be invented. We need to figure out what
> testing means, what CD (continuous delivery) means, we need to develop tools
> and environments that people can develop **robust ML that does not have too
> many biases** and does not overfit.

In that gap lives many opportunities to develop new tools and services. We in
the ML ecosystem are called upon to implement the future of machine learning
tools. Traditional software engineering has many useful tools and techniques
which can either be repurposed for Machine Learning development or used as a
source for ideas in developing new tools.

### 1.2. PyTorch motivation

PyTorch 1.0 implements one important engineering principle — “a seamless
transition from AI research to production”. It helps to move AI technology from
research into production as quickly as possible. In order to do that a few
challenges were solved:

1. **Write code once** — not have to rewrite or re-optimize code to go from
   research to prod.

1. **Performance** — training model on large datasets.

1. **Other languages** — not only Python which is great for prototyping but also
   C++ and other languages.

1. **Scaling** — deploy PyTorch at scale more easily.

## 2. Engineering practices for software 2.0

### 2.1. Melting of software 2.0 and software 1.0

**Andrej Karpathy** from Tesla AI had a
[dedicated talk](https://www.facebook.com/pytorch/videos/169366590639145/) about
best engineering practices in ML. He drew a contrast between traditional
software development (software 1.0) with software utilizing Machine Learning
techniques (software 2.0), saying that

> “software 2.0 code also has new feature demands, contains bugs, and requires
> iterations.”

Meaning that ML development has a lifecycle similar to traditional software:

> “When you are working with these [neural] networks **in production** you are
> doing much more than that [training and measuring models]. You maintaining the
> codebase and that codebase is alive is just like 1.0 code.”

Machine Learning models need to grow and develop feature-by-feature, bugs need
to be found and fixed, and repeatable processes are a must, as in earlier non-ML
software development practices.

### 2.2. Software 2.0 best practices

Karpathy went on to describe how software 1.0 best practices can be used in
software 2.0 (ML modeling):

1. **Test-driven development** — test/train dataset separation is not enough
   since it describes only expected performance. Edge cases have to be tested to
   ensure the model performs as required. That requires incorporating more
   examples in datasets, or changing model architecture, or changing
   optimization functions.

1. **Continues Integration and Continues Delivery** (CI/CD) — Intelligently used
   of CI/CD can propel a team into rapid agile development of software systems.
   The phases of CI/CD jobs include: 1) ML model auto re-training when code or
   dataset changes; 2) running unit-tests; 3) easy access to the last model; 4)
   Auto-deployment to test and/or production systems.

1. **Version Control** — track all the changes in datasets (labels), not only
   code.

1. Train a **single model** from scratch every time without using other
   pre-trained models. (External pre-trained models don’t count as far as I
   understand.) A chain of fine-tuning models very quickly disintegrates
   codebase. In software 1.0 a single **monorepo** is an analog of a single
   model which also helps to avoid disintegration.

This list of best practices shows how serious Tesla AI is about robust software
which is not surprising for self-driving car area. Any company needs these
practices in order to organize a manageable ML development process.

## 3. Data file-centric tools

Frameworks and libraries like PyTorch make a significant step in machine
learning tooling and bringing the best practices. However, frameworks and
libraries might be not enough for many of the ML best practices. For example,
dataset versioning, ML model versioning, continuous integration (CI) and
continuous delivery (CD) requires manipulation and transferring data files.
These can be done in a **more efficient and natural way by data management
tools** and storage systems rather than libraries.

The need for a machine learning artifact manipulation tool with **data
file-centric philosophy** was the major motivation behind open source project
that we created — Data Version Control (DVC) or [DVC.org](http://dvc.org).

DVC connects Git with data files and machine learning pipelines which helps keep
version control on machine learning models and datasets using familiar Git
semantics coupled with the power of cloud storage systems such as Amazon’s S3,
Google’s GCS, Microsoft’s Azure or bare-metal servers accessed by SSH.

If PyTorch helps in organizing code inside an ML project then data-centric tools
like DVC help organized different pieces of ML projects into a single workflow.
The machine learning future requires both types of tools — code level and data
file level.

## Conclusion

Thus far only the first steps have been taken toward using machine learning
tooling and the best machine learning practices. Mostly large companies are
using these practices because they faced the problems a while ago. Best
practices should be embraced by the entire industry which will help to bring
machine learning to a higher new level.
