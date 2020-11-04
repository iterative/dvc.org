# Versioning Data and Models

Data science teams today face data management questions around versioning
datasets, data artifacts, and machine learning models. How do we keep track of
changes in data, code, and ML models? What’s the best way to organize and store
multiple versions of data and model files? How can data lifecycles be defined
and enforced?

![](/img/data_ver_complex.png) _Exponential complexity of DS projects_

Let's see if DVC can help 😉. How about we agree NOT to complicate things with
ad hoc conventions when naming changed data files and directories? Check! DVC
can capture the contents of datasets, intermediate results, and ML models as
project snapshots are created
[with Git](<(https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)>)
(commits, branches, etc.).

<div style="display: flex; flex-flow: row wrap; margin: 0 -0.5rem;">
<div style="flex: 1 0 50%; padding: 0.5rem;">

**Before**: multiple filename versions — inefficient and error-prone

```git
 .
 ├── data
 │   ├── 2019-04
 │   │   └── raw
+│   ├── 2019-10
+│   │   └── raw.txt
+│   ├── 2020-03
+│   │   ├── raw.txt
+│   │   └── features.csv
+│  ...
 ├── model.h5
+├── model_20200421.h5
+├── model_final.h5
 └── src
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
 │   └── features.csv
 ├── model.h5
 └── src
     └── training.py
```

DVC
[hides](/doc/user-guide/dvc-files-and-directories#internal-directories-and-files)
the complexity and matches the right versions of code and data for you 💘.

</div>
</div>

We won't go too deep into how it works here, since we have many
[guides](/doc/user-guide) and [references](/doc/command-reference) for that, but
here's the gist of it: DVC enables data _versioning through codification_. This
means producing a description of which data, ML artifacts, etc. should be in the
environment at any given time.

![](/img/404.png) _Data as code_

> 👩‍💻 To try data versioning with DVC hands-on, please follow the
> [versioning tutorial](/doc/use-cases/versioning-data-and-model-files/tutorial).

With this approach, your source code doesn't need to figure out variable file
paths like `data/2019/words_final`. Only the actual processing code and
[hyperparameters](/doc/command-reference/params) change between commits, while
file paths remain stable.

Here are other major benefits of DVC:

- Identify exact research inputs to understand and reproduce past results: just
  restore the desired project version, and find the file(s) in question.
- adopt existing engineering tools like Git SCM, continuous integration (CI),
  and other best practices that improve productivity.
- Make data-centric projects easier to work on by separating code from data,
  which also increases data persistence.
- Collaborate with a toolset everyone is familiar with (data scientists,
  engineers, managers), and others (see [Get Started](/doc/start)).
- Enforce lifecycle and security policies by having all changes go though a Git
  repo. This immutable change history enables auditing changes to data and
  models.
