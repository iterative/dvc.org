# Versioning Data and Model Files

[Version control](https://en.wikipedia.org/wiki/Version_control) has become a
staple in software engineering because it allows effective collaboration on
source code. This means having a change history to go back (commits), developing
features in parallel (branching), assisted merging, peer-reviews (pull
requests), tagging key revisions, etc. Imagine if we could use these features
for data modeling!

Unfortunately, versioning tools like [Git](https://git-scm.com/) are designed to
handle small text files. While other assets can exist in the repository, file
storage itself is a side effect, and it's limited by hosting services
[like GitHub](https://docs.github.com/en/github/managing-large-files/what-is-my-disk-quota).
Traditional storage solutions such as hard drives or NAS, and cloud services
like Amazon S3 or Google Drive are much better options for saving and sharing
large files.

What if we could **combine big data storage with versioning features**?

![](/img/model-versioning-diagram.png) _DVC's hybrid versioned storage_

DVC brings the best of both worlds together by replacing the data with small,
human-readable [metafiles](/doc/user-guide/dvc-files-and-directories) that Git
can handle. The data itself is <abbr>cached</abbr> locally, outside of the Git
repo, and can be easily synchronized with on-premises or cloud storage. But
unlike other solutions (like
[Git-LFS](/doc/user-guide/related-technologies#git-lfs-large-file-storage)),
[remote storage](/doc/command-reference/remote) is optional: no server setup or
special services are needed, just the `dvc` command.

## How it looks

Working on data processing code, it's easy to overlook that the initial data
also changes along the way. If something goes wrong (or for any other reason),
it's easy to revisit previous versions of the code with Git. But its behavior
may still be different with the latest data!

To "eliminate this variable" and achieve full
[reproducibility](/doc/start/data-pipelines), we can use `dvc add` to capture
data snapshots that match code checkpoints:

```dvc
$ git add cleanup.c
$ dvc add data/raw
...
$ git add data/raw.dvc data/.gitignore

$ git commit -m 'Data cleanup v1.0'
```

Now that Git is tracking the code (including a `.dvc` file), and DVC is tracking
the data, we can repeat the procedure to generate more commits. Use
`dvc checkout` to go back:

```dvc
$ git checkout v1.0
$ dvc checkout
M       data\raw
```

![](/img/versioning.png) _Full project restoration_

> For more hands-on experience, we recommend following the
> [versioning tutorial](/doc/use-cases/versioning-data-and-model-files).

## DVC is not Git!

DVC metafiles such as `dvc.yaml` and `.dvc` files serve as placeholders to track
data files and directories (among other purposes). They point to specific data
contents in the <abbr>cache</abbr>, providing the ability to store multiple data
versions out-of-the-box. Full-fledged
[version control](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control)
is left for Git to handle, however.
