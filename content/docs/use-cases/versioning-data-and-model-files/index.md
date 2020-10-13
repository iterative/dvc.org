# Versioning Data and Model Files

[Version control](https://en.wikipedia.org/wiki/Version_control) has become a
staple in software engineering because it allows effective collaboration on
source code. This means having a change history to traverse (commits), clean
parallel work (branching and merging), peer-reviews (pull requests), release
management, etc. Imagine enjoying similar capabilities in data science!

- Organize and share different versions of datasets and machine learning models
  easily.
- Codify data artifacts and processes to manage them with existing tools and
  best practices.
- Make data pipelines fully reproducible by yourself and others.

![](/img/404) _Data versioning in a nutshell_

Unfortunately, SCM tools like [Git](https://git-scm.com/) are designed to handle
small text files, so data scientists can only control part of their assets that
way. Storage itself is also severely limited by code hosting services
[like GitHub](https://docs.github.com/en/github/managing-large-files/what-is-my-disk-quota),
so transferring and managing data storage separately is a constant hurdle.

DVC enables [tracking](#how-it-looks) large datasets and other <abbr>data
artifacts</abbr> in Git by replacing them with small, human-readable
[metafiles](/doc/user-guide/dvc-files-and-directories). The data itself is
<abbr>cached</abbr> outside of Git (locally or externally), and can be
synchronized automatically with [dedicated storage](#versioned-storage). More
advanced features of DVC build upon this foundation.

> 💡 Please see [Get Started](/doc/start) for a primer on DVC's features.

## Advantages of versioning data with DVC

- Simple CLI: track data and ML models as they evolve without ad-hoc
  conventions, with simple commands like `dvc add` or `dvc repro` (similar to
  `git`).
- Treat data as code: leverage Git workflow such as branching, pull requests,
  and even CI/CD for your data lifecycle.
- Debugging: trace problems using the exact data that was used during
  development.
- Releasing: Tag stable data and models like code, using semantic versioning or
  other standards.
- Security: [DVC metafiles](/doc/user-guide/dvc-files-and-directories) enable
  auditing data changes. And data access controls can be setup via cloud storage
  platforms.

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

What if we could **combine data and ML model versioning features with large file
storage** solutions like traditional hard drives, NAS, or cloud services such as
Amazon S3 and Google Drive? DVC brings together the best of both worlds by
implementing easy synchronization between the data <abbr>cache</abbr> and
on-premises or cloud storage for sharing.

![](/img/model-versioning-diagram.png) _DVC's hybrid versioned storage_

> Note that [remote storage](/doc/command-reference/remote) is optional in DVC:
> no server setup or special services are needed, just the `dvc` command-line
> tool.
