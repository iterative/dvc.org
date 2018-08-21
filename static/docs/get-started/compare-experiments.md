# Compare Experiments

DVC makes it easy to iterate on your project using
[Git branches](https://git-scm.com/about/branching-and-merging). It provides a
way to try different ideas, keep track of them, switch back and forth. To find
the best performing experiment or track the progress, a special *metric* output
type is supported in DVC.

Metric file is usually a plain text file with any project-specific numbers -
`AUC`, `ROC`, etc. With a `-M` option of `dvc run` you can specify outputs that
contain your project metrics:

<details><summary><strong>Expand to prepare the evaluation stage</strong></summary>
<p>
To provide an unbiased evaluation of the final model fit on the training data
set are going to use the test data set. We need to adjust the feature extraction
to take into account this split for training and test data sets. No code
modifications are required, let's just change the stage definition:
</p>
<pre>
    $ git checkout master
    $ dvc checkout
    $ dvc run -d featurization.py -d data.tsv -d data-test.tsv \
              -o matrix.pkl -o matrix-test.pkl \
              python featurization.py data.tsv matrix.pkl \
                                      data-test.tsv matrix-test.pkl
    $ git commit .gitignore matrix.plk.dvc -m "change featurization stage"
</pre>
<p>
DVC will aks for confirmation to overwrite the stage. Type `yes` and proceed.
</p>
</details>
</br>

```dvc
    $ dvc run \
          -d evaluate.py -d model.pkl -d matrix-test.pkl \
          -M auc.metric \
          python evaluate.py model.pkl matrix-test.pkl auc.metric
```

`evaluate.py` calculates AUC value using the test data set. `auc.metric` -
is just a plain text file with a single number inside. A `dvc metrics show`
command provides a way to compare different experiments:

<details><summary><strong>Expand to run evaluation for bigrams</strong></summary>
<p>
To evaluate the `bigram` model we need to merge the changes and reproduce the
metric file:
</br>
<pre>
    $ git add auc.metric auc.metric.dvc
    $ git commit -m "add evaluation step with AUC metric"
    $ git checkout bigram && dvc checkout
    $ git merge -X theirs master 
    $ dvc repro auc.metric.dvc
    $ git commit -a -m "evaluate bigram model"
</pre>
</p>
</details>
</br>

```dvc
    $ dvc metrics show -a
    master:
        auc.metric: 0.588765
    bigram:
        auc.metric: 0.620421
```

DVC provides built-in support to track and navigate `JSON`, `TSV` or `CVS` metric
files if you want to track additional information. Check `dvc metrics` to learn
more.
