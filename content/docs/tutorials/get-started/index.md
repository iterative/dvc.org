# Get Started with DVC!

Data Version Control is a data version control, data pipelining, and experiment
management command-line tool built on top of existing engineering toolset ans
practices, particularly Git. In this guide we will show the basic features of
DVC step by step.

## Initialize

Move into the directory you want to use as <abbr>workspace</abbr>, and use
`dvc init` inside to create a <abbr>DVC project</abbr>. It can contain existing
project files. At initialization, a new `.dvc/` directory is created for the
internal
[files and directories](/dvc-files-and-directories#internal-directories-and-files):

```dvc
$ dvc init
$ ls .dvc/
config  plots/  tmp/
```

DVC is typically initialized on top of Git, which is needed for the
[versioning](/doc/tutorials/get-started/data-versioning) features. The `.dvc/`
directory is automatically staged with Git by `dvc init`, so it can be committed
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
