# Get Started with DVC!

This tutorial explores DVC hands-on, working with source code and command line.

<details>

### TLDR: Get the complete project

In case you'd like to get the complete code base and final results, or have any
issues along the way, please note that we have a fully reproducible
[example-get-started](https://github.com/iterative/example-get-started) repo on
Github:

```dvc
$ git clone https://github.com/iterative/example-get-started
$ cd example-get-started
$ dvc pull
```

</details>

## Initialize

Start by creating a <abbr>workspace</abbr> and initialize Git in it, as the
underlying versioning layer. Then use `dvc init` to create a <abbr>DVC
repository</abbr>. For example:

```dvc
$ mkdir dvc-get-started
$ cd dvc-get-started
$ git init
$ dvc init
$ git status
Changes to be committed:
        new file:   .dvc/.gitignore
        new file:   .dvc/config
        ...
$ git commit -m "Initialize DVC repository"
```

At DVC initialization, a new `.dvc/` directory is created for internal
[files and directories 📖](/doc/user-guide/dvc-files-and-directories). This
directory is automatically staged with Git, so it can be committed right away.

## What's ahead?

DVC functionality can be split into layers. Each one can be used independently,
but together they form a robust framework to capture and navigate machine
learning development.

- [Data **versioning**](/doc/tutorials/get-started/data-versioning) is the basic
  foundation for storing and sharing **evolving datasets** and ML models. We
  work on a regular Git workflow, without storing **large files** with Git.

- [Data **pipelines**](/doc/tutorials/get-started/data-pipelines) let you
  register data modeling **workflows** that can be managed and **reproduced**
  easily by you or others.

- [**Experiments**](/doc/tutorials/get-started/experiments) are a natural part
  of data science, or any R&D process. DVC provides special tools to define,
  manage, tune, and **compare them** through _parameters_ and _metrics_.
