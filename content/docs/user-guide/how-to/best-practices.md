# Best Practices for DVC Projects

This guide provides general tips and tricks related to DVC, which can be
utilized while working on a project. Using the practices listed here, you can
manage your projects with DVC more efficiently.

### Manually editing dvc.yaml or .dvc files

It's safe to edit `dvc.yaml` and `.dvc` files. You can manually change all the
fields present in these files. However, please keep in mind to not change the
`md5` or `checksum` fields in `.dvc` files as they contain hash values which DVC
uses to track the file or directory.

### Using meta in dvc.yaml or .dvc files

DVC provides an optional `meta` field in `dvc.yaml` and `.dvc` file. It can be
used to add any user specific information. It also supports YAML content.

### Never store credentials in project config

Do not store any user credentials in project config file. This file can be found
by default in `.dvc/config`.

---

Data scientists, engineers, or managers may already know or can easily find
answers to some of these questions. However, the variety of answers and
approaches makes data science collaboration a nightmare. **A systematic approach
is required.**

## Questions on...

### Source code and data versioning

- How do you avoid discrepancies between
  [revisions](https://git-scm.com/docs/revisions) of source code and versions of
  data files, when the data cannot fit into a traditional repository?

### Experiments

- How do you document progress of training different types of models on your
  data files in the same project?

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
