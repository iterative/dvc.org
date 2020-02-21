# gc

Remove unused objects from <abbr>cache</abbr> or remote storage.

## Synopsis

```usage
usage: dvc gc [-h] [-q | -v] [-a] [-T] [-c] [-r REMOTE] [-f] [-j JOBS]
              [-p [REPOS [REPOS ...]]]
```

## Description

This command deletes (garbage collects) data files or directories that may exist
in the cache (or [remote storage](/doc/command-reference/remote) if `-c` is
used) but no longer referenced in [DVC-files](/doc/user-guide/dvc-file-format)
currently in the <abbr>workspace</abbr>. By default, this command only cleans up
the local cache, which is typically located on the same machine as the project
in question. This usually helps to free up disk space.

There are important things to note when using Git to version the
<abbr>project</abbr>:

- If the cache/remote holds several versions of the same data, all except the
  current one will be deleted.
- Use the `--all-branches` or `--all-tags` options to avoid collecting data
  referenced in the tips of all branches or all tags, respectively.

Unless the `--cloud` (`-c`) option is used, `dvc gc` does not remove data files
from any remote. This means that any files collected from the local cache can be
restored using `dvc fetch`, as long as they have previously been uploaded with
`dvc push`.

## Options

- `-a`, `--all-branches` - keep cached objects referenced in all Git branches.
  Useful for keeping data for all the latest experiment versions. It's
  recommended to consider including this option when using `-c` i.e.
  `dvc gc -ac`.

- `-T`, `--all-tags` - the same as `-a` above, but applies to Git tags. It's
  useful if tags are used to track "checkpoints" of an experiment or project.
  Note that both options can be combined, for example using the `-aT` flag.

- `-p`, `--projects` - if a single remote or a single cache is shared among
  different projects (e.g. a configuration like the one described
  [here](/doc/use-cases/shared-development-server)), this option can be used to
  specify a list of them (each project is a path) to keep data that is currently
  referenced from them.

- `-c`, `--cloud` - also remove files in remote storage. _This operation is
  dangerous._ It removes datasets, models, other files that are not linked in
  the current commit (unless `-a` or `-T` are also used). The default remote is
  used unless a specific one is given with `-r`.

- `-r`, `--remote` - name of the remote storage to collect unused objects from
  if `-c` option is specified.

- `-j`, `--jobs` - garbage collector parallelism level. The default value is
  `4 * cpu_count()`. For SSH remotes default is 4. For now only some phases of
  GC are parallel.

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

When you run `dvc gc` it removes all objects from cache that are not referenced
in the <abbr>workspace</abbr> (by collecting hash values from the DVC-files):

```dvc
$ dvc gc

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
