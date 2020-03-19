# Get Started with DVC!

You'll need [Git](https://git-scm.com) to run the commands in this guide. Also,
if DVC is not installed, please follow these [instructions](/doc/install) to do
so.

In the next few sections we'll build a simple natural language processing (NLP)
project from scratch. If you'd like to get the final result or have any issues
along the way, you can download the fully reproducible
[GitHub project](https://github.com/iterative/example-get-started) by running:

```dvc
$ git clone https://github.com/iterative/example-get-started
```

Otherwise, bear with us and we'll introduce some basic DVC concepts to get the
same results together!

The idea for this project is a simplified version of our
[Deep Dive Tutorial](/doc/tutorials/deep). It explores the NLP problem of
predicting tags for a given StackOverflow question. For example, we might want a
classifier that can classify (or predict) posts about Python by tagging them
with `python`.

![](/img/example-flow-2x.png)

This is a natural language processing context, but NLP isn't the only area of
data science where DVC can help. DVC is designed to be agnostic of frameworks,
languages, etc. If you have data files or datasets and/or you produce data
files, models, or datasets and you want to:

- Capture and save those <abbr>data artifacts</abbr> the same way you capture
  code
- Track and switch between different versions of data easily
- Understand how data artifacts (e.g. ML models) were built in the first place
- Be able to compare models to each other
- Bring software best practices to your team and get everyone on the same page

# Initialize

There are a few recommended ways to install DVC: OS-specific package/installer,
`pip`, `conda`, and Homebrew. See [Installation](/doc/install) for all the
alternatives and details.

Let's start by creating a <abbr>workspace</abbr> we can version with Git. Then
run `dvc init` inside to create the DVC <abbr>project</abbr>:

```dvc
$ mkdir example-get-started
$ cd example-get-started
$ git init
$ dvc init
$ git commit -m "Initialize DVC project"
```

At DVC initialization, a new `.dvc/` directory will be created for internal
configuration and cache
[files and directories](/doc/user-guide/dvc-files-and-directories) that are
hidden from the user.

> See `dvc init` if you want to get more details about the initialization
> process, and
> [DVC Files and Directories](/doc/user-guide/dvc-files-and-directories) to
> learn about the DVC internal file and directory structure.

The last command, `git commit`, versions the `.dvc/config` and `.dvc/.gitignore`
files (DVC internals) with Git.

# Configure

Once you install DVC, you'll be able to start using it (in its local setup)
immediately.

However, remote storage should be set up (see `dvc remote`) if you need to share
data or models outside of the context of a single project, for example with
other collaborators or even with yourself, in a different computing environment.
It's similar to the way you would use GitHub or any other Git server to store
and share your code.

For simplicity, let's setup a local remote:

<details>

### What is a "local remote" ?

While the term may seem contradictory, it doesn't have to be. The "local" part
refers to the machine where the project is stored, so it can be any directory
accessible to the same system. The "remote" part refers specifically to the
project/repository itself. Read "local, but external" storage.

</details>

```dvc
$ dvc remote add -d myremote /tmp/dvc-storage
$ git commit .dvc/config -m "Configure local remote"
```

> We only use a local remote in this section for simplicity's sake as you learn
> to use DVC. For most [use cases](/doc/use-cases), other "more remote" types of
> remotes will be required.

[Adding a remote](/doc/command-reference/remote/add) should be specified by both
its type (protocol) and its path. DVC currently supports these types of remotes:

- `s3`: Amazon Simple Storage Service
- `azure`: Microsoft Azure Blob Storage
- `gdrive` : Google Drive
- `gs`: Google Cloud Storage
- `ssh`: Secure Shell (requires SFTP)
- `hdfs`: Hadoop Distributed File System
- `http`: HTTP and HTTPS protocols
- `local`: Directory in the local file system

> If you installed DVC via `pip` and plan to use cloud services as remote
> storage, you might need to install these optional dependencies: `[s3]`,
> `[azure]`, `[gdrive]`, `[gs]`, `[oss]`, `[ssh]`. Alternatively, use `[all]` to
> include them all. The command should look like this: `pip install "dvc[s3]"`.
> (This example installs `boto3` library along with DVC to support S3 storage.)

For example, to setup an S3 remote we would use something like this (make sure
that `mybucket` exists):

```dvc
$ dvc remote add -d s3remote s3://mybucket/myproject
```

> This command is only shown for informational purposes. No need to actually run
> it in order to continue with the Get Started.

You can see that DVC doesn't require installing any databases, servers, or
warehouses. It can use bare S3 or SSH to store data, intermediate results, and
models.

See `dvc config` to get information about more configuration options and
`dvc remote` to learn more about remotes and get more examples.
