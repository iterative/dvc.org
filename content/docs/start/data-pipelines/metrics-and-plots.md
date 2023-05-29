---
title: 'Get Started: Metrics and Plots'
description: 'Get started with DVC metrics and plots. Learn how to
capture, evaluate, and visualize ML pipelines.'
---

# Get Started: Metrics and Plots

<details>

### 🎬 Click to watch a video intro.

https://youtu.be/bu3l75eQlQo

</details>

DVC makes it easy to track <abbr>metrics</abbr>, and visualize performance and
outputs using <abbr>plots</abbr>. These concepts are crucial to machine learning
[experimentation](/doc/start/experiments) as well as other types of data
processing pipelines and are introduced below.

## Collecting metrics

DVC has a generalized way to deal with metrics that you can use with any process
that writes metrics into [files][metrics file]. DVC provides a convenient way to
pick up, parse, view those <abbr>metrics</abbr>, and
[run comparisons](#comparing-iterations) across executions (see [supported
formats]).

Let's add a final evaluation stage to our [earlier pipeline] and run it:

```cli
$ dvc stage add --name evaluate \
      --deps src/evaluate.py --deps model.pkl --deps data/features \
      --metrics-no-cache eval/live/metrics.json \
      --outs-no-cache eval/live/plots --outs-no-cache eval/prc \
      --outs eval/importance.png \
      python src/evaluate.py model.pkl data/features

$ dvc repro
```

[earlier pipeline]: /doc/start/data-pipelines/building-pipelines

<details>

### 💡 Expand to get a peek under the hood

The `-outs-no-cache`/`-O` option specifies an output that will not be
<abbr>cached</abbr> by DVC (path won't be tracked by DVC). This is used for
small artifact that are either always generated locally or tracked in Git.
`--metrics-no-cache`/`-M` specifies a metrics file (that will also not be
cached). `dvc stage add` will generates this new stage in the `dvc.yaml` file:

```yaml
evaluate:
  cmd: python src/evaluate.py model.pkl data/features
  deps:
    - data/features
    - model.pkl
    - src/evaluate.py
  outs:
    - eval/importance.png
    - eval/live/plots:
        cache: false
    - eval/prc:
        cache: false
  metrics:
    - eval/live/metrics.json:
        cache: false
```

The biggest difference from previous stages in our pipeline is the new `metrics`
section. Metrics files contain scalar values (like `AUC`) to track and compare
across iterations.

<admon type="info">

With `cache: false`, DVC skips caching the output, as we want these JSON metrics
files to be versioned by Git.

</admon>

</details>

[`evaluate.py`] writes the model's [ROC-AUC] and [average precision] to
[`eval/live/metrics.json`] (designated a metrics file with `-M` above):

```json
{
  "avg_prec": {
    "train": 0.9772271756725741,
    "test": 0.9449556493816984
  },
  "roc_auc": {
    "train": 0.9873675866013153,
    "test": 0.9619097316125981
  }
}
```

As you can see, it's a simple json file and the structure is up to you and your
project, with the only expectation of metrics being numerical (see [supported
formats] to learn more).

DVC doesn't care how you generate [metric files][metrics file]. DVC can pick
them up and view them via the command line (as we're about to see), VS Code's
[DVC extension] or [Studio][studio metrics].

Now that DVC is aware of the [metrics file], we can visualize the metrics in the
terminal:

```dvc
$ dvc metrics show
Path                    avg_prec.test    avg_prec.train    roc_auc.test    roc_auc.train
eval/live/metrics.json  0.94496          0.97723           0.96191         0.98737
```

<admon icon="book">

You can visualize metrics from different files and stages in a unified way. You
can also show metrics across different branches, commits and tags. See
`dvc metrics show` and its command line arguments to learn more.

</admon>

## Displaying plots

The [`evaluate.py`] script writes additional output files, formatted in a way
that allows them to be graphed. The code demonstrates three different methods of
generating <abbr>plots</abbr>:

- The [`roc_curve`] and [`confusion_matrix`] metrics are written into the
  [`eval/live/plots`] directory using `Live.log_sklearn_plot()` API (from
  [DVCLive]).
- The precision-recall curves are manually generated and dumped into
  [`eval/prc/train.json`] using a standard `json.dump()` call and contain JSON
  arrays of the form:

  ```json
  {
    "prc": [
      { "precision": 0.0215, "recall": 1.0, "threshold": 0.0 },
      { "precision": 1.0, "recall": 0.0093, "threshold": 0.6 },
      ...
  ```

- Finally, a custom bar chart of features' importance is generated using
  [`matplotlib.pyplot.savefig`] and written into `eval/importance.png`.

You can visualize all of these with DVC!

[`evaluate.py`]:
  https://github.com/iterative/example-get-started/blob/master/src/evaluate.py
[dvclive]: /doc/dvclive
[`roc_curve`]:
  https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_curve.html
[`confusion_matrix`]:
  https://scikit-learn.org/stable/modules/generated/sklearn.metrics.confusion_matrix.html
[`eval/live/plots`]:
  https://github.com/iterative/example-get-started/blob/master/eval/live/plots
[`eval/prc/train.json`]:
  https://github.com/iterative/example-get-started/blob/main/eval/prc/train.json
[`matplotlib.pyplot.savefig`]:
  https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.savefig.html

Let's configure `dvc.yaml` with a [plots template][plots files] to parse those.
Edit `dvc.yaml` and add this top level section:

```yaml
plots:
  - ROC:
      template: simple
      x: fpr
      y:
        eval/live/plots/sklearn/roc/train.json: tpr
        eval/live/plots/sklearn/roc/test.json: tpr
  - Confusion-Matrix:
      template: confusion
      x: actual
      y:
        eval/live/plots/sklearn/cm/train.json: predicted
        eval/live/plots/sklearn/cm/test.json: predicted
  - Precision-Recall:
      template: simple
      x: recall
      y:
        eval/prc/train.json: precision
        eval/prc/test.json: precision
  - eval/importance.png
```

To render the plots, run the `dvc plots show` command, which generates an HTML
file you can then open in a browser:

```cli
$ dvc plots show
file:///Users/dvc/example-get-started/dvc_plots/index.html
```

The generated HTML file contains the following rendered plots:

![](/img/plots_prc_get_started_show.svg)
![](/img/plots_roc_get_started_show.svg)
![](/img/plots_importance_get_started_show.png '=500 :wrap-left')
![](/img/plots_cm_get_started_show.svg)

<admon icon="tip">

#### For more advanced visualization

- If you're using VSCode's [DVC extension] for your project, you can use the
  [Plots Dashboard] inside your IDE.
- If you're using [Studio] for collaboration on your ML project, use the "[Show
  plots][studio display plots]" button in the project experiment screen. From
  [Studio], all visualization, comparisons and trends can be easily [shared with
  others][studio share a project] as well!

</admon>

Let's save this iteration into Git:

```cli
$ git add .gitignore dvc.yaml dvc.lock eval
$ git commit -a -m "Create evaluation stage"
```

[plots files]: /doc/user-guide/project-structure/dvcyaml-files#plots
[dvc extension]:
  https://marketplace.visualstudio.com/items?itemName=Iterative.dvc
[plots dashboard]:
  https://github.com/iterative/vscode-dvc/blob/main/extension/resources/walkthrough/plots.md
[Studio]: /doc/studio
[studio display plots]:
  /doc/studio/user-guide/projects-and-experiments/visualize-and-compare#display-plots-and-images
[studio share a project]:
  /doc/studio/user-guide/projects-and-experiments/share-a-project#share-a-project

Next, we'll learn about injecting and tracking parameters into our pipelines.

[`eval/live/metrics.json`]:
  https://github.com/iterative/example-get-started/blob/main/eval/live/metrics.json
[roc-auc]:
  https://scikit-learn.org/stable/modules/model_evaluation.html#receiver-operating-characteristic-roc
[average precision]:
  https://scikit-learn.org/stable/modules/model_evaluation.html#precision-recall-and-f-measures
[metrics file]: /doc/command-reference/metrics#supported-file-formats
[studio metrics]:
  /doc/studio/user-guide/projects-and-experiments/visualize-and-compare#visualize-and-compare-experiments
[supported formats]: /doc/command-reference/metrics#supported-file-formats
