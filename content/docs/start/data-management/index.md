---
title: 'Get Started: Data Management'
description: 'Get started with data management in DVC, including versioning
access, pipelines, as well as metrics, parameters, and plots.'
---

# Get Started: Data Management

How cool would it be to make Git handle arbitrarily large files and directories
with the same performance it has with small code files? Imagine cloning a
repository and seeing data files and machine learning models in the workspace.
Or switching to a different version of a 100Gb file in less than a second with a
`git checkout`. Think "Git for data".

https://youtu.be/kLKBcPonMYw

The foundation of DVC consists of a few commands you can run along with `git` to
track large files, directories, or ML model files. Read on or watch the video
above to learn more!

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
