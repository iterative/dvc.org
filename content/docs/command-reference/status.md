# status

Show changes in the <abbr>project</abbr>
[pipelines](/doc/command-reference/pipeline), as well as file mismatches either
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

`dvc status` searches for changes in the existing tracked data and pipelines,
either showing which files or directories have changed in the
<abbr>workspace</abbr> and must be added or reproduced again (with `dvc add` or
`dvc repro`); or differences between <abbr>cache</abbr> vs. remote storage
(implying `dvc push` or `dvc pull` should be run to synchronize them). The
_remote_ mode is triggered by using the `--cloud` or `--remote` options:

| Mode   | Command option | Description                                                                                                                 |
| ------ | -------------- | --------------------------------------------------------------------------------------------------------------------------- |
| local  | _none_         | Comparisons are made between data files in the workspace and corresponding files in the cache directory (e.g. `.dvc/cache`) |
| remote | `--remote`     | Comparisons are made between the cache, and the given remote. Remote storage is defined using the `dvc remote` command.     |
| remote | `--cloud`      | Comparisons are made between the cache, and the default remote (typically defined with `dvc remote --default`).             |

This command scans all `dvc.lock` and `.dvc` files to compare the hash values
saved in their `outs` fields against the actual data files or directories in the
<abbr>workspace</abbr> (the `--all-branches` and `--all-tags` options compare
multiple workspace versions). Scanning is limited to the given `targets` (if
any). See also options `--with-deps` and `--recursive` below.

DVC supports granularity as well: the targets may be files or directories found
inside a directory that is
[tracked as a whole](/doc/command-reference/add#example-directory).

If no differences are detected, `dvc status` prints
`Data and pipelines are up to date.` If differences are detected by
`dvc status`, the command output indicates the changes. For each stage with
differences, the changes in <abbr>dependencies</abbr> and/or
<abbr>outputs</abbr> that differ are listed. For each item listed, either the
file name or hash is shown, along with a _state description_, as detailed below:

- _changed checksum_ means that the `.dvc` file hash has changed (e.g. someone
  manually edited it).

- _always changed_ means that this is a
  [`.dvc` file](/doc/user-guide/dvc-files-and-directories#dvc-files) with no
  dependencies (see `dvc add`) or that the stage in
  [`dvc.yaml`](/doc/user-guide/dvc-files-and-directories#dvcyaml-file) has the
  `always_changed: true` value set (see `--always-changed` option in `dvc run`).

- _changed deps_ or _changed outs_ means that there are changes in dependencies
  or outputs tracked by the stage in
  [`dvc.lock`](/doc/user-guide/dvc-files-and-directories#dvcyaml-file)) or
  `.dvc` file. Depending on the use case, commands like `dvc commit`,
  `dvc repro`, or `dvc run` can be used to update the file. Possible states are:

  - _new_: An <abbr>output</abbr> is found in the workspace, but there is no
    corresponding file hash saved in the `dvc.lock` or `.dvc` file yet.
  - _modified_: An output or <abbr>dependency</abbr> is found in the workspace,
    but the corresponding file hash in the `dvc.lock` or `.dvc` file is not up
    to date.
  - _deleted_: The output or dependency is referenced in a `dvc.yaml` or `.dvc`
    file, but does not exist in the workspace.
  - _not in cache_: An output exists in the workspace, and the corresponding
    file hash in the `dvc.lock` or `.dvc` file is up to date, but there is no
    corresponding <abbr>cache</abbr> file or directory.

- _update available_ means that an <abbr>import stage</abbr> is outdated (the
  original data source has changed). The imported data can be brought to its
  latest version by using `dvc update`.

**For comparison against remote storage:**

- _new_ means that the file/directory exists in the cache but not in remote
  storage.
- _deleted_ means that the file/directory doesn't exist in the cache, but exists
  in remote storage.

For either _new_ and _deleted_ data, the cache (subset determined by the current
workspace) is different from remote storage. Bringing the two into sync requires
`dvc pull` or `dvc push`. For the typical process to update the workspace, see
[Sharing Data And Model Files](/doc/use-cases/sharing-data-and-model-files).

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

- `--all-commits` - same as `-a` or `-T` above, but applies to _all_ Git  
  commits as well as the workspace. Useful for comparing cache content for the
  entire existing commit history of the project.

- `-d`, `--with-deps` - determines files to check by tracking dependencies to
  the `targets`. If none are provided, this option is ignored. By traversing all
  stage dependencies, DVC searches backward from the target stages in the
  corresponding pipelines. This means DVC will not show changes occurring in
  later stages than the `targets`. Applies whether or not `--cloud` is
  specified.

- `-r <name>`, `--remote <name>` - specifies which remote storage (see
  `dvc remote list`) to compare against. Implies `--cloud`.

- `-j <number>`, `--jobs <number>` - specifies the number of jobs DVC can use to
  retrieve information from remote servers. This only applies when the `--cloud`
  option is used or a remote is given.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if
  data and pipelines are up to date, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example: Simple usage

```dvc
$ dvc status
bar.dvc:
        changed deps:
                modified:      bar
        changed outs:
                not in cache:      foo
foo.dvc
        changed outs:
                deleted:      foo
        changed checksum
prepare.dvc
        changed outs:
                new:      bar
        always changed
```

This shows that for stage `bar.dvc`, the dependency `foo` and the
<abbr>output</abbr> `bar` have changed. Likewise for `foo.dvc`, the dependency
`foo` has changed, but no output has changed.

## Example: Dependencies

```dvc
$ vi code/featurization.py
... edit the code

$ dvc status model.p.dvc
Data and pipelines are up to date.

$ dvc status model.p.dvc --with-deps
matrix-train.p.dvc
    changed deps:
            modified:  code/featurization.py
```

If the `dvc status` command is limited to a target that had no changes, but by
adding `--with-deps`, any upstream change will be found (in a preceding stage).

## Example: Remote comparisons

Let's now assume that we have a shared remote on S3: and would like to check
what files we have generated but haven't pushed to the remote yet:

```dvc
$ dvc remote list
storage	s3://dvc-remote
```

And would like to check what files we have generated but haven't pushed to the
remote yet:

```dvc
$ dvc status --remote storage
new:      data/model.p
new:      data/eval.txt
new:      data/matrix-train.p
new:      data/matrix-test.p
```

The output shows where the location of the remote storage is, as well as any
differences between the <abbr>cache</abbr> and `storage` remote.

Note that when comparing against remote storage, `dvc status` supports
granularity for files found in tracked directories, for example:

```dvc
$ tree data
data
├── raw
│   ├── partition.1.dat
│   ├── ...
│   └── partition.n.dat
└── raw.dvc              # data/raw/ is tracked as a whole.

$ dvc status -r local data/raw/partition.1.dat
new:                data/raw
```

## Example: Import stage needs update

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
