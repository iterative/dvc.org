---
title: How Data Scientists Can Improve Their Productivity
date: 2017-05-15
description: |
  Data science and machine learning are iterative processes. It is never
  possible to successfully complete a data science project in a single pass.
descriptionLong: |
  The iteration time is a critical parameter in data science process. The
  quicker you iterate, the more you can check ideas and build a better model.
  The productivity of data scientists can be improved by speeding up iteration
  processes and the DVC tool takes care of this.
picture: 2017-05-15/post-image.jpg
author: dmitry_petrov
commentsUrl: https://discuss.dvc.org/t/how-a-data-scientist-can-improve-their-productivity/301
tags:
  - Productivity
  - Python
  - Tutorial
---

Data science and machine learning are iterative processes. It is never possible
to successfully complete a data science project in a single pass. A data
scientist constantly tries new ideas and changes steps of her pipeline:

1. extract new features and accidentally find noise in the data;

2. clean up the noise, find one more promising feature;

3. extract the new feature;

4. rebuild and validate the model, realize that the learning algorithm
   parameters are not perfect for the new feature set;

5. change machine learning algorithm parameters and retrain the model;

6. find the ineffective feature subset and remove it from the feature set;

7. try a few more new features;

8. try another ML algorithm. And then a data format change is required.

This is only a small episode in a data scientist’s daily life and it is what
makes our job different from a regular engineering job.

Business context, ML algorithm knowledge and intuition all help you to find a
good model faster. But you never know for sure what ideas will bring you the
best value.

This is why the iteration time is a critical parameter in data science process.
The quicker you iterate, the more you can check ideas and build a better model.

> “A well-engineered pipeline gets data scientists iterating much faster, which
> can be a big competitive edge” From
> [Engineering Practices in Data Science](http://blog.untrod.com/2012/10/engineering-practices-in-data-science.html)
> By Chris Clark.

## A data science iteration tool

To speed up the iterations in data science projects we have created an open
source tool [data version control](http://dvc.org) or [DVC.org](http://dvc.org).

DVC takes care of dependencies between commands that you run, generated data
files, and code files and allows you to easily reproduce any steps of your
research with regards to files changes.

You can think about DVC as a Makefile for a data science project even though you
do not create a file explicitly. DVC tracks dependencies in your data science
projects when you run data processing or modeling code through a special
command:

```dvc
$ dvc run python code/xml_to_tsv.py \
                 data/Posts.xml data/Posts.tsv
```

`dvc run` works as a proxy for your commands. This allows DVC to track input and
output files, construct the dependency graph
([DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph)), and store the
command and parameters for a future command reproduction.

The previous command will be automatically piped with the next command because
of the file `data/Posts.tsv` is an output for the previous command and the input
for the next one:

```dvc
# Split training and testing dataset. Two output files.
# 0.33 is the test dataset splitting ratio.
# 20170426 is a seed for randomization.
$ dvc run python code/split_train_test.py \
                 data/Posts.tsv 0.33 20170426 \
                 data/Posts-train.tsv data/Posts-test.tsv
```

DVC derives the dependencies automatically by looking to the list of the
parameters (even if your code ignores the parameters) and noting the file
changes before and after running the command.

If you change one of your dependencies (data or code) then all the affected
steps of the pipeline will be reproduced:

```dvc
# Change the data preparation code.
$ vi code/xml_to_tsv.py

# Reproduce.
$ dvc repro data/Posts-train.tsv
Reproducing run command for data item data/Posts.tsv.
Reproducing run command for data item data/Posts-train.tsv.
```

This is a powerful way of quickly iterating through your pipeline.

The pipeline might have a lot of steps and forms of acyclic dependencies between
the steps. Below is an example of a canonical machine learning pipeline (more
details in [the DVC tutorials](https://dvc.org/doc/tutorials):

`gist:dmpetrov/7704a5156bdc32c7379580a61e2fe3b6#dvc_pipeline.sh`

## Why are regular pipeline tools not enough?

> “Workflows are expected to be mostly static or slowly changing.” (See
> [Airflow](https://airflow.incubator.apache.org/).)

Regular pipeline tools like [Airflow](http://airflow.incubator.apache.org) and
[Luigi](https://github.com/spotify/luigi) are good for representing static and
fault tolerant workflows. A huge portion of their functionality is created for
monitoring, optimization and fault tolerance. These are very important and
business critical problems. However, these problems are irrelevant to data
scientists’ daily lives.

Data scientists need a lightweight, dynamic workflow management system. In
contrast to the traditional airflow-like system, DVC reflects the process of
researching and looking for a great model (and pipeline), not optimizing and
monitoring an existing one. This is why DVC is a good fit for iterative machine
learning processes. When a good model was discovered with DVC, the result could
be incorporated into a data engineering pipeline (Luigi or Airflow).

## Pipelines and data sharing

In addition to pipeline description, data reproduction and dynamic nature, DVC
has one more important feature. It was designed in accordance with the best
software engineering practices. DVC is based on Git. It keeps code, and stores
DAG in the Git repository which allows you to share your research results. But
it moves the actual file content outside the Git repository (in `.cache`
directory which DVC includes in `.gitignore`) since Git is not designed to
accommodate large data files.

The data files can be shared between data scientists through cloud storages
using a simple command:

```dvc
# Data scientists 1 syncs data to the cloud.
$ dvc sync data/
```

![](/uploads/images/2017-05-15/git-server-or-github.jpeg)

Currently, AWS S3 and GCP storage are supported by DVC.

## Conclusion

The productivity of data scientists can be improved by speeding up iteration
processes and the DVC tool takes care of this.

We are very interested in your opinion and feedback. Please post your comments
here or contact us on Twitter — [FullStackML](https://twitter.com/FullStackML).

If you found this tool useful, **please “star” the
[DVC Github repository](https://github.com/iterative/dvc)**.
