# Sharing Experiments

In a regular Git workflow, <abbr>DVC repository</abbr> versions are typically
synchronized among team members. And [DVC Experiments] are internally connected
to this commit history, so you can similarly share them.

[dvc experiments]: /doc/user-guide/experiment-management

## Push and pull experiments

The fastest way to share DVC experiments is to use `dvc exp push` and
`dvc exp pull`. This works like [sharing regular project
versions][sharing-data], but here DVC takes care of synchronizing to/from both
Git and [DVC remotes][remote storage] as needed:

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
  │    Code and     │    │      Data      │
  │    metafiles    │    │    (cached)    │  Local project
  └─────────────────┘    └────────────────┘
```

[remote storage]: /doc/user-guide/data-management/remote-storage
[sharing-data]: /doc/start/data-management/data-versioning#storing-and-sharing

If you need to share <abbr>cached</abbr> data that is tracked by DVC, [configure
remote storage] first (e.g. Amazon S3 or SSH).

[configure remote storage]:
  https://dvc.org/doc/user-guide/data-management/remote-storage#configuration

<admon type="tip">

Check that you have the necessary remotes with `git remote -v` and (optionally)
`dvc remote list`.

</admon>

You can upload an experiment using `dvc exp push --no-cache`, which takes a Git
remote name and an experiment ID or name. (Remove the `--no-cache` flag to
include <abbr>cached</abbr> data, which requries a `dvc remote`.) For example:

```cli
$ dvc exp push --no-cache origin quare-zips
```

<admon type="tip">

Learn how to [list local experiments] (to find their names).

You can also [list remote experiments] (without/before downloading them).

[list local experiments]:
  /doc/user-guide/experiment-management/comparing-experiments#list-experiments-in-the-project
[list remote experiments]:
  /doc/user-guide/experiment-management/comparing-experiments#list-experiments-saved-remotely

</admon>

To download an experiment, use `dvc exp pull --no-cache` (with the Git remote
and experiment name). Remove `--no-cache` to include data, for example:

```cli
$ dvc exp pull origin quare-zips
```

This puts all the necessary files and data (from both Git and DVC remotes) in
your project.

<admon type="warn">

DVC experiments are not fetched when cloning a <abbr>DVC repository</abbr> (to
avoid cluttering your local repo). You must `dvc exp pull` the ones you want.

</admon>

### Sharing many experiments

Use the `--rev`/`--num`/`--all-commits` options of `dvc exp push` and
`dvc exp pull` to share many experiments at once. E.g., to upload all
experiments based on the latest commit, target the Git `HEAD`:

```
$ dvc exp push --rev HEAD origin
```

## Pushing a persistent experiment

To share an individual experiment the same way you share other Git commits, turn
it into a
[persistent](/doc/user-guide/experiment-management/persisting-experiments) Git
commit (we use `dvc exp branch` below) and [share it][sharing-data] like any
project version.

```cli
$ dvc exp branch quare-zips my-branch
Git branch 'my-branch' has been created from experiment 'quare-zips'.
To switch to the new branch run:
        git checkout my-branch

$ git checkout my-branch
Switched to branch 'my-branch'

$ git push origin my-branch
```

If you only need to share code and metadata (like parameters and metrics), then
pushing to Git should be enough.

You may also have <abbr>cached</abbr> data, models, etc. tracked by DVC. To
share these, `dvc push` them to [remote storage] (e.g. Google Drive or NAS).

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
  │    Code and     │    │      Data      │
  │    metafiles    │    │    (cached)    │  Local project
  └─────────────────┘    └────────────────┘
```
