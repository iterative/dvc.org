# Get Started with DVC!

Data Version Control is **a new type of experiment management software** built
on top of the existing engineering toolset you're already used to, particularly
Git. And like `git`, `dvc` is also a command-line tool. In this guide we will
show the basic features of DVC step by step.

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

Create a directory to use as <abbr>workspace</abbr>, and use `dvc init` inside
to create a <abbr>DVC project</abbr>. At initialization, a new `.dvc/` directory
is created for the internal
[files and directories](/doc/user-guide/dvc-files-and-directories):

```dvc
$ dvc init
$ ls .dvc/
config  plots/  tmp/
```

### Not a replacement for Git

<abbr>DVC repositories</abbr> work **on top of Git**, which serves as the
underlying versioning layer. This is optional, but needed for the
[data versioning](/doc/tutorials/get-started/data-versioning) features of DVC.
The `.dvc/` directory is automatically staged with Git, so it can be committed
right away:

```dvc
$ git status
Changes to be committed:
        new file:   .dvc/.gitignore
        new file:   .dvc/config
        ...
$ git commit -m "Initialize DVC repo"
```

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
