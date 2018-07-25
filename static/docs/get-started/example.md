# Example

To show DVC in action, let's play with an actual machine learning scenario.
Let's explore the natural language processing (NLP) problem of predicting tags
for a given StackOverflow question. For example, we want one classifier which
can predict a post that is about the Java language by tagging it "Java".

First, let's download the model code and set up the Git repository:

```dvc
    $ mkdir myrepo
    $ cd myrepo
    $ wget https://dvc.org/s3/so/code.tgz
    $ tar zxf code.tgz && rm -f code.tgz
    $ pip install -U -r code/requirements.txt
    $ git init
    $ git add code/
    $ git commit -m 'Download code'
```

The full pipeline can be built by running the code below:

* Initialize DVC repository (in your Git repository):

```dvc
    $ dvc init
```

* Download a file to the data/ directory and add it to dvc.

```dvc
    $ mkdir data
    $ cd data
    $ wget https://dvc.org/s3/so/25K/Posts.xml.tgz
    $ dvc add Posts.xml.tgz
```

* Extract XML from the archive.

```dvc
    $ dvc run -d data/Posts.xml.tgz -o data/Posts.xml tar zxf data/Posts.xml.tgz
```

* Prepare the data.

```dvc
    $ dvc run -d code/xml_to_tsv.py -d data/Posts.xml -o data/Posts.tsv \
          python code/xml_to_tsv.py data/Posts.xml data/Posts.tsv
```

* Split training and testing dataset. Two output files.

```dvc
    # 0.33 - test dataset split ratio. 20170426 is a seed for randomization.
    $ dvc run -d code/split_train_test.py -d data/Posts.tsv \
              -o data/Posts-train.tsv -o data/Posts-test.tsvpython \
          code/split_train_test.py data/Posts.tsv 0.33 20170426 \
                       data/Posts-train.tsv data/Posts-test.tsv
```

* Extract features from the data. Two TSV as inputs with two pickle matrices as
outputs.

```dvc
    $ dvc run -d code/featurization.py -d data/Posts-train.tsv \
              -d data/Posts-test.tsv \
	      -o data/matrix-train.p -o data/matrix-test.p \
	  python code/featurization.py data/Posts-train.tsv \
                 data/Posts-test.tsv data/matrix-train.p data/matrix-test.p
```

* Train ML model on the training dataset. 20170426 is another seed value.

```dvc
    $ dvc run -d code/train_model.py -d data/matrix-train.py -o data/model.py \
          python code/train_model.py data/matrix-train.p 20170426 data/model.p
```

* Evaluate the model on the test dataset.

```dvc
    $ dvc run -d code/evaluate.py -d data/model.py \
	      -d data/matrix-test.p -o data/evaluation.txt \
     python code/evaluate.py data/model.p data/matrix-test.p data/evaluation.txt
```

* Get the result.

```dvc
    $ cat data/evaluation.txt
    AUC: 0.596182
```

All steps could be automatically and efficiently reproduced even if some source
files have been modified. For example:

* Let's improve the feature extraction algorithm by making some modification to
the `code/featurization.py`:

```dvc
    $ vi code/featurization.py
```

Specify ngram parameter in CountVectorizer (lines 50–53) and increase number of features to 6000:
```
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
    $ dvc repro evaluation.txt.dvc
```

* Take a look at the target metric improvement:

```dvc
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
