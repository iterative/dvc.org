# Sharing Experiments

You can send [live metrics and plots] to [Studio], [push] entire completed
<abbr>experiments</abbr> (including data, models, and code), and convert an
experiment into a [persistent] branch or commit in your Git repo.

## Live metrics and plots

You can send [live experiments] to [Studio](https://studio.iterative.ai), which
will show intermediate results for metrics and plots in any running experiments.
To start sharing live metrics to [Studio],
[get your Studio token](https://studio.iterative.ai/user/_/profile?section=accessToken)
and save it in your
[dvc config](/doc/user-guide/project-structure/configuration#studio) or
`DVC_STUDIO_TOKEN` environment variable. For example, to set it globally for all
of a user's projects:

```cli
$ dvc config --global studio.token ***
```

While the experiment runs, you will see live updates like this in Studio (and so
will anyone else with access to the project):

![Live metrics in Studio](https://static.iterative.ai/img/studio/live_metrics.gif)

![Live plots in Studio](https://static.iterative.ai/img/studio/live_plots.gif)

<details>

### Advanced options and troubleshooting for live metrics and plots

See [DVC config] for how to enable/disable live metrics and how to configure a
different Studio URL or Git repository, or see the Studio guide on [live
experiments] for more information on how to setup, view, and compare.

</details>

## Push experiments

<details>

### ⚙️ How pushing and pulling experiments works

`dvc exp push` pushes <abbr>experiment</abbr> commits that Git can upload to
remote servers like GitHub but don't show up in the UI (so they don't clutter
your repo) and can be cleaned up without affecting the rest of your project.

To understand how `dvc exp push` works, let's compare to pushing a [persistent]
commit. With a typical Git commit, you would use `git push` to upload it to your
Git remote and `dvc push` to upload the corresponding data to your DVC remote.

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

DVC <abbr>experiments</abbr> are tied to your Git repo, but they are ignored by
normal Git operations like `git push`, `git pull`, and `git clone`. You can
upload completed experiments using `dvc exp push`. This will push not only
metrics and plots, but also the code and DVC-<abbr>cached</abbr> files (data and
models) so you can [pull] an experiment, make it [persistent], and reproduce it
from your Git repo. For example, in the simplest case, push experiments to Git
remote `origin`:

```cli
$ dvc exp push origin
```

<details>

### Advanced options and troubleshooting for pushing experiments

If you don't know your Git remote, check with `git remote -v` or see
[troubleshooting] for problems.

By default, DVC will also share <abbr>cached</abbr> data that is tracked by DVC,
which requires [remote storage] (e.g. Amazon S3 or SSH). Add the `--no-cache`
flag to exclude sharing cached data.

By default, `dvc exp push origin` will push all experiments derived from your
current Git commit, but you may specify specific experiments as arguments or use
the flags to select a different set of experiments to push.

</details>

## Find pushed experiments

You can see pushed experiments in [Studio]. From there, you can make an
experiment [persistent] by creating a Git branch, or you can [remove] it from
your Git remote:

![Studio Shared Experiments](/img/studio-shared-exps.png)

From your workspace, you can see pushed experiments if you provide a Git remote
name to `dvc exp list`.

```cli
$ dvc exp list origin
refs/tags/baseline-experiment:
    cnn-32
    cnn-64
```

<details>

### Advanced options for finding pushed experiments

`dvc exp list origin` lists remote experiments based on your current commit. You
can use `--all-commits` (`-A`) to list all experiments, or add any other
supported option.

</details>

## Pull experiments

To download pushed experiments, use `dvc exp pull` (with the Git remote and
experiment name).

```cli
$ dvc exp pull origin
```

This puts all the necessary files and data (from both Git and DVC remotes) in
your project.

<details>

### Advanced options for pulling experiments

Add the `--no-cache` flag to exclude pulling from the DVC remote.

By default, `dvc exp pull origin` will pull all experiments derived from your
current Git commit, but you may specify specific experiments as arguments or use
the flags to select a different set of experiments to push.

</details>

## Persist experiment

DVC experiments run outside of the regular Git workflow for faster iteration and
to avoid polluting your <abbr>repository</abbr>'s history, but you can easily
bring back the most promising experiments into your regular Git workflow. You
can convert any pushed experiment from [Studio] into a persistent Git branch and
create a pull request to merge it into your main repo branch:

![Studio Create a New Branch](/img/studio-branch.gif)

Alternatively, from your workspace, to share an individual experiment the same
way you share [other Git commits][sharing-data], use `dvc exp branch` to create
a Git branch from the experiment and [share it][sharing-data] like any Git
branch.

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

If you don't want to create a new Git branch and instead want to commit the
experiment directly on top of your current Git branch, you can [bring experiment
results to your workspace].

## Remove pushed experiments

As you share more experiments, [Studio] and Git remotes may be become cluttered
with experiment references.

You can remove experiments in Studio:

![Studio Remove selected rows](/img/studio-remove.gif)

To remove pushed experiments using the command line, use `dvc exp remove -g`:

```cli
$ dvc exp remove -g origin unwet-jinn
Removed experiments: unwet-jinn
```

[studio]: https://studio.iterative.ai
[live metrics and plots]: #live-metrics-and-plots
[push]: #push-experiments
[pull]: #pull-experiments
[live experiments]:
  /doc/studio/user-guide/projects-and-experiments/live-metrics-and-plots
[dvc config]: /docs/user-guide/project-structure/configuration#studio
[remote storage]: /doc/user-guide/data-management/remote-storage
[sharing-data]: /doc/start/data-management/data-versioning#storing-and-sharing
[troubleshooting]: /doc/user-guide/troubleshooting#git-auth
[persistent]: #persist-experiment
[bring experiment results to your workspace]:
  /doc/user-guide/experiment-management/comparing-experiments#bring-experiment-results-to-your-workspace
[remove]: #remove-pushed-experiments
