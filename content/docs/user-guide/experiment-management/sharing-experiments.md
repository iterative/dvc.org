# Sharing Experiments

To share experiments, you can:

1. Send [live experiments] to [Studio] to view metrics and plots.
2. Push completed experiments with `dvc exp push`, and optionally manage them in
   [Studio].

## Live metrics and plots

You can send [live experiments] to [Studio](https://studio.iterative.ai), which
will show updates showing intermediate results for metrics and plots in any
running experiments. To start sharing live metrics to [Studio],
[get your Studio token](https://studio.iterative.ai/user/_/profile?section=accessToken)
and save it in your
[dvc config](/doc/user-guide/project-structure/configuration#studio) or
`DVC_STUDIO_TOKEN` environment variable. For example, to set it globally for all
of a user's projects:

```cli
$ dvc config --global studio.token ***
```

While the experiment runs, you will see live updates like this in Studio:

![Live metrics in Studio](https://static.iterative.ai/img/studio/live_metrics.gif)

![Live plots in Studio](https://static.iterative.ai/img/studio/live_plots.gif)

See [DVC config] for how to enable/disable live metrics and how to configure a
different Studio URL or Git repository, or see the Studio guide on [live
experiments] for more information on how to setup, view, and compare.

## Push experiments

You can upload a completed experiment using `dvc exp push`. For example, push
experiment `quare-zips` to Git remote `origin`:

```cli
$ dvc exp push origin quare-zips
```

If you don't know your Git remote, check with `git remote -v` or see
[troubleshooting] for problems.

By default, DVC will also share <abbr>cached</abbr> data that is tracked by DVC,
which requires [remote storage] (e.g. Amazon S3 or SSH). Add the `--no-cache`
flag to exclude sharing cached data.

You can optionally manage your pushed experiments from Studio. If you have saved
your token as described above for [live experiments](#live-metrics-and-plots),
DVC will notify Studio when you push an experiment. Otherwise, you may use the
reload button in Studio.

![Sharing experiments in Studio](/img/exp-sharing-studio.png)

<details>

### ⚙️ How pushing and pulling experiments works

`dvc exp push` pushes <abbr>experiment</abbr> commits that Git can upload to
remote servers like GitHub but don't show up in the UI (so they don't clutter
your repo) and can be cleaned up without affecting the rest of your project.

To understand how `dvc exp push` works, let's compare to pushing a
[persistent commit](#push-a-persistent-experiment). With a typical Git commit,
you would use `git push` to upload it to your Git remote and `dvc push` to
upload the corresponding data to your DVC remote.

```
 ┌────────────────┐  ┌────────────────┐
 ├────────────────┤  │   DVC remote   │ Remote locations
 │   Git remote   │  │    storage     │
 │                │  ├────────────────┤
 └────────────────┘  └────────────────┘
         ▲                    ▲
         │                    │
      git push             dvc push
      git pull             dvc pull
         │                    │
         ▼                    ▼
 ┌────────────────┐  ┌────────────────┐
 │    Code and    │  │      Data      │
 │    metafiles   │  │    (cached)    │ Local project
 └────────────────┘  └────────────────┘
```

`dvc exp push` and `dvc exp pull` take care of synchronizing to/from both Git
and DVC remotes as needed:

```
 ┌────────────────┐  ┌────────────────┐
 ├────────────────┤  │   DVC remote   │ Remote locations
 │   Git remote   │  │    storage     │
 │                │  ├────────────────┤
 └────────────────┘  └────────────────┘
         ▲                    ▲
         │   dvc exp push     │
         │   dvc exp pull     │
         ▼                    ▼
 ┌─────────────────┐ ┌────────────────┐
 │    Code and     │ │      Data      │
 │    metafiles    │ │    (cached)    │ Local project
 └─────────────────┘ └────────────────┘
```

</details>

## Pull experiments

To download an experiment, use `dvc exp pull` (with the Git remote and
experiment name).

```cli
$ dvc exp pull origin quare-zips
```

This puts all the necessary files and data (from both Git and DVC remotes) in
your project. Add the `--no-cache` flag to exclude pulling from the DVC remote.

You can find experiments to pull in [Studio](https://studio.iterative.ai) or
[list remote experiments] from the command line.

<admon type="warn">

DVC experiments are not fetched when cloning a <abbr>DVC repository</abbr> (to
avoid cluttering your local repo). You must `dvc exp pull` the ones you want.

</admon>

## Share many experiments

By default, DVC will share all experiments derived from the Git `HEAD`.

```
$ dvc exp push origin
Pushed experiment conic-ease, lucid-lair, and major-mela to Git remote 'origin'.
```

Use the `--rev`/`--num`/`--all-commits` options of `dvc exp push` and
`dvc exp pull` to share experiments from other commits.

## Push a persistent experiment

To share an individual experiment the same way you share [other Git
commits][sharing-data], turn it into a
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

[studio]: https://studio.iterative.ai
[live experiments]:
  /doc/studio/user-guide/projects-and-experiments/live-metrics-and-plots
[dvc config]: /docs/user-guide/project-structure/configuration#studio
[remote storage]: /doc/user-guide/data-management/remote-storage
[sharing-data]: /doc/start/data-management/data-versioning#storing-and-sharing
[troubleshooting]: /doc/user-guide/troubleshooting#git-auth
[list remote experiments]:
  /doc/user-guide/experiment-management/comparing-experiments#list-experiments-saved-remotely
