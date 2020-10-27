# Versioning Data and Models

Data science teams today face data management questions around versioning
datasets, data artifacts, and machine learning models. How do we keep track of
changes in data, code, and ML models? What’s the best way to organize and store
multiple versions of data files for safe, persistent access? How can the
intertwined lifecycles of data and models be followed and enforced?

![](/img/data_ver_complex.png) _Exponential complexity of DS projects_

DVC proposes to _codify_ data projects in order to adopt existing engineering
tools like Git
[version control](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control),
continuous integration (CI), and other best practices that improve productivity.
This means writing a description of which data, ML artifacts, etc. should be in
the environment at a given time. DVC can restore the <abbr>workspace</abbr>
files and directories (from a separate data storage) to match that description.
Some benefits of this approach:

- Identify exact research inputs, so anyone can understand and verify results
  later (reproducibility).
- Separate code from data neatly, making projects easier to work on by separate
  teams, and improving data persistence.
- All changes go through the immutable history of a Git repo, allowing to
  enforce data lifecycles policies (data security).
- Compose your own collaboration toolset that everyone (data scientists,
  engineers, managers) is familiar with, e.g. GitHub, Google Drive, etc.
- Treating _data as code_ enables other advanced features; See
  [Get Started](/doc/start) for a primer.

But how does DVC look & feel? First we replaces large data files and directories
with tiny, human-readable _metafiles_ that can be versioned using Git.

```git
 .
 ├── data         # Kept outside of Git
 │   ├── raw.txt
 │   ├── labels.csv
 ...
+├── data.dvc     # Metafile that replaces data/
+├── dvc.yaml     # Replaces model.h5
 ├── model.h5     # Also ignored by Git
 ├── training.py
```

Metafiles contain a unique identifier of this version of the data (stored
separately). For example:

```yaml
# data.dvc
outs:
  - md5: 6d048097506e0f7b6e431ca7d1b00f02
    path: data
```

> See [DVC Files and Directories](/doc/user-guide/dvc-files-and-directories) for
> more details.

Th bottom line is that your code doesn't need to read or write complicated
output file paths like `data/2020-10-27...`. Leave it to DVC to match the right
versions of code and data later 💘.

A regular `git` workflow can be used to create project
[snapshots](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)
(commits), branches, etc. encompassing all the things (source code, data, and
models):

```dvc
$ git add data.dvc data.yaml ... training.py
$ git commit -m "First modeling experiment"
$ git tag -a v1 -m "Model v1"
```

DVC can use this metadata in Git as a proxy to the actual
[data storage](/doc/use-cases/versioned-storage), and rewind ⏪ or fast-forward
⏩ the entire project based on it (see `dvc checkout`).

![](/img/versioning.png) _Full project restoration_

> For more hands-on experience, please follow the
> [versioning tutorial](/doc/use-cases/versioning-data-and-model-files/tutorial).

In summary, data science and machine learning are iterative processes where the
lifecycles of data, code, and ML models occur at different paces. DVC helps
integrate and manage them effectively.
