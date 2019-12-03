# Manage Experiments By Branches

You can use a different Git branch for each experiment.

<p align="center">
<img src="/static/img/user-guide/experiments/branches.png" />
</p>

This is usually more flexible than managing experiments by tags, since you can
easily base a new experiment on any of the previous experiments.

## Examples

An example of managing experiments by branches can be seen on the
[Deep Dive Tutorial](https://dvc.org/doc/tutorials/deep/reproducibility).

These interactive tutorials also manage experiments by branches:

- [Pipelines](https://katacoda.com/dvc/courses/tutorials/pipelines) - Using DVC
  commands to build a simple ML pipeline.
- [MNIST](https://katacoda.com/dvc/courses/tutorials/mnist) - Classify images of
  hand-written digits using the MNIST dataset.

## How it works

### Commit and branch

Let's say that we are working on the branch `master` and at the end of the
experiment we want to save it on a branch named `unigrams`. We can do it like
this:

```dvc
$ git commit -am 'Evaluate'
$ dvc commit   # just to make sure all the data are committed
$ git checkout -b unigrams
$ git checkout master
```

Now we can continue working on `master` for another experiment. When we are done
we can create another branch for it same as above.

### New experiment based on another one

Suppose that we want to start a new experiment based on another one, instead of
starting from `master`. We can switch first to that branch and then start a new
experiment on top of it:

```dvc
$ git checkout unigrams
$ dvc checkout
$ git checkout -b bigrams
```

Now we can continue to make the necessary changes for the bigrams experiment.

### Compare the metrics

To find out which experiment has the best performance (the best metrics) we use
the command `dvc metrics show` with the option `-a, --all-branches`:

```dvc
$ dvc metrics show -a

bigrams:
	data/eval.txt: AUC: 0.624727

unigrams:
	data/eval.txt: AUC: 0.624652
```

### Check out an experiment

Let's list first all the branches:

```dvc
$ git branch -a
bigrams
unigrams
...
```

To switch to the experiment `unigrams` we can do:

```dvc
$ git checkout unigrams
$ dvc checkout
```

Switching back to `master`:

```dvc
$ git checkout master
$ dvc checkout
```

In any case the command `dvc repro` should not have to re-run anything and
should finish quickly, if all the data of the experiments have been committed
properly.

### Move the best experiment to master

> Usually it is not necessary to move the best experiment to master, since we
> can easily switch to any of the branches.

What we usually want is to completely replace the master branch with the
experiment branch. Using `git merge` is not the best option in such a situation
since it will usually result into a mixture between the two branches (the master
branch and the experiment branch). Instead we should copy the branches, like
this:

```dvc
$ git checkout bigrams
$ git branch -c master old-master
$ git branch -C bigrams master
$ git push -f origin master
$ git branch -D old-master
$ git checkout master
$ git diff bigrams
```
