---
title: 'Get Started: Parameters'
description: 'Get started with DVC pipeline parameters. Learn how to
parametrize your pipeline.'
---

# Get Started: Parameters

It's common for data science pipelines to include configuration files that
define adjustable parameters to control code execution and inject external
inputs, like model training hyper-parameters. Tracking the parameters used for
pipeline execution alongside the data and code itself is essential to making
your pipelines reproducible and to allow comparisons and analysis.

## Defining stage parameters

DVC provides a mechanism for stages to depend on the values of specific sections
of dedicated parameter config files (YAML, JSON, TOML, and Python formats are
supported).

The `featurize` pipeline stage already has
[parameters (params section)](/doc/command-reference/params) defined in
`dvc.yaml`:

```yaml
featurize:
  cmd: python src/featurization.py data/prepared data/features
  deps:
    - data/prepared
    - src/featurization.py
  params:
    - featurize.max_features
    - featurize.ngrams
  outs:
    - data/features
```

<details>

### ⚙️ Expand to revisit the stage creation command

The `featurize` stage was created with this `dvc stage add` command:

```cli
$ dvc stage add -n featurize \
          -p featurize.max_features,featurize.ngrams \
          -d src/featurization.py -d data/prepared \
          -o data/features \
          python src/featurization.py data/prepared data/features
```

Notice the argument sent to the `-p` option (short for `--params`)

</details>

The `params` section defines the parameter dependencies of the `featurize`
stage. By default, DVC will look for those values (`featurize.max_features` and
`featurize.ngrams`) in a file named [`params.yaml`], but file names and
structure can also be user-defined, similar to metrics and plot files.

Here are the contents of the [`params.yaml`] file:

```yaml
prepare:
  split: 0.20
  seed: 20170428

featurize:
  max_features: 100
  ngrams: 1

train:
  seed: 20170428
  n_est: 50
  min_split: 2
```

You can see its conveniently sharding the parameters by the corresponding
scripts / pipeline stages.

## Modifying parameters

To work with parameters, let's assume that we are not happy with the AUC value
we
[got previously](/doc/start/data-pipelines/metrics-and-plots#collecting-metrics).
We'll edit the `params.yaml` file to use bigrams (ngrams=2) and increase the
number of features:

```git
 featurize:
-  max_features: 100
-  ngrams: 1
+  max_features: 200
+  ngrams: 2
```

Now all you need to do is (re)run the pipeline:

```cli
$ dvc repro
```

It'll analyze the changes, use existing results from the <abbr>run cache</abbr>,
and execute only the commands needed to produce new results (model, metrics,
plots). Simply (re)run `dvc repro` and DVC will run whatever needs running!

<admon type="tip">

Notice that all the "moving pieces" are represented by changes in files, and all
of those changes can be committed and tracked in Git. This means that all the
information to fully and reliably reproduce executions or compare runs is
accessible in Git history!

</admon>

## Comparing iterations

DVC has a few commands to inspect and visualize changes in metrics, parameters,
and plots. Those can come very handy when working with <abbr>DVC
pipelines</abbr> to manage machine learning experiments.

<admon type="tip">

Try running `dvc params diff`, as well as `dvc metrics diff` and
`dvc plots diff` to observe the results. To learn more, jump to
[this chapter in "Experimenting Using Pipelines"](/doc/start/experiments/experiment-pipelines#comparing-iterations)

</admon>

[`params.yaml`]:
  https://github.com/iterative/example-get-started/blob/master/params.yaml
