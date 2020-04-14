# Get Started with DVC!

You'll need [Git](https://git-scm.com) to run the commands in this tutorial.
Also, if DVC is not installed, please follow these [instructions](/doc/install)
first.

In the next few pages we'll build a simple natural language processing (NLP)
project from scratch. It explores the problem of predicting tags for a given
StackOverflow question. For example, we might want a classifier that can
classify (or predict) posts about Python by tagging them with `python`.

![](/img/example-flow-2x.png) _Data modeling overview_

> This is a simplified version of our [Deep Dive Tutorial](/doc/tutorials/deep).

Keep in mind that NLP is not the only area of data science where DVC can help.
DVC is designed to be agnostic of frameworks, programming languages, etc.

> In case you'd like to get the complete code base and results, or have any
> issues along the way, please note that we have a fully reproducible
> [**example-get-started**](https://github.com/iterative/example-get-started)
> repo on Github:
>
> ```dvc
> $ git clone https://github.com/iterative/example-get-started
> $ cd example-get-started
> $ dvc pull
> ```

## Initialize

Start by creating a <abbr>workspace</abbr> in the home directory, that you can
version with Git. Then run `dvc init` inside to create a DVC
<abbr>repository</abbr>:

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
environment), we're going to set up a
[remote storage](/doc/command-reference/remote/add) for the <abbr>DVC
project</abbr>. For simplicity, let's set up a _local remote_:

<details>

### What is a "local remote" ?

While the term may seem contradictory, it doesn't have to be. The "local" part
refers to the type of location where the storage is, and it means another
directory in the same file system. "Remote" is the term that refers to the
storage itself. It's essentially a local storage backup.

</details>

```dvc
$ dvc remote add -d myremote /tmp/dvc-storage
$ git commit .dvc/config -m "Configure local remote"
```

That's it! DVC doesn't require installing any databases, servers, or warehouses.
It can simply use cloud services or local/network file systems to store all your
data, intermediate results, and ML models.

Note that we only use a local remote in this tutorial for simplicity's sake. For
most cases, other "more remote" types of storage will be required. The following
are currently supported:

- Amazon **S3** (Simple Storage Service)
- Microsoft **Azure** Blob Storage
- **Google Drive**
- **Google Cloud** Storage
- Aliyun **OSS** (Object Storage Service)
- **SSH** (Secure Shell) — requires SFTP
- **HDFS** (Hadoop Distributed File System)
- **HTTP** (and HTTPS) — read-only
- Directory in the **local** file system

> Refer to `dvc remote` for more details and examples.

There are many other configuration options that can be tweaked in DVC. Please
see `dvc config` for more information.

---

Go to the next page to continue ↘
