# Dataset versioning example

> In this example I will use DVC to version two datasets. I'll delete most of
> the training data from the datasets completely, clear the DVC local cache of
> old versions of the data, and then restore the data from a remote storage. The
> local system I will be using comprises Alpine Linux installed with Python 3
> (available as a [docker image](https://hub.docker.com/_/python)) with
> [numpy](https://numpy.org) installed, DVC with S3 support (via
> `pip install 'dvc[s3]'`), the
> [Amazon AWS CLI tool](https://aws.amazon.com/cli/), and an AWS
> [S3 bucket](https://aws.amazon.com/s3/) serving as the remote storage.

## Set up the project

Two 3D MRI datasets from the [Medical MNIST v2](https://medmnist.com) collection
will be used. These datasets are compressed numpy (`.npz`) files containing a
large number of labelled 28x28x28 3D images. The images are already divided into
train, validation and test subsets, but we will only be concerned with the
training data here. After initialising git and DVC and connecting DVC to an S3
bucket, `curl` can be used to download the
[Adrenal and Fracture 3D datasets](https://arxiv.org/abs/2110.14795). .

```dvc
$ mkdir mnist3d; cd mnist3d
$ git init
$ dvc init
$ dvc remote add s3cache s3://mikemayobucket/mnist3d_cache/
$ mkdir datasets
$ curl https://zenodo.org/record/5208230/files/adrenalmnist3d.npz --output datasets/adrenalmnist3d.npz
$ curl https://zenodo.org/record/5208230/files/fracturemnist3d.npz --output datasets/fracturemnist3d.npz
$ echo datasets > .gitignore
$ dvc add datasets
```

We will need a couple of python scripts as well. The first will display
information about the data (just the shape of the training data) and the second
will change the data by performing a resampling operation (e.g. because we
decided that we only need 100 3D MRIs for training a model). Note that the
second script saves the dataset to a file with the same name as it originally
came from. Thus, in a non-versioned system, the original data files would be
overwritten and lost. But since we are using DVC, these files will be versioned
for us.

Both scripts should be placed in the `mnist3d` folder created above. Code for
`train_shape.py`:

```python
import glob
import numpy as np
for dataset_filename in glob.glob("datasets/*"):
    dataset=np.load(dataset_filename)
    print(dataset_filename,dataset["train_images"].shape)
```

Code for `train_resample.py`:

```python
import glob
import numpy as np
for dataset_filename in glob.glob("datasets/*"):
    dataset=np.load(dataset_filename)
    perm=np.random.permutation(len(dataset["train_images"]))[:100]
    np.savez_compressed(dataset_filename,
        train_images=dataset["train_images"][perm],
        train_labels=dataset["train_labels"][perm],
        val_images=dataset["val_images"],
        val_labels=dataset["val_labels"],
        test_images=dataset["test_images"],
        test_labels=dataset["test_labels"]
    )
```

With these files properly set up, the project can be committed using git and the
files tracked by DVC can be pushed to the remote storage:

```dvc
$ git add .dvc/config .gitignore datasets.dvc *.py
$ git commit -m "initial commit"
$ dvc push -r s3cache
$ dvc commit
```

## Modifying the datasets

Now let's run both of those scripts:

```dvc
$ python train_shape.py
datasets/fracturemnist3d.npz (1027, 28, 28, 28)
datasets/adrenalmnist3d.npz (1188, 28, 28, 28)
$ python train_resample.py
$ python train_shape.py
datasets/fracturemnist3d.npz (100, 28, 28, 28)
datasets/adrenalmnist3d.npz (100, 28, 28, 28)
```

Having modified the datasets, let's commit the changes:

```dvc
$ dvc commit
$ dvc push -r s3cache
```

DVC projects by default have a local cache which can be found in `.dvc/cache/`.
We have also set up a remote storage in our S3 bucket. While we have been
explicitly pushing changes out to the remote storage using `dvc push`, DVC has
also been updating the local cache behind the scenes.

Let's take a look at the local cache, then:

```dvc
$ ls -R .dvc/cache/
.dvc/cache/:
0b  3b	40  4b	6a  bb
.dvc/cache/0b:
d966942f566224ace014c03e18e06c.dir
.dvc/cache/3b:
0be6a0767165ff41569bed711a08fc.dir
.dvc/cache/40:
aa56cc28d50937abdcc10b540f0403
.dvc/cache/4b:
9053b610a5a8321964a6c129f01bdc
.dvc/cache/6a:
a7b0143a6b42da40027a9dda61302f
.dvc/cache/bb:
d3c5a5576322bc4cdfea780653b1ce
```

We can see from this directory listing that the local cache has _six_ objects
stored in it. Two of those objects represent directories, as indicated by the
`.dir` extension to the object name.

This makes sense, since so far DVC has seen two versions of the `datasets`
directory, one version of the directory with the larger files and the other
version with smaller files. In both cases, the directories contained exactly two
files.

The following figure visualises the way the datasets directory is represented in
the local and remote storages:

![Data in project and remote storage](/img/directories_and_caches.png)

Let's leave all of these objects on the remote storage, so the remote storage
will become effectively our "backup".

Our local system, on the other hand, may not have a great deal of available
space for storing the large older versions of the data. Ideally, the local cache
should only store the current version of the data.

Fortunately, we can clean up the local cache with DVC's garbage collection
command `dvc gc`. Let's run that command and then look at the local cache:

```dvc
$ dvc gc --workspace
$ ls -R .dvc/cache/
.dvc/cache/:
0b  3b	40  4b	6a  bb
.dvc/cache/0b:
.dvc/cache/3b:
0be6a0767165ff41569bed711a08fc.dir
.dvc/cache/40:
aa56cc28d50937abdcc10b540f0403
.dvc/cache/4b:
9053b610a5a8321964a6c129f01bdc
.dvc/cache/6a:
.dvc/cache/bb:
```

The output of the `ls` command shows that after garbage collection only three
files remain in the local cache. We can confirm that these local objects are the
most recent versions by running `train_shape.py` and checking the training data
size:

```dvc
$ python train_shape.py
datasets/fracturemnist3d.npz (100, 28, 28, 28)
datasets/adrenalmnist3d.npz (100, 28, 28, 28)
$ git add datasets.dvc ; git commit -m "resampled training data" ; dvc commit
```

## Reverting the datasets

While the original larger versions of the `.npz` files no longer exist on our
local PC, we did push them to the remote storage earlier on and are usig the
remote storage as a backup.

Let's now revert the files back to what they were before we resampled them.

We will first of all need to run `git log` and find the hashcode for the commit
that we initially did. Once we have the hash code (which will be different on
your system) we can then checkout the earlier version of `datasets.dvc` from
that commit, and pull the original versions of the datasets back into the local
cache using `dvc pull`:

```dvc
$ git checkout <hash code of initial commit> -- datasets.dvc datasets.dvc
$ dvc pull -r s3cache
$ dvc gc --workspace
$ python train_shape.py
datasets/fracturemnist3d.npz (1027, 28, 28, 28)
datasets/adrenalmnist3d.npz (1188, 28, 28, 28)
$ git commit -m "restored data" ; dvc commit
```

A final run of `train_shape.py` confirms that the original datasets are back in
the workspace, so the earlier versions have been correctly restored.
