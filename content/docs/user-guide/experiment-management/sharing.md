# Sharing Experiments

DVC has storing and sharing facilities like remotes or shared cache for tracked
files. In this section we discuss an alternative way to share the experiments
without committing them to Git history or branch.

## Prepare remotes to share experiments

There are two types of remotes to store experiment objects: Git remotes are the
locations that store Git repositories. A Github/Gitlab/Bitbucket repository is
an example of a Git remote.

The other type of remote is the DVC remote which we add to a project using
`dvc remote add` and manage using `dvc remote` subcommands. Basically DVC
remotes have the same structure as <abbr>DVC cache</abbr>, but live in the
cloud. DVC uses these locations to store and fetch binary files that doesn't
normally fit into Git repositories.

DVC experiments use both kinds of these remotes to store objects.

Experiment objects that are normally tracked in Git are shared using Git
remotes, and files tracked with DVC are shared using DVC remotes. Therefore both
of these sharing facilities should be set up for experiment sharing to work
correctly.

Normally, there should already be a Git repository set up as `origin` when you
clone the project. To view Git remotes in a project, you can use `git remote -v`
command.

```dvc
$ git remote -v
origin  https://github.com/iterative/get-started-experiments (fetch)
origin  https://github.com/iterative/get-started-experiments (push)
```

On the other hand, cached DVC files are stored in DVC remotes. You can get the
location of DVC remotes in a project using `dvc remote list` command.

```dvc
$ dvc remote list
storage https://remote.dvc.org/get-started-experiments
```

If there is not a DVC remote set up for your project, please refer to
`dvc remote add` documentation to add a remote to share DVC-cached files in the
experiments.

(Q: What about neither, `cache: false` objects and objects tracked both DVC and
Git?)

## Pushing experiments to remotes

You can push an experiment to a Git repository using `dvc exp push`.

```dvc
$ dvc exp push origin exp-abc123
```

It requires the Git remote name and experiment name as arguments.

It pushes the DVC tracked files in DVC cache to DVC remote automatically. If you
want to prevent this behavior and not push these files, you can use `--no-cache`
flag.

DVC uses the default remote for pushing files in the DVC cache. If there is not
a default DVC remote, it asks to define one by `dvc remote default <remote>`. If
you don't want to have a default remote, or if there are more than one DVC
remote defined in the project, you can select the remote that will be used by
`--remote` / `-r` option.

DVC uses multiple threads to push DVC-cached files. By default DVC uses 4x
`cpu_count()` threads to push the files. You can set the number of threads
with`--jobs`/`-j` option. Please note that increase in performance is dependent
to available bandwidth and remote (cloud) server configurations. For very large
number of jobs, you may have side effects in your local network or system.

DVC has a caching mechanism called _Run-Cache_ that stores the artifacts from
intermediate stages. For example, if there is an intermediate step that applies
data-augmentation on your dataset and you would like to push these artifacts as
well as the end products of the experiments, you can use `--run-cache` flag to
push all of these to the DVC remote. `--run-cache` flag pushes all artifacts
referenced in `dvc.lock` file.

## Listing experiments in remotes

DVC stores the experiments in Git repositories. In order to list experiments in
a repository, you can use `dvc exp list` command.

With no command line options, this command lists the experiments in the current
repository. You can supply a Git remote name to list the experiments.

```dvc
$ dvc exp list origin
main:
	cnn-128
	cnn-32
	cnn-64
	cnn-96
```

`dvc exp list <git-remote>` lists the experiments that are referenced by the
_current commit._ If you would like to list all experiments referenced from
other branches and commit, use `--all` flag.

```dvc
$ dvc exp list origin --all
0b5bedd:
	exp-9edbe
0f73830:
	exp-280e9
	exp-4cd96
	exp-65d0a
172b1b9:
	exp-7424d
190e697:
	exp-ec039
3426c9e:
	exp-0680e
39afbbc:
	exp-21155
        ...
```

When you don't need the parent commits', you can just get the names with
`--names-only` option.

```dvc
$ dvc exp list origin --names-only
cnn-128
cnn-32
cnn-64
cnn-96
```

## Pulling experiments from remotes

When you clone a DVC repository from a Git remote, it doesn't clone any
experiments. In order to get the experiments, use `dvc exp pull` command with
the Git remote and the experiment name.

```dvc
$ dvc exp pull origin cnn-64
```

It pulls all the text files from Git repository and DVC tracked files from DVC
remote. You need to have both of these remote configured in your project. See
[above](#prepare-remotes-to-share-experiments) for information regarding remote
configuration.

When you don't have a default DVC remote, or would like to ask DVC to use a
particular remote, you can specify it with `--remote` / `-r` option.

DVC can use more than one thread to pull DVC tracked files from remotes. You can
set the number of threads to pull by `--jobs` / `-j` option. By default DVC uses
4 x `cpu_count()` threads for non-SSH remotes, and 4 threads for SSH remotes.

If there is already an experiment in the current repository with the name you're
trying to pull, DVC won't overwrite it unless you supply `--force` flag.

## Pulling all experiments from a remote

Assuming all experiments have distinct names, you can create a loop to pull all
experiments from `origin` like the following.

```dvc
$ dvc exp list --all --names-only | while read -r expname ; do \
    dvc exp pull origin ${expname} \
done
```

## Creating a separate directory for an experiment

A very common use case for experiments is to create a separate local directory
for your work. You can do so by `dvc exp apply` and `dvc exp branch` commands,
but here we'll see how to use `dvc exp pull` to copy an experiment.

Suppose there is project in `~/my-project` that you have many experiments and
would like to have a copy of a particular experiment named `exp-abc12` in this
project.

You first clone the repository to another directory:

```dvc
$ git clone ~/my-project ~/my-successful-experiment
$ cd ~/my-successful-experiment
```

Git sets `origin` of cloned repository to `~/my-project`, so when you list the
experiments in this new clone, you can see your all experiments in
`~/my-project`.

```dvc
$ dvc exp list origin
main:
   ...
   exp-abc12
   ...
```

If there is no DVC remote in the original repository, and there is no means to
set up one, you can define the original repository's DVC cache as a _remote_ in
the clone.

```dvc
$ dvc remote add --local --default storage ~/my-project/.dvc/cache
```

If there is a DVC remote for the project, assuming all DVC cache in
`~/my-project` repository is pushed to it, you can pull an experiment in the
clone:

```dvc
$ dvc exp pull origin exp-abc12
```

Then we can apply this experiment and get a workspace that contains all your
experiment files:

```dvc
$ dvc exp apply exp-abc12
```

Now you have a dedicated directory for your experiment that contains all your
artifacts.

---

> BELOW is from GS:Experiments and will be removed

## Sharing Experiment

After committing the best experiments to our Git branch, we can
[store and share](/doc/start/data-and-model-versioning#storing-and-sharing) them
remotely like any other iteration of the pipeline.

```dvc
dvc push
git push
```

<details>

### 💡 Important information on storing experiments remotely.

The commands in this section require both a `dvc remote default` and a
[Git remote](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes). A
DVC remote stores the experiment data, and a Git remote stores the code,
parameters, and other metadata associated with the experiment. DVC supports
various types of remote storage (local file system, SSH, Amazon S3, Google Cloud
Storage, HTTP, HDFS, etc.). The Git remote is often a central Git server
(GitHub, GitLab, BitBucket, etc.).

</details>

Experiments that have not been made persistent will not be stored or shared
remotely through `dvc push` or `git push`.

`dvc exp push` enables storing and sharing any experiment remotely.

```dvc
$ dvc exp push gitremote exp-bfe64
Pushed experiment 'exp-bfe64' to Git remote 'gitremote'.
```

`dvc exp list` shows all experiments that have been saved.

```dvc
$ dvc exp list gitremote --all
72ed9cd:
        exp-bfe64
```

`dvc exp pull` retrieves the experiment from a Git remote.

```dvc
$ dvc exp pull gitremote exp-bfe64
Pulled experiment 'exp-bfe64' from Git remote 'gitremote'.
```

> All these commands take a Git remote as an argument. A `dvc remote default` is
> also required to share the experiment data.
