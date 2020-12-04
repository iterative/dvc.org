# status

Show changes in the <abbr>project</abbr>
[pipelines](/doc/command-reference/dag), as well as file mismatches either
between the <abbr>cache</abbr> and <abbr>workspace</abbr>, or between the cache
and remote storage.

## Synopsis

```usage
usage: dvc status [-h] [-v] [-j <number>] [-q] [-c] [-r <name>] [-a] [-T]
                  [--all-commits] [-d] [-R] [--show-json]
                  [targets [targets ...]]

positional arguments:
  targets       Limit command scope to these tracked files/directories,
                .dvc files, or stage names.
```

## Description

Searches for changes in the existing tracked data and pipelines, either showing
which files or directories have changed in the <abbr>workspace</abbr> and should
be added or reproduced again (with `dvc add` or `dvc repro`); or differences
between <abbr>cache</abbr> vs. [remote storage](/doc/command-reference/remote)
(implying `dvc push` or `dvc pull` should be run to synchronize them). The
_remote_ mode is triggered by using the `--cloud` or `--remote` options:

| Mode   | Option     | Description                                                                                                                 |
| ------ | ---------- | --------------------------------------------------------------------------------------------------------------------------- |
| local  | _none_     | Comparisons are made between data files in the workspace and corresponding files in the cache directory (e.g. `.dvc/cache`) |
| remote | `--remote` | Comparisons are made between the cache, and the given remote. Remote storage is defined using the `dvc remote` command.     |
| remote | `--cloud`  | Comparisons are made between the cache, and the default remote (typically defined with `dvc remote --default`).             |

Without arguments, this command checks all stages (defined in `dvc.yaml`) and
`.dvc` files, and compares the hash values of their <abbr>outputs</abbr> (found
in `dvc.lock` for stages) against the actual data files or directories in the
workspace. The `--all-branches`, `--all-tags`, and `--all-commits` options
enable checking data for multiple Git commits.

The `targets` given to this command (if any) limit what to check. It accepts
paths to tracked files or directories (including paths inside tracked
directories), `.dvc` files, and stage names (found in `dvc.yaml`).

If no differences are detected, `dvc status` prints
`Data and pipelines are up to date.` or
`Cache and remote 'myremote' are in sync` (if using the `-c` or `-r` options are
used). If differences are detected, the changes in <abbr>dependencies</abbr>
and/or <abbr>outputs</abbr> for each stage that differs are listed. For each
item listed, either the file name or hash is shown, along with a _state
description_, as detailed below:

### Local workspace status

- _changed checksum_ means that the `.dvc` file hash has changed (e.g. someone
  manually edited it).

- _always changed_ means that this is a `.dvc` file with no dependencies (see
  `dvc add`) or that the stage in `dvc.yaml` has the `always_changed: true`
  value set (see `--always-changed` option in `dvc run`).

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
Bringing the two into sync requires `dvc pull` or `dvc push`. For the typical
process to update the workspace, see
[Sharing Data And Model Files](/doc/use-cases/sharing-data-and-model-files).

For _missing_ data, there's nothing to retrieve from storage. This can happen
for example in fresh <abbr>DVC repository</abbr> clones if the data wasn't
uploaded from the original repo, or after certain uses of `dvc gc`. You can try
`dvc repro` to regenerate the output locally, and `dvc push` remotely after
that.

## Options

- `-c`, `--cloud` - enables comparison against a remote (see `dvc remote`). If
  the `--remote` option is not used, DVC will compare against the default remote
  (specified in the `core.remote` config option).

- `-a`, `--all-branches` - compares cache content against all Git branches
  instead of just the current workspace. This basically runs the same status
  command in every branch of this repo. The corresponding branches are shown in
  the status output. Applies only if `--cloud` or a `-r` remote is specified.
  Note that this can be combined with `-T` below, for example using the `-aT`
  flag.

- `-T`, `--all-tags` - same as `-a` above, but applies to Git tags as well as
  the workspace. Note that both options can be combined, for example using the
  `-aT` flag.

- `-R`, `--recursive` - determines the files to check status for by searching
  each target directory and its subdirectories for stages (in `dvc.yaml`) and
  `.dvc` files to inspect. If there are no directories among the targets, this
  option is ignored.

- `--show-json` - prints the command's output in easily parsable JSON format,
  instead of a human-readable table.

- `--all-commits` - same as `-a` or `-T` above, but applies to _all_ Git commits
  as well as the workspace. This compares the cache content for the entire
  commit history of the project.

- `-d`, `--with-deps` - determines files to check by tracking dependencies to
  the `targets`. If none are provided, this option is ignored. By traversing all
  stage dependencies, DVC searches backward from the target stages in the
  corresponding pipelines. This means DVC will not show changes occurring in
  later stages than the `targets`. Applies whether or not `--cloud` is
  specified.

- `-r <name>`, `--remote <name>` - specifies which remote storage (see
  `dvc remote list`) to compare against. Implies `--cloud`.

- `-j <number>`, `--jobs <number>` - parallelism level for DVC to retrieve
  information from remote storage. This only applies when the `--cloud` option
  is used, or a `--remote` is given. The default value is `4 * cpu_count()`. For
  SSH remotes, the default is `4`. Note that the default value can be set using
  the `jobs` config option with `dvc remote modify`. Using more jobs may speed
  up the operation.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if
  data and pipelines are up to date, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

```dvc
$ dvc status
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
baz.dvc:
	changed outs:
		modified:           baz
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
original file or directory changes later, `dvc status` will show
`update available` as output:

```dvc
$ dvc status
data.csv.dvc:
	changed deps:
		update available:   data.csv (different/repo/location)
```

The imported data can be brought to its latest version by using `dvc update`.
