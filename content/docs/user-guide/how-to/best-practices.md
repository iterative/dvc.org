# Best Practices for DVC Projects

Data scientists, engineers, or managers may already know or can easily find
answers to some of these questions. However, the variety of answers and
approaches makes data science collaboration a nightmare. **A systematic approach
is required.**

## Questions on...

### Source code and data versioning

- How do you avoid discrepancies between
  [revisions](https://git-scm.com/docs/revisions) of source code and versions of
  data files, when the data cannot fit into a traditional repository?

  DVC replaces all large data files, models, etc. with small
  [metafiles](doc/user-guide/dvc-files-and-directories) (tracked by Git). These
  files point to the original data, which you can access by checking out the
  required `revision`.

### Experiments

- How do you document progress of training different types of models on your
  data files in the same project?

  You can make use of Git branches for each of the model and then utilise DVC
  features while working on that branch.

### Experiment time log

- How do you track which of your
  [hyperparameter](<https://en.wikipedia.org/wiki/Hyperparameter_(machine_learning)>)
  changes contributed the most to producing or improving your target
  [metric](doc/command-reference/metrics)? How do you monitor the degree of each
  change?

  Hyperparameters are defined using the the `--params` option of `dvc run` and
  the default parameters file is `params.yaml`. You can commit different
  versions of `params.yaml` and then use `dvc metrics` or `dvc plots` to track
  which parameter contributes most to the change.

### Navigating through experiments

- How do you recover a model from last week without wasting time waiting for the
  model to retrain?

  First you can checkout the required `revision`, followed by `dvc checkout` to
  update DVC-tracked files and directories in your workspace.

- How do you quickly switch between a large dataset and a small subset without
  modifying source code?

  You can change dependencies of relevant stage either by using `dvc run` with
  `-f` option or by manually editing the stage in `dvc.yaml` file.

### Reproducibility

- How do you run a model's evaluation process again without retraining the model
  and preprocessing a raw dataset?

  DVC provides a way to reproduce pipelines partially. You can use `dvc repro`
  to execute evaluation stage without reproducing complete pipeline.

### Managing and sharing large data files

- How do you share models trained in a GPU environment with colleagues who don't
  have access to a GPU?

- How do you share the entire 147 GB of your ML project, with all of its data
  sources, intermediate data files, and models?

  Cloud or local storage can be used to store the project's data. You can share
  large data files and models with others if they are stored on
  [remote storage](doc/command-reference/remote/add#supported-storage-types).
