# add

Track data files or directories with DVC, by creating a corresponding `.dvc`
file.

## Synopsis

```usage
usage: dvc add [-h] [-q | -v] [-f] [--no-commit] [--external]
               [--glob] [-o <path>]
               [--to-remote] [-r <name>] [--remote-jobs <number>]
               targets [targets ...]
positional arguments:
  targets               Files or directories to add
```

<details>

### Options removed in 3.0

- `--desc`
- `--file`
- `--jobs` (renamed to `--remote-jobs`)
- `--labels`
- `--meta`
- `--recursive`
- `--type`

</details>

## Description

The `dvc add` command is analogous to `git add`, in that it makes DVC aware of
the target data, in order to start versioning it. It creates a `.dvc` file to
track the added data.

This command can be used to track large files, models, dataset directories, etc.
that are too big for Git to handle directly. This enables
[versioning](/doc/use-cases/versioning-data-and-models) them indirectly with
Git.

The `targets` are the files or [directories](#adding-entire-directories) to add.
They get stored in the <abbr>cache</abbr> by default (use the `--no-commit`
option to avoid this, and `dvc commit` to finish the process when needed).

> See also `dvc.yaml` and `dvc stage add` for more advanced ways to track and
> version intermediate and final results (like ML models).

After checking that each `target` hasn't been added before (or tracked with
other DVC commands), a few actions are taken under the hood:

1. Calculate the file hash.
2. Move the file contents to the cache (by default in `.dvc/cache`) (or to
   [remote storage] if `--to-remote` is given), using the file hash to form the
   cached file path. (See [Structure of cache directory] for more details.)
3. Attempt to replace the file with a link to the cached data (more details on
   file linking further down). Skipped if `--to-remote` is used.
4. Create a corresponding `.dvc` file to track the file, using its path and hash
   to identify the cached data (with `--to-remote`/`-o`, an external path is
   moved to the <abbr>workspace</abbr>). The `.dvc` file lists the DVC-tracked
   file as an <abbr>output</abbr> (`outs` field). The `.dvc` file name generated
   is `<file>.dvc`, where `<file>` is the file name of the first target.
5. Add the `targets` to `.gitignore` in order to prevent them from being
   committed to the Git repository (unless `dvc init --no-scm` was used when
   initializing the <abbr>DVC project</abbr>).
6. Instructions are printed showing `git` commands for staging `.dvc` files (or
   they are staged automatically if [`core.autostage`] is set).

[remote storage]: /doc/user-guide/data-management/remote-storage
[structure of cache directory]:
  /doc/user-guide/project-structure/internal-files#structure-of-the-cache-directory
[`core.autostage`]: /doc/user-guide/project-structure/configuration#core

Summarizing, the result is that the target data is replaced by small `.dvc`
files that can be easily tracked with Git.

It's possible to prevent files or directories from being added by DVC by
entering the corresponding patterns in a `.dvcignore` file.

You can also [undo `dvc add`](/doc/user-guide/how-to/stop-tracking-data) to stop
tracking files or directories.

By default, DVC tries to use reflinks (see
[File link types](/doc/user-guide/data-management/large-dataset-optimization#file-link-types-for-the-dvc-cache)
to avoid copying any file contents and to optimize `.dvc` file operations for
large files. DVC also supports other link types for use on file systems without
`reflink` support, but they have to be specified manually. Refer to the
`cache.type` config option in `dvc config cache` for more information.

### Adding entire directories

A `dvc add` target can be either a file or a directory. In the latter case, a
`.dvc` file is created for the top of the hierarchy (with default name
`<dir_name>.dvc`).

Every file in the dir is cached normally (unless the `--no-commit` option is
used), but DVC does not produce individual `.dvc` files for each one. Instead,
the single `.dvc` file references a special JSON file in the cache (with `.dir`
extension), that in turn points to the added files.

> Refer to
> [Structure of cache directory](/doc/user-guide/project-structure/internal-files#structure-of-the-cache-directory)
> for more info. on `.dir` cache entries.

Note that DVC commands that use tracked data support granular targeting of files
and directories, even when contained in a parent directory added as a whole.
Examples: `dvc push`, `dvc pull`, `dvc get`, `dvc import`, etc.

To avoid adding files inside a directory accidentally, you can add the
corresponding patterns to `.dvcignore`.

### Adding symlink targets {#add-symlink}

`dvc add` supports symlinked files as `targets`. But if a target path is a
directory symlink, or if it contains any intermediate directory symlinks, it
cannot be added to DVC.

For example, given the following project structure:

```
.
├── .dvc
├── dir
│   └── file
├── link_to_dir -> dir
├── link_to_external_dir -> /path/to/dir
├── link_to_external_file -> /path/to/file
└── link_to_file -> dir/file
```

`link_to_file` and `link_to_external_file` are both valid symlink targets to
`dvc add`. But `link_to_dir`, `link_to_external_dir`, and `link_to_dir/file` are
not.

## Options

- `--no-commit` - do not store `targets` in the cache (the `.dvc` file is still
  created). Use `dvc commit` to finish the operation (similar to `git commit`
  after `git add`).

- `--glob` - allows adding files and directories that match the [pattern]
  specified in `targets`. Shell style wildcards supported: `*`, `?`, `[seq]`,
  `[!seq]`, and `**`

- `--external` - allow tracking `targets` outside of the DVC repository
  in-place. See [Managing External Data].

  <admon type="warn">

  Note that this is an advanced feature for very specific situations and not
  recommended except if there's absolutely no other alternative. Additionally,
  this typically requires an external cache setup (see link above).

  </admon>

- `-o <path>`, `--out <path>` - specify a `path` to the desired location in the
  workspace to place the `targets` (copying them from their current location).
  This enables targeting data outside the project (see an
  [example](#example-transfer-to-an-external-cache)).

- `--to-remote` - add a target that's outside the project, neither move it into
  the workspace, nor cache it.
  [Transfer it](#example-transfer-to-remote-storage) directly to remote storage
  instead (the default one unless otherwise specified with `-r`). Implies
  `--out .`. Use `dvc pull` to get the data locally.

- `-r <name>`, `--remote <name>` - name of the `dvc remote` to transfer external
  target to (can only be used with `--to-remote`).

- `--remote-jobs <number>` - parallelism level for DVC to transfer data when
  using `--to-remote`. The default value is `4 \* cpu_count()`. For SSH remotes,
  the default is `4`. Using more jobs may speed up the operation.

- `-f`, `--force` - when using `--out` to specify a local target file or
  directory, the operation will fail if those paths already exist. this flag
  will force the operation causing local files/dirs to be overwritten by the
  command.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

[pattern]: https://docs.python.org/3/library/glob.html
[managing external data]: /doc/user-guide/data-management/managing-external-data

## Example: Single file

Track a file with DVC:

```cli
$ dvc add data.xml
```

As indicated above, a `.dvc` file has been created for `data.xml`. Let's explore
the result:

```cli
$ tree
.
├── data.xml
└── data.xml.dvc
```

Let's check the `data.xml.dvc` file inside:

```yaml
outs:
  - md5: 6137cde4893c59f76f005a8123d8e8e6
    path: data.xml
```

This is a standard `.dvc` file with only one output (`outs` field). The hash
value (`md5` field) corresponds to a file path in the <abbr>cache</abbr>.

```cli
$ file .dvc/cache/d8/acabbfd4ee51c95da5d7628c7ef74b
.dvc/cache/61/37cde4893c59f76f005a8123d8e8e6: ASCII text
```

⚠️ Tracking compressed files (e.g. ZIP or TAR archives) is not recommended, as
`dvc add` supports tracking directories (details below).

## Example: Directory

Let's suppose your goal is to build an algorithm to identify cats and dogs in
pictures. You may then have hundreds or thousands of pictures of these animals
in a directory, and this is your training dataset:

```cli
$ tree pics --filelimit 3
pics
├── train
│   ├── cats [many image files]
│   └── dogs [many image files]
└── validation
    ├── cats [more image files]
    └── dogs [more image files]
```

[Tracking a directory](#tracking-directories) with DVC as simple as with a
single file:

```cli
$ dvc add pics
```

There are no `.dvc` files generated within this directory structure to match
each image, but the image files are all <abbr>cached</abbr>. A single `pics.dvc`
file is generated for the top-level directory, and it contains:

```yaml
outs:
  - md5: ce57450aa92ab8f2b957c24b0df73edc.dir
    path: pics
```

> Refer to [Adding entire directories](#adding-entire-directories) for more
> info.

This allows us to treat the entire directory structure as a single data
artifact. For example, you can pass it as a <abbr>dependency</abbr> to a stage
definition:

```cli
$ dvc stage add -n train \
                -d train.py -d pics \
                -M metrics.json -o model.h5 \
                python train.py
```

> To try this example, see the
> [versioning tutorial](/doc/use-cases/versioning-data-and-models/tutorial).

## Example .dvcignore

Let's take an example to illustrate how `.dvcignore` interacts with `dvc add`.

```cli
$ mkdir dir
$ echo file_one > dir/file1
$ echo file_two > dir/file2
```

Now add `file1` to `.dvcignore` and track the entire `dir` directory with
`dvc add`.

```cli
$ echo dir/file1 > .dvcignore
$ dvc add dir
```

Let's now modify `file1` (which is listed in `.dvcignore`) and run `dvc status`:

```cli
$ echo file_one_changed > dir/file1
$ dvc status
Data and pipelines are up to date.
```

`dvc status` ignores changes to files listed in `.dvcignore`.

Let's have a look at cache directory:

```cli
$ tree .dvc/cache
.dvc/cache
├── 0a
│   └── ec3a687bd65c3e6a13e3cf20f3a6b2.dir
└── 52
    └── 4bcc8502a70ac49bf441db350eafc2
```

Only the hash values of the `dir/` directory (with `.dir` file extension) and
`file2` have been cached.

## Example: Transfer to an external cache

When you want to add a large dataset that is outside of your
<abbr>project</abbr> (e.g. online), you would normally need to download or copy
it into the <abbr>workspace</abbr> first. But you may not have enough local
storage space.

You can however set up an [external cache] that can handle the data. To avoid
ever making a local copy, target the outside data with `dvc add` while
specifying an `--out` (`-o`) path inside of your project. This way the data will
be transferred to the <abbr>cache</abbr> directly, and then [linked] into your
workspace.

Let's add a `data.xml` file via HTTP, putting it in `./data.xml`:

```cli
$ dvc add https://data.dvc.org/get-started/data.xml -o data.xml
...
$ ls
data.xml data.xml.dvc
```

The resulting `.dvc` file will save the provided local `path` as if the data was
already in the workspace, while the `md5` hash points to the copy of the data
that has now been transferred to the <abbr>cache</abbr>. Let's check the
contents of `data.xml.dvc` in this case:

```yaml
outs:
  - md5: a304afb96060aad90176268345e10355
    nfiles: 1
    path: data.xml
```

[linked]:
  /doc/user-guide/data-management/large-dataset-optimization#file-link-types-for-the-dvc-cache
[external cache]:
  /doc/user-guide/data-management/managing-external-data#setting-up-an-external-cache

## Example: Transfer to remote storage

Sometimes there's not enough space in the local environment to import a large
dataset, but you still want to track it in the <abbr>project</abbr> so that
`dvc pull` can download it later.

As long as you have setup a `dvc remote` that can handle the data, this can be
achieved with the `--to-remote` flag. It creates a `.dvc` file without
downloading anything, transferring a target directly to remote storage instead.

Let's add a `data.xml` file via HTTP straight "to remote":

```cli
$ dvc add https://data.dvc.org/get-started/data.xml --to-remote
...
$ ls
data.xml.dvc
```

Since a `.dvc` file is created in the <abbr>workspace</abbr>, whenever anyone
wants to actually download the data they can use `dvc pull`:

```cli
$ dvc pull data.xml.dvc
A       data.xml
1 file added
```

<admon type="info">

Note that you can also do this [with `dvc import-url`]. This has the added
benefit of keeping a connection to the data source so it can be updated later
(with `dvc update`).

[with `dvc import-url`]:
  /doc/command-reference/import-url#example-transfer-to-remote-storage

</admon>
