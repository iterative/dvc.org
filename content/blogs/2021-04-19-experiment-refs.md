---
title: Git Custom References for ML Experiments
date: 2021-04-19
description: >
  In DVC 2.0, we’ve introduced a new feature set aimed at simplifying the
  versioning of lightweight ML experiments. In this post, we’ll dive into how
  exactly these new experiments work.

descriptionLong: >
  In [DVC 2.0](/blog/dvc-2-0-release), we’ve introduced a new feature set aimed
  at simplifying the versioning of lightweight ML experiments. In this post,
  we’ll show how DVC leverages the power of Git references to track each
  experiment, while also completely abstracting away the need for you to
  manually manage a potentially unlimited number of Git feature branches or
  tags.

picture: 2021-04-19/experiment-refs.png
pictureComment: Utilizing Custom Git References in DVC
author: peter_rowlands
commentsUrl: https://discuss.dvc.org/t/utilizing-custom-git-references-in-dvc/727
tags:
  - MLOps
  - Git
  - Experiments
  - Release
---

One of the main features provided by DVC is the ability to version machine
learning (ML) pipelines and experiments using Git commits. While this works very
well for versioning mature projects and models, for projects under active
development that may require generating hundreds of experiments or more in a
single day, typical Git workflows can be difficult to work with. This type of
rapid experimentation may appear to fit nicely with the concept of Git feature
branches, but a Git repository with such large numbers of branches will
eventually become too unwieldy to manage.

In DVC 2.0, we’ve introduced a new feature set aimed at simplifying the
versioning of lightweight ML experiments. DVC now provides a series of `dvc exp`
commands which allow you to easily generate new experiments with modified
hyperparameters, and to quickly compare their results. In this post, we’ll show
how DVC leverages the power of Git references to track each experiment, while
also completely abstracting away the need for you to manually manage a
potentially unlimited number of Git feature branches or tags.

_Note: This post mainly focuses on the “How?” side of DVC 2.0 experiments. For a
great overview of the “What?” check out our
[2.0 release post](/blog/dvc-2-0-release) and our
[Get Started: Experiments](https://dvc.org/doc/start/experiments) guide._

## Experiments in DVC 2.0

At the heart of the new experiments feature is the `dvc exp run` command.
Whenever a pipeline is executed with `dvc exp run`, the results will be
automatically tracked by DVC as a single “experiment”. DVC will track everything
in your workspace as a part of the experiment, including unstaged changes made
prior to execution. This means that DVC experiments can be used to test the
result of changes to DVC-tracked data or pipeline parameters, as well as changes
to Git-tracked code.

![Example experiment run](../uploads/images/2021-04-19/exp-run.gif 'Example experiment run')

_Note: You can follow along with the commands used in this example and
throughout this post, using our
[example-get-started](https://github.com/iterative/example-get-started)
repository._

Now let’s take a deeper look into what actually happened when we ran our
experiment. Starting from the latest commit in our repository’s `master` branch,
we invoked `dvc exp run --set-param` to generate a new experiment with the
specified parameter value. DVC then reproduced our pipeline as if we had
manually edited our `params.yaml` to contain that parameter change (setting
`featurize.max_features` to `2000`), and then saved the results in a new
experiment named `exp-26220`.

Returning DVC users will likely be familiar with the typical Git+DVC workflow of
reproducing your pipeline, staging the results in Git, and then Git committing
those changes:

```dvc
$ dvc repro
$ git add .
$ git commit
```

This workflow is now essentially automated within our single `exp run` command,
with one key difference. Rather than saving the results in a Git _branch_, the
results are saved in a custom Git _reference_.

## What is a Git reference?

A Git reference (or ref) is a named reference to a Git commit. References are
addressed via a pathname starting with `refs/`. Git branches and tags are
actually just references which are stored in the `refs/heads` and `refs/tags`
namespaces respectively. In our repo, we can see that:

The tip of our `master` branch is commit `f137703`:

```dvc
$ git show master
commit f137703af59ba1b80e77505a762335805d05d212 (HEAD -> master)
Author: dberenbaum <dave@iterative.ai>
Date:   Wed Apr 14 14:31:54 2021 -0400

    Run experiments tuning random forest params
```

`master` itself is a Git ref (`refs/heads/master`) pointing to that commit:

```dvc
$ git show-ref master
f137703af59ba1b80e77505a762335805d05d212 refs/heads/master
```

## What exactly is a DVC experiment?

Now, going back to our experiment run, we see that DVC has generated and saved
an experiment named `exp-26220`. We can even use that name freely within DVC
commands as if it was a Git branch or tag name:

```dvc
$ dvc metrics diff master exp-26220
Path         Metric    Old      New      Change
scores.json  avg_prec  0.60405  0.58589  -0.01817
scores.json  roc_auc   0.9608   0.945    -0.01581

$ dvc diff master exp-26220
Modified:
    data/features/
    data/features/test.pkl
    data/features/train.pkl
    model.pkl
    prc.json
    roc.json
    scores.json

files summary: 0 added, 0 deleted, 0 renamed, 6 modified
```

However, Git tells us that there is no branch or tag named `exp-26220`, and we
cannot use that name in Git porcelain commands:

```dvc
$ git tag -l
0-git-init
1-dvc-init
10-bigrams-experiment
11-random-forest-experiments
2-track-data
3-config-remote
4-import-data
5-source-code
6-prepare-stage
7-ml-pipeline
8-evaluation
9-bigrams-model
baseline-experiment
bigrams-experiment
random-forest-experiments

$ git branch -l
* master

$ git checkout exp-26220
error: pathspec 'exp-26220' did not match any file(s) known to git
```

_Note: The Git CLI is divided into
[two sets of commands](https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain):
the commonly used user-friendly “porcelain” commands (like `git checkout`) and
the lower level “plumbing” commands._

This naturally begs the question, “What is `exp-26220`?”

The answer is simple, it’s a custom DVC Git ref pointing to a Git commit:

```dvc
$ git show-ref exp-26220
c42f48168830148b946f6a75d1bdbb25cda46f35 refs/exps/f1/37703af59ba1b80e77505a762335805d05d212/exp-26220
```

_Note: that `dvc exp show --sha` can be used to view Git commit SHAs for
experiments. Using DVC experiments should never require you to use any of the
low-level Git plumbing commands like `git show-ref`._

If we examine the experiment commit itself, we can see that it is just a regular
commit object that contains our hyperparameter change and the results of the
run:

```dvc
$ git show c42f481
commit c42f48168830148b946f6a75d1bdbb25cda46f35 (refs/exps/f1/37703af59ba1b80e77505a762335805d05d212/exp-26220)
Author: Peter Rowlands <peter@pmrowla.com>
Date:   Mon Apr 19 04:24:04 2021 +0000

    dvc: commit experiment 262206295221319fe5e8ca8a9854d6eb93ec0931fb377488910304cf5ed55f84

diff --git a/dvc.lock b/dvc.lock
index 0e92326..d81fe2b 100644
--- a/dvc.lock
+++ b/dvc.lock
@@ -30,19 +30,19 @@ stages:
       size: 2455
     params:
       params.yaml:
-        featurize.max_features: 3000
+        featurize.max_features: 2000
         featurize.ngrams: 2
...
diff --git a/scores.json b/scores.json
index 27f6dab..8270914 100644
--- a/scores.json
+++ b/scores.json
@@ -1,4 +1,4 @@
 {
-    "avg_prec": 0.6040544652105823,
-    "roc_auc": 0.9608017142900953
+    "avg_prec": 0.5858888885424922,
+    "roc_auc": 0.944996664954421
 }
...
```

## DVC and custom Git refs

In DVC 2.0, we now use the custom `refs/exps` namespace for storing DVC
experiments in Git. Under the hood, using Git refs allows us to keep using all
of the versioning capabilities provided by Git, without polluting your
repository with actual Git branches and tags. Since the user-friendly Git
porcelain commands (like `git checkout` and `git diff`) only resolve branches
and tags (and will ignore custom references), DVC experiments are essentially
hidden from your Git repository (and only visible to DVC commands).

Even though the experiment refs themselves are “invisible” to Git porcelain
commands, Git commit SHAs for experiments can be used in any Git command. This
allows you to leverage the power of tools like `git diff` to compare things like
code changes between a DVC experiment and any other Git commit (meaning you can
even compare experiment commit SHAs to Git branches or tags).

Likewise, for tools which provide a GUI on top of Git, experiments will be
hidden from your repository in typical use cases:

![`gitk --branches --tags` example](../uploads/images/2021-04-19/gitk-branches-tags.png 'gitk --branches --tags')
_`gitk --branches --tags`_

Tools which provide the capability to displaying all Git refs (including custom
namespaces) can also be used to view experiments as if they were Git branches:

![`gitk --all` example screenshot](../uploads/images/2021-04-19/gitk-all.png 'gitk --all')
_`gitk --all`_

Experiments are also completely local (since custom refs are not transferred to
or from Git remotes on `git push` and `git pull`), meaning that even if you run
thousands of experiments locally, you do not need to worry about accidentally
polluting your team’s upstream Github or Gitlab repository with those
experiments. However, individual DVC experiments can be explicitly shared via
remote Git repositories using the `dvc exp push` and `dvc exp pull` commands.
Regular Git branches can also be created from experiments can via
`dvc exp branch`.

## Conclusion

Prior to version 2.0, DVC already provided a method for versioning (and
reproducing) ML pipelines with Git. By extending DVC's existing capabilities
with the functionality offered by custom Git references, we've created a new
framework for users to easily generate and track their experiments. And when
used in conjunction with the other new features provided in 2.0 (like
[checkpoints versioning](https://dvc.org/doc/command-reference/exp/run#checkpoints)
and
[pipeline parametrization](https://dvc.org/doc/user-guide/project-structure/pipelines-files#templating)),
DVC can now fulfill certain use cases which were unfeasible with typical pre-2.0
DVC + Git workflows, including hyperparameter tuning and deep learning
scenarios.

We hope that whether you are new to DVC or a long time user, you will try out
the new capabilities provided in our 2.0 release. And as always, if you have any
questions, comments or suggestions, please feel free to connect with the DVC
community on [Discourse](https://discuss.dvc.org/),
[Discord](https://dvc.org/chat) and [GitHub](https://github.com/iterative/dvc).
