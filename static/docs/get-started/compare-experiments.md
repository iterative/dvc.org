# Compare Experiments

DVC makes it easy to iterate on your project using Git commits with tags or Git
branches. It provides a way to try different ideas, keep track of them, switch
back and forth. To find the best performing experiment or track the progress, a
special *metric* output type is supported in DVC lie it was described in one of
the previous steps.

Let's run evaluate for the latest `bigram` experiment we created in one of the
previous steps. It mostly takes just running the `dvc repro`:

```dvc
    $ git checkout master
    $ dvc checkout
    $ dvc repro evaluate.dvc
    $ git commit -a -m "evaluate bigram model"
```

Let's also assign a Git tag again, it will serve as a checkpoint for us to
compare experiments, or if we need to go back and checkout it and the
corresponding data:

```dvc
    $ git tag -a "bigram-experiment" -m "bigrams"
```
Now, we can use `-T` option of the `dvc metrics show` command to see the
difference between the `baseline` and `bigrams` experiments:

```dvc
    $ dvc metrics show -T
    baseline-experiment:
        auc.metric: 0.588765
    bigram-experiment:
        auc.metric: 0.620421
```

DVC provides built-in support to track and navigate `JSON`, `TSV` or `CSV`
metric files if you want to track additional information. Check `dvc metrics` to
learn more.
