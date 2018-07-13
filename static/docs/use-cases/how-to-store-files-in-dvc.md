# How To Store Files In DVC

DVC allows storing and versioning files with Git, without checking the file
contents into Git. It is useful when dealing with files that are too large
for Git to handle. DVC stores information about your data file in a special
.dvc file, that has a description of a file that can be used for versioning.
DVC supports various types of remote locations for your cache files and
allows you to easily store and share your data alongside your code.

Let's say you already have a project that uses a bunch of images that are
stored in `assets` directory.

```
    $ ls assets
    favicon-16x16.png favicon-32x32.png favicon.ico social-share.png
```

To start using dvc we need to first initialize it in your repository:

```
    $ dvc init
```

DVC will create a `.dvc` directory that will store special files and also
a `.dvc/cache` directory that will be used to store cache for your data.

```
    $ git status
    ...
            new file:   .dvc/.gitignore
	    new file:   .dvc/config
    $ git commit -m "Initialize dvc"
```

Start tracking assets with dvc:

```
    $ dvc add assets
```

Commit your changes:

```
    $ git status
    ...
    Untracked files:
        .gitignore
        assets.dvc
    $ git add .gitignore assets.dvc
    $ git commit -m "Track assets with dvc"
```

To share your data with others you need to setup ```dvc remote``` repository.
DVC supports a variety of remote types (see
[`dvc remote`](https://dvc.org/doc/commands-reference/remote) for more info),
but for this example let's use AWS S3 remote to store your cache. To add
your S3 repository and set it as a default one run:

```
    $ dvc remote add -d myremote s3://mybucket/mycache
    Setting 'myremote' as a default remote.
```

This will add `myremote` to your `.dvc/config`. Commit your changes and push
your code:

```
    $ git add .dvc/config
    $ git push
```

Now, to upload your cache use:

```
    $ dvc push
    (1/5): [##############################] 100% 3caf879afa11fc750cac4e15721a8741
    (2/5): [##############################] 100% f83c01a5634a9e7b8a04177a5533f67b
    (3/5): [##############################] 100% 2579801f17b00b0014d4e2a4847e3064.dir
    (4/5): [##############################] 100% 82986e112ecefabbcfbaf960e2c8fb36
    (5/5): [##############################] 100% 18d51187e9602848514499047bb6de7f
```

In order for your collagues to obtain the cache, they will simply need to run:

```
   $ git pull
   $ dvc pull
   (1/5): [##############################] 100% 3caf879afa11fc750cac4e15721a8741
   (2/5): [##############################] 100% f83c01a5634a9e7b8a04177a5533f67b
   (3/5): [##############################] 100% 2579801f17b00b0014d4e2a4847e3064.dir
   (4/5): [##############################] 100% 82986e112ecefabbcfbaf960e2c8fb36
   (5/5): [##############################] 100% 18d51187e9602848514499047bb6de7f
```
