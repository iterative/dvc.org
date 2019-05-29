# add

Take a data file or a directory under DVC control.

## Synopsis

```usage
usage: dvc add [-h] [-q | -v] [-f]
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

1. Calculate the file checksum.
2. Move the file content to the DVC cache (default location is `.dvc/cache`).
3. Replace the file by a link to the file in the cache (see details below).
4. Create a corresponding DVC file (metafile `.dvc`) and store the checksum to
   identify the cache entry.
5. Add the _target_ filename to `.gitignore` (if Git is used in this workspace)
   to prevent it from being committed to the Git repository.
6. Instructions are printed showing `git` commands for adding the files to a Git
   repository. If a different SCM system is being used, use the equivalent
   command for that system or nothing is printed if `--no-scm` was specified for
   the repository.

The result is data file is added to the DVC cache, and DVC metafiles (`.dvc`)
can be tracked via Git or other version control system. The stage file
(metafile) lists the added file as an `out` (output) of the stage, and
references the DVC cache entry using the checksum. See
[DVC File Format](/doc/user-guide/dvc-file-format) for the detailed description
of the DVC _metafile_ format.

By default DVC tries to use reflinks (see
[File link types](/docs/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache)
to avoid copying any file contents and to optimize DVC file operations for large
files. DVC also supports other link types for use on file systems without
`reflink` support, but they have to be specified manually. Refer to the
`cache.type` config option in `dvc config cache` for more information.

A `dvc add` target can be an individual file or a directory. There are two ways
to work with directory hierarchies with `dvc add`.

1. With `dvc add --recursive`, the hierarchy is traversed and every file is
   added individually as described above. This means every file has its own
   `.dvc` file, and a corresponding DVC cache entry is made (unless
   `--no-commit` flag is added).
2. When not using `--recursive` a DVC stage file is created for the top of the
   directory (`dirname.dvc`), and every file in the hierarchy is added to the
   DVC cache (unless `--no-commit` flag is added), but these files do not have
   individual DVC files. Instead the DVC file for the directory has a
   corresponding file in the DVC cache containing references to the files in the
   directory hierarchy.

In a DVC project `dvc add` can be used to version control any data artifacts -
input, intermediate, output files and directories, as well as model files. It is
useful by itself to go back and forth between different versions of datasets or
models. Usually though, it is recommended to use `dvc run` and `dvc repro`
mechanism to version control intermediate and output artifacts (like models).
This way you bring data provenance and make your project reproducible.

## Options

- `-R`, `--recursive` - recursively add each file under the named directory. For
  each file a new DVC file is created using the process described earlier.

- `--no-commit` - do not put files/directories into cache. A stage file is
  created, and an entry is added to `.dvc/state`, while nothing is added to the
  cache (`.dvc/cache`). The `dvc status` command will mention that the file is
  `not in cache`. The `dvc commit` command will add the file to the DVC cache.
  This is analogous to the `git add` and `git commit` commands.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

- `-f`, `--file` - specify name of the DVC file it generates. It should be
  either `Dvcfile` or have a `.dvc` file extension (e.g. `data.dvc`) in order
  for `dvc` to be able to find it later.

## Examples: Single file

Take a file under DVC control:

```dvc
$ dvc add data.xml

Adding 'data.xml' to '.gitignore'.
Saving 'data.xml' to cache '.dvc/cache'.
Saving information to 'data.xml.dvc'.

To track the changes with git run:

	git add .gitignore data.xml.dvc
```

As the output says, stage file have been created for the file. Let us explore
the result:

```dvc
$ tree
.
├── data.xml
└── data.xml.dvc
```

Let's check the `data.xml.dvc` file inside:

```yaml
md5: aae37d74224b05178153acd94e15956b
outs:
  - cache: true
    md5: d8acabbfd4ee51c95da5d7628c7ef74b
    metric: false
    path: data.xml.jpg
```

This is a standard DVC stage file with only an `outs` entry. The checksum should
correspond to an entry in the cache.

```dvc
$ file .dvc/cache/d8/acabbfd4ee51c95da5d7628c7ef74b

.dvc/cache/d8/acabbfd4ee51c95da5d7628c7ef74b: ASCII text
```

## Examples: Directory

What if you have not one dog picture, but hundreds of pictures of dogs and cats?
Your goal might be to build an algorithm to identify dogs and cats in pictures,
and this is your training data set:

```dvc
$ tree pics
pics
├── train
│   ├── cats        <-- a lot of images of cats
│   └── dogs        <-- a lot of images of dogs
└── validation
    ├── cats        <-- images of cats
    └── dogs        <-- images of dogs
```

Taking a directory under DVC control as simple as taking a single file:

```dvc
$ dvc add pics

Computing md5 for a large directory pics/train/cats. This is only done once.
[##############################] 100% pics/train/cats

...

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

```dvc
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

```dvc
$ dvc run -f train.dvc \
          -d train.py -d data \
          -M metrics.json -o model.h5 \
          python train.py
```

To see this whole example go to
[Example: Versioning](/doc/get-started/example-versioning).

Since no top-level DVC file is generated with the `--recursive` option we cannot
use the directory structure as a whole.
