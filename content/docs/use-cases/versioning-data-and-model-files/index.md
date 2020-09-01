# Versioning Data and Model Files

SCM or _version control_ was a disruptive introduction to software development
because it allows effective collaboration on source code by all the stakeholders
of a project. In [Git](https://git-scm.com/), this means commits, branches and
tags, merging or rebasing, etc.

Source code versioning features require storing text files and other small
assets in the code repository, but **storage itself** is not the goal of SCM. In
fact, having large and binary files in code repos can be considered a
side-effect, and its severely limited by Git hosting
([e.g. GitHub](https://docs.github.com/en/github/managing-large-files/what-is-my-disk-quota)).

Traditional storage solutions like hard drives or NAS, as well as cloud storage
services like Amazon S3 and Google Drive, are much more optimal platforms for
storing big data files and folders. So what if we could combine their advantages
with the versioning capabilities of Git?

![](/img/model-versioning-diagram.png) _DVC's hybrid versioned storage model_

...

## How it Looks

...

> For hands-on experience, we recommend following the
> [versioning tutorial](/doc/use-cases/versioning-data-and-model-files).

## DVC is not Git!

DVC metafiles such as `dvc.yaml` and `.dvc` files serve as placeholders to track
data files and directories (among other purposes). They point to specific data
contents in the <abbr>cache</abbr>, providing the ability to store multiple data
versions out-of-the-box.

Full-fledged
[version control](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control)
is left for Git and its hosting platforms (e.g. GitHub, GitLab) to handle. These
are designed for source code management (SCM) however, and thus ill-equipped to
support data science needs. That's where DVC comes in: with its built-in data
<abbr>cache</abbr>, reproducible [pipelines](/doc/start/data-pipelines), among
several other novel features (see [Get Started](/doc/start/) for a primer.)
