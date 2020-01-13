# status

Show changes in the <abbr>project</abbr>
[pipelines](/doc/command-reference/pipeline), as well as mismatches either
between the <abbr>cache</abbr> and <abbr>workspace</abbr> files, or between the
cache and remote storage.

## Synopsis

```usage
usage: dvc status [-h] [-v] [-j JOBS] [--show-checksums] [-q] [-c]
                  [-r REMOTE] [-a] [-T] [-d] [targets [targets ...]]

positional arguments:
  targets        Limit command scope to these DVC-files. Using -R,
                 directories to search DVC-files in can also be given.
```

## Description

`dvc status` searches for changes in the existing pipelines, either showing
which [stages](/doc/command-reference/run) have changed in the workspace and
must be reproduced (with `dvc repro`), or differences between cache vs. remote
storage (meaning `dvc push` or `dvc pull` should be run to synchronize them).
The two modes, _local_ and _cloud_ are triggered by using the `--cloud` or
`--remote` options:

| Mode   | CLI Option | Description                                                                                                                 |
| ------ | ---------- | --------------------------------------------------------------------------------------------------------------------------- |
| local  | _none_     | Comparisons are made between data files in the workspace and corresponding files in the cache directory (e.g. `.dvc/cache`) |
| remote | `--remote` | Comparisons are made between the cache, and the given remote. Remote storage is defined using the `dvc remote` command.     |
| remote | `--cloud`  | Comparisons are made between the cache, and the default remote, defined with `dvc remote --default` command.                |

DVC determines data and code files to compare by analyzing all
[DVC-files](/doc/user-guide/dvc-file-format) in the <abbr>project</abbr>
(`--all-branches` and `--all-tags` in the `cloud` mode compare multiple
workspace versions). The comparison can be limited to specific DVC-files by
listing them as `targets`. Changes are reported only against the given
`targets`. When combined with the `--with-deps` option, a search is made for
changes in other stages that affect the target.

In the `local` mode, changes are detected through the checksum of every file
listed in every DVC-file in question against the corresponding file in the file
system. The command output indicates the detected changes, if any. If no
differences are detected, `dvc status` prints this message:

```dvc
$ dvc status
Data and pipelines are up to date.
```

This indicates that no differences were detected, and therefore no stages would
be executed by `dvc repro`.

If instead, differences are detected, `dvc status` lists those changes. For each
DVC-file (stage) with differences, the changes in _dependencies_ and/or
_outputs_ that differ are listed. For each item listed, either the file name or
the checksum is shown, and additionally a status word is shown describing the
changes (described below). This changes list provides a reference to both the
status of a DVC-file, as well as the changes to individual dependencies and
outputs described in it.

- _changed checksum_ means that the <abbr>DVC-file</abbr> checksum has changed
  (e.g. someone manually edited the file).

- _always changed_ means that this is a DVC-file with no dependencies (an
  _orphan_ stage file) or that it has the `always_changed: true` value set (see
  `--always-changed` option in `dvc run`), so its considered always changed, and
  thus is always executed by `dvc repro`.

- _changed deps_ or _changed outs_ means that there are changes in dependencies
  or outputs tracked by the <abbr>DVC-file</abbr>. Depending on the use case,
  commands like `dvc commit` or `dvc repro`, `dvc run` should be run to update
  the file. Possible states are:

  - _new_: <abbr>Output</abbr> exists in workspace, but there is no
    corresponding checksum calculated and saved in the DVC-file for this output
    yet.
  - _modified_: Output or dependency exists in workspace, but the corresponding
    checksum in the DVC-file is not up to date.
  - _deleted_: Output or dependency does not exist in workspace, but still
    referred in the DVC-file.
  - _not in cache_: Output exists in workspace and the corresponding checksum in
    the DVC-file is up to date, but there is no corresponding <abbr>cache</abbr>
    entry.

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

- `-d`, `--with-deps` - one or more `targets` should be specified for this
  option to have effect. Determines files to check by tracking dependencies to
  the target DVC-files (stages). By traversing all stage dependencies, DVC
  searches backward from the target stages in the corresponding pipelines. This
  means DVC will not show changes occurring in later stages than the `targets`.
  Applies whether or not `--cloud` is specified.

- `-c`, `--cloud` - enables comparison against a remote. (See `dvc remote`.). If
  no `--remote` option has been given, DVC will compare against the default
  remote (specified in the `core.remote` config option). Otherwise the
  comparison will be against the remote specified in the `--remote` option.

- `-r REMOTE`, `--remote REMOTE` - specifies which remote storage (see
  `dvc remote list`) to compare against. The argument, `REMOTE`, is a remote
  name defined using the `dvc remote` command. Implies `--cloud`.

- `-a`, `--all-branches` - compares cache content against all Git branches
  instead of checking just the current workspace version. This basically runs
  the same status command in all the branches of this repo. The corresponding
  branches are shown in the status output. Applies only if `--cloud` or a `-r`
  remote is specified.

- `-T`, `--all-tags` - compares cache content against all Git tags instead of
  checking just the current workspace version. Similar to `-a` above. Note that
  both options can be combined, for example using the `-aT` flag.

- `-j JOBS`, `--jobs JOBS` - specifies the number of jobs DVC can use to
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

If the `dvc status` command is limited to a target that had no changes, result
shows no changes. By adding `--with-deps` the change will be found, so long as
the change is in a preceding stage.

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
Preparing to collect status from s3://dvc-remote
    new:      data/model.p
    new:      data/eval.txt
    new:      data/matrix-train.p
    new:      data/matrix-test.p
```

The output shows where the location of the remote storage is, as well as any
differences between the <abbr>cache</abbr> and `storage` remote.
