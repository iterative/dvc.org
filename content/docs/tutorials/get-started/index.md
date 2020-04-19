# Get Started with DVC!

The next few pages explore the main layers of features in DVC, from basic to
advanced. This will be done in a hands-on way, working with source code and
command line.

You'll need [Git](https://git-scm.com) to run the commands in this tutorial.
Also, if DVC is not installed, please follow [these instructions](/doc/install)
first.

<details>

### Expand to get the complete project

In case you'd like to get the complete code base and results, or have any issues
along the way, please note that we have a fully reproducible
[example-get-started](https://github.com/iterative/example-get-started) repo on
Github:

```dvc
$ git clone https://github.com/iterative/example-get-started
$ cd example-get-started
$ dvc pull
```

</details>

## Initialize

Let's start by creating a <abbr>workspace</abbr>, and initialize `git` in it as
an underlying versioning layer. Then run `dvc init` inside to create a <abbr>DVC
repository</abbr>:

```dvc
$ cd ~
$ mkdir so-tag-predict
$ cd so-tag-predict
$ git init
$ dvc init
$ git commit -m "Initialize DVC repository"
```

At DVC initialization, a new `.dvc/` directory is created for internal
configuration and <abbr>cache</abbr>
[files and directories](/doc/user-guide/dvc-files-and-directories), that are
hidden from the user. This directory can be committed with Git.

> See [DVC Files and Directories](/doc/user-guide/dvc-files-and-directories) to
> learn more about the DVC internal file and directory structure.

---

Go to the next page to continue ↘
