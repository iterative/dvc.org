---
title: 'Get Started: Data Management'
description: 'Get started with data management in DVC, including versioning
access, pipelines, as well as metrics, parameters, and plots.'
---

# Get Started: Data Management

Let's look at DVC's features from the perspective of data and machine learning
model management. This includes automatic caching; versioning on top of Git
(without storing in the Git repo); sharing, exploring, and accessing remotely,
among other tasks.

We can also build and version pipelines to capture our data workflows stage by
stage, from raw data and its pre-processing, through feature engineering and ML
model training, and up to evaluation (performance metrics), visualization, or
other post-processing.

## Following the Get Started

Although presented in a logical order, each page in this trail is an independent
chapter you can go to directly. There may be references to other chapters or
docs, but you can skip them and still get a good idea of the features in
question, even by only reading page sections.

For better learning, you can also try each step yourself and get to similar
results. Some of the required steps for this may be inside collapsed sections
you can click on to expand:

<details>

### Click for an example!

You'll find useful notes and tips throughout our docs such as the one below.

</details>

<admon type="tip">

The steps and results of some of these chapters are captured in our
[example-get-started] repo on GitHub. Feel free to clone it and `git checkout`
any of it's [tags] to explore further.

[example-get-started]: https://github.com/iterative/example-get-started
[tags]: https://github.com/iterative/example-get-started/tags

</admon>

<cards>

  <card href="/doc/start/data-management/data-versioning" heading="Data Versioning">
    Base layer of DVC for large files, datasets, and machine learning models
  </card>

  <card href="/doc/start/data-management/data-and-model-access" heading="Data and Model Access">
    Using data artifacts from outside of the project and importing them from
    another DVC project
  </card>

  <card href="/doc/start/data-management/data-pipelines" heading="Data Pipelines">
    Describe how models and other data artifacts are built.
  </card>

  <card href="/doc/start/data-management/metrics-parameters-plots" heading="Metrics, Parameters, and Plots">
    Capture, navigate, and evaluate ML projects.
  </card>

</cards>
