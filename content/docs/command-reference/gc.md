# gc

Remove unused files and directories from <abbr>cache</abbr> or [remote storage].

## Synopsis

```usage
usage: dvc gc [-h] [-q | -v] [-w] [-a] [-T] [--all-commits]
              [--all-experiments] [-c] [-r <name>] [-f] [-j <number>]
              [-p [<path> [<path> ...]]]
```

## Description

This command can delete (garbage collect) data files or directories that exist
in the <abbr>cache</abbr> but are no longer needed. With `--cloud`, it also
[removes data in remote storage](#removing-data-in-remote-storage).

To avoid accidentally deleting data, `dvc gc` doesn't do anything unless one or
a combination of scope options are provided (`--workspace`, `--all-branches`,
`--all-tags`, `--all-commits`, `--all-experiments`). Use these to indicate which
cached files are still needed. See the [Options](#options) section for more
details.

The data kept is determined by reading the <abbr>DVC files</abbr> in the set of
commits of the given scope.

> Note that `dvc gc` tries to fetch missing [`.dir` files] from remote storage
> to local cache in order to determine which files should exist inside cached
> directories. These files may be missing if the cache was previously garbage
> collected, in a newly cloned copy of the repo, etc.

Unless the `--cloud` option is used, any files collected from the cache can be
restored using `dvc fetch`, as long as they have been previously uploaded with
`dvc push`.

[`.dir` files]:
  /doc/user-guide/project-structure/internal-files#structure-of-the-cache-directory

### Removing data in remote storage

If the `--cloud` (`-c`) flag is used, this command deletes unused data from the
[default remote storage](/doc/command-reference/remote/default) **in addition**
to deleting it from the local DVC cache. To specify a DVC remote to delete from,
use the `--remote` (`-r`) option.

> ⚠️ Danger: cloud deletion is irreversible unless there is another DVC remote
> or a manual backup with the same data.

## Options

- `-w`, `--workspace` - keep _only_ files and directories referenced in the
  workspace. This option is enabled automatically with the other scope options
  (below).

- `-a`, `--all-branches` - keep cached data referenced in all Git branches, as
  well as in the workspace (implying `-w`). Useful if branches are used to track
  different experiments. Note that this can be combined with `-T` below, for
  example using the `-aT` flags.

- `-T`, `--all-tags` - keep cached data referenced in all Git tags, as well as
  in the workspace (implying `-w`). Useful if tags are used to mark certain
  versions of an experiment or project. Note that this can be combined with `-a`
  above, for example using the `-aT` flags.

- `-A`, `--all-commits` - keep cached data referenced in all\* Git commits, as
  well as in the workspace (implying `-w`). This preserves the cache for all
  data used in the entire commit history of the project.

  A use case for this option is to safely delete all temporary data `dvc run`
  and/or `dvc repro` cache when used without committing changes (see the `-O` or
  `-M`, and `--no-commit` options in those commands). In that scenario, data
  that is never referenced from the workspace or from any Git commit can still
  be stored in the project's cache).

  > \* Not including [DVC experiments]

[dvc experiments]: /doc/user-guide/experiment-management#experiments

- `--all-experiments` keep cached objects referenced in all [DVC experiments],
  as well as in the workspace (implying `-w`). This preserves the project's
  [experimental](/doc/user-guide/experiment-management) data (including
  checkpoints). See also `dvc exp gc`.

- `-p <paths>`, `--projects <paths>` - if a single remote or a single
  [cache is shared](/doc/user-guide/how-to/share-a-dvc-cache) among different
  projects, this option can be used to specify a list of them (each project is a
  path) to keep data that is currently referenced from them.

- `-c`, `--cloud` - remove files in remote storage in addition to local cache.
  **This option is dangerous.** The default remote is used unless a specific one
  is given with `-r`.

- `-r <name>`, `--remote <name>` - name of the
  [remote storage](/doc/command-reference/remote) to collect unused objects from
  if `-c` option is specified (see `dvc remote list`).

- `-j <number>`, `--jobs <number>` - parallelism level for DVC to access data
  from remote storage. This only applies when the `--cloud` option is used, or a
  `--remote` is given. The default value is `4 * cpu_count()`. Note that the
  default value can be set using the `jobs` config option with
  `dvc remote modify`. Using more jobs may speed up the operation.

  > For now only some phases of garbage collection are parallel.

- `-f`, `--force` - force garbage collection. Skip confirmation prompt.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Basic example of cleaning up the <abbr>cache</abbr>:

```dvc
$ du -sh .dvc/cache/
7.4G    .dvc/cache/
```

When you run `dvc gc --workspace`, DVC removes all objects from cache that are
not referenced in the <abbr>workspace</abbr> (by collecting hash values from the
<abbr>DVC files</abbr>):

```dvc
$ dvc gc --workspace

'.dvc/cache/27e30965256ed4d3e71c2bf0c4caad2e' was removed
'.dvc/cache/2e006be822767e8ba5d73ebad49ef082' was removed
'.dvc/cache/2f412200dc53fb97dcac0353b609d199' was removed
'.dvc/cache/541025db4da02fcab715ca2c2c8f4c19' was removed
'.dvc/cache/62f8c2ba93cfe5a6501136078f0336f9' was removed
'.dvc/cache/7c4521365288d69a03fa22ad3d399f32' was removed
'.dvc/cache/9ff7365a8256766be8c363fac47fc0d4' was removed
'.dvc/cache/a86ca87250ed8e54a9e2e8d6d34c252e' was removed
'.dvc/cache/f64d65d4ccef9ff9d37ea4cf70b18700' was removed
```

Let's check the size now:

```dvc
$ du -sh .dvc/cache/
3.1G    .dvc/cache/
```
