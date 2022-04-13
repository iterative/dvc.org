---
title: 'Get Started: Experiments'
---

# Get Started with Experiments

In machine learning projects, the number of <abbr>experiments</abbr> grows
rapidly. DVC can track these experiments, list and compare their most relevant
metrics, parameters, and dependencies, navigate among them, and commit only the
ones that we need to Git.

> ⚠️ This video is outdated and will be updated soon! Where there are
> discrepancies between docs and video, please follow the docs.

https://youtu.be/FHQq_zZz5ms

In this section, we explore the basic features of DVC experiment management with
the [`example-dvc-experiments`][ede] project.

[ede]: https://github.com/iterative/example-dvc-experiments

<details>

## ⚙️ Initializing a project with DVC experiments

If you already have a DVC project, that's great. You can start to use `dvc exp`
commands right away to run experiments in your project. (See the [User Guide]
for detailed information.) Here, we briefly discuss how to structure an ML
project with DVC experiments using `dvc exp init`.

[user guide]: /doc/user-guide/experiment-management/experiments-overview

A typical machine learning project has data, a set of scripts that train a
model, a bunch of hyperparameters that tune training and models, and outputs
metrics and plots to evaluate the models. `dvc exp init` has sane defaults about
the names of these elements to initialize a project:

```dvc
$ dvc exp init python src/train.py
```

Here, `python src/train.py` specifies how you run experiments. It could be any
other command.

If your project uses different names for them, you can set directories for
source code (default: `src/`), data (`data/`), models (`models/`), plots
(`plots/`), and files for hyperparameters (`params.yaml`), metrics
(`metrics.json`) with the options supplied to `dvc exp init`.

You can also set these options in a dialog format with
`dvc exp init --interactive`.

</details>

- [**Running Experiments**](run-experiment):
- [**See Experiment Results**](see-experiment-results):
- [**Hyperparameters and Reproduction**](parameters):
- [**Comparing Experiments**](comparing-experiments):
- [**Parallel Experiments**](parallel-experiments):
- [**Metrics**](metrics):
- [**Committing Experiments**](committing-experiments):
- [**Creating Plots from Outputs**](creating-plots-from-outputs):
- [**Generate plots from Integrations**](generate-plots-from-integrations):
- [**Tracking Plot Images**](tracking-plot-images):
- [**More information**](link-to-guide):
