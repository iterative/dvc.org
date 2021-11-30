# Visualization with DVC Plots

In parallel with versioning parameters and metrics by associating them with
experiments, DVC allows to generate plots from multivariate outputs. There are
several options to generate and keep track of the plots:

- DVC can generate HTML files that includes interactive Vega-Lite plots, from
  the data series in JSON, YAML, CSV, or TSV.

- DVC can keep track of image files produced as plot outputs from the
  training/evaluation scripts.

- DVC, with its DVCLive integration can produce plots automatically during
  training.

In this document, we'll focus on the first option and briefly describe the other
two. Please see `dvc plots` and the DVCLive documentation for details.

- [ ] Configure the plots to use dvclive output
- [ ] Generate a plot file and open it in the browser
- [ ] Generate a plot image and use `dvc plot` on it
