---
title: March '20 Community Gems
date: 2020-03-12
description: |
  Great discussions and technical Q&A's from our users.
descriptionLong: |
  Look here every month for great discussions and technical Q&A's from our users 
  and core development team.
picture: 2020-03-12/march_20_header.png
author: elle_obrien
commentsUrl: https://discuss.dvc.org/t/march-20-community-gems/336
tags:
  - Discord
  - Tags
  - Gems
  - Data registry
---

## Discord gems

Here are some Q&A's from our Discord channel that we think are worth sharing.

### Q: I have several simulations organized with Git tags. I know I can compare the metrics with `dvc metrics diff [a_rev] [b_rev]`, substituting hashes, branches, or tags for [a_rev] and [b_rev]. [But what if I wanted to see the metrics for a list of tags?](https://discordapp.com/channels/485586884165107732/563406153334128681/687634347104403528)

DVC has a built in function for this! You can use `dvc metrics show` with the
`-T` option:

```dvc
$ dvc metrics show -T
```

to list the metrics for all tagged experiments.

Also, we have a couple of relevant discussions going on in our GitHub repo about
[handling experiments](https://github.com/iterative/dvc/issues/2799) and
[hyperparameter tuning](https://github.com/iterative/dvc/issues/3393). Feel free
to join the discussion and let us know what kind of support would help you most.

### Q: [Is there a recommended way to save metadata about the data in a `.dvc` file?](https://discordapp.com/channels/485586884165107732/563406153334128681/685105104340386037) In particular, I'd like to save summary statistics (e.g., mean, minimum, and maximum) about my data.

One simple way to keep metadata in a `.dvc` file is by using the `meta` field.
Each `meta` entry is a `key:value` pair (for example, `name: Jean-Luc`). The
`meta` field can be manually added or written programmatically, but note that if
the `.dvc` file is overwritten (perhaps by `dvc run`, `dvc add`, or
`dvc import`) these values will not be preserved. You can read more about this
[in our docs](https://dvc.org/doc/user-guide/dvc-file-format).

Another approach would be to track the statistics of your dataset in a metric
file, just as you might track performance metrics of a model. For a tutorial on
using DVC metrics please
[see our docs](https://dvc.org/doc/command-reference/metrics).

### Q: My team has been using DVC in production. When we upgraded from DVC version 0.71.0, we started getting an error message: `ERROR: unexpected error - /my-folder is not a git repository`. [What's going on?](https://discordapp.com/channels/485586884165107732/485596304961962003/687403454989467650)

This is a consequence of new support we've added for monorepos with the
`dvc init --subdir` functionality
([see more here](https://dvc.org/doc/command-reference/init#init)), which lets
there be multiple DVC projects within a single Git repository. Now, if a DVC
repository doesn't contain a `.git` directory, DVC expects the `no_scm` flag to
be present in `.dvc/config` and raises an error if not. For example, one of our
users reported this when using DVC to pull files into a Docker container that
didn't have Git initialized (for more about using DVC without Git,
[see our docs](https://dvc.org/doc/command-reference/init#initializing-dvc-without-git)).

You can fix this by running `dvc config core.no_scm true` (you could include
this command in the script that creates Docker images). Alternately, you could
include `.git` in your Docker container, but this is not advisable for all
situations.

We are currently working to
[add graceful error-handling](https://github.com/iterative/dvc/issues/3474) for
this particular issue so stay tuned.

### Q: [Is there a way to force the pipeline to rerun, even if its dependencies haven't changed?](https://discordapp.com/channels/485586884165107732/563406153334128681/687422002822381609)

Yes, `dvc repro` has a flag that should help here. You can use the `-f` or
`--force` flag to reproduce the pipeline even when no changes in the
dependencies (for example, a training datset tracked by DVC) have been found. So
if you had a hypoethetical DVC pipeline whose final process was `deploy.dvc`,
you could run `dvc repro -f deploy.dvc` to rerun the whole pipeline.

### Q: What's the best way to orgnize DVC repositories if I have several training datasets shared by several projects? Some projects use only one dataset while other use several. [Can one project have `.dvc` files corresponding to different remotes?](https://discordapp.com/channels/485586884165107732/563406153334128681/670664813973864449)

Yes, one project directory can contain datasets from several different DVC
remotes. Specifically, DVC has functions `dvc import` and `dvc get` that emulate
the experience of using a package manager for grabbing datasets from external
sources. You can use `dvc import` or `dvc get` to access any number of datasets
that are dependencies in a given project. For more on this,
[see our tutorial on data registries](https://dvc.org/doc/use-cases/data-registries).

### Q: [What are the risks of using DVC on confidential data?](https://discordapp.com/channels/485586884165107732/563406153334128681/689848196473684024)

DVC doesn't collect any information about your data (or code, or models, for
that matter). You may have noticed that DVC
[collects Anonymized Usage Analytics](https://dvc.org/doc/user-guide/analytics),
which users may
[opt out of](https://dvc.org/doc/user-guide/analytics#opting-out). The data we
collect is extremely limited and anonymized, as it is collected mainly for the
purpose of prioritizing bugs and feature development based on DVC usage. For
example, we collect info about your operating system, DVC version, and
installation method (the
[complete list of collected features is here](https://dvc.org/doc/user-guide/analytics#what)).

Many of our users work with sensitive or private data, and we've developed DVC
with such scenarios in mind from day one.

### Q: [Can you suggest a reference architecture for using DVC as part of MLOps?](https://discordapp.com/channels/485586884165107732/563406153334128681/683890642631524392)

Increasingly, DVC is being used not to just to version and manage machine
learning projects, but as part of MLOps, _practices for combining data science
and software engineering_. As MLOps is a fairly new discipline, standards and
references aren't yet solidified. So while there isn't (_yet_) a standard recipe
for using DVC in MLOps projects, we can point you to a few architectures we
like, and which have been reported in sufficient detail to recreate.

First, DVC can be used to detect events (such as dataset changes) in a CI/CD
system that traditional version control systems might not be able to. An
excellent and thorough
[blog by Danilo Sato et al.](https://martinfowler.com/articles/cd4ml.html)
explores using DVC in this way, as part of a CI/CD system that retrains a model
automatically when changes in the dataset are detected.

Second, DVC can be used to support model training on cloud GPUs, particularly as
a tool for pushing and pulling files (such as datasets and trained models)
between cloud computing instances, DVC repositories, and other environments.
This architecture was the subject of a
[recent blog by Marcel Mikl and Bert Besser](https://blog.codecentric.de/en/2020/01/remote-training-gitlab-ci-dvc/).
Their report describes the cloud computing setup and continuous integration
pipeline quite well.

If you develop your own architecture for using DVC in MLOps, please keep us
posted. We'll be eager to learn from your experience. Also, keep an eye on our
blog in the next few months. We're rolling out some new tools with a focus on
MLOps!
