# Example

To show DVC in action, let's play with an actual machine learning scenario.
Let's explore the natural language processing (NLP) problem of predicting tags
for a given StackOverflow question. For example, we want one classifier which
can predict a post that is about the Java language by tagging it "Java".

First, let's download the model code and set up the Git repository::

```sh
    $ mkdir myrepo
    $ cd myrepo
    $ mkdir code
    $ wget -nv -P code/ \
        https://s3-us-west-2.amazonaws.com/dvc-share/so/code/featurization.py \
        https://s3-us-west-2.amazonaws.com/dvc-share/so/code/evaluate.py \
        https://s3-us-west-2.amazonaws.com/dvc-share/so/code/train_model.py \
        https://s3-us-west-2.amazonaws.com/dvc-share/so/code/split_train_test.py \
        https://s3-us-west-2.amazonaws.com/dvc-share/so/code/xml_to_tsv.py \
        https://s3-us-west-2.amazonaws.com/dvc-share/so/code/requirements.txt
    $ pip install -U -r code/requirements.txt
    $ git init
    $ git add code/
    $ git commit -m 'Download code'
```

The full pipeline can be built by running the code below::

* Initialize DVC repository (in your Git repository):

```sh
    $ dvc init
```

* Download a file and put it into the data/ directory.

```sh
    $ dvc import \
        https://s3-us-west-2.amazonaws.com/dvc-share/so/25K/Posts.xml.tgz data/
```

* Extract XML from the archive.

```sh
    $ dvc run tar zxf data/Posts.xml.tgz -C data/
```

* Prepare the data.

```sh
    $ dvc run python code/xml_to_tsv.py data/Posts.xml data/Posts.tsv python
```

* Split training and testing dataset. Two output files.

```sh
    $ # 0.33 - test dataset split ratio. 20170426 is a seed for randomization.
    $ dvc run python code/split_train_test.py data/Posts.tsv \
        0.33 20170426 data/Posts-train.tsv data/Posts-test.tsv
```

* Extract features from the data. Two TSV as inputs with two pickle matrices as
outputs.

```sh
    $ dvc run python code/featurization.py data/Posts-train.tsv \
        data/Posts-test.tsv data/matrix-train.p data/matrix-test.p
```

* Train ML model on the training dataset. 20170426 is another seed value.

```sh
    $ dvc run python code/train_model.py data/matrix-train.p 20170426 \
        data/model.p
```

* Evaluate the model on the test dataset.

```sh
    $ dvc run python code/evaluate.py data/model.p data/matrix-test.p \
        data/evaluation.txt
```

* Get the result.

```sh
    $ cat data/evaluation.txt
    AUC: 0.596182
```

All steps could be automatically and efficiently reproduced even if some source
files have been modified. For example:

* Let's improve the feature extraction algorithm by making some modification to
the `code/featurization.py`:

```sh
    $ vi code/featurization.py
```

* Commit all the changes:

```sh
    $ git commit -am "Add bigram features"

    [master 50b5a2a] Add bigram features
    1 file changed, 5 insertion(+), 2 deletion(-)
```

* Reproduce all required steps to get our target metrics file:

```sh
    $ dvc repro data/evaluation.txt

    Reproducing run command for data item data/matrix-train.p. Args: python code/featurization.py data/Posts-train.tsv data/Posts-test.tsv data/matrix-train.p data/matrix-test.p
    Reproducing run command for data item data/model.p. Args: python code/train_model.py data/matrix-train.p 20170426 data/model.p
    Reproducing run command for data item data/evaluation.txt. Args: python code/evaluate.py data/model.p data/matrix-test.p data/evaluation.txt
    Data item "data/evaluation.txt" was reproduced.
```

* Take a look at the target metric improvement:

```sh
    $ cat data/evaluation.txt

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
