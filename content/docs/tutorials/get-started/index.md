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

## Configure

Because we'll want to share data and models outside of the local context later
(for example with other collaborators or for access from a different computing
environment), we're going to set up a default
[remote storage](/doc/command-reference/remote) for the <abbr>DVC
project</abbr>. For simplicity, let's set up a _local remote_:

<details>

### What is a "local remote" ?

While the term may seem contradictory, it doesn't have to be. The "local" part
refers to the type of location where the storage is: another directory in the
same file system. "Remote" is how we call storage for DVC projects. It's
essentially a local storage backup.

</details>

```dvc
$ dvc remote add -d myremote /tmp/dvc-storage
$ git commit .dvc/config -m "Configure local remote"
```

That's it! DVC doesn't require installing any databases, servers, or warehouses.
It can simply use cloud services or local/network file systems to store all your
data, intermediate results, and ML models.

Note that for most real-life cases, **DVC supports many other remote storage
types**: Google Drive, Amazon S3, Azure Blob Storage, Google Cloud Storage,
Aliyun OSS, SSH, HDFS, and HTTP. Please refer to `dvc remote add` for more
details and examples.

There are many other configuration options that can be tweaked in DVC. Please
see `dvc config` for more information.

---

Go to the next page to continue ↘
