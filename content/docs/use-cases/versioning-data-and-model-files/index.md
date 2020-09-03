# Versioning Data and Model Files

[Version control](https://en.wikipedia.org/wiki/Version_control) has become a
staple in software engineering because it allows effective collaboration on
source code. This means having a change history to go back (commits), developing
features in parallel (branching), assisted merging, peer-reviews (pull
requests), tagging key revisions, etc. Imagine if we could use these features
for data modeling!

Unfortunately, versioning tools like [Git](https://git-scm.com/) are designed to
handle small text files. While other assets can exist in the repository, storage
itself is not the goal, and its limited by Git hosting services
[like GitHub](https://docs.github.com/en/github/managing-large-files/what-is-my-disk-quota).
Traditional storage solutions such as hard drives or NAS, or cloud services like
Amazon S3 or Google Drive, are much better options for saving and transferring
large files.

What if we could **combine effective data storage with robust versioning
features**?

![](/img/model-versioning-diagram.png) _DVC's hybrid versioned storage model_

DVC brings the best of both worlds together by replacing the data with small,
human-readable [metafiles](/doc/user-guide/dvc-files-and-directories) that Git
can handle. The data itself is <abbr>cached</abbr> locally outside the Git repo,
and can easily be synchronized with on-premises or cloud storage. But unlike
other options (like
[Git-LFS](/doc/user-guide/related-technologies#git-lfs-large-file-storage)),
[remote storage](/doc/command-reference/remote) is optional: no server setup or
special services are needed, just the `dvc` command.

## Why bother?

Working on data processing code, it's easy to overlook that the initial data may
also change along the way. If something goes wrong (or for any other reason), it
may be easy to revisit previous versions of the code with Git. But its behavior
may still be different with the latest data!

To eliminate this variable and achieve full
[reproducibility](/doc/start/data-pipelines), we can use `dvc add` to capture
data snapshots that match code checkpoints:

```dvc
$ git add cleanup.c
$ dvc add data/raw
...
$ git add data/raw.dvc data/.gitignore

$ git commit -m 'Data cleanup v1'
```

Now that Git is tracking the code (including a `.dvc` file), and DVC is tracking
the data, we can repeat the procedure to generate more commits. Use
`dvc checkout` to go back:

```dvc
$ git checkout v1
$ dvc checkout
M       data\raw
```

> For more hands-on experience, we recommend following the
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
