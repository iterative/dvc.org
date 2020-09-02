# Versioning Data and Model Files

[Version control](https://en.wikipedia.org/wiki/Version_control) has become a
staple in software engineering because it allows effective collaboration on
source code. This means having a change history to go back to (commits),
developing features in parallel (branching), assisted merging, peer-reviews
(pull requests), tagging key revisions, etc. Imagine if we could use these
features for data modeling!

Unfortunately, versioning tools like [Git](https://git-scm.com/) are designed to
handle small text files. While other assets can exist in the repository, storage
itself is not the goal, and is limited by Git hosting services
[such as GitHub](https://docs.github.com/en/github/managing-large-files/what-is-my-disk-quota).
Traditional storage solutions like hard drives or NAS, or cloud services like
Amazon S3 or Google Drive, are much better options for saving and transferring
large files.

What if we could **combine effective data storage with robust versioning
features**?

![](/img/model-versioning-diagram.png) _DVC's hybrid versioned storage model_

DVC brings the best of both worlds together by replacing the data in the repo
with small, human-readable
[metafiles](/doc/user-guide/dvc-files-and-directories). Tracked data is
<abbr>cache</abbr> locally outside the Git repo, and can easily be synchronized
with on-premises or cloud storage. Unlike other alternatives (like Git-LFS),
[remote storage](/doc/command-reference/remote) is optional — no server setup or
special services are required.

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
