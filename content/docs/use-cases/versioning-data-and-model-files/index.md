# Versioning Data and Models

Data science teams today face data management questions around versioning
datasets, data artifacts, and machine learning models. How do we keep track of
changes in data, code, and ML models? What's the best way to organize and store
multiple versions of data and model files? How can data lifecycles be defined
and enforced?

![](/img/data_ver_complex.png) _Exponential complexity of DS projects_

Let's see if DVC can help. Can we avoid ad hoc naming conventions for changed
data files and directories? Check! ✔️ DVC captures the contents of datasets,
intermediate results, and ML models as project snapshots are created
([Git commits](<(https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)>)).
✔️ All these versions of the data are
[stored separately](/doc/user-guide/dvc-files-and-directories#structure-of-the-cache-directory)
in an efficient way that prevents file duplication.

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

DVC hides the complexity and matches the right versions of code and data for you
💘.

</div>
</div>

We won't go too deep into how everything works here, since we have many
[guides](/doc/user-guide) and [references](/doc/command-reference) for that, but
here's the gist of it: DVC enables data _versioning through codification_. This
means producing a description of which data, ML artifacts, etc. should be in the
environment at any given time. It consists of special
[metafiles](/doc/user-guide/dvc-files-and-directories) that we can put in Git
along with the source code.

![](/img/404.png) _Data as code_

This way data and models use the same change history as code, so you can
[semver](https://semver.org/) the project as a whole (as normally done in
software engineering). DVC can rewind ⏪ or fast-forward ⏩ the data needed for
your project based on the metadata in Git, letting you focus on data science
instead of moving data around!

Other major benefits of Data Version Control:

- Identify exact research inputs to understand and reproduce past results: just
  restore the desired project version, and find the data you need.
- Adopt existing engineering tools like Git SCM, continuous integration (CI),
  and other best practices that improve productivity.
- Make data-centric projects easier to work on by separating code from data,
  which also increases data persistence.
- Your code doesn't need to figure out complicated file paths like
  `data/2019/labels_v2_final`. You can focus on writing code and doing data
  science.
- Collaborate with a toolset everyone is familiar with (data scientists,
  engineers, managers), and others (see [Get Started](/doc/start)).
- Enforce lifecycle and security policies by having all changes go though a Git
  repo. This immutable change history enables auditing changes to data and
  models.

> 👩‍💻 To try hands-on data versioning with DVC, please follow the
> [versioning tutorial](/doc/use-cases/versioning-data-and-model-files/tutorial).

In summary, data science and machine learning are iterative processes where the
lifecycles of data, code, and ML models occur at different paces. DVC helps
integrate and manage them effectively.
