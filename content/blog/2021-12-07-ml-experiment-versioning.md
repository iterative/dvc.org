---
title: Don't Just Track Your ML Experiments, Version Them
date: 2021-12-07
description: >
  ML experiment brings together the benefits of traditional code versioning and
  modern day experiment tracking, super charging your ability to reproduce and
  iterate on your work.
descriptionLong: >
  ML experiment versioning takes experiment tracking to the next level.  Track
  experiments as code, reproduce and incrementally update experiments, and keep
  experiments distributed to share however you want.  Iterate on your
  experiments at scale in ways that neither traditional software version control
  nor existing experiment tracking tools can.
picture:
pictureComment:
author: dave_berenbaum
commentsUrl:
tags:
  - MLOps
  - DVC
  - Experiments
  - Experiment Tracking
  - Experiment Versioning
---

Experiment tracking tools help manage machine learning projects where version
control tools like Git are insufficient. They log parameters and metrics, and
they may store binary artifacts like input data or model weights so that you can
reproduce experiments and retrieve results. They enable you to navigate all this
meta-information, for example with dashboards to organize and compare many
experiments.

Git can't manage or compare all that experiment meta-information, but it is
still better for code. For example, Git tracks incremental changes instead of
having to log all code files as artifacts for each experiment. Therefore,
experiments get split between Git for code and experiment tracking tools for
meta-information. A link may be added in one or the other to keep track.

ML experiment versioning combines experiment tracking and version control:

- **Experiments as code**: Track meta-information in the code repository and
  version it like code.
- **Versioned reproducibility**: Save and restore experiment state, and track
  changes to only execute what's new.
- **Distributed experiments**: Organize locally and choose what to share,
  reusing your existing repo structure.

```
+---------------------+    +------------------+
|                     |    |                  |
| Experiment Tracking |    |  Code Versioning |
|                     |    |                  |
+---------------------+    +---------/--------+
            \                       /
             \                     /
              \-                 /-
                \               /
                 \             /
            +-----\------------------+
            |                        |
            | Experiment Versioning  |
            |                        |
            +------------------------+
```

# ML Experiments as Code

Experiment versioning treats experiments as code. Experiment tracking tools log
parameters, metrics, and artifacts to a database through API calls. In
experiment versioning, they are saved in files.

You can choose your own file formats and paths, which you can configure in DVC:

```dvc
$ dvc exp init -i
This command will guide you to set up a default stage in dvc.yaml.
See https://dvc.org/doc/user-guide/project-structure/pipelines-files.

DVC assumes the following workspace structure:
├── data
├── metrics.json
├── models
├── params.yaml
├── plots
└── src

Command to execute: python src/train.py
Path to a code file/directory [src, n to omit]: src/train.py
Path to a data file/directory [data, n to omit]: data/images/
Path to a model file/directory [models, n to omit]:
Path to a parameters file [params.yaml, n to omit]:
Path to a metrics file [metrics.json, n to omit]:
Path to a plots file/directory [plots, n to omit]: logs.csv
```

This might mean a little more work to set up your code to read parameters from
`params.yaml` or write metrics to `metrics.json`. DVC adds
[data versioning](https://dvc.org/doc/start/data-and-model-versioning) support
to track artifacts like data and models within your repo.

Once you set up your repo in this structure, you start to see the benefits of
this approach. Experiment meta-information lives in readable files that are
always available, and your code can stay clean. You can read, save, and version
your meta-information:

```dvc
$ cat params.yaml
train:
  epochs: 10
model:
  conv_units: 128
```

```dvc
$ cat metrics.json
{"loss": 0.24310708045959473, "acc": 0.9182999730110168}
```

You can see what changed in parameters, code, or anything else:

```dvc
$ git diff HEAD~1 -- params.yaml
diff --git a/params.yaml b/params.yaml
index baad571a2..57d098495 100644
--- a/params.yaml
+++ b/params.yaml
@@ -1,5 +1,5 @@
 train:
   epochs: 10
-model:
-  conv_units: 16
+model:
+  conv_units: 128
```

DVC enables you to compare experiments at a glance:

```dvc
$ dvc exp show
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ Experiment              ┃ Created      ┃    loss ┃    acc ┃ train.epochs ┃ model.conv_units ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace               │ -            │ 0.25183 │ 0.9137 │ 10           │ 64
│
│ mybranch                │ Oct 23, 2021 │       - │      - │ 10           │ 16
│
│ ├── 9a4ff1c [exp-333c9] │ 10:40 AM     │ 0.25183 │ 0.9137 │ 10           │ 64
│
│ ├── 138e6ea [exp-55e90] │ 10:28 AM     │ 0.25784 │ 0.9084 │ 10           │ 32
│
│ └── 51b0324 [exp-2b728] │ 10:17 AM     │ 0.25829 │ 0.9058 │ 10           │ 16
│
└─────────────────────────┴──────────────┴─────────┴────────┴──────────────┴──────────────────┘
```

# Versioned reproducibility

To reproduce an ML experiment, you need to piece together the meta-information
to run the pipeline end to end. Experiment tracking databases save the
artifacts, but you still need to put them all back in the right place. Since
experiment versioning keeps all the meta-information in your repo, you can
restore the experiment state exactly as it was in your workspace. DVC
[saves the state of the experiment](https://dvc.org/blog/experiment-refs) and
restores it for you:

```dvc
$ dvc exp apply exp-333c9

Changes for experiment 'exp-333c9' have been applied to your current workspace.
```

In ML experimentation, you need not only reproducibility, but also flexibility
to update your experiments incrementally. Data drift, new ideas, bug fixes, etc.
all mean running a new experiment, and you can't always start from scratch.
Versioned reproducibility means tracking changes to the experiment state. DVC
can determine what changes were introduced by the experiment and only run what's
necessary.

```dvc
$ dvc exp run --set-param model.conv_units=128
'data/images.tar.gz.dvc' didn't change, skipping
Stage 'extract' didn't change, skipping
Running stage 'train':
> python3 src/train.py
79/79 [==============================] - 1s 14ms/step - loss: 0.2552 - acc: 0.9180
Updating lock file 'dvc.lock'

Reproduced experiment(s): exp-be916
Experiment results have been applied to your workspace.

To promote an experiment to a Git branch run:

        dvc exp branch <exp> <branch>

```

# Distributed Experiments

Experiment tracking tools log experiments to a central database and show them in
a dashboard. This makes it easy to share them with teammates and compare
experiments. However, it introduces a problem - in an active experimentation
phase, you may create hundreds of experiments. Team members may be overwhelmed,
and the tool loses one of its core purposes - sharing experiments between team
members.

Experiment versioning piggybacks on Git and its distributed nature. All the
experiments you run are stored in your local repo, and only the best experiments
are promoted to the central repo (GitHub for example) to share with teammates.
Distributed experiments are shared with the same people as your code repo, so
you don't need to replicate your project permissions or worry about security
risks.

With DVC, you can push experiments just like Git branches:

```dvc
$ dvc exp push origin exp-333c9
Pushed experiment 'exp-333c9'to Git remote 'origin'.
```

# What Next?

There are parallels between the
[history of version control](https://ericsink.com/vcbe/html/history_of_version_control.html)
and the history of experiment tracking. Git's distributed nature and incremental
change tracking were major advances over the centralized, file-based version
control systems of previous generations. Experiment versioning can similarly
advance the next generation of experiment tracking.

Experiment versioning is still in its early days. Look out for future
announcements about:

- Deep learning features like [live monitoring](https://dvc.org/doc/dvclive) and
  [checkpointing](https://dvc.org/doc/user-guide/experiment-management/checkpoints).
- Visualizing and comparing experiment results in other tools like VS Code and
  [DVC Studio](https://studio.iterative.ai/).

What do you want to see for the next generation of experiment tracking? Join our
upcoming
[meetup](https://www.meetup.com/DVC-Community-Virtual-Meetups/events/282064369/)
to discuss, or let us know in the comments!
