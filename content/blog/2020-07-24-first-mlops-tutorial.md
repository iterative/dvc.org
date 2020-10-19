---
title: |
  NEW VIDEO! 🎥 MLOps Tutorial #1: 
  Intro to continuous integration for ML
date: 2020-07-24
description: |
  A video tutorial abut using continuous integration in data 
  science and machine learning projects. This tutorial shows 
  how to use GitHub Actions and Continuous Machine Learning 
  (CML) to create your own automated model training and 
  evaluation system.
picture: 2020-07-24/blog_header.png
author: elle_obrien
commentsUrl: https://discuss.dvc.org/t/new-video-mlops-tutorial-1-intro-to-continuous-integration-for-ml/454
tags:
  - Continuous integration
  - DevOps
  - MLOps
  - CML
---

Earlier this month, we launched [CML](https://cml.dev), our latest open-source
project in the MLOps space. We think it's a step towards establishing powerful
DevOps practices (like continuous integration) as a regular fixture of machine
learning and data science projects. But there are plenty of challenges ahead,
and a big one is _literacy_.

So many data scientists, like developers, are self-taught. Data science degrees
have only recently emerged on the scene, which means if you polled a handful of
senior-level data scientists, there'd almost certainly be no universal training
or certificate among them. Moreover, there's still no widespread agreement about
what it takes to be a data scientist: is it an engineering role with a little
bit of Tensorflow sprinkled on top? A title for statisticians who can code?
We're not expecting an easy resolution to these existential questions anytime
soon.

In the meantime, we're starting a video series to help data scientists curious
about DevOps (and developers and engineeers curious about data science!) get
started. Through hands-on coding examples and use cases, we want to give data
science practitioners the fundamentals to explore, use, and influence MLOps.

The first video in this series uses a lightweight and fairly popular data
science problem- building a model to predict wine quality ratings- as a
playground to introduce continuous integration.

The tutorial covers:

- Using Git-flow in a data science project (making a feature branch and pull
  request)
- Creating your first GitHub Action to train and evaluate a model
- Using CML to generate visual reports in your pull request summarizing model
  performance

It's now up on YouTube!

https://youtu.be/9BgIDqAzfuA

[Code for the project is available online](https://github.com/andronovhopf/wine)
so you can follow along! We also recommend checking out the
[CML docs](https://github.com/iterative/cml) for more details, tutorials, and
use cases.

If you have questions, the best way to get in touch is by leaving a comment on
the blog, video, or our [Discord channel](https://discord.gg/bzA6uY7). And,
we're especially interested to hear what use cases you'd like to see covered in
future videos- tell us about your data science project and how you could imagine
using continuous integration, and we might be able to create a video!
