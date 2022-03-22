# status

Show changes in the <abbr>project</abbr>
[pipelines](/doc/command-reference/dag), as well as file mismatches either
between the <abbr>cache</abbr> and <abbr>workspace</abbr>, or between the cache
and remote storage.

## Synopsis

```usage
usage: dvc status [-h] [-v] [-j <number>] [-q] [-c] [-r <name>] [-a] [-T]
                  [--all-commits] [-d] [-R] [--json]
                  [targets [targets ...]]

positional arguments:
  targets       Limit command scope to these tracked files/directories,
                .dvc files, or stage names.
```

## Description

Searches for changes in the existing tracked data and pipelines. In local mode,
it shows which files or directories have changed in the <abbr>workspace</abbr>
(thus could be [added](/doc/command-reference/add) or
[reproduced](/doc/command-reference/repro) again). In remote mode, it reports
the differences between <abbr>cache</abbr> vs. [remote storage] (`dvc push` or
`dvc pull` could be used to synchronize these).

| Mode   | Option            | Description                                                                                                                 |
| ------ | ----------------- | --------------------------------------------------------------------------------------------------------------------------- |
| local  | _none_            | Comparisons are made between data files in the workspace and corresponding files in the cache directory (e.g. `.dvc/cache`) |
| remote | `--remote` (`-r`) | Comparisons are made between the cache, and a given DVC remote.                                                             |
| remote | `--cloud` (`-c`)  | Comparisons are made between the cache, and the [default remote].                                                           |

Without arguments, this command checks all `dvc.yaml` and `.dvc` files to
rebuild and validate pipeline(s). It then compares <abbr>outputs</abbr> defined
in these files against the actual data in the workspace.

Any `targets` given to this command limit what to show changes for. It accepts
paths to tracked files or directories (including paths inside tracked
directories), `.dvc` files, and stage names (found in `dvc.yaml`).

The `--all-branches`, `--all-tags`, and `--all-commits` options enable comparing
DVC-tracked files referenced in multiple Git commits at once.

If no differences are detected, `dvc status` prints
`Data and pipelines are up to date`, or
`Cache and remote 'myremote' are in sync` (if using the `-c` or `-r` options are
used). If differences are detected, the changes in <abbr>dependencies</abbr>
and/or <abbr>outputs</abbr> for each stage are listed. For each item listed,
either the file name or hash is shown, along with a state description, as
detailed bellow.

[remote storage]: /doc/command-reference/remote
[default remote]: /doc/command-reference/remote/default

### Local workspace status

- _changed checksum_ means that the `.dvc` file hash has changed (e.g. someone
  manually edited it).

- _always changed_ means that this stage (in `dvc.yaml`) has neither
  dependencies nor outputs, or that the `always_changed` field set to `true`
  (see `dvc stage add --always-changed`).

- _changed deps_ or _changed outs_ means that there are changes in dependencies
  or outputs tracked by the stage or `.dvc` file. Depending on the use case,
  commands like `dvc commit`, `dvc repro`, or `dvc run` can be used to update
  the file. Possible states are:

  - _new_: An <abbr>output</abbr> is found in the <abbr>workspace</abbr>, but
    there is no corresponding file hash saved in the `dvc.lock` or `.dvc` file
    yet.
  - _modified_: An output or <abbr>dependency</abbr> is found in the workspace,
    but the corresponding file hash in the `dvc.lock` or `.dvc` file is not up
    to date.
  - _deleted_: The output or dependency is referenced in a `dvc.lock` or `.dvc`
    file, but does not exist in the workspace.
  - _not in cache_: An output exists in the workspace, and the corresponding
    file hash in the `dvc.lock` or `.dvc` file is up to date, but there is no
    corresponding <abbr>cache</abbr> file or directory.

- _update available_ means that an <abbr>import stage</abbr> is outdated (the
  original data source has changed). The imported data can be brought to its
  latest version by using `dvc update`.

### Comparison against remote storage

- _new_ means that the file/directory exists in the cache but not in remote
  storage.
- _deleted_ means that the file/directory doesn't exist in the cache, but exists
  in remote storage.
- _missing_ means that the file/directory doesn't exist neither in cache, nor in
  remote storage.

For _new_ and _deleted_ data, the cache is different from remote storage.
Bringing the two into sync requires `dvc pull` or `dvc push`.

For _missing_ data, there's nothing to retrieve from storage. This can happen
for example in fresh <abbr>DVC repository</abbr> clones if the data wasn't
uploaded from the original repo, or after certain uses of `dvc gc`. You can try
`dvc repro` to regenerate the output locally, and `dvc push` remotely after
that.

## Options

- `-c`, `--cloud` - enables comparison against a remote (see `dvc remote`). If
  the `--remote` option is not used, DVC will compare against the default remote
  (specified in the `core.remote` config option).

  The `dvc remote` used is determined in order, based on

  1. the `remote` fields in the `dvc.yaml` or `.dvc` files.
  2. the value passed to the `--remote` option via CLI.
  3. the value of the `core.remote` config option (see `dvc remote default`).

- `-a`, `--all-branches` - compares cache content against all Git branches, as
  well as the current workspace. This basically runs the same status command in
  every branch of this repo. The corresponding branches are shown in the status
  output. Applies only if `--cloud` or a `-r` remote is specified. Note that
  this can be combined with `-T` below, for example using the `-aT` flags.

- `-T`, `--all-tags` - compares cache content against all Git tags, as well as
  the workspace. Note that this can be combined with `-a` above, for example
  using the `-aT` flags.

- `-A`, `--all-commits` - compares cache content against all Git commits, as
  well as the workspace. This compares the cache content for the entire commit
  history of the project.

- `-d`, `--with-deps` - only meaningful when specifying `targets`. This
  determines files to check by resolving all dependencies of the targets: DVC
  searches backward from the targets in the corresponding pipelines. This will
  not show changes occurring in later stages than the `targets`.

- `-R`, `--recursive` - determines the files to check status for by searching
  each target directory and its subdirectories for stages (in `dvc.yaml`) and
  `.dvc` files to inspect. If there are no directories among the targets, this
  option has no effect.

- `-r <name>`, `--remote <name>` - name of the [remote storage] to compare
  against (see `dvc remote list`). Implies `--cloud`.

- `--json` - prints the command's output in easily parsable JSON format, instead
  of a human-readable table.

- `-j <number>`, `--jobs <number>` - parallelism level for DVC to access data
  from remote storage. This only applies when the `--cloud` option is used, or a
  `--remote` is given. The default value is `4 * cpu_count()`. Note that the
  default value can be set using the `jobs` config option with
  `dvc remote modify`. Using more jobs may speed up the operation.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if
  data and pipelines are up to date, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

```dvc
$ dvc status
baz.dvc:
	changed outs:
		modified:           baz
dofoo:
	changed deps:
		modified:           baz
	changed outs:
		modified:           foo
dobar:
	changed deps:
		modified:           foo
	changed outs:
		deleted:            bar
```

This shows that for stage `dofoo`, the dependency `baz` and the output `foo`
have changed. Likewise for stage `dobar`, the dependency `foo` has changed and
the output `bar` doesn't exist in the workspace. For `baz.dvc`, the file `baz`
tracked by it has changed.

## Example: Specific files or directories

`dvc status` only checks the tracked data corresponding to any given `targets`:

```dvc
$ dvc status foo.dvc dobar
foo.dvc:
	changed outs:
		modified:            foo
	changed checksum
dobar:
	changed deps:
		modified:           foo
	changed outs:
		not in cache:       bar
```

> In this case, the target `foo.dvc` is a `.dvc` file to track the `foo` file,
> while `dobar` is the name of a stage defined in `dvc.yaml`.

Note that you can check data within directories tracked, such as the `data/raw`
directory (tracked with `data/raw.dvc`):

```dvc
$ tree data
data
├── raw
│   ├── partition.1.dat
│   ├── ...
│   └── partition.n.dat
└── raw.dvc

$ dvc fetch data/raw/partition.1.dat
new:                data/raw
```

## Example: Dependencies

```dvc
$ vi code/featurization.py
... edit the code

$ dvc status model.p
Data and pipelines are up to date.

$ dvc status model.p --with-deps
matrix-train.p:
	changed deps:
		modified:  code/featurization.py
```

The `dvc status` command may be limited to a target that had no changes, but by
adding `--with-deps`, any change in a preceding stage will be found.

## Example: Remote comparisons

Let's now assume that we have a shared remote on S3: and would like to check
what files we have generated but haven't pushed to the remote yet:

```dvc
$ dvc remote list
storage	s3://bucket/path
```

And would like to check what files we have generated but haven't pushed to the
remote yet:

```dvc
$ dvc status --remote storage
...
	new:      data/model.p
	new:      data/eval.txt
	new:      data/matrix-train.p
	new:      data/matrix-test.p
```

The output shows where the location of the remote storage is, as well as any
differences between the <abbr>cache</abbr> and `storage` remote.

## Example: Check imported data

Let's import a data file (`data.csv`) from a different <abbr>DVC repository
</abbr> into our current project using `dvc import`.

```dvc
$ dvc import different/repo/location data.csv
```

The resulting `data.csv.dvc` file is called an <abbr>import stage</abbr>. If the
original file or directory changes later, `dvc status` will show "update
available" as output:

```dvc
$ dvc status
data.csv.dvc:
	changed deps:
		update available:   data.csv (different/repo/location)
```

The imported data can be brought to its latest version by using `dvc update`.
