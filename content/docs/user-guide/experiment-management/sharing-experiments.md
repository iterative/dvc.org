# Sharing Experiments

> ⚠️ Note: Since a Git repository is required for experiment management
> features, in order to share them you will also need to have a [Git remote]
> setup. Only [SSH Git URLs] are supported.

[git remote]: https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes
[ssh git urls]:
  https://git-scm.com/book/en/v2/Git-on-the-Server-The-Protocols#_the_protocols

Sharing experiments is similar to [sharing regular project data] and artifacts
by pushing (uploading) and pulling (downloading) from remotes. DVC-tracked data,
models, etc. are in your project's <abbr>cache</abbr> and thus will be
transferred to/from [DVC remote storage](/doc/command-reference/remote) (e.g.
Amazon S3 or Google Drive). Small files like experimental code and
[DVC metafiles](/doc/user-guide/project-structure) files are stored and shared
with Git automatically (you don't need to worry about using Git directly).

[sharing regular project data]: /doc/use-cases/sharing-data-and-model-files

Start by making sure you have your remotes setup with `git remote -v` and
`dvc remote list`:

```dvc
$ git remote -v
origin  git@github.com:iterative/get-started-experiments.git (fetch)
origin  git@github.com:iterative/get-started-experiments.git (push)

$ dvc remote list
storage s3://mybucket/my-dvc-store
```

## Uploading experiments

You can upload an experiment and its files to both remotes using `dvc exp push`
(requires the Git remote name and experiment name as arguments).

```dvc
$ dvc exp push origin exp-abc123
```

> Use `dvc exp show` to find experiment names.

This pushes the necessary DVC-tracked files from the cache to the default DVC
remote (similar to `dvc push`). You can prevent this behavior by using the
`--no-cache` option to the command above.

If there's no default DVC remote, it will ask you to define one with
`dvc remote default`. If you don't want a default remote, or if you want to use
a different remote, you can specify one with the `--remote` (`-r`) option.

DVC can use multiple threads to upload files (4 per CPU core by default). You
can set the number with `--jobs` (`-j`). Please note that increases in
performance also depend on the connection bandwidth and remote configurations.

> 📖 See also the [run-cache] mechanism.

[run-cache]: /doc/user-guide/project-structure/internal-files#run-cache

## Listing experiments on remotes

You can use the `dvc exp list` command to list experiments. (with no arguments
it lists the experiments in the current project. You can supply a Git remote
name to list the experiments that have been pushed there:

```dvc
$ dvc exp list origin
main:
    cnn-128
    cnn-32
    cnn-64
    cnn-96
```

Note that by default this only lists experiments derived from the current commit
(local `HEAD` or default remote branch). You can list all the experiments
(derived from from every branch and commit) with the `--all` option:

```dvc
$ dvc exp list origin --all
0b5bedd:
    exp-9edbe
0f73830:
    exp-280e9
    exp-4cd96
    ...
main:
    cnn-128
    ...
```

## Downloading experiments

When you clone a DVC repository, it doesn't fetch any experiments by default. In
order to get them, use `dvc exp pull` (with the Git remote and the experiment
name), for example:

```dvc
$ dvc exp pull origin cnn-64
```

This pulls all the necessary files from both remotes. Again, you need to have
both of these configured (see this
[earlier section](#prepare-remotes-to-share-experiments)).

You can specify a remote to pull from with `--remote` (`-r`).

DVC can use multiple threads to download files (4 per CPU core typically). You
can set the number with `--jobs` (`-j`).

If an experiment being pulled already exists in the local project, DVC won't
overwrite it unless you supply `--force`.

## Example: Sharing multiple experiments

You can create a loop to push or pull all experiments. For example in a Linux
terminal:

```dvc
$ dvc exp list --all --names-only | while read -r expname ; do \
    dvc exp pull origin ${expname} \
done
```

## Example: Dedicated experiment directories

A good way to isolate experiments is to create a separate directory outside the
current <abbr>repository</abbr> for each one.

> Another alternative is to use `dvc exp apply` and `dvc exp branch`, but here
> we'll see how to use `dvc exp pull` to copy an experiment.

Suppose there is a DVC repo in `~/my-project` with multiple experiments. Let's
create a copy of experiment `exp-abc12` from it. First, clone the repo into
another directory:

```dvc
$ git clone ~/my-project ~/my-experiment
$ cd ~/my-experiment
```

Git sets the `origin` remote of the cloned repo to `~/my-project`, so you can
see your all experiments from `~/my-experiment` like this:

```dvc
$ dvc exp list origin
main:
	exp-abc12
	...
```

If the original repository doesn't have a `dvc remote`, you can define its
<abbr>cache</abbr> as the clone's remote storage:

```dvc
$ dvc remote add --local --default storage ~/my-project/.dvc/cache
```

> ⚠️ `--local` is important here, so that the configuration changes don't
> accidentally get to the original repo.

Having a DVC remote (and assuming the experiments have been pushed or cached
there) you can `dvc exp pull` the one in question; You can then can
`dvc exp apply` it and get a <abbr>workspace</abbr> that contains all of its
files:

```dvc
$ dvc exp pull origin exp-abc12
$ dvc exp apply exp-abc12
```

Now you have a separate repo directory for your experiment, containing all its
artifacts!
