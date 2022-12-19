# Sharing Experiments

In a regular Git workflow, <abbr>DVC repository</abbr> versions are typically
synchronized among team members. And [DVC Experiments] are internally connected
to this commit history, so you can similarly share them.

## Basic workflow: store as peristent commits

The most straightforward way to share experiments is to store them as
[persistent](/doc/user-guide/experiment-management/persisting-experiments) Git
commits and share them like you would [any other commit]. This will share all
code and metadata associated with the experiment.

```cli
$ dvc exp branch quare-zips my-branch
Git branch 'my-branch' has been created from experiment 'quare-zips'.
To switch to the new branch run:
        git checkout my-branch

$ git checkout my-branch
Switched to branch 'my-branch'

$ git push origin my-branch
```

If you only need to share code and metadata like parameters and metrics, then
pushing to Git is often enough. However, you may also have data, models, etc.
that are tracked and <abbr>cached</abbr> by DVC. If you need to share these
files, you can push them to [remote storage](/doc/command-reference/remote)
(e.g. Amazon S3 or Google Drive).

```cli
$ dvc push
```

```
  ┌────────────────┐     ┌────────────────┐
  ├────────────────┤     │   DVC remote   │  Remote locations
  │   Git remote   │     │    storage     │
  │                │     ├────────────────┤
  └────────────────┘     └────────────────┘
          ▲                       ▲
          │                       │
       git push                dvc push
       git pull                dvc pull
          │                       │
          ▼                       ▼
  ┌─────────────────┐    ┌────────────────┐
  │   Code and      │    │                │
  │   metafiles     │    │   Cached data  │  Local project
  └─────────────────┘    └────────────────┘
```

## Advanced workflow: `dvc exp push`

Storing experiments as persistent Git commits is not always practical, and it
can become annoying to do this every time you want to share an experiment. What
if you aren't ready to make the experiment persistent but still want to share it
with others? What if you have many experiments to share? For those scenarios,
you can use `dvc exp push`.

This works similarly to [sharing regular project versions], by synchronizing
with DVC and [Git remotes]. But DVC takes care of pushing and pulling to/from
both Git and DVC remotes in the case of experiments.

```
  ┌────────────────┐     ┌────────────────┐
  ├────────────────┤     │   DVC remote   │  Remote locations
  │   Git remote   │     │    storage     │
  │                │     ├────────────────┤
  └────────────────┘     └────────────────┘
          ▲                       ▲
          │      dvc exp push     │
          │      dvc exp pull     │
          ▼                       ▼
  ┌─────────────────┐    ┌────────────────┐
  │   Code and      │    │                │
  │   metafiles     │    │   Cached data  │  Local project
  └─────────────────┘    └────────────────┘
```

[dvc experiments]: /doc/user-guide/experiment-management/experiments-overview
[any other commit]:
  /doc/start/data-management/data-versioning#storing-and-sharing
[git remotes]: https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes

### Preparation

<admon type="tip">

If you don't need to share <abbr>cached</abbr> data, you can skip `dvc remote`
configuration by using the `dvc exp push --no-cache` and
`dvc exp pull --no-cache`.

</admon>

Make sure that you have the necessary remotes setup. Let's confirm with
`git remote -v` and `dvc remote list`:

```cli
$ git remote -v
origin  git@github.com:iterative/get-started-experiments.git (fetch)
origin  git@github.com:iterative/get-started-experiments.git (push)

$ dvc remote list
storage s3://mybucket/my-dvc-store
```

> ⚠️ Note that DVC can only authenticate with Git remotes using [SSH URLs].

[ssh urls]:
  https://git-scm.com/book/en/v2/Git-on-the-Server-The-Protocols#_the_protocols

### Uploading experiments

You can upload an experiment with all of its files and data using
`dvc exp push`, which takes a Git remote name and an experiment ID or name as
arguments.

> 💡 You can use `dvc exp show` to find experiment names.

```cli
$ dvc exp push origin quare-zips
```

Once pushed, you can easily [list remote experiments] (with `dvc exp list`).

[list remote experiments]:
  /doc/user-guide/experiment-management/comparing-experiments#list-experiments-saved-remotely

### Downloading experiments

When you clone a DVC repository, it doesn't fetch any experiments by default. In
order to get them, use `dvc exp pull` (with the Git remote and the experiment
name), for example:

```cli
$ dvc exp pull origin cnn-32
```

This pulls all the necessary files from both remotes. Again, you need to have
both of these configured (see this [earlier section](#preparation)).

If an experiment being pulled already exists in the local project, DVC won't
overwrite it unless you supply `--force`.

### Sharing many experiments

Use the`--rev` option of `dvc exp push` and `dvc exp pull` to share many
experiments at once. For example, to upload all experiments based on the latest
commit of the current branch (Git `HEAD`), use `--rev HEAD`:

```
$ dvc exp push --rev HEAD origin
```
