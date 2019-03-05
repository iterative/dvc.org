# add

Take a data file or a directory under DVC control.

## Synopsis

```usage
    usage: dvc add [-h] [-q | -v]
                   [-R] [--no-commit]
                   targets [targets ...]

    positional arguments:
      targets                  Input files/directories.

```

## Description

The `dvc add` command is analogous to the `git add` command. By default an added
file is committed to the DVC cache. Using the `--no-commit` option, the file
will not be added to the cache and instead the `dvc commit` command is used when
(or if) the file is to be committed to the DVC cache.

Under the hood a few actions are taken for each file in the target(s):

1. Move the file content to the DVC cache (default location is `.dvc/cache`).
2. Calculate the file checksum.
3. Replace the file by a link to the file in the cache (see details below).
4. Create a corresponding DVC file (metafile `.dvc`) and store the checksum
  to identify the cache entry.
5. Add the _target_ filename to `.gitignore` (if Git is used in this workspace)
  to prevent it from being committed to the Git repository. This behavior is
  prevented if the workspace is initialized with the `--no-scm` option.
6. Instructions are printed showing `git` commands for adding the files to a
  Git repository. If a different SCM system is being used, use the equivalent
  command for that system.

The result is data file is added to the DVC cache, and the Git repository stores
the metafile (`.dvc`). The stage file (metafile) lists the added file as an
`out` (output) of the stage, and references the DVC cache entry using the
checksum. See [DVC File Format](/doc/user-guide/dvc-file-format) for the
detailed description of the DVC _metafile_ format.

By default DVC tries a range of link types (`reflink`, `hardlink`, `symlink`,
or `copy`) to try to avoid copying any file contents and to optimize DVC file
operations even for large files. The `reflink` is the best link type available,
but even though it is frequently supported by modern filesystems, many others
still don't support it. DVC has the other link types for use on filesystems
without `reflink` support. See `dvc config` for more information.

A `dvc add` target can be an individual file or a directory. There are two ways
to work with directory hierarchies with `dvc add`.

1. With `dvc add --recursive`, the hierarchy is traversed and every file is
  added individually as described above. This means every file has its own
  `.dvc` file, and a corresponding DVC cache entry is made. If the
  `--no-commit` flag is added the DVC cache entry is not made.
2. When not using `--recursive` a DVC stage file is created for the top of
  the directory (`dirname.dvc`), and every file in the hierarchy is added to the
  DVC cache, but these files do not have individual DVC files. Instead the DVC
  file for the directory has a corresponding file in the DVC cache containing
  references to the files in the directory hierarchy.

The `dvc add` command is useful for manually maintaining updates to datasets
and files. For files that are the outputs of running a command, it is better
to use the `dvc run` command to create a DVC stage file listing dependencies
and outputs.

## Options

* `-R`, `--recursive` - recursively add each file under the named directory. For
  each file a new DVC file is created using the process described earlier.

* `--no-commit` - do not put files/directories into cache. A stage file is
  created, and an entry is added to `.dvc/state`, while nothing is added to the
  cache (`.dvc/cache`). The `dvc status` command will note that the file is `not
  in cache`. The `dvc commit` command will add the file to the DVC cache. This
  is analogous to the `git add` and `git commit` commands.

* `-h`, `--help` - prints the usage/help message, and exit.

* `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if all
  stages are up to date or if all stages are successfully rerun, otherwise exit
  with 1.

* `-v`, `--verbose` - displays detailed tracing information from executing the
  `dvc add` command.


## Examples

Take files under DVC control:

```

    $ ls raw

    dog.111.jpg

    $ dvc add raw/dog.111.jpg

    Adding 'raw/dog.111.jpg' to 'raw/.gitignore'.
    Saving 'raw/dog.111.jpg' to cache '.dvc/cache'.
    Saving information to 'raw/dog.111.jpg.dvc'.

    To track the changes with git run:

    	git add raw/.gitignore raw/dog.111.jpg.dvc

```

As the output says, stage files have been created for each file. Let us explore
the results.

We see that DVC files were created:

```
    $ ls raw

    dog.111.jpg   dog.111.jpg.dvc
```

Let's check the format used for the DVC files.

```
    $ cat raw/dog.111.jpg.dvc

    md5: aae37d74224b05178153acd94e15956b
    outs:
    - cache: true
      md5: d8acabbfd4ee51c95da5d7628c7ef74b
      metric: false
      path: dog.111.jpg
```

This is a standard DVC stage file with only an `outs` entry. The checksum should
correspond to an entry in the cache.

```
    $ ls .dvc/cache/d8/acabbfd4ee51c95da5d7628c7ef74b
    .dvc/cache/d8/acabbfd4ee51c95da5d7628c7ef74b

    $ file .dvc/cache/d8/acabbfd4ee51c95da5d7628c7ef74b
    .dvc/cache/d8/acabbfd4ee51c95da5d7628c7ef74b: JPEG image data, JFIF standard 1.01, aspect ratio, density 1x1, segment length 16, baseline, precision 8, 499x375, frames 3
```

Then we can individually verify each has a corresponding DVC cache entry. With
the `file` command we verify that each is a JPEG image with the expected
characteristics.

What if you have not one dog picture, but hundreds of pictures of dogs and cats?
Your goal might be to build an algorithm to identify dogs and cats in pictures,
and this is your training data set.

```
    $ du pics
    11092	pics/train/cats
    13044	pics/train/dogs
    24140	pics/train
    9244	pics/validation/cats
    10496	pics/validation/dogs
    19744	pics/validation
    43888	pics

    $ dvc add pics
    Computing md5 for a large directory pics/train/cats. This is only done once.
    [##############################] 100% pics/train/cats

    Computing md5 for a large directory pics/train/dogs. This is only done once.
    [##############################] 100% pics/train/dogs

    Computing md5 for a large directory pics/validation/cats. This is only done once.
    [##############################] 100% pics/validation/cats

    Computing md5 for a large directory pics/validation/dogs. This is only done once.
    [##############################] 100% pics/validation/dogs

    Saving 'pics' to cache '.dvc/cache'.

    Linking directory 'pics'.
    [##############################] 100% pics

    Saving information to 'pics.dvc'.

    To track the changes with git run:

      	git add pics.dvc
```

There are no DVC files generated within this directory structure, but the images
are all added to the DVC cache. DVC prints a message to that effect, saying that
`md5` values are computed for each directory. A DVC file is generated for the
top-level directory, and it contains this:

```yaml
    md5: df06d8d51e6483ed5a74d3979f8fe42e
    outs:
    - cache: true
      md5: b8f4d5a78e55e88906d5f4aeaf43802e.dir
      metric: false
      path: pics
    wdir: .
```

If instead you use the `--recursive` option, the output looks as so:

```
    $ dvc add --recursive pix
    Saving 'pix/train/cats/cat.150.jpg' to cache '.dvc/cache'.
    Saving 'pix/train/cats/cat.130.jpg' to cache '.dvc/cache'.
    Saving 'pix/train/cats/cat.111.jpg' to cache '.dvc/cache'.
    Saving 'pix/train/cats/cat.438.jpg' to cache '.dvc/cache'.
    ...
```

In this case a DVC file corresponding to each file is generated, and no
top-level DVC file is generated. But this is less convenient.

With the `dvc add pics` a single DVC file is generated, `pics.dvc`, which lets
us treat the entire directory structure in one unit. It lets you pass the whole
directory tree as input to a `dvc run` stage like so:

```
    $ dvc run -f train.dvc -d train.py -d data -M metrics.json -o model.h5 \
              -o bottleneck_features_train.npy \
              -o bottleneck_features_validation.npy \
              python train.py
```

To see this whole example go to
[Example: Versioning](/doc/get-started/example-versioning).

Since no top-level DVC file is generated with the `--recursive` option we
cannot use the directory structure as a whole.