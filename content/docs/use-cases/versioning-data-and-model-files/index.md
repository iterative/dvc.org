# Versioning Data and Models

Data science teams today face data management questions around versioning
datasets, data artifacts, and machine learning models. How do we keep track of
changes in data, code, and ML models? What’s the best way to organize and store
multiple versions of data files for safe, persistent access? How can the
lifecycle of data and models be followed and enforced?

![](/img/data_ver_complex.png) _Exponential complexity of DS projects_

DVC proposes to _codify_ data projects in order to adopt existing engineering
tools like Git
[version control](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control),
continuous integration (CI), and other best practices that improve productivity.
This means writing a description of which data, ML artifacts, etc. should be in
the environment at a given time. DVC can restore the <abbr>workspace</abbr>
files and directories (from a separate data storage) to match that description.
Here are some benefits of this approach:

- Track all the things (code, data, ML models) with a unified toolset that is
  accessible to every project participant (data scientists, engineers, managers,
  etc.).
- Reproducibility and trustworthiness: identify exact research inputs, enable
  anyone to understand and verify results.
- Enforce data lifecycle policies — all project changes have to go through the
  repository history.
- Low coupling: separate code from data by caching large files/directories
  automatically. This makes your project easier to maintain (high cohesion) and
  improves data persistence.
- Simple CLI: work with simple terminal [commands](/doc/command-reference)
  similar to `git`.
- Treating data as code also allows for other advanced features, see
  [Get Started](/doc/start) for a primer.
- Security: Audit an immutable history of changes to your data and models.

## How it looks

Versioning large data files and directories with Git is made possible by
replacing them with small, human-readable
[metafiles](/doc/user-guide/dvc-files-and-directories). The data itself is
<abbr>cached</abbr> outside of Git (locally or externally), and can be
synchronized automatically with
[dedicated storage](/doc/use-cases/versioned-storage) — a good way to share data
for collaboration.

![](/img/404) _Parts of a DVC project_

Let’s imagine a project containing a couple of large data files (in the `data/`
directory), along with some source code to process it (`training.py`). Let’s
codify it with DVC:

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

Tiny `.dvc` files capture snapshots of existing files or directories in the
<abbr>workspace</abbr> (see `dvc add`), and can be put in Git as placeholders
for the data. Similarly, `dvc.yaml` files can also capture any
<abbr>output</abbr> data produced by running the code (see `dvc repro`). All
tracked data contents are saved to the <abbr>DVC cache</abbr>, and linked\* back
to their original location:

> \* See
> [File link types](/doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache)
> and `dvc config cache` for more info. on file linking.

The `data.dvc` and `dvc.lock` metafiles connect workspace and cache. Let’s see
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

**Remember: DVC doesn’t replace Git.** Having codified data
<abbr>artifacts</abbr> and [pipelines](/doc/start/data-pipelines), regular `git`
commands are used to create versions (commits, tags, branches, etc.):

> Note that DVC automatically prevents Git from tracking data in the
> <abbr>workspace</abbr> (via `.gitignore`).

```dvc
$ git add cleanup.sh
$ dvc add data/
...
$ git add data.dvc data/.gitignore

$ git commit -m 'Data cleanup v1.0'
```

> By matching versions of code with snapshots of the data at the time, we can
> achieve full [reproducibility](/doc/start/data-pipelines).

Now that Git is tracking the code (including
[DVC metafiles](/doc/user-guide/dvc-files-and-directories)), and DVC is tracking
the data, we can repeat the procedure to generate more commits. `dvc checkout`
can then be used to go back:

```dvc
$ git checkout v1.0
$ dvc checkout
M       data\raw
```

![](/img/versioning.png) _Full project restoration_

> For more hands-on experience, please follow the
> [versioning tutorial](/doc/use-cases/versioning-data-and-models/tutorial).
