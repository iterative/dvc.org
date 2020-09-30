# Versioning Data and Model Files

[Version control](https://en.wikipedia.org/wiki/Version_control) has become a
staple in software engineering because it allows effective collaboration on
source code. This means having a change history to traverse (commits),
developing parallel features (branching and merging), peer-reviews (pull
requests), release management, etc. Imagine using these features for data
engineering and machine learning!

Unfortunately, versioning tools like [Git](https://git-scm.com/) are designed to
handle small text files. DVC begins by enabling the [tracking](#how-it-looks) of
large datasets and other <abbr>data artifacts</abbr> by replacing them with
small, human-readable [metafiles](/doc/user-guide/dvc-files-and-directories)
that `git` can handle. The data itself is <abbr>cached</abbr> locally, outside
of Git.

Another limitation of source code management is that, while other assets can
exist in the Git repository, storage is limited by hosting services
[like GitHub](https://docs.github.com/en/github/managing-large-files/what-is-my-disk-quota).
DVC addresses this problem by integrating with
[dedicated storage](#versioned-storage) platforms.

## Summary of advantages

- Reproducibility: match code commits with the corresponding data so you can
  always go back to different versions of the full project (code, data, and
  effects).
- Snapshots: track and organize data and ML model versions with a simple CLI
  (`dvc add` and `dvc checkout`, similar to basic Git commands) and `.dvc`
  files.
- Data as code: leverage Git workflow such as commits, branching, pull requests,
  reviews, and even CI/CD for your data and models lifecycle. Think Git for
  cloud storage, but without ad-hoc conventions.
- Debugging: trace problems using the exact data that was used during
  development.
- Releasing: Tag stable data and models like you do with code. Employ semantic
  versioning, connect branches to automatic deployment, etc.
- Security: Git versioning of
  [DVC metafiles](/doc/user-guide/dvc-files-and-directories) allows us to audit
  data changes. And using cloud storage, data access control can be setup per
  user or project.

> ## ⚠️ DVC is not Git!
>
> DVC metafiles such as `dvc.yaml` and `.dvc` files serve as placeholders to
> track data files and directories (among other purposes). They point to
> specific data contents in the <abbr>cache</abbr>, providing the ability to
> store multiple data versions out-of-the-box. Full-fledged
> [version control](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control)
> itself is left for Git to handle, however.

## How it looks

Working on data processing code, it's easy to overlook that the initial data
also changes along the way. If something goes wrong (or for any other reason),
it's easy to revisit previous versions of the code with Git. But the results may
still be different if using the latest data.

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

Now that Git is tracking the code (including a `.dvc` file created by DVC), and
DVC is tracking the data, we can repeat the procedure to generate more commits.
Use `dvc checkout` to go back:

```dvc
$ git checkout v1.0
$ dvc checkout
M       data\raw
```

![](/img/versioning.png) _Full project restoration_

> For more hands-on experience, we recommend following the
> [versioning tutorial](/doc/use-cases/versioning-data-and-model-files).

## Versioned storage

What if we could **combine versioning features with data storage** like
traditional hard drives, NAS, or cloud services like Amazon S3 and Google Drive?
DVC brings together the best of both worlds by implementing easy synchronization
between the data <abbr>cache</abbr> and on-premises or cloud storage for
sharing.

![](/img/model-versioning-diagram.png) _DVC's hybrid versioned storage_

> Note that [remote storage](/doc/command-reference/remote) is optional in DVC:
> no server setup or special services are needed, just the `dvc` command-line
> tool.
