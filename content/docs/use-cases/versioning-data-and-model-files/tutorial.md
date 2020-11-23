---
title: 'Tutorial: Data and Model Versioning'
description: 'Get hands-on experience with data versioning in a basic machine
learning version control scenario: managing multiple datasets and ML models
using DVC.'
---

# Tutorial: Data and Model Versioning

The goal of this example is to give you some hands-on experience with a basic
machine learning version control scenario: managing multiple datasets and ML
models using DVC. We'll work with a
[tutorial](https://blog.keras.io/building-powerful-image-classification-models-using-very-little-data.html)
that [François Chollet](https://twitter.com/fchollet) put together to show how
to build a powerful image classifier using a pretty small dataset.

![](/img/cats-and-dogs.jpg) _Dataset to classify cats and dogs_

> We highly recommend reading François' tutorial itself. It's a great
> demonstration of how a general pre-trained model can be leveraged to build a
> new high-performance model, with very limited resources.

We first train a classifier model using 1000 labeled images, then we double the
number of images (2000) and retrain our model. We capture both datasets and
classifier results and show how to use `dvc checkout` to switch between
<abbr>workspace</abbr> versions.

The specific algorithm used to train and validate the classifier is not
important, and no prior knowledge of Keras is required. We'll reuse the
[script](https://gist.github.com/fchollet/f35fbc80e066a49d65f1688a7e99f069) from
the original blog post as a _black box_ – it takes some data and produces a
model file.

## Preparation

> We have tested our tutorials and examples with Python 3. We don't recommend
> using earlier versions.

You'll need [Git](https://git-scm.com/) to run the commands in this tutorial.
Also, if DVC is not installed, please follow these [instructions](/doc/install)
to do so.

> If you're using Windows, please review
> [Running DVC on Windows](/doc/user-guide/running-dvc-on-windows) for important
> tips to improve your experience.

Okay! Let's first download the code and set up a Git repository:

```dvc
$ git clone https://github.com/iterative/example-versioning.git
$ cd example-versioning
```

This command pulls a <abbr>DVC project</abbr> with a single script `train.py`
that will train the model.

Let's now install the requirements. But before we do that, we **strongly**
recommend creating a
[virtual environment](https://python.readthedocs.io/en/stable/library/venv.html):

```dvc
$ python3 -m venv .env
$ source .env/bin/activate
$ pip install -r requirements.txt
```

<details>

### Expand to learn about DVC internals

The repository you cloned is already DVC-initialized. It already contains a
`.dvc/` directory with the `config` and `.gitignore` files. These and other
files and directories are hidden from user, as typically there's no need to
interact with them directly. See
[DVC Files and Directories](/doc/user-guide/dvc-files-and-directories) to learn
more.

</details>

## First model version

Now that we're done with preparations, let's add some data and then train the
first model. We'll capture everything with DVC, including the input dataset and
model [metrics](/doc/command-reference/metrics).

```dvc
$ dvc get https://github.com/iterative/dataset-registry \
          tutorial/ver/data.zip
$ unzip -q data.zip
$ rm -f data.zip
```

> `dvc get` can download any file or directory tracked in a <abbr>DVC
> repository</abbr> (and [stored remotely](/doc/command-reference/remote)). It's
> like `wget`, but for DVC or Git repos. In this case we use our
> [dataset registry](https://github.com/iterative/dataset-registry) repo as the
> data source (refer to [Data Registries](/doc/use-cases/data-registries) for
> more info.)

This command downloads and extracts our raw dataset, consisting of 1000 labeled
images for training and 800 labeled images for validation. In total, it's a 43
MB dataset, with a directory structure like this:

```bash
data
├── train
│   ├── dogs
│   │   ├── dog.1.jpg
│   │   ├── ...
│   │   └── dog.500.jpg
│   └── cats
│       ├── cat.1.jpg
│       ├── ...
│       └── cat.500.jpg
└── validation
   ├── dogs
   │   ├── dog.1001.jpg
   │   ├── ...
   │   └── dog.1400.jpg
   └── cats
       ├── cat.1001.jpg
       ├── ...
       └── cat.1400.jpg
```

_(Who doesn't love ASCII directory art?)_

Let's capture the current state of this dataset with `dvc add`:

```dvc
$ dvc add data
```

You can use this command instead of `git add` on files or directories that are
too large to be tracked with Git: usually input datasets, models, some
intermediate results, etc. It tells Git to ignore the directory and puts it into
the <abbr>cache</abbr> (while keeping a
[file link](/doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache)
to it in the <abbr>workspace</abbr>, so you can continue working the same way as
before). This is achieved by creating a simple human-readable
[DVC-file](/doc/user-guide/dvc-files-and-directories) that serves as a pointer
to the cache.

Next, we train our first model with `train.py`. Because of the small dataset,
this training process should be small enough to run on most computers in a
reasonable amount of time (a few minutes). This command <abbr>outputs</abbr> a
bunch of files, among them `model.h5` and `metrics.csv`, weights of the trained
model, and [metrics](/doc/command-reference/metrics) history. The simplest way
to capture the current version of the model is to use `dvc add` again:

```dvc
$ python train.py
$ dvc add model.h5
```

> We manually added the model output here, which isn't ideal. The preferred way
> of capturing command outputs is with `dvc run`. More on this later.

Let's commit the current state:

```dvc
$ git add data.dvc model.h5.dvc metrics.csv .gitignore
$ git commit -m "First model, trained with 1000 images"
$ git tag -a "v1.0" -m "model v1.0, 1000 images"
```

<details>

### Expand to learn more about DVC internals

As we mentioned briefly, DVC does not commit the `data/` directory and
`model.h5` file with Git. Instead, `dvc add` stores them in the
<abbr>cache</abbr> (usually in `.dvc/cache`) and adds them to `.gitignore`. We
then `git commit` DVC-files that contain file hashes that point to cached data.

In this case we created `data.dvc` and `model.h5.dvc`. Refer to
[DVC Files](/doc/user-guide/dvc-files-and-directories) to learn more about how
these files work.

</details>

> Note that executing `train.py` produced other intermediate files. This is OK,
> we will use them later.
>
> ```dvc
> $ git status
> ...
>       bottleneck_features_train.npy
>       bottleneck_features_validation.npy`
> ```

## Second model version

Let's imagine that our image dataset doubles in size. The next command extracts
500 new cat images and 500 new dog images into `data/train`:

```dvc
$ dvc get https://github.com/iterative/dataset-registry \
          tutorial/ver/new-labels.zip
$ unzip -q new-labels.zip
$ rm -f new-labels.zip
```

For simplicity's sake, we keep the validation subset the same. Now our dataset
has 2000 images for training and 800 images for validation, with a total size of
67 MB:

```bash
data
├── train
│   ├── dogs
│   │   ├── dog.1.jpg
│   │   ├── ...
│   │   └── dog.1000.jpg
│   └── cats
│       ├── cat.1.jpg
│       ├── ...
│       └── cat.1000.jpg
└── validation
   ├── dogs
   │   ├── dog.1001.jpg
   │   ├── ...
   │   └── dog.1400.jpg
   └── cats
       ├── cat.1001.jpg
       ├── ...
       └── cat.1400.jpg
```

We will now want to leverage these new labels and retrain the model:

```dvc
$ dvc add data
$ python train.py
$ dvc add model.h5
```

Let's commit the second version:

```dvc
$ git add data.dvc model.h5.dvc metrics.csv
$ git commit -m "Second model, trained with 2000 images"
$ git tag -a "v2.0" -m "model v2.0, 2000 images"
```

That's it! We've tracked a second version of the dataset, model, and metrics in
DVC and committed the DVC-files that point to them with Git. Let's now look at
how DVC can help us go back to the previous version if we need to.

## Switching between workspace versions

The DVC command that helps get a specific committed version of data is designed
to be similar to `git checkout`. All we need to do in our case is to
additionally run `dvc checkout` to get the right data into the
<abbr>workspace</abbr>.

![](/img/versioning.png)

There are two ways of doing this: a full workspace checkout or checkout of a
specific data or model file. Let's consider the full checkout first. It's pretty
straightforward:

```dvc
$ git checkout v1.0
$ dvc checkout
```

These commands will restore the workspace to the first snapshot we made: code,
data files, model, all of it. DVC optimizes this operation to avoid copying data
or model files each time. So `dvc checkout` is quick even if you have large
datasets, data files, or models.

On the other hand, if we want to keep the current code, but go back to the
previous dataset version, we can do something like this:

```dvc
$ git checkout v1.0 data.dvc
$ dvc checkout data.dvc
```

If you run `git status` you'll see that `data.dvc` is modified and currently
points to the `v1.0` version of the dataset, while code and model files are from
the `v2.0` tag.

<details>

### Expand to learn more about DVC internals

As we have learned already, DVC keeps data files out of Git (by adjusting
`.gitignore`) and puts them into the <abbr>cache</abbr> (usually it's a
`.dvc/cache` directory inside the repository). Instead, DVC creates
[DVC-files](/doc/user-guide/dvc-files-and-directories). These text files serve
as data placeholders that point to the cached files, and they can be easily
version controlled with Git.

When we run `git checkout` we restore pointers (DVC-files) first. Then, when we
run `dvc checkout`, we use these pointers to put the right data in the right
place.

</details>

## Automating capturing

`dvc add` makes sense when you need to keep track of different versions of
datasets or model files that come from source projects. The `data/` directory
above (with cats and dogs images) is a good example.

On the other hand, there are files that are the result of running some code. In
our example, `train.py` produces binary files (e.g.
`bottleneck_features_train.npy`), the model file `model.h5`, and the
[metrics](/doc/command-reference/metrics) file `metrics.csv`.

When you have a script that takes some data as an input and produces other data
<abbr>outputs</abbr>, a better way to capture them is to use `dvc run`:

> If you tried the commands in the
> [Switching between workspace versions](#switching-between-workspace-versions)
> section, go back to the master branch code and data, and remove the
> `model.h5.dvc` file with:
>
> ```dvc
> $ git checkout master
> $ dvc checkout
> $ dvc remove model.h5.dvc
> ```

```dvc
$ dvc run -n train -d train.py -d data \
          -o model.h5 -o bottleneck_features_train.npy \
          -o bottleneck_features_validation.npy -M metrics.csv \
          python train.py
```

`dvc run` writes a pipeline stage named `train` (specified using the `-n`
option) in `dvc.yaml`. It tracks all outputs (`-o`) the same way as `dvc add`
does. Unlike `dvc add`, `dvc run` also tracks dependencies (`-d`) and the
command (`python train.py`) that was run to produce the result.

> At this point you could run `git add .` and `git commit` to save the `train`
> stage and its outputs to the repository.

`dvc repro` will run the `train` stage if any of its dependencies (`-d`)
changed. For example, when we added new images to built the second version of
our model, that was a dependency change. It also updates outputs and puts them
into the <abbr>cache</abbr>.

To make things a little simpler: `dvc add` and `dvc checkout` provide a basic
mechanism for model and large dataset versioning. `dvc run` and `dvc repro`
provide a build system for machine learning models, which is similar to
[Make](https://www.gnu.org/software/make/) in software build automation.

## What's next?

In this example, our focus was on giving you hands-on experience with dataset
and ML model versioning. We specifically looked at the `dvc add` and
`dvc checkout` commands. We'd also like to outline some topics and ideas you
might be interested to try next to learn more about DVC and how it makes
managing ML projects simpler.

First, you may have noticed that the script that trains the model is written in
a monolithic way. It uses the `save_bottleneck_feature` function to
pre-calculate the bottom, "frozen" part of the net every time it is run.
Features are written into files. The intention was probably that the
`save_bottleneck_feature` can be commented out after the first run, but it's not
very convenient having to remember to do so every time the dataset changes.

Here's where the [pipelines](/doc/command-reference/dag) feature of DVC comes in
handy. We touched on it briefly when we described `dvc run` and `dvc repro`. The
next step would be splitting the script into two parts and utilizing pipelines.
See [Data Pipelines](/doc/start/data-pipelines) to get hands-on experience with
pipelines, and try to apply it here. Don't hesitate to join our
[community](/chat) and ask any questions!

Another detail we only brushed upon here is the way we captured the
`metrics.csv` metrics file with the `-M` option of `dvc run`. Marking this
<abbr>output</abbr> as a metric enables us to compare its values across Git tags
or branches (for example, representing different experiments). See `dvc metrics`
and
[Compare Experiments](/doc/tutorials/get-started/experiments#compare-experiments)
to learn more about managing metrics with DVC.
