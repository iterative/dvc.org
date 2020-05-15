# Tutorial: Pipelines

To show DVC in action, let's play with an actual machine learning scenario.
Let's explore the natural language processing
([NLP](https://en.wikipedia.org/wiki/Natural_language_processing)) problem of
predicting tags for a given StackOverflow question. For example, we want a
classifier that can predict posts about the Python language by tagging them
`python`. (This is a short version of the
[Deep Dive Tutorial](/doc/tutorials/deep).)

In this example, we will focus on building a simple ML
[pipeline](/doc/command-reference/pipeline) that takes an archive with
StackOverflow posts and trains the prediction model and saves it as an
<abbr>output</abbr>. See [Get Started](/doc/tutorials/get-started) to see links
to other examples, tutorials, use cases if you want to cover other aspects of
the DVC. The pipeline itself is a sequence of transformation we apply to the
data file:

![](/img/example-flow-2x.png)

DVC helps to describe these transformations and capture actual data involved -
input dataset we are processing, intermediate results (useful if some
transformations take a lot of time to run), output models. This way we can
capture what data and code were used to produce a specific model in a sharable
and reproducible way.

## Preparation

> We have tested our tutorials and examples with Python 3. We don't recommend
> using earlier versions.

You'll need [Git](https://git-scm.com) to run the commands in this tutorial.
Also, if DVC is not installed, please follow these [instructions](/doc/install)
to do so.

> If you're using Windows, please review
> [Running DVC on Windows](/doc/user-guide/running-dvc-on-windows) for important
> tips to improve your experience.

Okay! Let's first download the code and set up a Git repository:

```dvc
$ mkdir example-pipeline && cd example-pipeline
$ git init
$ dvc get https://github.com/iterative/dataset-registry \
          tutorial/nlp/pipeline.zip
$ unzip pipeline.zip
$ rm -f pipeline.zip
$ git add code/
$ git commit -m "Download and add code to new Git repo"
```

> `dvc get` can use any <abbr>DVC repository</abbr> to find the appropriate
> [remote storage](/doc/command-reference/remote) and download <abbr>data
> artifacts</abbr> from it (analogous to `wget`, but for repositories). In this
> case we use [dataset-registry](https://github.com/iterative/dataset-registry))
> as the source repo. (Refer to
> [Data Registries](/doc/use-cases/data-registries) for more info about this
> setup.)

Now let's install the requirements. But before we do that, we **strongly**
recommend creating a
[virtual environment](https://packaging.python.org/tutorials/installing-packages/#creating-virtual-environments):

```dvc
$ virtualenv -p python3 .env
$ echo ".env/" >> .gitignore
$ source .env/bin/activate
$ pip install -r code/requirements.txt
```

Next, we will create a [pipeline](/doc/command-reference/pipeline) step-by-step,
utilizing the same set of commands that are described in earlier
[Get Started](/doc/tutorials/get-started) chapters.

> Note that its possible to define more than one pipeline in each DVC project.
> This will be determined by the interdependencies between DVC-files, mentioned
> below.

Initialize <abbr>DVC repository</abbr> (run it inside your Git repo):

```dvc
$ dvc init
$ git add .
$ git commit -m "Initialize DVC project"
```

Download an input dataset to the `data/` directory and take it under DVC
control:

```dvc
$ mkdir data
$ dvc get https://github.com/iterative/dataset-registry \
          tutorial/nlp/Posts.xml.zip -o data/Posts.xml.zip
$ dvc add data/Posts.xml.zip
```

When we run `dvc add` `Posts.xml.zip`, DVC creates a
[DVC-file](/doc/user-guide/dvc-file-format).

<details>

### Expand to learn about DVC internals

At DVC initialization, a new `.dvc/` directory is created for internal
configuration and <abbr>cache</abbr>
[files and directories](/doc/user-guide/dvc-files-and-directories), that are
hidden from the user. This directory is automatically staged with `git add`, so
it can be easily committed with Git.

Note that the DVC-file created by `dvc add` has no dependencies, a.k.a. an
_orphan_ [stage file](/doc/command-reference/run):

```yaml
md5: c183f094869ef359e87e68d2264b6cdd
wdir: ..
outs:
  - md5: ce68b98d82545628782c66192c96f2d2
    path: data/Posts.xml.zip
    cache: true
    metric: false
    persist: false
```

This file can be committed with Git instead of the data file itself.

The data file `Posts.xml.zip` is linked (or copied) from
`.dvc/cache/ce/68b98d82545628782c66192c96f2d2`, and added to `.gitignore`. Even
if you remove it from the workspace, or `git checkout` a different commit, the
data is not lost if a corresponding DVC-file is committed. It's enough to run
`dvc checkout` or `dvc pull` to restore data files.

</details>

Commit the changes with Git:

```dvc
$ git add data/.gitignore data/Posts.xml.zip.dvc
$ git commit -m "Add dataset archive to project"
```

## Define stages

Each [stage](/doc/command-reference/run) – the parts of a
[pipeline](/doc/command-reference/pipeline) – is described by providing a
command to run, input data it takes and a list of <abbr>outputs</abbr>. DVC is
not Python or any other language specific and can wrap any command runnable via
CLI.

The first stage is to extract XML from the archive. Note that we don't need to
run `dvc add` on `Posts.xml` below, `dvc run` saves the data automatically
(commits into the <abbr>cache</abbr>, tracks the file with DVC):

```dvc
$ dvc run -d data/Posts.xml.zip \
          -o data/Posts.xml \
          -f extract.dvc \
          unzip data/Posts.xml.zip -d data
```

Similarly to `dvc add`, `dvc run` creates a stage file (a DVC-file with
dependencies).

<details>

### Expand to learn more about DVC internals

Here's what the `extract.dvc` stage file looks like:

```yaml
md5: c4280355ffe277571c1b7aa8a43d8107
cmd: unzip data/Posts.xml.zip -d data
wdir: .
deps:
  - md5: ce68b98d82545628782c66192c96f2d2
    path: data/Posts.xml.zip
outs:
  - md5: a304afb96060aad90176268345e10355
    path: data/Posts.xml
    cache: true
    metric: false
    persist: false
```

Just like the DVC-file we created earlier with `dvc add`, this stage file uses
`md5` hashes (that point to the cache) to describe and version control
dependencies and outputs. Output `data/Posts.xml` file is saved as
`.dvc/cache/a3/04afb96060aad90176268345e10355` and linked (or copied) to the
workspace, as well as added to `.gitignore`.

Two things are worth noticing here. First, by analyzing dependencies and outputs
that DVC-files describe, we can restore the full series of commands (pipeline
stages) we need to apply. This is important when you run `dvc repro` to
regenerate the final or intermediate result.

Second, hopefully it's clear by now that the actual data is stored in the
`.dvc/cache` directory, each file having a name based on an `md5` hash. This
cache is similar to Git's
[objects database](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects),
but made specifically to handle large data files.

> Note that for performance with large datasets, DVC can use file links from the
> cache to the workspace. This avoids copying actual file contents. Refer to
> [File link types](/doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache)
> to learn which alternatives exist and how to enable them.

</details>

Let's convert XML into TSV to make feature extraction easier:

```dvc
$ dvc run -d code/xml_to_tsv.py -d data/Posts.xml -o data/Posts.tsv \
          -f prepare.dvc \
          python code/xml_to_tsv.py data/Posts.xml data/Posts.tsv
```

Next, split training and test datasets. Here `0.2` is a test dataset split
ratio, `20170426` is a seed for randomization. There are two output files:

```dvc
$ dvc run -d code/split_train_test.py -d data/Posts.tsv \
          -o data/Posts-train.tsv -o data/Posts-test.tsv \
          -f split.dvc \
          python code/split_train_test.py \
                 data/Posts.tsv 0.2 20170426 \
                 data/Posts-train.tsv data/Posts-test.tsv
```

Now, extract features and labels from the data. Two TSV as inputs with two
pickle matrices as outputs:

```dvc
$ dvc run -d code/featurization.py \
          -d data/Posts-train.tsv -d data/Posts-test.tsv \
          -o data/matrix-train.pkl -o data/matrix-test.pkl \
          -f featurize.dvc \
          python code/featurization.py \
                 data/Posts-train.tsv data/Posts-test.tsv \
                 data/matrix-train.pkl data/matrix-test.pkl
```

Then, train a ML model on the training dataset. 20170426 is a seed value here:

```dvc
$ dvc run -d code/train_model.py -d data/matrix-train.pkl \
          -o data/model.pkl \
          -f train.dvc \
          python code/train_model.py data/matrix-train.pkl \
                 20170426 data/model.pkl
```

Finally, evaluate the model on the test dataset and get the
[metric](/doc/command-reference/metrics) file:

```dvc
$ dvc run -d code/evaluate.py -d data/model.pkl \
          -d data/matrix-test.pkl -M auc.metric \
          -f evaluate.dvc \
          python code/evaluate.py data/model.pkl \
                 data/matrix-test.pkl auc.metric
```

<details>

### Expand to learn more about DVC internals

By analyzing dependencies and outputs in DVC-files, we can generate a dependency
graph: a series of commands DVC needs to execute. `dvc repro` does this in order
to restore a pipeline and reproduce its intermediate or final results.

`dvc pipeline show` helps to visualize pipelines (run it with the `-c` option to
see actual commands instead of DVC-files):

```dvc
$ dvc pipeline show --ascii evaluate.dvc
       +------------------------+
       | data/Posts.xml.zip.dvc |
       +------------------------+
                    *
                    *
                    *
            +-------------+
            | extract.dvc |
            +-------------+
                    *
                    *
                    *
            +-------------+
            | prepare.dvc |
            +-------------+
                    *
                    *
                    *
              +-----------+
              | split.dvc |
              +-----------+
                    *
                    *
                    *
            +---------------+
            | featurize.dvc |
            +---------------+
             **           ***
           **                **
         **                    **
+-----------+                    **
| train.dvc |                  **
+-----------+                **
             **           ***
               **       **
                 **   **
            +--------------+
            | evaluate.dvc |
            +--------------+
```

</details>

## Check results

An easy way to see metrics across different branches:

```dvc
$ dvc metrics show
  auc.metric: 0.620091
```

> Since the dataset for this example is extremely simplified to make it faster
> to run this pipeline, the exact metric number may vary.

It's time to save our [pipeline](/doc/command-reference/pipeline). You can
confirm that we do not tack files or raw datasets with Git, by using the
`git status` command. We are just saving a snapshot of the DVC-files that
describe data, transformations (stages), and relationships between them.

```dvc
$ git add *.dvc auc.metric data/.gitignore
$ git commit -m "Add tag prediction pipeline (6 stages)"
```

## Reproduce

All stages could be automatically and efficiently reproduced even if any source
code files have been modified. For example, let's improve the feature extraction
algorithm by making some modification to the `code/featurization.py`. Please
open it with a text editor and specify `ngram` parameter in `CountVectorizer`
(lines 72–73):

```python
bag_of_words = CountVectorizer(stop_words='english',
                              max_features=5000,
                              ngram_range=(1, 2))
```

Reproduce all required stages to get to the target
[metric](/doc/command-reference/metrics) file:

```dvc
$ dvc repro evaluate.dvc
WARNING: Dependency 'code/featurization.py' of 'featurize.dvc' changed because it is 'modified'.
WARNING: Stage 'featurize.dvc' changed.
Running command:
	python code/featurization.py ...
```

Once that's done, check the AUC metric again for an improvement:

```dvc
$ dvc metrics show -a
working tree:
	auc.metric: AUC: 0.648462
master:
	auc.metric: AUC: 0.587951
```

> Since the dataset for this example is extremely simplified to make it faster
> to run this pipeline, the exact metric numbers may vary.

The `-a` option above tells `dvc metrics show` to show the metrics value for all
Git branches.

Feel free to commit the remaining changes with Git.

## Conclusion

By wrapping your commands with `dvc run`, it's easy to integrate DVC into a
machine learning or data processing [pipeline](/doc/command-reference/pipeline)
or other data science processes without any significant effort to rewrite your
code.

The key detail to notice is that DVC automatically derives the dependencies
between pipeline [stages](/doc/command-reference/run) by building dependency
graphs that represent data pipelines.

DVC streamlines all of your experiments into a single, reproducible
<abbr>project</abbr>, and it makes it easy to share it with Git, including
dependencies. This collaboration feature provides the ability to review data
science research.
