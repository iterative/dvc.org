# Collaboration Issues in Data Science

Even with all the success we've seen today in machine learning (ML),
specifically deep learning and its applications in business, the data science
community still lacks good practices for organizing their projects and
effectively collaborating across their varied ML projects. This is a critical
challenge: we need to evolve towards ML algorithms and methods no longer being
tribal knowledge and making them easy to implement, reuse, and manage.

To make progress, many areas of the ML experimentation process need to be
formalized. Common questions need to be answered in an unified, principled way.

## Questions

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

Some of these questions are easy to answer individually. Data scientists,
engineers, or managers may already knows or can easily find answers to some of
them. However, the variety of answers and approaches makes data science
collaboration a nightmare. **A systematic approach is required.**
