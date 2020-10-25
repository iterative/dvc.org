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

## Why do it with DVC

- Track all the things (code, data, ML models) as they change.
- Collaborate using a unified toolset that is accessible to everyone (data
  scientists, engineers, managers, etc.).
- Reproducibility and trustworthiness: identify exact inputs of past research,
  enable anyone to understand and verify results.
- Enforce data lifecycle policies: all project changes have to go through the
  repository history. Security audits are also made possible by an immutable
  history of changes in data and models.
- Low coupling: separate code from data by caching large files/directories
  automatically. This makes data projects easier to maintain (high cohesion) and
  improves data persistence.
- Simple interface: work with simple terminal [commands](/doc/command-reference)
  similar to `git`.
- Treating _data as code_ also allows for other advanced features, see
  [Get Started](/doc/start) for a primer.

## How it looks & feels

Data science and machine learning are iterative processes where the lifecycles
of data, code, and models occur semi-independently. Let's see how data
codification helps manage them effectively.

DVC starts by replacing large data files and directories in the
<abbr>workspace</abbr> with tiny, human-readable
[metafiles](/doc/user-guide/dvc-files-and-directories) that can be versioned
using Git. The data itself is cached outside of Git:

```git
 .
+├── .dvc         # Hidden DVC internals
+│   ├── cache      # CAS, excluded from Git
+│   │   ├── b6/e29fb... # data/ contents moved here
+│   │   └── ed/e2872... # model.h5 stored here
+│   ...
 ├── data         # Large dir, kept outside of Git
 │   ├── raw.txt
 │   └── labels.csv
 ...
+├── data.dvc     # Metafile that replaces data/
+├── dvc.yaml     # Metafile that replaces model.h5
 ├── model.h5     # Large file, also cached outside of Git
 ├── training.py
```

The [data cache](/doc/command-reference/config#cache) is a
[content-addressable storage](https://www.google.com/url?q=https://en.wikipedia.org/wiki/Content-addressable_storage&sa=D&ust=1603526252385000&usg=AOvVaw3Y4fV6jAM2grfE4k9AP3HX)
(CAS), which adds a layer of indirection between code and data... In other
words, your code doesn't need to look for the right version of input files, nor
to write complicated output file names, leave it to DVC to match them later 💘

> 💡 This cache can be
> [synchronized](/doc/start/data-versioning#storing-and-sharing) automatically
> with [dedicated storage](/doc/use-cases/versioned-storage) for sharing.

Metafiles connect workspace and cache (among other purposes). For example:

```yaml
# data.dvc
outs:
  - md5: b6e29fb... # Points to .dvc/cache/b6/e29fb...
    path: data
```

```yaml
# dvc.lock
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

> See [Data Pipelines](/doc/start/data-pipelines) to learn about stages.

Having codified the data and models in the project, a regular `git` workflow can
be used to create versions (commits), branches, etc. using the metafiles as
proxies to the underlying data:

```dvc
$ git add training.py
$ dvc add data/
...
$ git add data.dvc data/.gitignore
$ git commit -m 'First modeling experiment'

# Iterate, repeat!
```

> Note that DVC prevents Git from tracking data in the workspace (via
> `.gitignore`).

With the project metadata in Git (along with matching code), it can now easily
be rewound ⏪:

```dvc
$ git checkout v1
$ dvc checkout
M       data
```

![](/img/versioning.png) _Full project restoration_

> For more hands-on experience, please follow the
> [versioning tutorial](/doc/use-cases/versioning-data-and-model-files/tutorial).
