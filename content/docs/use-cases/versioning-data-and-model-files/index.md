# Versioning Data and Models

Data science teams today face data management questions around versioning
datasets, data artifacts, and machine learning models. How do we keep track of
changes in data, code, and ML models? What's the best way to organize and store
multiple versions of data and model files? How can data lifecycles be defined
and enforced?

![](/img/data_ver_complex.png) _Exponential complexity of DS projects_

Let's see if DVC can help. Can we avoid ad hoc naming conventions for changed
data files and directories? Yes: DVC captures the contents of datasets,
intermediate results, and ML models as project snapshots are created
([Git commits](<(https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)>)).
And all these versions of the data are
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

![](/img/data-as-code.png) _Data as code_

This way data and models use the same change history as code, so you can
[semver](https://semver.org/) the project as a whole (as normally done in
software engineering). DVC can rewind ⏪ or ⏩ fast-forward the data needed for
your project based on the metadata in Git, letting you focus on data science
instead of moving files around!

> To try hands-on data versioning with DVC, please follow the
> [versioning tutorial](/doc/use-cases/versioning-data-and-model-files/tutorial)
> 👩‍💻.

Major benefits of Data Version Control:

- Restore any project version and find the data you need instantly. Now you can
  always identify past research inputs to understand and reproduce the results!
- No need for complicated file paths like `data/2019/labels_v7_final` in your
  code.
- Adopt existing engineering tools like Git SCM, continuous integration (CI)
  such as [CML](https://cml.dev/), and other best practices that improve
  collaboration and productivity.
- A separate data storage increases persistence, and allows
  [sharing data and models](/doc/use-cases/sharing-data-and-model-files) easily
  You can even build a [data registry](/doc/use-cases/data-registries) or a
  [model zoo](/doc/api-reference/open).
- Enforce lifecycle policies by having a defined process to change data and
  models. Data security audits, anyone?

In summary, data science and machine learning are iterative processes where the
lifecycles of data, code, and ML models occur at different paces. DVC helps
integrate and manage them effectively.
