# Versioning Data and Model Files

[Version control](https://en.wikipedia.org/wiki/Version_control) was a
disruptive introduction to software development because it allows effective
collaboration on source code. This means keeping a change history, going back
and forth, working on features in parallel (branching), enforcing peer-reviews,
assisted merging of divergent versions, tagging key revisions, etc. Imagine if
we could use the same tools for data modeling!

Unfortunately, versioning tools like [Git](https://git-scm.com/) are designed
for small text files (code). While other assets can exist in the repo, storage
itself is a side-effect — limited by Git hosting services
[like-GitHub](https://docs.github.com/en/github/managing-large-files/what-is-my-disk-quota).
Traditional storage solutions like hard drives or NAS, as well as cloud services
like Amazon S3 or Google Drive, are much better options for storing large files
and folders.

What if we could **combine effective data storage with robust versioning
features**?

![](/img/model-versioning-diagram.png) _DVC's hybrid versioned storage model_

... why DVC is the way to go (sell philosophy)

## How it looks

... reference to a problem (exemplify why to version data)

... demo DVC's look&feel (more philosophy?)

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
are designed for source code versioning however, and thus ill-equipped to
support data science needs. That's where DVC comes in: with its built-in data
<abbr>cache</abbr>, reproducible [pipelines](/doc/start/data-pipelines), among
several other novel features (see [Get Started](/doc/start/) for a primer.)

... connect with other cases
