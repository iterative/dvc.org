# Experiments

Data science process is inherently iterative and R&D like - data scientist may
try many different approaches, different hyper-parameter values and "fail" many
times before the required level of a metric is achieved.

DVC is built to provide a way to capture different experiments and navigate
easily between them. Let's imagine we want to try a modified feature extraction:

<details>

### Expand to see code modifications

Edit `featurization.py` to enable bigrams and increase number of features. Find
and chage the `CountVectorizer` arguments, specify `ngram_range` and increase
number of features:

```python
    bag_of_words = CountVectorizer(stop_words='english',
                                   max_features=6000,
                                   ngram_range=(1, 2))
```
</details>


```dvc
    $ git checkout -b bigram
    $ vi featurization.py        # edit to use bigrams (see above)
    $ dvc repro model.pkl.dvc    # get and save the new model.pkl
    $ git commit -a -m "bigram model"
```

Now, we have a new `model.pkl` captured and saved. To get back to the initial
version we run `git checkout` along with `dvc checkout` command:

```
    $ git checkout master
    $ dvc checkout
```

DVC is designed to checkout large data files (no matter how large they are) into
your workspace instantly on almost all modern operating systems.
