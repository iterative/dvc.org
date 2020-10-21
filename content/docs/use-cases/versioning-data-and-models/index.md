# Versioning Data and Models

Taking data science from conceptual to applied requires answering data
management questions around dataset and machine learning model versioning. How
to track the evolution of data and ML models? How to organize and store the
revisions of these data artifacts for easy access and sharing?

It turns out that we can find some answers in software engineering, like
[version control](https://en.wikipedia.org/wiki/Version_control). This means
keeping a change history (commits), automatic file deduplication, enabling
parallel teamwork (branching), peer-reviews (pull requests), etc. Imagine if we
could do the same with data!

![](/img/data-as-code.png) _Matching data descriptions to a working environment_

Some advantages of versioning data and models:

- Manage multiple versions of datasets and ML models easily, while
  [preventing duplication](/doc/user-guide/large-dataset-optimization).
- Data as code: leverage Git workflows such as commits, branching, pull
  requests, reviews, and even CI/CD for your data and models lifecycle. Think
  "Git for data"
- Reproducibility: Guarantee that anyone can rewind
  [data pipelines](/doc/start/data-pipelines) exactly as they were created
  originally.
- Simple CLI: work with simple terminal commands like `dvc add` or
  `dvc checkout` (similar to familiar `git` commands).
- Security: [DVC metafiles](/doc/user-guide/dvc-files-and-directories) enable
  auditing data changes. And data access controls can be setup via storage
  integrations.

## Why DVC

Unfortunately, SCM tools like [Git](https://git-scm.com/) are designed to handle
small text files, so data scientists can only control part of their assets that
way. Storage itself is also severely limited by code hosting platforms
[like GitHub](https://docs.github.com/en/github/managing-large-files/what-is-my-disk-quota),
so transferring and managing data storage separately is a constant hurdle.

Rather than reinventing the wheel, DVC proposes to treat **data as code** in
order to manage it with existing engineering tools and best practices. Codifying
data science projects (building a declarative description of which data and
models should be in the environment) lets DVC match this description to the
<abbr>workspace</abbr> automatically, among other advanced uses.

> 💡 Please see [Get Started](/doc/start) for a primer on DVC's features.

## How it looks

Versioning large data files and directories with Git is made possible by
replacing them with small, human-readable
[metafiles](/doc/user-guide/dvc-files-and-directories). The data itself is
<abbr>cached</abbr> outside of Git (locally or externally), and can be
synchronized automatically with
[dedicated storage](/doc/use-cases/versioned-storage) — a good way to share data
for collaboration.

![](/img/404) _Parts of a DVC project_

Let's imagine a project containing a couple of large data files (in the `data/`
directory), along with some source code to process it:

```dvc
.
├── data
│   ├── labels.csv        # Many MB of labeled data here
│   └── transactions.csv  # Several GB of raw historic data
├── training.py
```

Tiny `.dvc` files capture snapshots of existing files or directories in the
<abbr>workspace</abbr> (see `dvc add`), and can be put in Git as placeholders
for the data. Similarly, `dvc.yaml` files can also capture any
<abbr>output</abbr> data produced by running the code (see `dvc repro`). All
tracked data contents are saved to the <abbr>DVC cache</abbr>, and linked\* back
to their original location:

> \* See
> [File link types](/doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache)
> and `dvc config cache` for more info. on file linking.

```git
 .
+├── .dvc     # Hidden DVC internals
+│   ├── cache
+│   │   ├── b6e29fb... # data/ contents moved here
+│   │   └── ede2872... # model.h5 stored here
+│   ...
 ├── data           # Now a link to the cache
 │   ├── labels.csv
 │   └── transactions.csv
 ...
+├── data.dvc     # Points to data/
+├── dvc.lock     # Points to model.h5
+├── dvc.yaml     # Wrapper for running training.py
+├── model.h5     # Final result (also a link to the cache)
 ├── training.py
```

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

By matching versions of code with snapshots of the data at the time, we can
achieve true [reproducibility](/doc/start/data-pipelines).

## Version control

DVC doesn't replace Git. Having codified data <abbr>artifacts</abbr> and
[pipelines](/doc/start/data-pipelines), use regular `git` commands to create
versions (commits, tags, branches, etc.):

```dvc
$ git add cleanup.sh
$ dvc add data/
...
$ git add data.dvc data/.gitignore

$ git commit -m 'Data cleanup v1.0'
```

> Note that DVC automatically prevents Git from tracking data in the
> <abbr>workspace</abbr> (via `.gitignore`).

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

> For more hands-on experience, please follow the
> [versioning tutorial](/doc/use-cases/versioning-data-and-models/tutorial).
