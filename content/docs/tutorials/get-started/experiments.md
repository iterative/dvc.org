# Experiments

Data science is a metric-driven process of experimentation, similar to any R&D.
DVC provides a built-in framework to capture and compare experiment performance
through _parameters_ and _metrics_.

<details>

### 👉 Expand to prepare the project

If you just followed through the
[pipelines](/doc/tutorials/get-started/data-pipelines) page of this tutorial,
just make sure you're back in the <abbr>project</abbr> we're working on:

```dvc
$ cd ~/so-tag-predict
```

Otherwise, run these commands to get the project from Github:

```dvc
$ git clone https://github.com/iterative/example-get-started
$ cd example-get-started
$ git checkout 7-ml-pipeline
$ dvc pull
```

</details>

## Project metrics

DVC metrics allow us to mark stage <abbr>outputs</abbr> as files containing
metrics to track. They are defined using the `-m` (`--metrics`) option of
`dvc run`. Let's add a final evaluation stage to our
[pipeline](/doc/tutorials/get-started/data-pipelines#pipelines), for example:

```dvc
$ dvc run -f evaluate.dvc \
          -d src/evaluate.py -d model.pkl -d data/features \
          -M auc.metric \
          python src/evaluate.py model.pkl \
                 data/features auc.metric
```

Stage `evaluate.py` reads features from the `features/test.pkl` file and
calculates the model's
[AUC](https://towardsdatascience.com/understanding-auc-roc-curve-68b2303cc9c5)
value. This metric is written to the `auc.metric` file (inn JSON format). We use
the `-M` option in the command above to mark the file as a metric (instead of a
regular output) in the stage file.

> Please, refer to `dvc run` and `dvc metrics` documentation for more details.

Let's save the updates:

```dvc
$ git add evaluate.dvc auc.metric
$ git commit -m "Create evaluation stage"
```

> Notice that we are versioning `auc.metric` with Git directly.

Let's also assign a Git tag. It will serve as a checkpoint for us to compare
experiments later:

```dvc
$ git tag -a "baseline-experiment" -m "Baseline experiment evaluation"
```

## Experimenting

Data scientist may try many different approaches or
[hyperparameters](/doc/tutorials/get-started/data-pipelines#parameters), having
multiple failed attempts before the desired result (monitored via metrics) is
achieved. DVC is built to provide a way to capture these experiments and
navigate between them easily.

### Tune parameters

Let's say we want to try a modified feature extraction. The
`src/featurization.py` script used to
[create the pipeline](/doc/tutorials/get-started/data-pipelines#pipelines)
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

Let's reproduce our pipeline up to the model training now:

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

## Compare experiments

DVC makes it easy to iterate on your project using Git commits with tags or Git
branches. It provides a way to try different ideas, keep track of them, switch
back and forth. To find the best performing experiment or track the progress,
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
experiment code and data respectively. And `dvc repro`, as we discussed in the
[Reproduce](/doc/tutorials/get-started/data-pipelines#reproduce) section, is a
way to run all the necessary commands to build the model and measure its
performance.

```dvc
$ git commit -am "Evaluate bigrams model"
$ git tag -a "bigrams-experiment" -m "Bigrams experiment evaluation"
```

Now, we can use `-T` option of the `dvc metrics show` command to see the
difference between the `baseline` and `bigrams` experiments:

```dvc
$ dvc metrics show -T

baseline-experiment:
    auc.metric: 0.588426
bigrams-experiment:
    auc.metric: 0.602818
```

DVC provides built-in support to track and navigate `JSON` or `YAML` metric
files if you want to track additional information. See `dvc metrics` to learn
more.

## Get older data version

Now that we have multiple experiments, models, processed datasets, the question
is how do we revert back to an older version of a model file? Or how can we get
the previous version of the dataset if it was changed at some point?

The answer is the `dvc checkout` command, and we already touched briefly the
process of switching between different data versions in previous sections.

Let's say we want to get the previous `model.pkl` file. The short answer is:

```dvc
$ git checkout baseline-experiment train.dvc
$ dvc checkout train.dvc
```

These two commands will bring the previous model file to its place in the
<abbr>workspace</abbr>.

<details>

### Expand to learn about DVC internals

DVC uses special [DVC-files](/doc/user-guide/dvc-file-format) to track data
files, directories, end results. In this case, `train.dvc` among other things
describes the `model.pkl` file this way:

```yaml
outs:
md5: a66489653d1b6a8ba989799367b32c43
path: model.pkl
```

`a664...2c43` is the "address" of the file in the local or remote DVC storage.

It means that if we want to get to the previous version, we need to restore the
DVC-file first with the `git checkout` command. Only after that can DVC restore
the model file using the new "address" from the DVC-file.

</details>

To fully restore the previous experiment we just run `git checkout` and
`dvc checkout` without specifying a target:

```dvc
$ git checkout baseline-experiment
$ dvc checkout
```

Read the `dvc checkout` command reference and a dedicated data versioning
[example](/doc/tutorials/versioning) for more information.
