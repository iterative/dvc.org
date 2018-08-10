# Experiments

One of the major data science process distinctions is its inherently iterative,
R&D like nature - data scientist may try many different approaches, different
hyper-parameter values and "fail" many times before the required level of a
metric is achieved.

DVC is built to do this navigation extremely fast on all modern operating
systems. Let's imagine we want to try a different feature extraction:

```dvc
    $ git checkout bigram
    $ vim featurization.py   # edit to use bigrams (see above)
    $ dvc repro              # get and save the new model.pkl
    $ git commit -a -m "bigram model"
```

Now, we have a new `model.pkl` captured and saved. To get back to the initial
version we run `git checkout` along with `dvc checkout` commands:

```
    $ git check master
    $ dvc checkout
```

DVC is built to do this navigation extremely fast on all modern operating
systems.
