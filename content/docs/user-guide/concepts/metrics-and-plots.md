---
name: 'Metrics and Plots'
match: ['metrics', 'plots', 'plot metrics']
tooltip: >-
  DVC metrics and plots provide sets of commands to follow the performance of
  machine learning experiments. Mark certain stage outputs as metrics and
  visualize metrics as plots. [📖](/doc/user-guide/concepts/metrics-and-plots)
description: >-
  DVC provides sets of commands to track the performance of machine learning
  experiments. Mark certain stage outputs as metrics and visualize metrics as
  plots.
---

<!-- keywords: machine learning metrics, compare data science experiments, machine learning experiment management, track experiment performance, visualize data science experiment diff, plot machine learning metrics, deep learning experiment tracking, track machine learning experiments -->

A machine learning / data science project is usually an experimentation of
different methods to model and analyze data. Experimentation requires to
evaluate the methods by different metrics and DVC helps the user in this regard.

Metrics are another kind of <abbr>output</abbr> emitted by certain
<abbr>stages</abbr>. DVC doesn't ascribe any semantics to metric numbers (e.g.
AUC, FPR) produced by the commands run in stages. The only expectation is to put
them in JSON or YAML files to present them later.

Plots are also outputs produced by certain stages. DVC generates HTML files from
the data emitted in CSV, TSV, JSON or YAML formats. It's possible to generate
plots of different metrics on a single chart to compare them.

## Further Reading

- `dvc metrics` command reference
- `dvc plots` command reference
