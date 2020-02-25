# gc

Remove unused objects from <abbr>cache</abbr> or remote storage.

## Synopsis

```usage
usage: dvc gc [-h] [-q | -v]
              [-w] [-a] [-T] [--all-commits] [-c] [-r <name>]
              [-f] [-j <number>] [-p [<path> [<path> ...]]]
```

## Description

This command deletes (garbage collects) data files or directories that may exist
in the cache (or [remote storage](/doc/command-reference/remote) if `-c` is
used) but no longer referenced in [DVC-files](/doc/user-guide/dvc-file-format)
currently in the <abbr>workspace</abbr>. To avoid accidentally deleting data,
this command requires the explicit use of [option](#options) flags to determine
it's behavior (i.e. what "garbage" to collect).

By default, this command won't delete anything at all to make it safe and
explicit. However, you can use different flags to change the behavior.

Using the `--workspace` or `-w` option, it will only clean up the local cache,
which is typically located on the same machine as the <abbr>DVC project</abbr>
in question. This is an aggessive behavior that usually helps to free up disk
space.

There are important things to note when using Git to version the project:

- If the cache/remote holds several versions of the same data, all except the
  current one will be deleted.
- Use the `--all-branches`/`--all-tags`/`--all-commits` options to avoid
  collecting data referenced in the tips of all branches or all tags,
  respectively.

The default remote is used (see `dvc config core.remote`) unless the `--remote`
option is used.

Unless the `--cloud` (`-c`) option is used, `dvc gc` does not remove data files
from any remote. This means that any files collected from the local cache can be
restored using `dvc fetch`, as long as they have previously been uploaded with
`dvc push`.

## Options

- `-a`, `--all-branches` - keep cached objects referenced in all Git branches as
  well as in the workspace (implies `-w`). Useful for keeping data for all the
  latest experiment versions. It's recommended to consider including this option
  when using `-c` i.e. `dvc gc -ac`.

- `-T`, `--all-tags` - the same as `-a` above, but applies to Git tags as well
  as in the workspace (implies `-w`). Useful if tags are used to track
  "checkpoints" of an experiment or project. Note that both options can be
  combined, for example using the `-aT` flag.

- `--all-commits` - the same as `-a` or `-T` above, but applies to Git commits
  as well as in the workspace (implies `-w`). Useful for keeping data for all
  experiment versions ever used in the history of the project.

- `-w`, `--workspace` - remove files in local cache that are not referenced in
  the workspace. **This behavior is dangerous.** This option is enabled
  automatically if `--all-tags` or `--all-branches` are used.

- `-p <paths>`, `--projects <paths>` - if a single remote or a single cache is
  shared among different projects (e.g. a configuration like the one described
  [here](/doc/use-cases/shared-development-server)), this option can be used to
  specify a list of them (each project is a path) to keep data that is currently
  referenced from them.

- `-c`, `--cloud` - remove files in remote storage in addition to local cache.
  **This behavior is dangerous.** It removes datasets, models or other files
  that are not linked in the current commit (unless `-a` or `-T` are also used).
  The default remote is used unless a specific one is given with `-r`.

- `-r <name>`, `--remote <name>` - name of the
  [remote storage](/doc/command-reference/remote) to collect unused objects from
  if `-c` option is specified (see `dvc remote list`).

- `-j <number>`, `--jobs <number>` - garbage collector parallelism level. The
  default `JOBS` argument is `4 * cpu_count()`. For SSH remotes default is 4.

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
DVC-files):

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
