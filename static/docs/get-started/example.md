# Example

This is a short version of the [Tutorial](/doc/tutorial).

To show DVC in action, let's play with an actual machine learning scenario.
Let's explore the natural language processing (NLP) problem of predicting tags
for a given StackOverflow question. For example, we want one classifier which
can predict a post that is about the Python language by tagging it `python`.

In this example, we will focus on building a simple pipeline that takes an
archive with StackOverflow posts and trains the prediction model and saves it as
an output. Check [get started](/doc/get-started) to see links to other examples,
tutorials, use cases if you want to cover other aspects of the DVC.

The pipeline itself is a sequence of transformation we apply to the
data file:

* Extract data
* Prepare data (convert XML to TSV)
* Split data into training and testing data sets
* Build a feature matrix
* Trains the model (using the training data set)
* And finally evaluate the model (using the test data set)

DVC helps to describe these transformations and capture actual data involved -
input data set we are processing, intermediate artifacts (useful if some
transformations take a lot of time to run), output models. This way we can
capture what data and code were used to produce a specific model in a sharable
and reproducible way.

Okay, let's first download the code and set up a Git repository. This step has
nothing to do with DVC so far, it's just a simple preparation:

```dvc
    $ mkdir example
    $ cd example
    $ git init
    $ wget -q -O - https://dvc.org/s3/examples/so/code.tgz | tar -xzvf -
    $ pip install -U -r code/requirements.txt
    $ git add .
    $ git commit -m 'download and initialize code'
```

Then, we are creating the pipeline step-by-step, utilizing the same set of
commands that are described in the [get started](/doc/get-started) chapters.

* Initialize DVC repository (run it inside your Git repository):

```dvc
    $ dvc init
    $ git commit -m "initialize DVC"
```

* Download an input data set to the `data` directory and take it under DVC
control:

```dvc
    $ mkdir data
    $ wget -P data https://dvc.org/s3/so/25K/Posts.xml.tgz
    $ dvc add data/Posts.xml.tgz
```

* The first actual step, extract XML from the archive. Note, we don't need to
run `dvc add` on `Posts.xml`, `dvc run` saves (commits into cache, takes the
file under DVC control) automatically:

```dvc
    $ dvc run -d data/Posts.xml.tgz \
              -o data/Posts.xml \
              -f extract.dvc \
              tar -xvf data/Posts.xml.tgz -C data
```

* Next step, let's convert XML into TSV to make feature extraction easier:

```dvc
    $ dvc run -d code/xml_to_tsv.py -d data/Posts.xml \
              -o data/Posts.tsv \
              -f prepare.dvc \
              python code/xml_to_tsv.py data/Posts.xml data/Posts.tsv
```

* Split training and testing data sets. Here `0.1` test dataset split ratio,
`20170426` is a seed for randomization. There are two output output files:

```dvc
    $ dvc run -d code/split_train_test.py -d data/Posts.tsv \
              -o data/Posts-train.tsv -o data/Posts-test.tsv \
              -f split.dvc \
              python code/split_train_test.py data/Posts.tsv 0.2 20170426 \
                                              data/Posts-train.tsv data/Posts-test.tsv
```

* Extract features and labels from the data. Two TSV as inputs with two pickle
matrices as outputs:

```dvc
    $ dvc run -d code/featurization.py -d data/Posts-train.tsv -d data/Posts-test.tsv \
              -o data/matrix-train.pkl -o data/matrix-test.pkl \
              -f featurize.dvc \
              python code/featurization.py data/Posts-train.tsv data/Posts-test.tsv \
                                           data/matrix-train.pkl data/matrix-test.pkl
```

* Train ML model on the training data set. 20170426 is a seed value here:

```dvc
    $ dvc run -d code/train_model.py -d data/matrix-train.pkl \
              -o data/model.pkl \
              -f train.dvc \
              python code/train_model.py data/matrix-train.pkl 20170426 data/model.pkl
```

* Finally, evaluate the model on the test data set and get the metrics file:

```dvc
    $ dvc run -d code/evaluate.py -d data/model.pkl -d data/matrix-test.pkl \
              -M auc.metric \
              -f evaluate.dvc \
              python code/evaluate.py data/model.pkl data/matrix-test.pkl auc.metric
```

* An easy way to see metrics across different branches:

```dvc
    $ dvc metrics show -a

    master:
        auc.metric: 0.587951
```

It's time to save the pipeline. You can check using `git status` command that we
do not save pickle model files or initial data sets into Git. We are just saving
a snapshot of the DVC files that describe data and code versions and
relationships between them.

```dvc
    $ git add *.dvc auc.metric
    $ git commit -am "create pipeline"
```

All steps could be automatically and efficiently reproduced even if some source
files have been modified. For example:

* Let's improve the feature extraction algorithm by making some modification to
the `code/featurization.py`:

```dvc
    $ vi code/featurization.py
```

Specify `ngram` parameter in `CountVectorizer` (lines 63–65):

```python
    bag_of_words = CountVectorizer(stop_words='english',
                                   max_features=5000,
                                   ngram_range=(1, 2))
```

* Reproduce all required steps to get our target metrics file:

```dvc
    $ dvc repro evaluate.dvc
```

* Take a look at the target metric improvement:

```dvc
    $ dvc metrics show -a

    master:
        auc.metric: 0.603121
```

By wrapping your commands with `dvc run` it's easy to integrate DVC into your
existing ML development pipeline/processes without any significant effort to
re-implement your code/application.

The key step to note is that DVC automatically derives the dependencies between
the experiment steps and builds the dependency graph (DAG) transparently.

Not only can DVC streamline your work into a single, reproducible environment,
it also makes it easy to share this environment by Git including the
dependencies — an exciting collaboration feature which gives the ability to
reproduce the research easily in a myriad of environments.
