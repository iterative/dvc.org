---
title: 'Metrics'
---

> > ⁉️ This is to show the scope, this document will be updated entirely.

## Metrics

> > ⁉️ No need to mention pipelines here.

First, let's see what is the mechanism to capture values for these ML
attributes. Let's add a final evaluation stage to our
[pipeline from before](/doc/start/data-pipelines):

> > ⁉️ `--plots-no-cache` and `--metrics-no-cache` seems advanced topics. We
> > need a simpler project, or simple way to demonstrate metrics and plots.

```dvc
$ dvc stage add -n evaluate \
          -d src/evaluate.py -d model.pkl -d data/features \
          -M scores.json \
          --plots-no-cache prc.json \
          --plots-no-cache roc.json \
          python src/evaluate.py model.pkl \
                 data/features scores.json prc.json roc.json
```

<details>

### 💡 Expand to see what happens under the hood.

The `-M` option here specifies a metrics file, while `--plots-no-cache`
specifies a plots file (produced by this stage) which will not be
<abbr>cached</abbr> by DVC. `dvc run` generates a new stage in the `dvc.yaml`
file:

```yaml
evaluate:
  cmd: python src/evaluate.py model.pkl data/features ...
  deps:
    - data/features
    - model.pkl
    - src/evaluate.py
  metrics:
    - scores.json:
        cache: false
  plots:
    - prc.json:
        cache: false
    - roc.json:
        cache: false
```

The biggest difference to previous stages in our pipeline is in two new
sections: `metrics` and `plots`. These are used to mark certain files containing
ML "telemetry". Metrics files contain scalar values (e.g. `AUC`) and plots files
contain matrices and data series (e.g. `ROC curves` or model loss plots) meant
to be visualized and compared.

> With `cache: false`, DVC skips caching the output, as we want `scores.json`,
> `prc.json`, and `roc.json` to be versioned by Git.

</details>

> > ⁉️ We can specify the exact position in the file, or we can show how it
> > works by quoting that section in a hidden section.

[`evaluate.py`](https://github.com/iterative/example-get-started/blob/master/src/evaluate.py)
writes the model's
[ROC-AUC](https://scikit-learn.org/stable/modules/model_evaluation.html#receiver-operating-characteristic-roc)
and
[average precision](https://scikit-learn.org/stable/modules/model_evaluation.html#precision-recall-and-f-measures)
to `scores.json`, which in turn is marked as a `metrics` file with `-M`. Its
contents are:

```json
{ "avg_prec": 0.5204838673030754, "roc_auc": 0.9032012604172255 }
```

`evaluate.py` also writes `precision`, `recall`, and `thresholds` arrays
(obtained using
[`precision_recall_curve`](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.precision_recall_curve.html))
into the plots file `prc.json`:

```json
{
  "prc": [
    { "precision": 0.021473008227975116, "recall": 1.0, "threshold": 0.0 },
    ...,
    { "precision": 1.0, "recall": 0.009345794392523364, "threshold": 0.6 }
  ]
}
```

Similarly, it writes arrays for the
[roc_curve](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_curve.html)
into `roc.json` for an additional plot.

> DVC doesn't force you to use any specific file names, nor does it enforce a
> format or structure of a metrics or plots file. It's completely
> user/case-defined. Refer to `dvc metrics` and `dvc plots` for more details.

You can view tracked metrics and plots with DVC. Let's start with the metrics:

```dvc
$ dvc metrics show
Path         avg_prec    roc_auc
scores.json  0.52048     0.9032
```
