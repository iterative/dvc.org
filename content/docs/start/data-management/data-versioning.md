---
title: 'Get Started: Data Versioning'
description: 'Get started with data and model versioning in DVC. Learn how to
use a standard Git workflow for datasets and ML models, without storing large
files in Git.'
---

# Get Started: Data Versioning

<details>

### 🎬 Click to watch a video intro.

https://youtu.be/kLKBcPonMYw

</details>

How cool would it be to track large datasets and machine learning models
alongside your code, sidestepping all the limitations of storing it in Git?
Imagine cloning a repository and immediately seeing your datasets, checkpoints
and models staged in your workspace. Imagine switching to a different version of
a 100Gb file in less than a second with a `git checkout`.

DVC can do all that. This is why it's often referred to as _*"Git for data"*_!

<admon type="tip">

The steps and results of the following chapters are captured in our
[example-get-started] repo. Feel free to `git clone/checkout` any of its
[tags][example-get-started-tags].

[example-get-started]: https://github.com/iterative/example-get-started
[example-get-started-tags]:
  https://github.com/iterative/example-get-started/tags

</admon>

## Fetching a dataset

Working inside an [initialized project](/doc/start#initializing-a-project)
directory, let's pick a piece of data to work with. We'll use an example
`data.xml` file, though any text or binary file (or directory) will do. Start by
running:

```cli
$ dvc get https://github.com/iterative/dataset-registry \
          get-started/data.xml -o data/data.xml
```

<admon type="info">

We used `dvc get` above to show how DVC can turn any Git repo into a [data
registry]. `dvc get` can download any file or directory tracked in a <abbr>DVC
repository</abbr>.

[data registry]: /doc/use-cases/data-registry

</admon>

## Tracking a dataset

Use `dvc add` to start tracking the dataset file:

```cli
$ dvc add data/data.xml
```

DVC stores information about the added file in a special `.dvc` file named
`data/data.xml.dvc`. This small, human-readable metadata file acts as a
placeholder for the original data for the purpose of Git tracking.

Next, run the following commands to track changes in Git:

```cli
$ git add data/data.xml.dvc data/.gitignore
$ git commit -m "Add raw data"
```

Now the _metadata about your data_ is versioned alongside your source code,
while the original data file was added to `.gitignore`.

<details id="add-click-to-get-a-peek-under-the-hood">

### 💡 Expand to get a peek under the hood

`dvc add` moved the data to the project's <abbr>cache</abbr>, and
<abbr>linked</abbr> it back to the <abbr>workspace</abbr>. The `.dvc/cache` will
look like this:

```
.dvc/cache
└── 22
    └── a1a2931c8370d3aeedd7183606fd7f
```

The hash value of the `data.xml` file we just added (`22a1a29...`) determines
the cache path shown above. And if you check `data/data.xml.dvc`, you will find
it there too:

```yaml
outs:
  - md5: 22a1a2931c8370d3aeedd7183606fd7f
    path: data.xml
```

</details>

<admon icon="book">

### More on discovering and accessing data

Your tracked data can be imported and fetched from anywhere using DVC. For
example, you may want to download a specific version of an ML model to a
deployment server or import a dataset into another project like we did
[above](#fetching-a-dataset). To learn about how DVC allows you to do this, see
[Discovering and Accessing Data Guide](/doc/user-guide/data-management/discovering-and-accessing-data).

</admon>
