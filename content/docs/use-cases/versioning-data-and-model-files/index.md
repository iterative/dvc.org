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

It's easy to revisit previous versions of the code with Git, but the data also
changes along the way. With DVC, we can achieve true
[reproducibility](/doc/start/data-pipelines) by matching code commits with
snapshots of the data used at the time. DVC [commands](/doc/command-reference)
and metafiles aim to make this intuitive.

### Basics of tracking and caching data

The following project directory contains a couple of large data files in
subdirectories of `data/`, along with some source code to process it:

```dvc
.
├── data
│   ├── labels.csv        # Many MB of labeled data here
│   └── transactions.csv  # Several GB of raw historic data
├── training.py
```

The `dvc add` command captures the essence of existing files or directories in
the <abbr>workspace</abbr> as `.dvc` files, tiny placeholders for the data that
can be put in Git. Similarly, `dvc.lock` files can also refer to any data
<abbr>output</abbr> by running the project's code (see `dvc repro` and
`dvc run`). All tracked data contents are saved to the <abbr>DVC cache</abbr>,
and linked\* back to their original location:

> \* See
> [Large Dataset Optimization](/doc/user-guide/large-dataset-optimization) and
> `dvc config cache` for more info on file linking.

```git
 .
+├── .dvc     # Hidden DVC internals
+│   ├── cache
+│   │   ├── b6...  # data/ contents moved here
+│   │   └── ed...  # model.pkl moved here
+│   ...
 ├── data           # Now a link to the cache
 │   ├── labels.csv
 │   └── transactions.csv
 ...
+├── data.dvc   # Points to data/
+├── dvc.lock   # Points to model.h5
+├── dvc.yaml   # Wrapper for running training.py
+├── model.h5   # Final result (also a link to the cache)
 ├── training.py
```

> See also `dvc.yaml`.

The `data.dvc` and `dvc.lock` metafiles connect workspace and cache. Let's see
their contents:

```yaml
outs:
  - md5: b6e29fb8740486c7e64a240e45505e41.dir
    path: data
```

```yaml
stages:
  train_model:
    cmd: python training.py data/ model.h5
    deps:
      - path: data
        md5: b6e29fb8740486c7e64a240e45505e41.dir
    outs:
      - path: model.h5
        md5: ede2872bedbfe10342bb1c416e2f049f
```

These metafiles, along with your code, can safely be put into a Git repo. The
tracked data in the workspace and the cache are separated by DVC (via
`.gitignore`).

### Version control

DVC doesn't replace Git. Having codified datasets, data pipelines, and their
outputs, use regular `git` commands to create versions (commits, tags, branches,
etc.):

```dvc
$ git add cleanup.sh
$ dvc add data/
...
$ git add data.dvc data/.gitignore

$ git commit -m 'Data cleanup v1.0'
```

Now that Git is tracking the code (including
[DVC metafiles](/doc/user-guide/dvc-files-and-directories)), and DVC is tracking
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
