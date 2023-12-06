# Sharing Experiments

You can control exactly which information gets shared from your experiments:

- keep it all local
- send [live metrics and plots] to [DVC Studio]
- push <abbr>experiment</abbr> code and metadata to your Git repo
- push data, models, and other artifacts to your DVC [remote storage]

See the video below for how it all works using the [DVC Extension] for VS Code,
or keep reading to go deeper.

https://www.youtube.com/watch?v=UMVYjwJtRj0&autoplay=1&mute=1

## Share everything

By default, your experiments are stored only where they were run. To
automatically share all experiment info, you will need a Git remote (for
example, GitHub), a [DVC Studio] project connected to that Git remote, and DVC
[remote storage] for any large artifacts you want DVC to track.

To automatically push code to the Git remote and artifacts to the DVC remote,
set the following environment variables:

```cli
$ export DVC_EXP_AUTO_PUSH=true
$ export DVC_EXP_GIT_REMOTE=origin
```

`DVC_EXP_AUTO_PUSH` forces DVC to [push] all experiments to the Git remote at
the completion of the experiment. DVC will also push all artifacts and other
<abbr>cached</abbr> data to the DVC remote.

`DVC_EXP_GIT_REMOTE` specifies the name of the Git remote where the experiment
will be pushed (usually `origin`). Use `git remote -v` to see your available Git
remotes, and adjust the value above if you want to push somewhere other than
`origin`.

To see these pushed experiments, go to
[DVC Studio](https://studio.iterative.ai), configure your Git provider, and add
a project using the same Git remote from above. Then navigate to the settings
page, copy your
[DVC Studio token](/doc/studio/user-guide/account-and-billing#studio-access-token),
and
[configure your environment to use the token](/doc/studio/user-guide/experiments/live-metrics-and-plots#set-up-an-access-token):

```cli
$ export DVC_STUDIO_TOKEN=***
```

Once configured, DVC Studio will provide realtime updates for all running
experiments and show all completed experiments that were pushed.

Keep reading for how to granularly control what information gets shared and
when.

## Live metrics and plots

You can send [live experiments] to [DVC Studio], which will show intermediate
results for metrics and plots in any running experiments. To start sharing live
metrics to [DVC Studio],
[get your Studio token](https://studio.iterative.ai/user/_/profile?section=accessToken)
and save it in your
[dvc config](/doc/user-guide/project-structure/configuration#studio) or
`DVC_STUDIO_TOKEN` environment variable. For example, to set it globally for all
of a user's projects:

```cli
$ dvc config --global studio.token ***
```

While the experiment runs, you will see live updates like this in DVC Studio
(and so will anyone else with access to the project):

![Live metrics in DVC Studio](https://static.iterative.ai/img/studio/live_metrics.gif)

![Live plots in DVC Studio](https://static.iterative.ai/img/studio/live_plots.gif)

<details>

### Advanced options and troubleshooting for live metrics and plots

See [DVC config] for how to enable/disable live metrics and how to configure a
different DVC Studio URL or Git repository, or see the DVC Studio guide on [live
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

You can see pushed experiments in [DVC Studio]. From there, you can make an
experiment [persistent] by creating a Git branch, or you can [remove] it from
your Git remote:

![DVC Studio Shared Experiments](/img/studio-shared-exps.png)

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
can convert any pushed experiment from [DVC Studio] into a persistent Git branch
and create a pull request to merge it into your main repo branch:

![DVC Studio Create a New Branch](/img/studio-branch.gif)

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

As you share more experiments, [DVC Studio] and Git remotes may be become
cluttered with experiment references.

You can remove experiments in DVC Studio:

![DVC Studio Remove selected rows](/img/studio-remove.gif)

To remove pushed experiments using the command line, use `dvc exp remove -g`:

```cli
$ dvc exp remove -g origin unwet-jinn
Removed experiments: unwet-jinn
```

[dvc extension]:
  https://marketplace.visualstudio.com/items?itemName=Iterative.dvc
[dvc studio]: https://studio.iterative.ai
[live metrics and plots]: #live-metrics-and-plots
[push]: #push-experiments
[pull]: #pull-experiments
[live experiments]: /doc/studio/user-guide/experiments/live-metrics-and-plots
[dvc config]: /docs/user-guide/project-structure/configuration#studio
[remote storage]: /doc/user-guide/data-management/remote-storage
[sharing-data]: /doc/start/data-management/data-versioning#storing-and-sharing
[troubleshooting]: /doc/user-guide/troubleshooting#git-auth
[persistent]: #persist-experiment
[bring experiment results to your workspace]:
  /doc/user-guide/experiment-management/comparing-experiments#bring-experiment-results-to-your-workspace
[remove]: #remove-pushed-experiments
