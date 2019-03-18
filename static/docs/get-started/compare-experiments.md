# Compare Experiments

DVC makes it easy to iterate on your project using
[Git branches](https://git-scm.com/about/branching-and-merging) or Git tags.
It provides a way to try different ideas, keep track of them, switch back and
forth. To find the best performing experiment or track the progress, a
special *metric* output type is supported in DVC.

Metric file is usually a plain text file (though file of any complexity and
structure could be used, check `dvc metrics` to get more details) with any
project-specific numbers - `AUC`, `ROC`, etc. With a `-M` option of `dvc run`
you can specify outputs that contain your project metrics:

<details>

### Expand to prepare the evaluation stage

To provide an unbiased evaluation of the final model fitted on the training data
set, we are going to use the test data set. We need to adjust the feature
extraction to take into account this split for training and test datasets. No
code modifications are required, let's just change the stage definition:

```dvc
    $ git checkout master
    $ dvc checkout
    $ dvc run -d featurization.py -d data.tsv -d data-test.tsv \
              -o matrix.pkl -o matrix-test.pkl \
              python featurization.py data.tsv matrix.pkl \
                                      data-test.tsv matrix-test.pkl
    $ git commit .gitignore matrix.pkl.dvc -m "change featurization stage"
```

DVC will ask for confirmation to overwrite the stage. Type `yes` and proceed.

</details>

```dvc
    $ dvc run \
          -d evaluate.py -d model.pkl -d matrix-test.pkl \
          -M auc.metric \
          python evaluate.py model.pkl matrix-test.pkl auc.metric
```

`evaluate.py` calculates AUC value using the test data set. `auc.metric` -
in this case, it's just a plain text file with a single number inside. A 
`dvc metrics show` command provides a way to compare different experiments:

<details>

### Expand to run an evaluation for bigrams

To evaluate the `bigram` model we need to merge the changes and reproduce the
metric file:

```dvc
    $ git add auc.metric auc.metric.dvc
    $ git commit -m "add evaluation step with AUC metric"
    $ git checkout bigram && dvc checkout
    $ git merge -X theirs master 
    $ dvc repro auc.metric.dvc
    $ git commit -a -m "evaluate bigram model"
```

</details>

```dvc
    $ dvc metrics show -a
    master:
        auc.metric: 0.588765
    bigram:
        auc.metric: 0.620421
```

DVC provides built-in support to track and navigate `JSON`, `TSV` or `CSV`
metric files if you want to track additional information. Check `dvc metrics` to
learn more.
