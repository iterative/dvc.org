# Sharing Experiments

Use `dvc exp push` and `dvc exp pull` to share experiments. This works like
[sharing regular project versions][sharing-data], but here DVC takes care of
synchronizing to/from both Git and [DVC remotes][remote storage] as needed:

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

## Pushing experiments

You can upload an experiment using `dvc exp push`, which takes a Git remote name
and an experiment ID or name. Check your Git remote with `git remote -v` and see
[troubleshooting] for problems. For example, push to Git remote `origin`:

```cli
$ dvc exp push origin quare-zips
```

By default, DVC will also share <abbr>cached</abbr> data that is tracked by DVC,
which requires [remote storage] (e.g. Amazon S3 or SSH). Add the `--no-cache`
flag to exclude sharing with the DVC remote.

View and manage pushed experiments in [Studio](https://studio.iterative.ai). To
notify Studio when you push experiments,
[get your Studio token](https://studio.iterative.ai/user/_/profile?section=accessToken)
and save it with
[`dvc config --global studio.token ***`](/doc/user-guide/project-structure/configuration#studio).

![Sharing experiments in Studio](/img/exp-sharing-studio.png)

[remote storage]: /doc/user-guide/data-management/remote-storage
[troubleshooting]: /doc/user-guide/troubleshooting#git-auth

## Live sharing

For long-running experiments, you may wish to share updates while the experiment
runs. For example, if you are running an experiment on a remote GPU server, you
may need a UI outside of that server to track progress and decide whether to
continue training. You can
[share live updates in Studio](/doc/studio/user-guide/projects-and-experiments/live-metrics-and-plots).
If you set the
[`DVC_STUDIO_TOKEN` environment variable](https://studio.iterative.ai/user/_/profile?section=accessToken),
[Studio](https://studio.iterative.ai) will show live metrics, plots, and other
experiment information.

![](https://static.iterative.ai/img/studio/live_metrics.gif)

## Pulling experiments

To download an experiment, use `dvc exp pull` (with the Git remote and
experiment name).

```cli
$ dvc exp pull origin quare-zips
```

This puts all the necessary files and data (from both Git and DVC remotes) in
your project. Add the `--no-cache` flag to exclude pulling from the DVC remote.

You can find experiments to pull in [Studio](https://iterative.studio.ai) or
[list remote experiments] from the command line.

[list remote experiments]:
  /doc/user-guide/experiment-management/comparing-experiments#list-experiments-saved-remotely

<admon type="warn">

DVC experiments are not fetched when cloning a <abbr>DVC repository</abbr> (to
avoid cluttering your local repo). You must `dvc exp pull` the ones you want.

</admon>

## Sharing many experiments

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
$ dvc exp branch quare-zips
Git branch 'quare-zips-branch' has been created from experiment 'quare-zips'.

$ git checkout quare-zips-branch
Switched to branch 'quare-zips-branch'

$ git push origin quare-zips-branch
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
