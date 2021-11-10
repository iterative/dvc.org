---
title: Don't Just Track Your Experiments, Version Them
date: 2021-11-17
description: >
  Versioning ML experiments combines the benefits of version control and
  experiment tracking.
descriptionLong: >
  With experiment versioning, you can take ML experiment tracking to the next
  level, making it easy and powerful to save, compare, and reproduce experiments
  at scale in ways that neither traditional software version control nor
  existing experiment tracking tools can.
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

Traditional software version control is not enough for tracking machine learning
experiments. When tracking ML experiments, you need to not only version code,
but to:

- Log experiment information (like parameters and metrics).
- Organize and compare many experiments.
- Reproduce costly experiments (including data, code, pipelines, and models).

Over the last few years, experiment tracking tools have come a long way, usually
providing an API to log experiment information, a database to store it, and a
dashboard to compare and visualize. We can learn from these tools and apply
modern version control practices to:

- Keep experiment information in your code repo so you can track changes
  introduced by each experiment the same way you version code.
- Associate experiments with commits in your repo so you can organize locally
  and choose what to share.
- Codify your experiment pipeline (commands, inputs, and outputs) so you can
  easily reproduce any experiment.

Experiment versioning builds on modern version control principles and technology
to address experiment tracking needs.

# Start Experiment Versioning

Using DVC, you can start versioning experiments from any Git repo. If you tell
DVC how your project is organized, it can manage your entire experiment
lifecycle and ensure that everything is recorded and synced with your Git
history.

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
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
default:
  cmd: python src/train.py
  deps:
  - data/images/
  - src/train.py
  params:
  - model
  - train
  outs:
  - models
  metrics:
  - metrics.json:
      cache: false
  plots:
  - logs.csv:
      cache: false
Do you want to add the above contents to dvc.yaml? [y/n]: y

Created default stage in dvc.yaml. To run, use "dvc exp run".
See https://dvc.org/doc/user-guide/experiment-management/running-experiments.
```

DVC treats experiments as code. Rather than log parameters and metrics with API
calls, DVC expects them to be saved in files. This might mean a little more work
to set up your code to read parameters from a YAML file or write metrics to a
JSON file. However, once you set up your repo in this structure, you start to
see the benefits of this approach.

# Benefits of Versioning

With an experiment tracking API, you insert API calls in your code to save
experiment information in a central database. With experiment versioning,
experiment information lives in readable files that are always available, and
your code stays clean.

Even without DVC, you can read, save, and version your experiment parameters and
metrics:

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

With an experiment tracking dashboard, you see all your experiments, and you may
sort, label, and filter to help keep them organized. With experiment versioning,
your code and experiments stay connected, and you have more flexibility in how
you organize and share them.

For example, you may try an experiment in a new Git branch. If something goes
wrong or the results are uninspiring, you may not push the branch, in which case
it doesn't get shared, reducing unnecessary clutter and cleanup that you might
encounter in an experiment tracking database and dashboard.

If the experiment instead looks interesting, you can push it along with your
code so that they stay in sync and are shared with the same people, and it's
already organized using your existing branch name. You can keep iterating on
that branch, start a new one if an experiment diverges too much, or merge into
your main branch to make it your primary model.

Many experiment tracking databases do not capture the pipeline to run the
experiment end to end. With experiment versioning, your entire experiment is
codified. Notice that the `dvc exp init` command above generated a `dvc.yaml`
file that tracks the experiment pipeline:

```dvc
$ cat dvc.yaml
stages:
  default:
    cmd: python src/train.py
    deps:
    - data/images
    - src/train.py
    params:
    - model
    - train
    outs:
    - models
    metrics:
    - metrics.json:
        cache: false
    plots:
    - logs.csv:
        cache: false
```

This captures:

- The command to run the experiment.
- Parameters and other dependencies.
- Metrics, plots, and other outputs.

The pipeline has a single `default` stage, but more stages can be added.

# Benefits of DVC

Of course, you could do all this yourself in Git. Since we have established that
code version control is insufficient for experiments, DVC adds features specific
to ML needs.

Large data and models aren't easily tracked in Git, so DVC tracks them using
your own storage, yet they are Git-compatible. For example, the above command
tracks the `models` folder in DVC, making Git ignore it yet storing and
versioning it so you can back up versions anywhere and check them out alongside
your experiment code.

While Git branching is a flexible way to organize and manage experiments, there
are often too many experiments to fit any Git branching workflow. DVC tracks
experiments so you don't need to create commits or branches for each one, yet
they are also Git compatible and can be converted into Git branches or merged
into your existing ones.

```dvc
$ dvc exp show
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ Experiment              ┃ Created      ┃    loss ┃    acc ┃ train.epochs ┃
model.conv_units ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace               │ -            │ 0.25183 │ 0.9137 │ 10           │ 64
│
│ dvc-init                │ Oct 23, 2021 │       - │      - │ 10           │ 16
│
│ ├── 9a4ff1c [exp-333c9] │ 10:40 AM     │ 0.25183 │ 0.9137 │ 10           │ 64
│
│ ├── 138e6ea [exp-55e90] │ 10:28 AM     │ 0.25784 │ 0.9084 │ 10           │ 32
│
│ └── 51b0324 [exp-2b728] │ 10:17 AM     │ 0.25829 │ 0.9058 │ 10           │ 16
│
└─────────────────────────┴──────────────┴─────────┴────────┴──────────────┴──────────────────┘

$ dvc exp branch exp-333c9 conv-units-64
Git branch 'conv-units-64' has been created from experiment 'exp-333c9'.
To switch to the new branch run:

        git checkout conv-units-64

```

Codifying the entire experiment pipeline is a good first step towards
reproducibility, but it still leaves the user to reconstruct that pipeline, and
ML pipelines often take too long to reproduce on the fly anyway. DVC can
reproduce the experiment with a single command, and it will check for cached
inputs and outputs and skip recomputing data that's been generated before.

```dvc
$ dvc exp run
'data/images.dvc' didn't change, skipping
Stage 'default' didn't change, skipping

Reproduced experiment(s): exp-44136
Experiment results have been applied to your workspace.

To promote an experiment to a Git branch run:

        dvc exp branch <exp> <branch>
```

# What Next?

Experiment versioning is still in its early days. Look out for future
announcements about:

- Deep learning challenges like live monitoring, checkpointing, and iterative
  training.
- Visualizing and comparing experiment results in other tools like VSCode and
  Studio.
- Orchestrating experiments on other machines.

What do you want to see for the next generation of experiment tracking? Try out
experiment versioning, share your thoughts, and help build the future of ML
developer tools.
