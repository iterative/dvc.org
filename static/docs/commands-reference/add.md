# add

Take a data file or a directory under DVC control.

## Synopsis

```usage
    usage: dvc add [-h] [-q | -v] [-R] [--no-commit] targets [targets ...]

    positional arguments:
      targets          Input files/directories.

```

## Description

The `dvc add` command is analogous to the `git add` command.  By default an 
added file is committed to the DVC cache.  Using the `--no-commit` option, the
file will not be added to the cache and instead the `dvc commit` command is
used when (or if) the file is to be committed to the DVC cache.

Under the hood a few actions are taken for each file in the target(s):

1. Move the file content to the DVC cache (default location is `.dvc/cache`).
2. Calculate the file checksum.
3. Replace the file by a link to the file in the cache (see details below).
4. Create a corresponding DVC file (metafile `.dvc`) and store the checksum
  to identify the cache entry.
5. Add the _target_ filename to `.gitignore` to prevent it from being 
  committed to the Git repository.
6. Instructions are printed showing `git` commands for the files to be added to
  the Git repository.

The result is data file is added to the DVC cache, and the Git repository stores
the metafile (`.dvc`).  The stage file (metafile) lists the added file as an
`out` (output) of the stage, and references the DVC cache entry using the 
checksum.  See [DVC File Format](/doc/user-guide/dvc-file-format) for the 
detailed description of the DVC _metafile_ format.

By default DVC tries a range of link types (`reflink`, `hardlink`, `symlink`,
or `copy`) to try to avoid copying any file contents and to optimize DVC file 
operations even for large files. The `reflink` is the best link type available, 
but even though it is frequently supported by modern filesystems, many others 
still don't support it.  DVC has the other link types for use on filesystems 
without `reflink` support. See `dvc config` for more information.

A `dvc add` target can be an individual file or a directory.  There are two ways
to work with directory hierarchies with `dvc add`.

1. With `dvc add --recursive`, the hierarchy is traversed and every file is 
  added individually as described above.  This means every file has its own 
  `.dvc` file, and a corresponding DVC cache entry is made.  If the 
  `--no-commit` flag is added the DVC cache entry is not made.
2. When not using `--recursive` a DVC stage file is created for the top of 
  the directory (`dirname.dvc`), and every file in the hierarchy is added to the 
  DVC cache, but these files do not have individual DVC files.  Instead the DVC 
  file for the directory has a corresponding file in the DVC cache containing 
  references to the files in the directory hierarchy.

The `dvc add` command is useful for manually maintaining updates to files.  For
files that are the outputs of running a command, it is better to use the 
`dvc run` command to create a DVC stage file listing dependencies and outputs.

## Options

* `-R`, `--recursive`  Recursively add each file under the named directory.  For 
  each file a new DVC file is created using the process described earlier.

* `--no-commit` Do not put files/directories into cache. A stage file is created,
  and an entry is added to `.dvc/state`, while nothing is added to the
  cache (`.dvc/cache`).  The `dvc status` command will note that the file
  is `not in cache`.  The `dvc commit` command will add the file to 
  the DVC cache.  This is analogous to the `git add` and `git commit` commands.

* `-h`, `--help` - prints the usage/help message, and exit.

* `-q`, `--quiet` - do not write anything to standard output.  Exit with 0 if
  all stages are up to date or if all stages are successfully rerun, otherwise 
  exit with 1.

* `-v`, `--verbose` - displays detailed tracing information from executing the
  `dvc add` command.


## Examples

Take files under DVC control:

```dvc

    $ ls raw

    dog.111.jpg	dog.121.jpg	dog.131.jpg	dog.141.jpg

    $ dvc add raw/dog.111.jpg raw/dog.121.jpg raw/dog.131.jpg raw/dog.141.jpg

    Adding 'raw/dog.111.jpg' to 'raw/.gitignore'.
    Saving 'raw/dog.111.jpg' to cache '.dvc/cache'.
    Saving information to 'raw/dog.111.jpg.dvc'.

    To track the changes with git run:

    	git add raw/.gitignore raw/dog.111.jpg.dvc

    Adding 'raw/dog.121.jpg' to 'raw/.gitignore'.
    Saving 'raw/dog.121.jpg' to cache '.dvc/cache'.
    Saving information to 'raw/dog.121.jpg.dvc'.

    To track the changes with git run:

	    git add raw/.gitignore raw/dog.121.jpg.dvc

    Adding 'raw/dog.131.jpg' to 'raw/.gitignore'.
    Saving 'raw/dog.131.jpg' to cache '.dvc/cache'.
    Saving information to 'raw/dog.131.jpg.dvc'.

    To track the changes with git run:

	    git add raw/.gitignore raw/dog.131.jpg.dvc

    Adding 'raw/dog.141.jpg' to 'raw/.gitignore'.
    Saving 'raw/dog.141.jpg' to cache '.dvc/cache'.
    Saving information to 'raw/dog.141.jpg.dvc'.

    To track the changes with git run:

	    git add raw/.gitignore raw/dog.141.jpg.dvc
```

As the output says, stage files have been created for each file.  Let us explore
the results.

We see that DVC files were created:

```dvc
    $ ls raw
    
    dog.111.jpg   dog.111.jpg.dvc   dog.121.jpg   dog.121.jpg.dvc
    dog.131.jpg   dog.131.jpg.dvc   dog.141.jpg   dog.141.jpg.dvc
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

This is a standard DVC stage file with only an `outs` entry.  The checksum 
should correspond to an entry in the cache.

```dvc
    $ grep '  md5' raw/*.dvc

    raw/dog.111.jpg.dvc:  md5: d8acabbfd4ee51c95da5d7628c7ef74b
    raw/dog.121.jpg.dvc:  md5: 678cf9d7a63239a887eeb30817379a80
    raw/dog.131.jpg.dvc:  md5: e6b8b22c62d141a248c07d80ec48534f
    raw/dog.141.jpg.dvc:  md5: 5d78f8e9366e44f5a77e79d3bd1bd904
```

This gives us the checksum for each file.

```dvc
    $ ls .dvc/cache/d8/acabbfd4ee51c95da5d7628c7ef74b 
    .dvc/cache/d8/acabbfd4ee51c95da5d7628c7ef74b
    $ file .dvc/cache/d8/acabbfd4ee51c95da5d7628c7ef74b 
    .dvc/cache/d8/acabbfd4ee51c95da5d7628c7ef74b: JPEG image data, JFIF standard 1.01, aspect ratio, density 1x1, segment length 16, baseline, precision 8, 499x375, frames 3

    $ ls .dvc/cache/67/8cf9d7a63239a887eeb30817379a80 
    .dvc/cache/67/8cf9d7a63239a887eeb30817379a80
    $ file .dvc/cache/67/8cf9d7a63239a887eeb30817379a80 
    .dvc/cache/67/8cf9d7a63239a887eeb30817379a80: JPEG image data, JFIF standard 1.01, aspect ratio, density 1x1, segment length 16, baseline, precision 8, 500x334, frames 3

    $ ls .dvc/cache/5d/78f8e9366e44f5a77e79d3bd1bd904 
    .dvc/cache/5d/78f8e9366e44f5a77e79d3bd1bd904
    $ file .dvc/cache/e6/b8b22c62d141a248c07d80ec48534f 
    .dvc/cache/e6/b8b22c62d141a248c07d80ec48534f: JPEG image data, JFIF standard 1.01, aspect ratio, density 1x1, segment length 16, baseline, precision 8, 468x423, frames 3

    $ ls .dvc/cache/5d/78f8e9366e44f5a77e79d3bd1bd904 
    .dvc/cache/5d/78f8e9366e44f5a77e79d3bd1bd904
    $ file .dvc/cache/5d/78f8e9366e44f5a77e79d3bd1bd904 
    .dvc/cache/5d/78f8e9366e44f5a77e79d3bd1bd904: JPEG image data, JFIF standard 1.01, aspect ratio, density 1x1, segment length 16, baseline, precision 8, 500x374, frames 3

```

Then we can individually verify each has a corresponding DVC cache entry.  With
the `file` command we verify that each is a JPEG image with the expected 
characteristics.
