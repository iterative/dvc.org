# Example

This is a short version of the [Tutorial](/doc/tutorial).

To show DVC in action, let's play with an actual machine learning scenario.
Let's explore the natural language processing (NLP) problem of predicting tags
for a given StackOverflow question. For example, we want one classifier which
can predict a post that is about the Java language by tagging it "Java".

In this example, we will focus on building a simple pipeline that takes an
archive with StackOverflow posts and trains the prediction model and saves it as
an output. The pipeline itself is a sequence of transformation we apply to the
data file:

* Extract data
* Prepare (convert XML to TSV)
* Split into training and testing data sets
* Build a feature matrix
* Trains the model (using the training data set)
* And finally evaluate the model (using the test data set)

Okay, let's first download the code and set up the Git repository. This step has
nothing to do with DVC so far, it's just a simple preparation:

```dvc
    $ mkdir example
    $ cd example
    $ git init
    $ wget -q -O - https://dvc.org/s3/so/code.tgz | tar -xvf -
    $ pip install -U -r code/requirements.txt
    $ git add .
    $ git commit -m 'download and initialize code'
```

Then, we are creating the pipeline step-by-step, utilizing the same set of
commands that are described in the get started chapters.

* Initialize DVC repository (in your Git repository):

```dvc
    $ dvc init
```

* Download an input data set to the `data` directory and take it into DVC
control:

```dvc
    $ mkdir data
    $ wget -P data https://dvc.org/s3/so/25K/Posts.xml.tgz
    $ dvc add data/Posts.xml.tgz
```

* The first actual step, extract XML from the archive. Note, we don't need to
run `dvc add` on `Posts.xml`, `dvc run` saves (commits into cache)
automatically:

```dvc
    $ dvc run -d data/Posts.xml.tgz \
              -o data/Posts.xml \
              tar -xvf data/Posts.xml.tgz -C data
```

* Next step, let's convert XML into TSV to make feature extraction easier:

```dvc
    $ dvc run -d code/xml_to_tsv.py -d code/conf.py -d data/Posts.xml \
              -o data/Posts.tsv \
              python code/xml_to_tsv.py
```

* Split training and testing data sets. There are two output output files:

```dvc
    # 0.33 - test dataset split ratio. 20170426 is a seed for randomization.
    $ dvc run -d code/split_train_test.py -d code/conf.py -d data/Posts.tsv \
              -o data/Posts-train.tsv -o data/Posts-test.tsv \
              python code/split_train_test.py 0.33 20170426
```

* Extract features from the data. Two TSV as inputs with two pickle matrices as
outputs:

```dvc
    $ dvc run -d code/featurization.py -d code/conf.py \
              -d data/Posts-train.tsv -d data/Posts-test.tsv \
              -o data/matrix-train.p -o data/matrix-test.p \
              python code/featurization.py
```

* Train ML model on the training data set. 20170426 is a seed value here:

```dvc
    $ dvc run -d code/train_model.py -d code/conf.py -d data/matrix-train.p \
              -o data/model.p \
              python code/train_model.py 20170426
```

* Finally, evaluate the model on the test data set and get the metrics file:

```dvc
    $ dvc run -d code/evaluate.py -d code/conf.py \
              -d data/model.p -d data/matrix-test.p \
              -M data/eval.txt \
              python code/evaluate.py
```

* Get the result.

```dvc
    $ cat data/eval.txt
    AUC: 0.596182
```

All steps could be automatically and efficiently reproduced even if some source
files have been modified. For example:

* Let's improve the feature extraction algorithm by making some modification to
the `code/featurization.py`:

```dvc
    $ vi code/featurization.py
```

Specify ngram parameter in CountVectorizer (lines 50–53) and increase number of
features to 6000:

```python
    bag_of_words = CountVectorizer(stop_words='english',
                                   max_features=6000,
                                   ngram_range=(1, 2))
```

* Commit all the changes:

```dvc
    $ git commit -am "Add bigram features"
```

* Reproduce all required steps to get our target metrics file:

```dvc
    $ dvc repro data/eval.txt.dvc
```

* Take a look at the target metric improvement:

```dvc
    $ cat data/eval.txt

    AUC: 0.627196
```

It's easy to integrate DVC into your existing ML pipeline/processes without any
significant effort to re-implement your code/application.

The key step to note is that DVC automatically derives the dependencies between
the experiment steps and builds the dependency graph (DAG) transparently.

Not only can DVC streamline your work into a single, reproducible environment,
it also makes it easy to share this environment by Git including the
dependencies — an exciting collaboration feature which gives the ability to
reproduce the research easily in a myriad of environments.
