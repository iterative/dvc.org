# Data and Model Files Versioning

DVC allows storing and versioning source data files, ML models, intermediate
results with Git, without checking the file contents into Git. It is useful
when dealing with files that are too large for Git to handle. DVC stores
information about your data file in a special `.dvc` file, that has a
description of a file that can be used for versioning. DVC supports various
types of remote locations for your data files and allows you to easily store
and share your data alongside your code.

In this very basic scenario, DVC is a better replacement for `git-lfs` and
ad-hoc scripts on top of Amazon S3 (or name-it cloud) that are usually used to
manage ML artifacts like model files, data files, etc. Unlike `git-lfs`, DVC
is open, free (you are paying only for the remote storage) and does not require
installing a server, can be used on-premise (NAS, SSH, for example) or with any
major cloud provider (S3, Google Could, Azure). 

Let's say you already have a project that uses a bunch of images that are
stored in `images` directory and has a `model.pkl` file - your model file that
is deployed to production. 

```dvc
    $ ls images
    0001.jpg 0002.jpg 0003.jpg 0004.jpg ...

    $ ls
    model.pkl ...
```

To start using dvc and keeping track of a model and images we need first
to initialize it in your repository:

```dvc
    $ dvc init
```

DVC creates a `.dvc` directory that stores special files and also
a `.dvc/cache` directory that will be used to store cache for your data.

```dvc
    $ git status
    
    ...
            new file:   .dvc/.gitignore
	    new file:   .dvc/config
    
    $ git commit -m "Initialize dvc"
```

Start tracking images and models with DVC:

```dvc
    $ dvc add images
    $ dvc add model.pkl
```

Commit your changes:

```dvc
    $ git status
    
    ...
    Untracked files:
        .gitignore
        images.dvc
	model.pkl.dvc
    
    $ git add .gitignore images.dvc model.pkl.dvc
    $ git commit -m "track images and models with dvc"
```

To share your data with others you need to setup a remote repository.
DVC supports a variety of remote types (see `dvc remote`) but for this
example let's use AWS S3 remote to store your cache. To add your S3
repository and set it as a default one run:

```dvc
    $ dvc remote add -d myremote s3://mybucket/mycache
    Setting 'myremote' as a default remote.
```

This will add `myremote` to your `.dvc/config`. Commit your changes and push
your code:

```dvc
    $ git add .dvc/config
    $ git push
```

Now, to upload your cache use:

```dvc
    $ dvc push
    
    (1/5): [##############################] 100% 3caf879afa11fc750cac4e15721a8741
    (2/5): [##############################] 100% f83c01a5634a9e7b8a04177a5533f67b
    (3/5): [##############################] 100% 2579801f17b00b0014d4e2a4847e3064.dir
    (4/5): [##############################] 100% 82986e112ecefabbcfbaf960e2c8fb36
    (5/5): [##############################] 100% 18d51187e9602848514499047bb6de7f
```

In order for your collagues to obtain the cache, they will simply need to run:

```dvc
   $ git pull
   $ dvc pull
   
   (1/5): [##############################] 100% 3caf879afa11fc750cac4e15721a8741
   (2/5): [##############################] 100% f83c01a5634a9e7b8a04177a5533f67b
   (3/5): [##############################] 100% 2579801f17b00b0014d4e2a4847e3064.dir
   (4/5): [##############################] 100% 82986e112ecefabbcfbaf960e2c8fb36
   (5/5): [##############################] 100% 18d51187e9602848514499047bb6de7f
```
