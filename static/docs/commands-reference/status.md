# status

Show changes in the [pipeline(s)](/doc/get-started/pipeline), as well as
mismatches either between the local cache and local files, or between the local
cache and remote cache.

## Synopsis

```usage
usage: dvc status [-h] [-v] [-j JOBS] [--show-checksums] [-q] [-c]
                  [-r REMOTE] [-a] [-T] [-d] [targets [targets ...]]

positional arguments:
  targets        Limit command scope to these DVC-files. Using -R,
                 directories to search DVC-files in can also be given.
```

## Description

`dvc status` searches for changes in the existing pipeline(s), either showing
which [stages](/doc/commands-reference/run) have changed in the local workspace
and must be reproduced (with `dvc repro`), or differences between the local
cache and remote cache (meaning `dvc push` or `dvc pull` should be run to
synchronize them). The two modes, _local_ and _cloud_ are triggered by using the
`--cloud` or `--remote` options:

| Mode   | CLI Option | Description                                                                                                                   |
| ------ | ---------- | ----------------------------------------------------------------------------------------------------------------------------- |
| local  | _none_     | Comparisons are made between data files in the workspace and corresponding files in the local cache (`.dvc/cache`)            |
| remote | `--remote` | Comparisons are made between the local cache, and the given remote. Remote caches are defined using the `dvc remote` command. |
| remote | `--cloud`  | Comparisons are made between the local cache, and the default remote, defined with `dvc remote --default` command.            |

DVC determines data and code files to compare by analyzing all
[DVC-files](/doc/user-guide/dvc-file-format) in the workspace (`--all-branches`
and `--all-tags` in the `cloud` mode compare multiple workspaces - across all
branches or tags). The comparison can be limited to specific DVC-files by
listing them as `targets`. Changes are reported only against the given
`targets`. When combined with the `--with-deps` option, a search is made for
changes in other stages that affect the target.

In the `local` mode, changes are detected through the checksum of every file
listed in every DVC-file in question against the corresponding file in the file
system. The output indicates the detected changes, if any. If no differences are
detected, `dvc status` prints this message:

```dvc
$ dvc status
Data and pipelines are up to date.
```

This indicates that no differences were detected, and therefore no stages would
be run again by `dvc repro`.

If instead, differences are detected, `dvc status` lists those changes. For each
DVC-file (stage) with differences, the changes in _dependencies_ and/or
_outputs_ that differ are listed. For each item listed, either the file name or
the checksum is shown, and additionally a status word is shown describing the
changes (described below). This changes list provides a reference to both the
status of a DVC-file, as well as the changes to individual dependencies and
outputs described in it.

- _changed checksum_ means that the <abbr>DVC-file</abbr> checksum has changed
  (e.g. someone manually edited the file).

- _always changed_ means that this is a special DVC-file with no dependencies
  (orphans), which is considered always changed and is always executed by
  `dvc repro`.

- _changed deps_ or _changed outs_ means that there are changes in dependencies
  or outputs defined by the <abbr>DVC-file</abbr>. Depending on the use case,
  commands like `dvc commit` or `dvc repro`, `dvc run` should be run to update
  the file. Possible states are:

  - _new_: Output exists in workspace, but there is no corresponding checksum
    calculated and saved in the DVC-file for this output yet.
  - _modified_: Output or dependency exists in workspace, but the corresponding
    checksum in the DVC-file is not up to date.
  - _deleted_: Output or dependency does not exist in workspace, but still
    referred in the DVC-file.
  - _not in cache_: Output exists in workspace and the corresponding checksum in
    the DVC-file is up to date, but there is no corresponding <abbr>cache</abbr>
    entry.

**For comparison against a remote cache:**

- _new_ means the file exists in the local cache but not the remote cache
- _deleted_ means the file doesn't exist in the local cache, but exists in the
  remote cache

For either the _new_ and _deleted_ cases, the local cache (subset of it, that is
determined by the active workspace) is different from the remote cache. Bringing
the two into sync requires `dvc pull` or `dvc push` to synchronize the DVC
cache. For the typical process to update workspaces, see
[Share Data And Model Files](/doc/use-cases/share-data-and-model-files).

## Options

- `-d`, `--with-deps` - determines files to check by tracking dependencies to
  the target DVC-file(s) (stages). This option only has effect when one or more
  `targets` are specified. By traversing all stage dependencies, DVC searches
  backward from the target stage(s) in the corresponding pipeline(s). This means
  DVC will not show changes occurring in later stage(s) than `targets`. Applies
  whether or not `--cloud` is specified.

- `-c`, `--cloud` - enables comparison against a remote cache. If no `--remote`
  option has been given, DVC will compare against the default remote cache,
  which is specified in the `core.remote` config option. Otherwise the
  comparison will be against the remote specified in the `--remote` option.

- `-r REMOTE`, `--remote REMOTE` - specifies which remote storage (see
  `dvc remote list`) to compare against. The argument, `REMOTE`, is a remote
  name defined using the `dvc remote` command. Implies `--cloud`.

- `-a`, `--all-branches` - compares cache content against all Git branches.
  Instead of checking just the workspace, it runs the same status command in all
  the branches of this repo. The corresponding branches are shown in the status
  output. Applies only if `--cloud` or a remote is specified.

- `-T`, `--all-tags` - compares cache content against all Git tags. Both the
  `--all-branches` and `--all-tags` options cause DVC to check more than just
  the workspace. The corresponding tags are shown in the status output. Applies
  only if `--cloud` or a remote is specified.

- `-j JOBS`, `--jobs JOBS` - specifies the number of jobs DVC can use to
  retrieve information from remote servers. This only applies when the `--cloud`
  option is used or a remote is given.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if
  Pipelines are up to date, otherwise 1.

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

This shows that for `bar.dvc` the dependency, `foo`, has changed, and the
output, `bar` has changed. Likewise for `foo.dvc` the dependency `foo` has
changed, but no output has changed.

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
rcache	s3://dvc-remote
```

And would like to check what files we have generated but haven't pushed to the
remote yet:

```dvc
$ dvc status --remote rcache

Preparing to collect status from s3://dvc-remote
[##############################] 100% Collecting information
    new:      data/model.p
    new:      data/eval.txt
    new:      data/matrix-train.p
    new:      data/matrix-test.p
```

The output shows where the location of the remote cache as well as any
differences between the local cache and remote cache.
