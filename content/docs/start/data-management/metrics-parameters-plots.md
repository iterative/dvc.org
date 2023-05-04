---
title: 'Get Started: Metrics, Parameters, and Plots'
description: 'Get started with DVC parameters, metrics, and plots. Learn how to
capture, evaluate, and visualize ML projects without leaving Git.'
---

# Get Started: Metrics, Parameters, and Plots

<details>

### 🎬 Click to watch a video intro.

https://youtu.be/bu3l75eQlQo

</details>

DVC makes it easy to track [metrics](/doc/command-reference/metrics), update
<abbr>parameters</abbr>, and visualize performance with
[plots](/doc/command-reference/plots). These concepts are introduced below.

<admon type="tip">

All of the above can be combined into [experiments] to run and compare many
iterations of your machine learning project.

[experiments]: /doc/start/experiments

</admon>

## Collecting metrics

First, let's check out the mechanism to track and use metrics in a <abbr>DVC
pipelines</abbr>. While the importance of collecting and visualizing numerical
metrics is clear and common for ML projects, the mechanism generalizes well to
any process you run in a pipeline that dump metrics into a files upon execution.
DVC provides a convenient way to identify and visualize those.

Let's add a final evaluation stage to our [earlier pipeline] and run it:

```cli
$ dvc stage add -n evaluate \
  -d src/evaluate.py -d model.pkl -d data/features \
  -M eval/live/metrics.json -O eval/live/plots \
  -O eval/prc -o eval/importance.png \
  python src/evaluate.py model.pkl data/features

$ dvc repro
```

[earlier pipeline]: /doc/start/data-management/data-pipelines

<details>

### 💡 Expand to get a peek under the hood

The `-O` option here specifies an output that will not be <abbr>cached</abbr> by
DVC, and `-M` specifies a metrics file (that will also not be cached).
`dvc stage add` will generates this new stage in the `dvc.yaml` file:

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
section. Metrics files contain scalar values (e.g. `AUC`) to compare across
iterations.

<admon type="info">

With `cache: false`, DVC skips caching the output, as we want these JSON metrics
files to be versioned by Git.

</admon>

</details>

The `-M` flag above designates [`eval/live/metrics.json`] as a [metrics file].
The [`evaluate.py`] script writes the model's [ROC-AUC] and [average precision]
metrics to this file using `Live.make_summary()` which is a convenient API to
register those. Reproducing the pipeline, this is how the metrics file will look
like:

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

As you can see, it's a simple json file and the structure is loosely defined
(see [supported formats] to learn more).

DVC doesn't really care how you generate those - you can create metric files
whichever way you like, and as long as metrics are numerical, it can pick those
up for visualization via the command line (as we'll see below), VS Code's [DVC
extension] or [Studio][studio metrics].

Now that DVC knows about our [metrics file], we can visualize the metrics from
the terminal:

```dvc
$ dvc metrics show
Path                    avg_prec.test    avg_prec.train    roc_auc.test    roc_auc.train
eval/live/metrics.json  0.94496          0.97723           0.96191         0.98737
```

<admon icon="book">

DVC allows you visualize metrics from different parts of the pipeline (different
metric files). You can also visualize metrics across different branches, commits
and tags. See `dvc metrics show` docs to learn more.

</admon>

## Visualizing plots

The [`evaluate.py`] script writes additional output files with data, formatted
in a way that allows it to be graphed. The code demonstrates several methods of
generating plots:

- The [`roc_curve`] and [`confusion_matrix`] metrics values are generated and
  dumped into the [`eval/live/plots`] directory using `Live.log_sklearn_plot()`
  API ([DVCLive]).
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

- A custom `eval/importance.png` image showing a bar chart of features'
  importance is generated using [`matplotlib.pyplot.savefig`].

You can visualize all of these with DVC! Try configuring `dvc.yaml` with the
[plots section][plots files] below by editing it:

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

The generated HTML file will contain the following:

![](/img/plots_prc_get_started_show.svg)
![](/img/plots_roc_get_started_show.svg)
![](/img/plots_importance_get_started_show.png '=500 :wrap-left')
![](/img/plots_cm_get_started_show.svg)

Alternatively, if you're using the [DVC VSCode extension] for your project, you
can use the [Plots Dashboard].

Let's save this iteration so we can compare it later:

```cli
$ git add .gitignore dvc.yaml dvc.lock eval
$ git commit -a -m "Create evaluation stage"
```

Later we will see how to
[compare and visualize different pipeline iterations](#comparing-iterations).
For now, let's see how to capture another critical piece of information for
pipeline execution: parameters. Tracking parameters along with your pipeline
data is essential to making it fully reproducible and for future comparisons to
be complete.

[dvclive]: /doc/dvclive
[`roc_curve`]:
  https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_curve.html
[`confusion_matrix`]:
  https://scikit-learn.org/stable/modules/generated/sklearn.metrics.confusion_matrix.html
[plots files]: /doc/user-guide/project-structure/dvcyaml-files#plots
[plots dashboard]:
  https://github.com/iterative/vscode-dvc/blob/main/extension/resources/walkthrough/plots.md
[dvc extension]:
  https://marketplace.visualstudio.com/items?itemName=Iterative.dvc

## Defining stage parameters

It's pretty common for data science pipelines to include configuration files
that define adjustable parameters to control the code execution externally -
whether it's model training, data processing or any other piece of code. DVC
provides a mechanism for stages to depend on the values of specific sections of
such a config file (YAML, JSON, TOML, and Python formats are supported).

Luckily, the `featurize` stage already has
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

### ⚙️ Expand to recall how it was generated.

The `featurize` stage was created with this `dvc stage add` command. Notice the
argument sent to the `-p` option (short for `--params`):

```cli
$ dvc stage add -n featurize \
          -p featurize.max_features,featurize.ngrams \
          -d src/featurization.py -d data/prepared \
          -o data/features \
          python src/featurization.py data/prepared data/features
```

</details>

The `params` section defines the parameter dependencies of the `featurize`
stage. By default, DVC will look for those values (`featurize.max_features` and
`featurize.ngrams`) in a file named [`params.yaml`], but file names and
structure can also be user-defined, similar to metrics and plots.

Here's the contents of our [`params.yaml`] file:

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

## Modifying parameters

To work with parameters, let's assume (realistically) that we are not happy with
the AUC value we got so far. Let's edit the `params.yaml` file to use bigrams
(ngrams=2) and increase the number of features:

```git
 featurize:
-  max_features: 100
-  ngrams: 1
+  max_features: 200
+  ngrams: 2
```

Now all you need to do is (re)run:

```cli
$ dvc repro
```

It'll analyze the changes, use existing results from the <abbr>run cache</abbr>,
and execute only the commands needed to produce new results (model, metrics,
plots).

The same workflow applies to other modifications; you make changes (like editing
source code, configs files and updating datasets), and then you simple run
`dvc repro`. DVC runs whatever needs running.

<admon type="tip">

Notice that all the "moving pieces" are represented by changes in files, and all
of those changes can be committed and tracked in Git. This means that all the
information to fully and reliably reproduce executions or run comparisons is
readily accessible to us in Git history!

</admon>

## Comparing iterations

DVC has a few commands to inspect and visualize changes in metrics, parameters,
and plots. Let's compare the latest "bigrams" run with the last committed
"baseline" iteration.

`dvc params diff` shows how params in the workspace (our "bigrams" run) differ
from the last commit (ngram=1):

```cli
$ dvc params diff
Path         Param                   HEAD  workspace
params.yaml  featurize.max_features  100   200
params.yaml  featurize.ngrams        1     2
```

`dvc metrics diff` does the same for metrics:

```cli
$ dvc metrics diff
Path                    Metric          HEAD     workspace    Change
eval/live/metrics.json  avg_prec.test   0.9014   0.925        0.0236
eval/live/metrics.json  avg_prec.train  0.95704  0.97437      0.01733
eval/live/metrics.json  roc_auc.test    0.93196  0.94602      0.01406
eval/live/metrics.json  roc_auc.train   0.97743  0.98667      0.00924
```

And finally, we can compare all plots with a single `dvc plots diff` command (we
show only some of them here, for brevity):

```cli
$ dvc plots diff
file:///Users/dvc/example-get-started/plots.html
```

![](/img/plots_prc_get_started_diff.svg)
![](/img/plots_importance_get_started_diff.png)

<admon type="tip">

All these commands also accept
[Git revisions](https://git-scm.com/docs/gitrevisions) (commits, tags, branch
names) to compare.

</admon>

[`eval/live/metrics.json`]:
  https://github.com/iterative/example-get-started/blob/main/eval/live/metrics.json
[`evaluate.py`]:
  https://github.com/iterative/example-get-started/blob/master/src/evaluate.py
[`params.yaml`]:
  https://github.com/iterative/example-get-started/blob/master/params.yaml
[`eval/live/plots`]:
  https://github.com/iterative/example-get-started/blob/master/eval/live/plots
[`eval/prc/train.json`]:
  https://github.com/iterative/example-get-started/blob/main/eval/prc/train.json
[roc-auc]:
  https://scikit-learn.org/stable/modules/model_evaluation.html#receiver-operating-characteristic-roc
[average precision]:
  https://scikit-learn.org/stable/modules/model_evaluation.html#precision-recall-and-f-measures
[metrics file]: /doc/command-reference/metrics#supported-file-formats
[`matplotlib.pyplot.savefig`]:
  https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.savefig.html
[DVC VSCode extension]: /doc/vs-code-extension
[studio metrics]:
  /doc/studio/user-guide/projects-and-experiments/visualize-and-compare#visualize-and-compare-experiments
[supported formats]: /doc/command-reference/metrics#supported-file-formats
