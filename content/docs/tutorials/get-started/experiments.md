# Experiments

Data scientist may try many different approaches and
[parameters](/doc/command-reference/params), having multiple attempts before the
desired result is achieved — monitored with [metrics](#project-metrics)
(explained further down). DVC is built to provide a way to capture these
experiments and navigate between them easily.

<details>

### 👉 Expand to prepare the project

If you just followed through the
[pipelines](/doc/tutorials/get-started/data-pipelines) page, make sure you're
located in the <abbr>project</abbr> we're building. Otherwise, get the project
from Github with:

```dvc
$ git clone https://github.com/iterative/example-get-started
$ cd example-get-started
$ git checkout 7-ml-pipeline
$ dvc pull
```

</details>

## Tuning parameters

Let's say we want to try a modified feature extraction. The
`src/featurization.py` script used to
[create the pipeline](/doc/tutorials/get-started/data-pipelines#dependency-graphs-dags)
actually accepts an optional third argument with the path to a YAML _parameters
file_ to load values to tune its vectorization. Let's generate it:

```dvc
$ echo "max_features: 6000" > params.yaml
$ echo "ngram_range:" >> params.yaml
$ echo "  lo: 1" >> params.yaml
$ echo "  hi: 2" >> params.yaml
$ git add params.yaml
```

> Notice that we're versioning our parameters file with Git, in case we want to
> change its contents for further experiments.

Let's now redefine the featurization stage so that DVC knows that it depends on
the specific values of `max_features` and `ngram_range`. For this we use the
`-p` (`--params`) option of `dvc run`. `params.yaml` is the default parameters
file name in DVC, so there's no need to specify this:

```dvc
$ dvc run -y -f featurize.dvc \
          -d src/featurization.py -d data/prepared \
          -p max_features,ngram_range.lo,ngram_range.hi \
          -o data/features \
          python src/featurization.py \
                 data/prepared data/features params.yaml

$ git add featurize.dvc
$ git commit -m "Update featurization stage"
```

> Please refer to `dvc params` for more information.

### Run the experiment

Let's [reproduce](/doc/tutorials/get-started/data-pipelines#reproduce) our
pipeline up to the model training now:

```dvc
$ dvc repro train.dvc
$ git commit -am "Reproduce model using bigrams"
```

> Notice that `git commit -a` stages all the changes produced by `dvc repro`
> before committing them with Git. Refer to the
> [command reference](https://git-scm.com/docs/git-commit#Documentation/git-commit.txt--a)
> for more details.

---

Now, we have a new `model.pkl` captured and saved. To get back to the initial
version, we run `git checkout` along with `dvc checkout` command:

```dvc
$ git checkout baseline-experiment
$ dvc checkout
```

DVC is designed to checkout large data files (no matter how large they are) into
your <abbr>workspace</abbr> almost instantly on almost all modern operating
systems with file links. See
[Large Dataset Optimization](/doc/user-guide/large-dataset-optimization) for
more information.

## Project metrics

DVC metrics allow us to mark process outputs as files containing metrics to
track. They are defined using the `-m` (`--metrics`) option of `dvc run`.

Let's add a final evaluation stage to our
[pipeline](/doc/tutorials/get-started/data-pipelines#dependency-graphs-dags):

```dvc
$ dvc run -f evaluate.dvc \
          -d src/evaluate.py -d model.pkl -d data/features \
          -M auc.json \
          python src/evaluate.py model.pkl \
                 data/features auc.json
```

`evaluate.py` reads features from the `features/test.pkl` file and calculates
the model's
[AUC](https://towardsdatascience.com/understanding-auc-roc-curve-68b2303cc9c5)
value. This metric is written to the `auc.json` file. We use the `-M` option in
the command above to mark the file as a metric in the stage file.

> Please, refer to `dvc run` and `dvc metrics` documentation for more details.

Let's save the updates:

```dvc
$ git add evaluate.dvc auc.json
$ git commit -m "Model evaluation stage"
```

> Notice that we are versioning `auc.json` with Git directly.

Let's also assign a Git tag. It will serve as a checkpoint for us to compare
experiments later:

```dvc
$ git tag -a "baseline-experiment" -m "Baseline experiment evaluation"
```

## Compare experiments

DVC makes it easy to iterate on your project using Git commits with tags or Git
branches. It provides a way to try different ideas, keep track of them, switch
back and forth. To find the best-performing experiment or track the progress,
[project metrics](/doc/command-reference/metrics) are supported in DVC (as
described in one of the previous sections).

Let's run evaluate for the latest `bigrams` experiment we created earlier. It
mostly takes just running the `dvc repro`:

```dvc
$ git checkout master
$ dvc checkout
$ dvc repro evaluate.dvc
```

`git checkout master` and `dvc checkout` commands ensure that we have the latest
experiment code and data respectively. And `dvc repro` is a way to run all the
necessary commands to build the model and measure its performance.

```dvc
$ git commit -am "Evaluate bigrams model"
$ git tag -a "bigrams-experiment" -m "Bigrams experiment evaluation"
```

Now, we can use `-T` option of the `dvc metrics show` command to see the
difference between the `baseline` and `bigrams` experiments:

```dvc
$ dvc metrics show -T

baseline-experiment:
      auc.json: {"AUC": 0.588426}
bigrams-experiment:
      auc.json: {"AUC": 0.602818}
```

DVC provides built-in support to track and navigate `JSON` or `YAML` metric
files if you want to track additional information. See `dvc metrics` to learn
more.
