---
title: Don't Just Track Your Experiments, Version Them
date: 2021-12-07
description: >
  Versioning experiments combines the benefits of version control and experiment
  tracking.
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

Experiment tracking tools solve problems not handled by version control tools
like Git. Instead of being built to track only code, they log experiment
information like parameters, metrics, and even binary artifacts like serialized
models. They also can organize and compare many experiments, whereas Git may
become messy and is limited to comparing two versions at a time.

Git is still better than experiment tracking tools for code. It tracks
incremental changes instead of having to log all code files as artifacts for
each experiment. Therefore, ML experiments get split between Git for code and
experiment tracking tools for everything else. A link may be added in one or the
other to keep track.

Experiment versioning combines experiment tracking and version control:

- Track all experiment information, but do it in the code repo and version it
  like code.
- Save pipeline to guarantee reproducibility and track changes to execute only
  modified parts.
- Organize experiments locally and choose what to share, reusing your existing
  repo structure without cluttering the repo history.

+---------------------+ +------------------+ | | | | | Experiment Tracking | |
Code Versioning | | | | | +---------------------+ +---------/--------+ \ /  
 \ /  
 \- /-  
 \ /  
 \ /  
 +-----\------------------+  
 | |  
 | Experiment Versioning |  
 | |  
 +------------------------+

# Experiments as Code

Experiment versioning treats experiments as code. Experiment tracking tools log
parameters and metrics to a database through API calls. In experiment
versioning, they are saved in files.

This might mean a little more work to set up your code to read parameters from a
YAML file or write metrics to a JSON file. However, once you set up your repo in
this structure, you start to see the benefits of this approach.

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

Experiment information lives in readable files that are always available, and
your code can stay clean. You can read, save, and version your experiment
parameters and metrics:

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

To version experiments as code, you need to track not only parameters and
metrics, but everything associated with the experiment. Experiment tracking
tools support logging arbitrary artifacts like data and models, which aren't
always easily tracked in Git. Experiment versioning adds proper versioning
support for these artifacts while maintaining metadata about those artifacts
within your code repo to track changes. For example, you can see that a single
image was removed from a directory of 70,000 images.

```dvc
$ git diff
diff --git a/data/images.dvc b/data/images.dvc
index 853b29143..78628ff48 100644
--- a/data/images.dvc
+++ b/data/images.dvc
@@ -1,5 +1,5 @@
 outs:
-- md5: 0ebacd64e04c0e4a97d8fa48a4d707e6.dir
-  size: 35401667
-  nfiles: 70000
+- md5: ef1169c037524932f3c74a3e175f2eb1.dir
+  size: 35401107
+  nfiles: 69999
   path: images
```

# Pipeline Versioning

Reproducing experiments requires not only artifacts like data and models, but
also the pipeline to run the experiment end to end. Pipelines are a nascent
feature in most experiment tracking tools, if they are supported at all. To
properly version the pipeline, it first needs to be codified, including the
steps or stages run. Each stage should include info about the commands,
dependencies, and outputs needed to reproduce each stage and to piece together
the pipeline. Like other artifacts, metadata about the pipeline is saved in
plain-text files to track in the code repo.

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

Codifying the entire experiment pipeline is a good first step towards
reproducibility, but it still leaves the user to execute that pipeline, and ML
pipelines often take too long to reproduce on the fly. Versioning the pipeline
means tracking changes to it. If a pipeline stage's commands and dependencies
have not changed, its outputs may be recovered so that it does not have to be
executed again.

```dvc
$ dvc exp run
'data/images.dvc' didn't change, skipping
Stage 'default' didn't change, skipping

Reproduced experiment(s): exp-333c9
Experiment results have been applied to your workspace.

To promote an experiment to a Git branch run:

        dvc exp branch <exp> <branch>
```

# Distributed Experiments

Experiment tracking tools log experiments to a central database and show them in
a dashboard. This enables comparison that would be difficult in Git. Distributed
experiments are recorded in the local code repo like leaves or twigs growing
from Git branches.

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

You may push and pull what you want to share. When collaborating, only a small
selection of experiments may be worth sharing, and you may not know until after
you run and compare them. Pushing an experiment shares all the experiment
information and code so that they stay in sync and are shared with the same
people, and it's already organized using Git branches.

```dvc
$ dvc exp push origin exp-333c9
Pushed experiment 'exp-333c9'to Git remote 'origin'.
```

While Git branching is a flexible way to organize experiments, there are often
too many experiments to fit any Git branching workflow. Experiments must act
like leaves that may be blown away easily, yet also like twigs that may grow
into branches:

```dvc
$ dvc exp branch exp-333c9 conv-units-64
Git branch 'conv-units-64' has been created from experiment 'exp-333c9'.
To switch to the new branch run:

        git checkout conv-units-64

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
- Orchestrating experiments on other
  [machines](https://github.com/iterative/dvc/wiki/Remote-executors).

What do you want to see for the next generation of experiment tracking? Join our
upcoming
[meetup](https://www.meetup.com/DVC-Community-Virtual-Meetups/events/282064369/)
to discuss, or let us know in the comments!
