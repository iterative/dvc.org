# Versioning Data and Models

Data science teams today face data management questions around versioning
datasets, data artifacts, and machine learning models. How do we keep track of
changes in data, code, and ML models? What’s the best way to organize and store
multiple versions of data and model files? How can data lifecycles be defined
and enforced?

![](/img/data_ver_complex.png) _Exponential complexity of DS projects_

Let's see if DVC can help 😉. How about we agree NOT to complicate things with
ad hoc conventions when naming changed data files and directories? Check! DVC
captures the contents of datasets, intermediate results, and ML models
automatically when you create snapshots of the project
[with Git](<(https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)>)
(commits, branches, etc.).

<div style="display: flex; flex-flow: row wrap; margin: 0 -0.5rem;">
<div style="flex: 1 0 50%; padding: 0.5rem;">

**Before**: manual filename versioning — error-prone

```git
 .
 ├── data
 │   ├── 2019-04
 │   │   └── raw
+│   ├── 2019-10
+│   │   └── raw.txt
+│   ├── 2020-03
+│   │   ├── raw.txt
+│   │   └── labels.csv
+│  ...
 ├── model.h5
+├── model_20200421.h5
+├── model_final.h5
 └── training.py
```

</div>
<div style="flex: 1 0 50%; padding: 0.5rem;">

**After**: Lean <abbr>workspace</abbr> that's easy to navigate. Only one version
of the data is shown alongside the current code.

```dvc
$ git checkout v1
```

```git
 .
+├── .dvc
 ├── data
 │   ├── raw.txt
 │   └── labels.csv
 ├── model.h5
 └── training.py
```

DVC
[hides](/doc/user-guide/dvc-files-and-directories#internal-directories-and-files)
the complexity and matches the right versions of code and data for you 💘.

</div>
</div>

> 💡 A side benefit of this approach is that your code doesn't need to figure
> out variable file paths like `data/2019/words_final`. Coding is decoupled from
> data management.

## What magic is this? 🧞

We won't go too deep into how DVC works here, since we have many
[guides](/doc/user-guide) and [references](/doc/command-reference) that explain
the mechanics in detail, but here's the gist of it: Data versioning is achieved
through _codification_. This means producing a description of which data, ML
artifacts, etc. should be in the environment at any given time (matching the
code commits).

The codified description consists of tiny `.dvc` files (among other
[metafiles](/doc/user-guide/dvc-files-and-directories)) in the workspace that
point to the data files and directories
([stored separately](/doc/command-reference/cache)). We can put this metadata in
Git instead of the actual data, and DVC can rewind ⏪ or fast-forward ⏩ the
entire project based on it (see `dvc checkout`).

![](/img/versioning.png) _Full project restoration_

Data and models use the same immutable change history as code now (Git commit),
so you can [semver](https://semver.org/) the project as a whole (as is typical
in software engineering).

> 🔍 For more hands-on experience, please follow the
> [versioning tutorial](/doc/use-cases/versioning-data-and-model-files/tutorial).

## Benefits of DVC

- Identify exact research inputs to understand and reproduce past results: just
  restore the desired project version, and find the file(s) in question.
- adopt existing engineering tools like Git SCM, continuous integration (CI),
  and other best practices that improve productivity.
- Make data-centric projects easier to work on by separating code from data,
  which also increases data persistence.
- Collaborate with a toolset everyone is familiar with (data scientists,
  engineers, managers), and others (see [Get Started](/doc/start)).
- Enforce lifecycle and security policies by having all changes go though a Git
  repo.

In summary, data science and machine learning are iterative processes where the
lifecycles of data, code, and ML models occur at different paces. DVC's unique
_data-as-code_ approach helps integrate and manage them effectively.
