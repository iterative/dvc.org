# Example: Versioning

To show how DVC can be used to manage and version control machine learning
models and data sets, let's play with a
[tutorial](https://blog.keras.io/building-powerful-image-classification-models-using-very-little-data.html)
that
[François Chollet](https://twitter.com/fchollet) put together to show how to
build a powerful image classifier, using only a small data set. The goal of this
example is to give you some hands-on experience with a very basic scenario -
working with different versions of data sets and ML models.

The specific algorithm that is used to train and validate the classifier is not
important. No prior knowledge is required about Keras. We reuse the
[script](https://gist.github.com/fchollet/f35fbc80e066a49d65f1688a7e99f069) (it
goes along the blog post) in a "black box" way - it takes some data and produces
a model file. We though would highly recommend reading the
[post](https://blog.keras.io/building-powerful-image-classification-models-using-very-little-data.html)
itself since it's a great demonstration on how a general pre-trained model can
be leveraged to build a model with a great performance with very limited
resources.

## Preparation

If DVC is not installed, please follow the [instruction](/doc/get-started/install)
to install it.

Okay, let's first download the code and set up a Git repository. This step has
nothing to do with DVC so far, it's just a simple preparation:

```dvc
    $ git clone https://github.com/iterative/example-versioning.git
    $ cd example-versioning
```

(Optional) It's highly recommended to initialize a virtual environment to keep
your global packages clean and untouched:

```dvc
    $ virtualenv --system-site-packages .env
    $ source .env/bin/activate
```

<details>

### Expand to learn more about DVC internals

Repository you cloned is already DVC-initialized. There should be `.dvc`
directory with `config`, `.gitignore` files. These files and directories are
hidden from a user in general and a user does not interact with these files
directly. Check
[DVC Files and Directories](/doc/user-guide/dvc-files-and-directories)
to learn more.

</details>

## First model version

Let's now add some data, then train the first model and capture it with DVC,
including input data set and metrics.

```dvc
    $ wget -q -O - https://dvc.org/s3/examples/versioning/data.tgz | tar -xzvf -
```

This command downloads and extracts our initial data set - 1000 labeled images
of cats and dogs and 400 labeled images to validate. In summary, this is how
directory structure looks like:

```sh
   data/
       train/
           dogs/
               dog.1.jpg
               ...
               dog.500.jpg
           cats/
               cat.1.jpg
               ...
               cat.500.jpg
       validation/
           dogs/
               dog.1001.jpg
               ...
               dog.1400.jpg
           cats/
               cat.1001.jpg
               ...
               cat.1400.jpg
```

Let's capture the current state of this data set with `dvc add`:

```dvc
    $ dvc add data
```

This command should be used instead of `git add` on files or directories that
are too large to be put into Git. Usually, input data sets, models, some
intermediate results, etc. It tells Git to ignore the directory and puts it
into the DVC cache (of course, it keeps a link to it in the working tree, so you
can continue working with it the same way as before). Instead, it creates a
simple human readable meta-file that can be considered as a pointer to the
cache.

Next, we run the training with `python train.py`. We picked this example and
data sets to be small enough to be run on your machine in a reasonable amount of
time (a few minutes to train a model). This command produces a bunch of files,
among them `model.h5` and `metrics.json` - weights of the trained model and
metrics history. The simplest way to capture the current version of the model is
to use `dvc add` again:

```dvc
    $ python train.py
    $ dvc add model.h5
```

The recommended way of capturing script outputs is using `dvc run`. We'll touch
it a little bit later. For now, let's commit the current state:

```dvc
    $ git add .gitignore model.h5.dvc data.dvc metrics.json
    $ git commit -m "model first version, 1000 images"
    $ git tag -a "v1.0" -m "v1.0"
```

<details>

### Expand to learn more about DVC internals

As we mentioned briefly, DVC do not commit `data` directory and `model.h5` file
into git, `dvc add` pushed them into the DVC cache and added to the
`.gitignore`. Instead, we commit `.dvc` meta-files that serve as pointers to the
cache (usually, a `.dvc/cache` directory inside the repository) where actual
data resides.

In this case we created `data.dvc` and `model.h5.dvc` files. Check the
[DVC file format](/doc/user-guide/dvc-file-format) to learn more about how these
files are organized.

</details>

## Second model version

Let's imagine that our images data set is growing, we were able to double it:

```dvc
    $ wget -q -O - https://dvc.org/s3/examples/versioning/new-labels.tgz | tar -xzvf -
```

For simplicity we keep the validation data set the same. Now our data set should
look like this:

```sh
   data/
       train/
           dogs/
               dog.1.jpg
               ...
               dog.1000.jpg
           cats/
               cat.1.jpg
               ...
               cat.1000.jpg
       validation/
           dogs/
               dog.1001.jpg
               ...
               dog.1400.jpg
           cats/
               cat.1001.jpg
               ...
               cat.1400.jpg
```

Of course, we want to leverage these new labels and train the model again.

```dvc
    $ dvc add data
    $ dvc remove model.h5.dvc
    $ python train.py
    $ dvc add model.h5
```

Note! `dvc remove` is required, otherwise `python train.py` will overwrite the
existing file and may corrupt the cached version. Check this
[guide](/doc/user-guide/update-tracked-file) to learn more.

Let's commit the second version:

```dvc
    $ git add model.h5.dvc data.dvc metrics.json
    $ git commit -m "model second version, 2000 images"
    $ git tag -a "v2.0" -m "v2.0"
```

That's it, we have a second model and data set saved and pointers to them
committed into git. Let's now see how DVC can help to go back to the previous
version if we need to.

## Switching between versions

Operation that helps getting the specific committed version of data is designed
to be similar to Git. In Git (or any other code version control system) when you
need to get to a previous committed version of code you run `git checkout`. All
we need to do in our case is to run additionally `dvc checkout` to get the right
data to the working space:

```dvc
    $ git checkout v1.0
    $ dvc checkout
```

These commands will restore the working tree to the first snapshot we made -
code, data files, model. DVC optimizes this operation internally to avoid
copying data or model files each time. So `dvc checkout` is quick even if you
have large data sets, data files, or model.

<details>

### Expand to learn more about DVC internals

As we have learned already, DVC keeps data files out of Git (by adjusting
`.gitignore`) and puts them into the cache (usually it's a `.dvc/cache`
directory inside the repository). Instead, DVC creates simple meta-files that
have `.dvc` extension. These meta-files serve as pointers (`md5` hash) to
to the cache and are version controlled by Git.

When we run `git checkout` we restore pointers (or meta-files) first, then
when we run `dvc checkout` we use these pointers to put the right data into
the right place.

</details>

## Automating the workflow

`dvc add` is a perfectly reasonable choice when you need to keep track of
different versions of data sets or model files that come and are updated from
external sources. `data` directory above with cats and dogs images is a good
example (just don't forget to run `dvc remove` when you need to
[modify or replace](/doc/user-guide/update-tracked-file) a file that is under
DVC control).

On the other hand, there are files that are result of running some code. In our
example, you should have noticed, that `train.py` produces binary files (e.g.
`bottlneck_features_train.npy`), the model file `model.h5`, and the metric file
`metrics.json`. When you have a script that takes some data as an input and
produces other data files, a better way to capture them is to use `dvc run`:

```dvc
    $ dvc remove -p model.h5.dvc
    $ dvc run -f Dvcfile \
              -d train.py -d data \
              -M metrics.json \
              -o model.h5 -o bottleneck_features_train.npy -o bottleneck_features_validation.npy \
              python train.py
```

Similar to `dvc add`, `dvc run` creates a single DVC file (`Dvcfile` in this
case, specified by the `-f` option). It puts all outputs (`-o`) under DVC
control the same was as `dvc add` does. Unlike, `dvc add`, `dvc run` also tracks
dependencies (`-d`) and the command (`python train.py`) that was run to produce
the result.

`dvc repro` runs `Dvcfile` when some dependencies changed (for example, we added
new images like we did when we built the second model version). It also updates
outputs and puts them into the cache.

If `dvc add` and `dvc checkout` provide a basic mechanism to version control
large data files or models, `dvc run` and `dvc repro` provide a build system for
ML models, which would similar to makefiles in software engineering.

## What's next?

In this example our focus was on giving you a hands-on experience on ML models
and data sets versioning. We specifically focused on `dvc add` and `dvc
checkout` commands. Here we would like to outline some next topics and ideas
you would be interested to try to learn more about DVC and it makes managing ML
projects simpler.

First of all, you should have probably noticed that the script that trains a
model is written in a monolithic way. It runs the `save_bottleneck_feature`
function to pre-calculate bottom, "frozen" part of the net every time it is run.
Features are written into files, and intention probably was that the
`save_bottleneck_feature` can be commented out after the first run. It's not
very convenient to remember to comment/uncomment it every time data set is
changed.

Here where DVC pipelines feature comes very handy and was designed for. We
touched it briefly when we described `dvc run` and `dvc repro` at the very
end. Next step here would be splitting the script into two steps and utilize
DVC pipelines. Check this [example](/doc/get-started/example-pipeline) to get
a hands-on experience with them and try to apply it here. Don't hesitate to join
our [community](/chat) to ask any questions!

Another thing, you should have noticed, is the metrics file - `metrics.json`
and the way we captured it with `-M metrics.json` option. Metric file is a
special type of output DVC provides an interface on top to compare across tags
or branches. Check `dvc metrics` command and
[Compare Experiments](/doc/get-started/compare-experiments) to learn more about
managing metrics. Next step you should try on your own is converting both
iterations we had into `dvc run` and then utilize `dvc metrics show` to compare
them.


