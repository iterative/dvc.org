# Compare Experiments

DVC makes it easy to iterate on your project using Git commits with tags or Git
branches. It provides a way to try different ideas, keep track of them, switch
back and forth. To find the best performing experiment or track the progress, a
special _metric_ output type is supported in DVC (described in one of the
previous chapters).

Let's run evaluate for the latest `bigram` experiment we created in previous
chapters. It mostly takes just running the `dvc repro`:

```dvc
$ git checkout master
$ dvc checkout
$ dvc repro evaluate.dvc
```

`git checkout master` and `dvc checkout` commands ensure that we have the latest
experiment code and data respectively. And `dvc repro`, as we discussed in the
[Reproduce](/doc/get-started/reproduce) chapter, is a way to run all the
necessary commands to build the model and measure its performance.

```dvc
$ git commit -a -m "evaluate bigram model"
$ git tag -a "bigram-experiment" -m "bigrams"
```

Now, we can use `-T` option of the `dvc metrics show` command to see the
difference between the `baseline` and `bigrams` experiments:

```dvc
$ dvc metrics show -T

baseline-experiment:
    auc.metric: 0.588426
bigram-experiment:
    auc.metric: 0.602818
```

DVC provides built-in support to track and navigate `JSON`, `TSV` or `CSV`
metric files if you want to track additional information. See `dvc metrics` to
learn more.
