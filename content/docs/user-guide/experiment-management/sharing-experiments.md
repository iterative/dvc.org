# Sharing Experiments

In a regular Git workflow, <abbr>DVC repository</abbr> versions are typically
synchronized among team members. And [DVC Experiments] are internally connected
to this commit history. But to avoid cluttering everyone's copies of the repo,
by default experiments will only exist in the local environment where they were
[created].

You must explicitly save or share experiments individually on other locations.
This is done similarly to [sharing regular project versions], by synchronizing
with DVC and Git remotes. But DVC takes care of pushing and pulling to/from Git
remotes in the case of experiments.

```
  ┌────────────────┐     ┌────────────────┐
  ├────────────────┤     │                │  Remote locations
  │   DVC remote   │     │   Git remote   │
  │    storage     │     ├────────────────┤
  └────────────────┘     └────────────────┘
          ▲                       ▲
          │      dvc exp push     │
          │      dvc exp pull     │
          ▼                       ▼
  ┌─────────────────┐    ┌────────────────┐
  │                 │    │   Code and     │
  │   Cached data   │    │   metafiles    │  Local project
  └─────────────────┘    └────────────────┘
```

> Specifically, data, models, etc. are tracked and <abbr>cached</abbr> by DVC
> and thus will be transferred to/from
> [remote storage](/doc/command-reference/remote) (e.g. Amazon S3 or Google
> Drive). Small files like [DVC metafiles](/doc/user-guide/project-structure)
> and code are tracked by Git, so DVC pushes and pulls them to/from your
> existing [Git remotes].

[dvc experiments]: /doc/user-guide/experiment-management/experiments-overview
[created]: /doc/user-guide/experiment-management/running-experiments
[sharing regular project versions]:
  /doc/start/data-and-model-versioning#storing-and-sharing
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

Once pushed, you can easily [list remote experiments] (with `dvc exp list`).

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
both of these configured (see this [earlier section](#preparation)).

If an experiment being pulled already exists in the local project, DVC won't
overwrite it unless you supply `--force`.
