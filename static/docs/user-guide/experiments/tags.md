# How to Manage Experiments by Tags

You can mark (or label) each experiment using Git tags.

<p align="center">
<img src="/static/img/user-guide/experiments/tags.png" />
</p>

Using tags to mark experiments is most suitable when you can easily create a new
experiment based on the last one. For example when you are trying different
values for only one aspect of the experiment, say feature extraction.

## Examples

Examples of managing experiments by tags can be seen on these sections of the
Get Started tutorial:

- [Metrics](/doc/get-started/metrics)
- [Experiments](/doc/get-started/experiments)
- [Compare Experiments](/doc/get-started/compare-experiments)
- [Get Older Files](/doc/get-started/older-versions)

They can also be tried interactively on Katacoda:

- [Experiments and Metrics](https://katacoda.com/dvc/courses/get-started/experiments)
- [Data Versioning](https://katacoda.com/dvc/courses/get-started/versioning)

## How it works

### Commit and tag

At the end of each experiment we commit everything to Git and add a tag, like
this:

```dvc
$ git add .
$ git commit -m 'Baseline experiment'
$ dvc commit
$ git tag baseline-experiment
```

Do some changes to run an experiment with bigrams and commit it:

```dvc
$ git commit -am 'Evaluate bigrams model'
$ dvc commit
$ git tag bigrams-experiment -am 'Bigrams experiment'
```

> The command `dvc commit` might not be strictly required, since `dvc repro`
> usually commits everything, but we are using it just in case there is still
> some data that is not committed yet.

### Compare the metrics

To find out which experiment has the best performance (the best metrics) we use
the command `dvc metrics show` with the option `-T, --all-tags`:

```dvc
$ dvc metrics show -T

baseline-experiment:
    auc.metric: 0.588426
bigrams-experiment:
    auc.metric: 0.602818
```

### Check out a previous experiment

Let's list first all the tags:

```dvc
$ git tag
$ git log --oneline
```

To go to a previous experiment we can do:

```dvc
$ git checkout baseline-experiment
$ dvc checkout
$ dvc repro evaluate.dvc
```

> If all the data and outputs of the previous experiments have been cached
> correctly, this `dvc repro` should not have to re-run anything and should
> finish quickly.

Switch back to the latest version:

```dvc
$ git checkout master
$ dvc checkout
$ dvc repro evaluate.dvc
```

### Move the best experiment on top

Let's say that `baseline-experiment` has the best performance and we want to
move this experiment on top of the Git history. We can do it like this:

```dvc
# make master identical to the tag by reverting all the changes
$ git revert -n baseline-experiment..HEAD
$ git status
$ git diff --cached
$ git revert --continue

# delete the old tag and add it to the current version
$ git log --oneline
$ git tag -d baseline-experiment
$ git tag
$ git tag baseline-experiment
$ git log --oneline
```
