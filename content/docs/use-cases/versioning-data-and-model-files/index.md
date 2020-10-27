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
Some benefits of this approach:

- Track all the things (source code, data, ML models) as they change.
- Collaborate using a unified toolset, accessible to everyone (data scientists,
  engineers, managers, etc.).
- Identify exact research input, enabling anyone to understand and verify the
  results later (reproducibility).
- All project changes go through the immutable history of a repository, allowing
  for enforcement of lifecycle policies (data security).
- DVC separates code from data automatically. This makes the project easier to
  maintain and improves data persistence (low coupling, high cohesion).
- Treating _data as code_ also allows for other advanced features, see
  [Get Started](/doc/start) for a primer.

Let's go over how it looks & feels!

DVC replaces large data files and directories in the <abbr>workspace</abbr> with
tiny, human-readable _metafiles_ that can be versioned using Git.

```git
 .
 ├── data         # Kept outside of Git
 │   ├── raw.txt
 │   └── labels.csv
 ...
+├── data.dvc     # Metafile that replaces data/
+├── dvc.yaml     # Replaces model.h5
 ├── model.h5     # Also outside of Git
 ├── training.py
```

Your code doesn't need to look for the right version of input files, nor to
write complicated output file paths, leave it to DVC to match them later 💘

> See [DVC Files and Directories](/doc/user-guide/dvc-files-and-directories) for
> more details.

Metafiles contain a unique identifier of the version of the data (stored
separately). For example:

```yaml
# data.dvc
outs:
  - md5: 6d048097506e0f7b6e431ca7d1b00f02
    path: data
```

A regular `git` workflow can be used to create versions (commits), branches,
etc. with the codified data and models:

```dvc
$ git add data.dvc data.yaml ... training.py
$ git commit -m "First modeling experiment"
$ git tag -a v1 -m "Model v1"
```

The project metadata in Git works as a proxy to the actual data that match the
current code version. DVC uses it to rewind ⏪ (or ⏩) the entire project (see
`dvc checkout`).

![](/img/versioning.png) _Full project restoration_

> For more hands-on experience, please follow the
> [versioning tutorial](/doc/use-cases/versioning-data-and-model-files/tutorial).
