# Sharing Experiments

Regular <abbr>DVC repository</abbr> versions are typically synchronized among
team members per regular Git workflow. [DVC Experiments] are directly woven into
this commit history. But they also intend to avoid cluttering shared repos, so
by default they will only exist in the local environment where they were [run].

You must explicitly save or share experiments individually on other locations.
This is done similarly to [sharing regular project versions], by synchronizing
with DVC and Git remotes. But DVC takes care of pushing and pulling to/from Git
remotes in the case of experiments.

```
  ┌────────────────┐      ┌─────────────────┐
  ├────────────────┤      │                 │
  │   DVC remote   │      │    Git remote   │
  │    storage     │      ├─────────────────┤
  └────────────────┘      └─────────────────┘
           ▲                       ▲
           │     dvc exp push      │
           │                       │
  ┌────────┴────────┐     ┌────────┴────────┐
  │   Cached data   │     │    Code and     │
  │    artifacts    │     │    metafiles    │
  │                 │     │                 │
  └─────────────────┘     └─────────────────┘
```

> Specifically, data, models, etc. are tracked and <abbr>cached</abbr> by DVC
> and thus will be transferred to/from
> [remote storage](/doc/command-reference/remote) (e.g. Amazon S3 or Google
> Drive). Small files like [DVC metafiles](/doc/user-guide/project-structure)
> and code are tracked by Git, so DVC pushes and pulls them to/from your
> existing [Git remotes].

[dvc experiments]: /doc/user-guide/experiment-management/experiments-overview
[run]: /doc/user-guide/experiment-management/running-experiments
[sharing regular project versions]: /doc/use-cases/sharing-data-and-model-files
[git remotes]: https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes

## Preparation

Make sure that you have the necessary remotes setup. Let's confirm with
`git remote -v` and `dvc remote list`:

```dvc
$ git remote -v
origin  git@github.com:iterative/get-started-experiments.git (fetch)
origin  git@github.com:iterative/get-started-experiments.git (push)

$ dvc remote list
storage s3://mybucket/my-dvc-store
```

> ⚠️ Note that DVC can only authenticate with Git remotes using [SSH URLs].

[ssh urls]:
  https://git-scm.com/book/en/v2/Git-on-the-Server-The-Protocols#_the_protocols

## Uploading experiments

You can upload an experiment with all of its files and data using
`dvc exp push`, which takes a Git remote name and an experiment ID or name as
arguments.

> 💡 You can use `dvc exp show` to find experiment names.

```dvc
$ dvc exp push origin exp-abc123
```

Once pushed, you can easily [list remote experiments] (with `dvc exp list`). To
pus

> See also [How to Share Many Experiments][share many].

[list remote experiments]:
  /doc/user-guide/experiment-management/comparing-experiments#list-experiments-saved-remotely
[share many]: /doc/user-guide/how-to/share-many-experiments

## Downloading experiments

When you clone a DVC repository, it doesn't fetch any experiments by default. In
order to get them, use `dvc exp pull` (with the Git remote and the experiment
name), for example:

```dvc
$ dvc exp pull origin cnn-32
```

This pulls all the necessary files from both remotes. Again, you need to have
both of these configured (see this
[earlier section](#prepare-remotes-to-share-experiments)).

If an experiment being pulled already exists in the local project, DVC won't
overwrite it unless you supply `--force`.

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
