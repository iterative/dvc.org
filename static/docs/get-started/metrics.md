# Experiment Metrics

The last stage we would like to add to the pipeline is the evaluation stage.
Data science is a metric-driven R&D-like process and `dvc metrics` along with
DVC metric files provide a framework to capture and compare experiments
performance. It does not require installing any databases or instrumenting your
code to use some API, all is tracked by Git and is stored in Git or DVC remote
storage:

```dvc
    $ dvc run -f evaluate.dvc \
              -d src/evaluate.py -d model.pkl -d data/features \
              -M auc.metric \
              python src/evaluate.py model.pkl \
                     data/features auc.metric
```

`evaluate.py` calculates AUC value using the test data set. It reads features
from the `features/test.pkl` file and produces a DVC metric file - `auc.metric`.
It is a special DVC output file type, in this case it's just a plain text file
with a single number inside.

> Please, refer to the `dvc metrics` command documentation to see more available
> options and details.

Let's again commit and save results:

```dvc
    $ git add evaluate.dvc auc.metric
    $ git commit -m "add evaluation step to the pipeline"
    $ dvc push
```

Let's also assign a Git tag, it will serve as a checkpoint for us to compare
experiments in the future, or if we need to go back and checkout it and the
corresponding data:

```dvc
    $ git tag -a "baseline-experiment" -m "baseline"
```

The `dvc metrics show` command provides a way to compare different experiments,
by analyzing DVC metric files across different branches, tags, etc. But first we
need to create a new experiment to compare the baseline with.
