---
title: 'Data Management Trail'
description: 'Get started with data and model versioning in DVC. Learn how to use a
regular Git workflow for datasets and ML models, without storing large files in
Git.'
---

# Get Started: Data Versioning

How cool would it be to make Git handle arbitrarily large files and directories
with the same performance it has with small code files? Imagine doing a
`git clone` and seeing data files and machine learning models in the workspace.
Or switching to a different version of a 100Gb file in less than a second with a
`git checkout`.

The foundation of DVC consists of a few commands you can run along with `git` to
track large files, directories, or ML model files. Think "Git for data". Read on
or watch our video to learn about versioning data with DVC!

https://youtu.be/kLKBcPonMYw

<details>

### ⚙️ Expand to get an example dataset.

Having initialized a project in the previous section, we can get the data file
(which we'll be using later) like this:

```dvc
$ dvc get https://github.com/iterative/dataset-registry \
          get-started/data.xml -o data/data.xml
```

We use the fancy `dvc get` command to jump ahead a bit and show how a Git repo
becomes a source for datasets or models — what we call a "data/model registry".
`dvc get` can download any file or directory tracked in a <abbr>DVC
repository</abbr>. It's like `wget`, but for DVC or Git repos. In this case we
download the latest version of the `data.xml` file from the
[dataset registry](https://github.com/iterative/dataset-registry) repo as the
data source.

</details>

Welcome to DVC data management trail.

- [**Adding Files**](/doc/start/data/add-file): Start by adding your files to
  DVC.
- [**Upload and Share**](/doc/start/data/share): Add a DVC remote and upload
  your files for later sharing and retrieval.
- [**Retrieving**](/doc/start/data/retrieving): Retrieve the uploaded files.
- [**Making Changes**](/doc/start/data/making-changes): Make changes and track
  multiple versions of a same file.
- [**Switch Between Versions**](/doc/start/data/switch-between-versions): Switch
  between versions of a file.
- [**Large Dataset Versioning**](/doc/start/data/large-dataset-versioning):
  Track larger datasets with DVC.
- [**Accessing Data in other Repos**](/doc/start/data/access): How to access
  files in other DVC repositories.
- [**Listing files in other Repos**](/doc/start/data/list-files-in-remote-repo):
  How to see what other repositories contain.
- [**Download files from other Repos**](/doc/start/data/download-files-from-repos):
  How to download the files from other repositories.
- [**Track arbitrary URLs in your project**](/doc/start/data/import-files-to-project):
  How to use files on the Internet in your project.
- [**Use files in your Python project without downloading**](/doc/start/data/python-api):
  How to use files on the Internet in your project without downloading first.
