# gc

Remove unused objects from cache or remote storage.

## Synopsis

```usage
usage: dvc gc [-h] [-q | -v] [-a] [-T] [-c]
              [-r REMOTE] [-f] [-j JOBS]
              [-p [PROJECTS [PROJECTS ...]]]
```

## Description

If a data file was created in a different branch or commit than current, then it
will be removed by `dvc gc`, unless `--all-branches` or `--all-tags` option is
specified. If a data file has a few cached versions all of them except the
current one will be removed.

Note that unless `-c|--cloud` is specified, this action does NOT remove data
files from the remote storage. **Make sure though that remote is configured and
all the data you will need in the future is pushed there.** See `dvc remote` and
`dvc config` for more information. This command is just a way to clean the
working cache which is usually located on the machine your are running
experiments on and usually helps to save some space. You can `dvc fetch` all the
needed files back anytime you want.

## Options

- `-a`, `--all-branches` - keep cached objects referenced from the latest commit
  across all branches. It should be used if you want to keep data for the latest
  experiment revisions. Especially, if you intend to use `dvc gc -c` this option
  is much safer.

- `-T`, `--all-tags` - the same as `-a` but keeps cache for existing tags. It's
  useful if tags are used to track "checkpoints" of an experiment or project.

- `-p`, `--projects` - if a single remote or a single cache is shared (e.g. a
  configuration one describe
  [here](/doc/use-cases/multiple-data-scientists-on-a-single-machine)) among
  different projects, this option can be used to specify a list of them (each
  project is a path) to keep data that is currently referenced from them.

- `-c`, `--cloud` - also remove files in the remote storage. _This operation is
  dangerous._ It removes data sets, models, other files that are not linked in
  the current branch/commit (unless `-a` or `-T` is specified).

- `-r`, `--remote` - name of the remote storage to collect unused objects from
  if `-c` option is specified.

- `-j`, `--jobs` - garbage collector parallelism level. The default value is
  `4 * cpu_count()`. For SSH remotes default is 4. For now only some phases of
  GC are parallel.

- `-f`, `--force` - force garbage collection. Skip confirmation prompt.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Basic example of cleaning up the cache:

```dvc
$ du -sh .dvc/cache/
7.4G    .dvc/cache/
```

When you run `dvc gc` it removes all objects from cache that are not referenced
in the current workspace (by collecting hash sums from the stage DVC files):

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
