# Reproducibility

## How does it work?

The most exciting part of DVC is reproducibility.

> Reproducibility is the time you are getting benefits out of DVC instead of
> spending time managing ML pipelines.

DVC tracks all the dependencies. This helps you iterate on ML models faster
without thinking what was affected by your last change.

In order to track all the dependencies, DVC finds and reads all the DVC-files in
a repository and builds a dependency graph
([pipeline](/doc/command-reference/pipeline)) based on these files.

This is one of the differences between DVC reproducibility and software build
automation tools ([Make](https://www.gnu.org/software/make/), Maven, Ant,
Rakefile etc). It was designed in such a way to localize specification of the
graph nodes (pipeline [stages](/doc/command-reference/run)).

If you run `repro` on any [DVC-file](/doc/user-guide/dvc-file-format) from our
repository, nothing happens because nothing was changed in the pipeline defined
in the <abbr>project</abbr>: There's nothing to reproduce.

```dvc
$ dvc repro model.p.dvc
```

> By default, `dvc repro` tries to read the DVC-file with name `Dvcfile`, like
> the one we define in the previous chapter.

```dvc
$ dvc repro
```

Tries to reproduce the same pipeline, but there is still nothing to reproduce.

## Adding bigrams

Our NLP model was based on [unigrams](https://en.wikipedia.org/wiki/N-gram)
only. Let's improve the model by adding bigrams. The bigrams model will extract
signals not only from separate words but also from two-word combinations. This
eventually increases the number of features for the model and hopefully improves
the target [metric](/doc/command-reference/metrics).

Before editing the `code/featurization.py` file, please create and checkout a
new branch `bigrams`.

```dvc
$ git checkout -b bigrams
# Please use your favorite text editor:
$ vi code/featurization.py
```

Specify `ngram` parameter in `CountVectorizer` (lines 50–53) and increase the
number of features to 6000:

```python
bag_of_words = CountVectorizer(stop_words='english',
                               max_features=6000,
                               ngram_range=(1, 2))
```

Reproduce our changed pipeline:

```dvc
$ dvc repro

Reproducing 'matrix-train.p.dvc':
    python code/featurization.py
The input data frame data/Posts-train.tsv size is (66999, 3)
The output matrix data/matrix-train.p size is (66999, 6002) and data type is float64
The input data frame data/Posts-test.tsv size is (33001, 3)
The output matrix data/matrix-test.p size is (33001, 6002) and data type is float64

Reproducing 'model.p.dvc':
    python code/train_model.py 20180319
Input matrix size (66999, 6002)
X matrix size (66999, 6000)
Y matrix size (66999,)

Reproducing 'Dvcfile':
    python code/evaluate.py
```

The process started with the feature creation stage because one of its
parameters was changed — the edited source code file `code/featurization.py`.
All dependent stages were executed as well.

Let's take a look at the metrics change. The improvement is close to zero
(+0.0075% to be precise):

```dvc
$ cat data/eval.txt
AUC: 0.624727
```

This is not a great result but it gives us some information about the model.

To compare it with the previous AUC, you can use the `dvc metrics` command:

```dvc
$ dvc metrics show -a

bigrams:
	data/eval.txt: AUC: 0.624727

master:
	data/eval.txt: AUC: 0.624652
```

> It's convenient to keep track of information even for failed experiments.
> Sometimes a failed hypothesis gives more information than a successful one.

Let's keep the result in the repository. Later we can find out why bigrams don't
add value to the current model and change that.

Many DVC-files were changed. This happened due to file hash changes.

```dvc
$ git status -s
M Dvcfile
M code/featurization.py
M matrix-train.p.dvc
M model.p.dvc
```

Now we can commit the changes:

```dvc
$ git add .
$ git commit -m Bigrams
```

## Checkout code and data files

The previous experiment was done in the 'featurization' stage and provided no
improvements. This might be caused by not having perfect model hyperparameters.
Let's try to improve the model by changing the hyperparameters.

There is no good reason to improve the last bigrams model. Let's checkout the
original model from the master branch.

> Note that after checking out code and DVC-files from Git, data files have to
> be checked out as well using the `dvc checkout` command.

```dvc
$ git checkout master
$ dvc checkout
$ dvc repro
Data and pipelines are up to date.
```

After proper checkout, there is nothing to reproduce because all the correct
files were checked out by Git, and all data files by DVC.

In more detail — `git checkout master` checked out the code and DVC-files. The
DVC-files from the master branch point to old (unigram based) dependencies and
<abbr>outputs</abbr>. `dvc checkout` command found all the DVC-files and
restored the data files based on them.

## Tune the model

Let's create a new branch for this new experiment. It will help you to organize
all the experiments in a repository and checkout them when needed.

```dvc
$ git checkout -b tuning
# Please use your favorite text editor:
$ vi code/train_model.py
```

Increase the number of trees in the forest to 700 by changing the `n_estimators`
parameter and the number of jobs in the `RandomForestClassifier` class (line
27):

```python
clf = RandomForestClassifier(n_estimators=700,
                             n_jobs=6, random_state=seed)
```

Only the modeling and the evaluation stage need to be reproduced. Just run:

```dvc
$ dvc repro

Reproducing 'model.p.dvc':
    python code/train_model.py 20180319
Input matrix size (66999, 5002)
X matrix size (66999, 5000)
Y matrix size (66999,)
Reproducing 'Dvcfile':
    python code/evaluate.py
```

Validate the [metric](/doc/command-reference/metrics) and commit all the
changes.

```dvc
$ cat data/eval.txt
AUC: 0.637561
```

This seems like a good model improvement (+1.28%). Please commit all the
changes:

```dvc
$ git add .
$ git commit -m '700 trees in the forest'
```

## Merge the model to master

Now we can revisit the failing hypothesis with bigrams, which didn't provide any
model improvement even with one thousand more features. The current model with
700 trees in the forest is stronger and we might be able to get more information
using bigrams. So, let's incorporate the bigrams changes into the current model
using a regular Git merge command.

> Git merge logic works for data files and respectively for DVC models.

But first, let's create a branch as usual.

```dvc
$ git checkout -b train_bigrams
$ git merge bigrams
Auto-merging model.p.dvc
CONFLICT (content): Merge conflict in model.p.dvc
Auto-merging Dvcfile
CONFLICT (content): Merge conflict in Dvcfile
Automatic merge failed; fix conflicts and then commit the result.
```

The merge has a few conflicts. All of the conflicts are related to file hash
mismatches in the branches. You can properly merge conflicts by prioritizing the
file hashes from the bigrams branch: that is, by removing all hashes of the
other branch.
[Here](https://help.github.com/en/articles/resolving-a-merge-conflict-using-the-command-line)
you can find a tutorial that clarifies how to do that. It is also important to
remove all automatically generated
[conflict markers](https://git-scm.com/book/en/v2/Git-Tools-Advanced-Merging#_checking_out_conflicts)
(<code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>,
<code>&#61;&#61;&#61;&#61;&#61;&#61;&#61;</code>,
<code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>) from `model.p.dvc` and `Dvcfile`.

Another way to solve git merge conflicts is to simply replace all file hashes
with empty strings ''. The only disadvantage of this trick is that DVC will need
to recompute the <abbr>output</abbr> hashes.

After resolving the conflicts you need to checkout a proper version of the data
files:

```dvc
# Replace conflicting hashes with empty string ''
$ vi model.p.dvc
$ vi Dvcfile
$ dvc checkout
```

And reproduce the result:

```dvc
$ dvc repro

Reproducing 'model.p.dvc':
    python code/train_model.py 20180319
Input matrix size (66999, 6002)
X matrix size (66999, 6000)
Y matrix size (66999,)
Reproducing 'Dvcfile':
    python code/evaluate.py
```

Check the target [metric](/doc/command-reference/metrics):

```dvc
$ cat data/eval.txt
AUC: 0.640389
```

The bigrams increased the target metric by 0.28% and the last change looks like
a reasonable improvement to the ML model. So let's commit the result:

```dvc
$ git add .
$ git commit -m 'Merge bigrams into the tuned model'
```

Now our current branch contains the best model and it can be merged into master.

```dvc
$ git checkout master
$ dvc checkout
$ git merge train_bigrams
Updating f5ff48c..4bd09da
Fast-forward
 Dvcfile               | 6 +++---
 code/featurization.py | 3 ++-
 code/train_model.py   | 2 +-
 matrix-train.p.dvc    | 6 +++---
 model.p.dvc           | 6 +++---
 5 files changed, 12 insertions(+), 11 deletions(-)
```

Fast-forward strategy was applied to this merge. It means that we have all the
changes in the right place and reproduction is not needed.

```dvc
$ dvc checkout
$ dvc repro
Data and pipelines are up to date.
```
