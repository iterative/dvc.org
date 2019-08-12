# Experiments

Data science process is inherently iterative and R&D like. Data scientist may
try many different approaches, different hyper-parameter values, and "fail" many
times before the required level of a metric is achieved.

DVC is built to provide a way to capture different experiments and navigate
easily between them. Let's say we want to try a modified feature extraction:

<details>

### Expand to see code modifications

Edit `src/featurization.py` to enable bigrams and increase the number of
features. Find and change the `CountVectorizer` arguments, specify `ngram_range`
and increase number of features:

```python
bag_of_words = CountVectorizer(stop_words='english',
                               max_features=6000,
                               ngram_range=(1, 2))
```

</details>

```dvc
$ vi src/featurization.py    # edit to use bigrams (see above)
$ dvc repro train.dvc        # get and save the new model.pkl
$ git commit -a -m "bigram model"
```

Now, we have a new `model.pkl` captured and saved. To get back to the initial
version we run `git checkout` along with `dvc checkout` command:

```
$ git checkout baseline-experiment
$ dvc checkout
```

DVC is designed to checkout large data files (no matter how large they are) into
your <abbr>workspace</abbr> instantly on almost all modern operating systems
with file links. See
[Large Dataset Optimization](/docs/user-guide/large-dataset-optimization) for
more information.
