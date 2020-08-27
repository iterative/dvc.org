# Best Practices for DVC Projects

Asking questions on data science collaboration to data scientists, engineers, or
managers, we'll get a variety of answers. DVC provides a systematic approach
towards managing and collaborating on data science projects. You can manage your
projects with DVC more efficiently using the practices listed here:

- Source code and data versioning

  You can use DVC to avoid discrepancies between
  [revisions](https://git-scm.com/docs/revisions) of source code and versions of
  data files, when the data doesn't fit into a traditional repository. DVC
  replaces all large data files, models, etc. with small
  [metafiles](doc/user-guide/dvc-files-and-directories) (tracked by Git). These
  files point to the original data, which you can access by checking out the
  required `revision`.

- Experiments

  You can make use of Git branches to document progress of training different
  types of models on your data files in the same project. Create a branch for
  each of the models and then utilise DVC features while working on that branch.

- Experiment time log

  [Hyperparameter](<https://en.wikipedia.org/wiki/Hyperparameter_(machine_learning)>)
  are defined using the the `--params` option of `dvc run` and the default
  parameters file is `params.yaml`. You can commit different versions of
  `params.yaml` and then use `dvc metrics` or `dvc plots` to track which of your
  changes contributed the most in improving target
  [metric](doc/command-reference/metrics). You can monitor the degree of each
  change.

- Navigating through experiments

  To recover a model from last week without wasting time required for the model
  to retrain, first you can checkout the required `revision`. Followed by
  `dvc checkout` to update DVC-tracked files and directories in your workspace.

- Switching between datasets

  You can quickly switch between a large dataset and a small subset without
  modifying source code. To achieve this yoe need to change dependencies of
  relevant stage either by using `dvc run` with `-f` option or by manually
  editing the stage in `dvc.yaml` file.

- Reproducibility

  You can run a model's evaluation process again without actually retraining the
  model and preprocessing a raw dataset. DVC provides a way to reproduce
  pipelines partially. You can use `dvc repro` to execute evaluation stage
  without reproducing complete pipeline:

  ```dvc
  $ dvc repro evaluate
  ```

- Managing and sharing large data files

  Cloud or local storage can be used to store the project's data. You can share
  the entire 147 GB of your ML project, with all of its data sources,
  intermediate data files, and models with others if they are stored on
  [remote storage](doc/command-reference/remote/add#supported-storage-types).
  Using this you can share models trained in a GPU environment with colleagues
  who don't have access to a GPU. Have a look at this
  [example](doc/command-reference/pull#example-download-from-specific-remote-storage)
  to see how this works.

- Manually editing dvc.yaml or .dvc files

  It's safe to edit `dvc.yaml` and `.dvc` files. You can manually change all the
  fields present in these files. However, please keep in mind to not change the
  `md5` or `checksum` fields in `.dvc` files as they contain hash values which
  DVC uses to track the file or directory.

- Never store credentials in project config

  Do not store any user credentials in project config file. This file can be
  found by default in `.dvc/config`. Use `--local`, `--global`, or `--system`
  command options with `dvc config` for storing sensitive, or user-specific
  settings:

  ```dvc
  $ dvc config --system remote.username [password]
  ```

- Tracking <abbr>outputs</abbr> by Git

  If `outs` are small files in size and you want to track them with Git then you
  can use `--outs-no-cache` option to define outputs while creating or modifying
  a stage. DVC will not track will not track outputs in this case:

  ```dvc
  $ dvc run -n train -d src/train.py -d data/features \
            ---outs-no-cache model.p \
            python src/train.py data/features model.pkl
  ```

---

## Questions on...

### Source code and data versioning

- How do you avoid discrepancies between
  [revisions](https://git-scm.com/docs/revisions) of source code and versions of
  data files, when the data cannot fit into a traditional repository?

### Experiment time log

- How do you track which of your
  [hyperparameter](<https://en.wikipedia.org/wiki/Hyperparameter_(machine_learning)>)
  changes contributed the most to producing or improving your target
  [metric](/doc/command-reference/metrics)? How do you monitor the degree of
  each change?

### Navigating through experiments

- How do you recover a model from last week without wasting time waiting for the
  model to retrain?

- How do you quickly switch between a large dataset and a small subset without
  modifying source code?

### Reproducibility

- How do you run a model's evaluation process again without retraining the model
  and preprocessing a raw dataset?

### Managing and sharing large data files

- How do you share models trained in a GPU environment with colleagues who don't
  have access to a GPU?

- How do you share the entire 147 GB of your ML project, with all of its data
  sources, intermediate data files, and models?
