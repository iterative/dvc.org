# Reproducibility

## How does it work?

The most exciting part of DVC is reproducibility.

> Reproducibility is the time you are getting benefits out of DVC instead of
> spending time defining the ML pipelines.

DVC tracks all the dependencies, which helps you iterate on ML models faster
without thinking what was affected by your last change.

> In order to track all the dependencies, DVC finds and reads ALL the DVC-files
> in a repository and builds a dependency graph
> ([DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph)) based on these
> files.

This is one of the differences between DVC reproducibility and traditional
Makefile-like build automation tools (Make, Maven, Ant, Rakefile etc). It was
designed in such a way to localize specification of DAG nodes.

If you run `repro` on any created DVC-file from our repository, nothing happens
because nothing was changed in the defined pipeline.

```dvc
# Nothing to reproduce
$ dvc repro model.p.dvc
```

By default, `dvc repro` reads DVC-files named `Dvcfile`:

```dvc
# Reproduce Dvcfile.
# But there is still nothing to reproduce:
$ dvc repro
```

## Adding bigrams

Our NLP model was based on [unigrams](https://en.wikipedia.org/wiki/N-gram)
only. Let’s improve the model by adding bigrams. The bigram model will extract
signals not only from separate words but also from two-word combinations. This
eventually increases the number of features for the model and hopefully improves
the target metric.

Before editing the `code/featurization.py` file, please create and checkout a
new branch `bigrams`.

```dvc
$ git checkout -b bigram
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

Reproduce the pipeline:

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

The process started with the feature creation step because one of its parameters
was changed — the edited source code `code/featurization.py`. All dependent
steps were regenerated as well.

Let’s take a look at the metric’s change. The improvement is close to zero
(+0.0075% to be precise):

```dvc
$ cat data/eval.txt
AUC: 0.624727
```

This is not a great result but it gives us some information about the model.

To compare it with the previous AUC, you can use the `metrics` command:

```dvc
$ dvc metrics show -a

bigram:
	data/eval.txt: AUC: 0.624727

master:
	data/eval.txt: AUC: 0.624652
```

> It is convenient to keep track of information even for failed experiments.
> Sometimes a failed hypothesis gives more information than a successful one.

Let’s keep the result in the repository. Later we can find out why bigram does
not add value to the current model and change that.

Many DVC-files were changed. This happened due to md5 checksum changes.

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

The previous experiment was done in the feature extraction step and provided no
improvements. This might be caused by not having perfect model hyperparameters.
Let’s try to improve the model by changing the hyperparameters.

There is no good reason to improve the last bigram based model. Let’s checkout
the original model from the master branch.

> Note that after checking out code and DVC-files from Git, data files have to
> be checked out as well using the `dvc checkout` command.

```dvc
$ git checkout master
$ dvc checkout
# Nothing to reproduce since code was checked out by `git checkout`
# and data files were checked out by `dvc checkout`
$ dvc repro
```

After proper checkout, there is nothing to reproduce because all the correct
files were checked out by Git and all data files by DVC.

In more detail — `git checkout master` checked out the code and DVC-files. The
DVC-files from the master branch point to old (unigram based) data files outputs
and dependencies. `dvc checkout` command found all the DVC-files and restored
the data files based on them.

## Tune the model

You should create a new branch for this new experiment. It will help you to
organize all the experiments in a repository and checkout them when needed.

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

Only the modeling and the evaluation step need to be reproduced. Just run repro:

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

Validate the metric and commit all the changes.

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

Now we can revisit the failing hypothesis with bigrams, which didn’t provide any
model improvement even with one thousand more features. The current model with
700 trees in the forest is stronger and we might be able to get more information
using bigrams. So, let’s incorporate the bigram changes into the current model
using a regular Git merge command.

> Git merge logic works for data files and respectively for DVC models.

But first, let’s create a branch as usual.

```dvc
$ git checkout -b train_bigram
$ git merge bigram
Auto-merging model.p.dvc
CONFLICT (content): Merge conflict in model.p.dvc
Auto-merging Dvcfile
CONFLICT (content): Merge conflict in Dvcfile
Automatic merge failed; fix conflicts and then commit the result.
```

The merge has a few conflicts. All of the conflicts are related to md5 checksum
miss-matches in the branches. You can properly merge conflicts by prioritizing
the checksums from the bigram branch.

> Or you can simply replace all the checksum by empty string ‘’.

The only disadvantage of the last, empty string tricks — DVC will recompute the
outputs checksums. After resolving the conflicts you need to checkout a proper
version of the data files:

```dvc
# Replace conflicting checksums to empty string ''
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

The target metric:

```dvc
$ cat data/eval.txt
AUC: 0.640389
```

The bigrams increased the target metric by 0.28% and the last change looks like
a reasonable improvement to the ML model. So, the result should be committed:

```dvc
$ git add .
$ git commit -m 'Merge bigrams into the tuned model'
```

Now our current branch contains the best model and it can be merged into master.

```dvc
$ git checkout master
$ dvc checkout
$ git merge train_bigram
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
# Nothing to reproduce:
$ dvc repro
```
