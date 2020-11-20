---
name: 'Metrics and Plots'
match: ['metrics', 'plots']
tooltip: 'Metrics and plots tooltip...'
---

# Metrics and Plots

<!-- _from plots and metrics intros_ -->

DVC has two concepts for metrics, that represent different results of machine
learning training or data processing:

1. `dvc metrics` represent **scalar numbers** such as AUC, _true positive rate_,
   etc.
2. `dvc plots` can be used to visualize **data series** such as AUC curves, loss
   functions, confusion matrices, etc.

<!-- _from `dvc metrics`_ -->

In order to follow the performance of machine learning experiments, DVC has the
ability to mark a certain stage <abbr>outputs</abbr> as metrics. These metrics
are project-specific floating-point or integer values e.g. AUC, ROC, false
positives, etc.

<!-- _from `dvc plots` description_ -->

DVC provides a set of commands to visualize certain metrics of machine learning
experiments as plots. Usual plot examples are AUC curves, loss functions,
confusion matrices, among others.

<!-- _probably should mention diff..._ -->
