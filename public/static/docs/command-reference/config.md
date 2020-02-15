# config

Get or set <abbr>project</abbr>-level (or global) DVC configuration options.

## Synopsis

```usage
usage: dvc config [-h] [--global] [--system] [--local] [-q | -v] [-u]
                  name [value]

positional arguments:
  name           Option name.
  value          Option value.
```

## Description

You can query/set/replace/unset DVC configuration options with this command. It
takes a config option `name` (a section and a key, separated by a dot) and its
`value` (any valid alpha-numeric string generally).

This command reads and updates the DVC configuration files. By default (if none
of `--local`, `--global`, or `--system` is provided) a project's config
(`.dvc/config`) file is read or modified. This file is by default meant to be
tracked by Git and should not contain sensitive and/or user-specific information
(passwords, SSH keys, etc). Use `--local`, `--global`, or `--system` options
instead to override project's settings, for sensitive, or user-specific
settings.

If the config option `value` is not provided and `--unset` option is not used,
this command returns the current value of the config option, if found in the
corresponding config file.

## Options

- `-u`, `--unset` - remove a specified config option from a config file.

- `--global` - modify a global config file (e.g. `~/.config/dvc/config`) instead
  of the project's `.dvc/config`.

- `--system` - modify a system config file (e.g. `/etc/dvc.config`) instead of
  `.dvc/config`.

- `--local` - modify a local config file instead of `.dvc/config`. It is located
  in `.dvc/config.local` and is Git-ignored. This is useful when you need to
  specify private config options in your config that you don't want to track and
  share through Git (credentials, private locations, etc).

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Configuration sections

The following config sections are written by this command to the project config
file (in `.dvc/config` by default), and they support the options below:

### core

This is the main section with the general config options:

- `core.loglevel` - log level that the `dvc` command should use. Possible values
  are: `info`, `debug`, `warning`, `error`.

- `core.remote` - name of the remote that should be used by default.

- `core.interactive` - whether to always ask for confirmation before reproducing
  each [stage](/doc/command-reference/run) in `dvc repro`. By default this
  behavior requires the use of option `-i` in that command. Accepts values
  `true` and `false`.

- `core.analytics` - used to turn off
  [anonymized usage statistics](/doc/user-guide/analytics). Accepts values
  `true` (default) and `false`.

- `core.checksum_jobs` - number of threads for computing file hashes. Accepts
  positive integers. The default value is `max(1, min(4, cpu_count() // 2))`.

- `core.hardlink_lock` - use hardlink file locks instead of the default ones,
  based on [`flock`](https://linux.die.net/man/2/flock) (i.e. project lock file
  `.dvc/lock`). Accepts values `true` and `false` (default). Useful when the DVC
  project is on a file system that doesn't properly support file locking (e.g.
  [NFS v3 and older](http://nfs.sourceforge.net/)).

### remote

These are sections in the config file that describe particular remotes. These
sections contain a `url` value, and can also specify `user`, `port`, `keyfile`,
`timeout`, `ask_password`, and other cloud-specific key/value pairs for each
remote. See `dvc remote` for more information.

### cache

A DVC project <abbr>cache</abbr> is the hidden storage (by default located in
the `.dvc/cache` directory) for files that are tracked by DVC, and their
different versions. (See `dvc cache` and
[DVC Files and Directories](/doc/user-guide/dvc-files-and-directories#structure-of-cache-directory)
for more details.) This section contains the following options:

- `cache.dir` - set/unset cache directory location. A correct value must be
  either an absolute path or a path **relative to the config file location**.
  The default value is `cache` that, resolved relative to the default project
  config location, results in `.dvc/cache`.

  > See also helper command `dvc cache dir` to intuitively set this config
  > option, properly transforming paths relative to the current working
  > directory into paths relative to the config file location.

- `cache.protected` - make DVC-tracked files read-only. Possible values are
  `true` or `false` (default). Run `dvc checkout` after changing the value of
  this option for the change to go into effect.

  Due to the way DVC handles linking between the data files in the cache and
  their counterparts in the <abbr>workspace</abbr>, it's easy to accidentally
  corrupt the cached file by editing or overwriting it. Turning this config
  option on forces you to run `dvc unprotect` before updating a file, providing
  an additional layer of security to your data.

  We highly recommend enabling this option when `cache.type` is set to
  `hardlink` or `symlink`.

- `cache.type` - link type that DVC should use to link data files from cache to
  the workspace. Possible values: `reflink`, `symlink`, `hardlink`, `copy` or a
  combination of those, separated by commas e.g: `reflink,hardlink,copy`.

  By default, DVC will try `reflink,copy` link types in order to choose the most
  effective of those two. DVC avoids `symlink` and `hardlink` types by default
  to protect user from accidental cache and repository corruption.

  ⚠️ If you manually set `cache.type` to `hardlink` or `symlink`, **you will
  corrupt the cache** if you modify tracked data files in the workspace. See the
  `cache.protected` config option above and corresponding `dvc unprotect`
  command to modify files safely.

  There are pros and cons to different link types. Refer to
  [File link types](/doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache)
  for a full explanation of each one.

  To apply changes to this option in the workspace, by restoring all file
  links/copies from cache, please use `dvc checkout --relink`. See
  [checkout options](/doc/command-reference/checkout#options) for more details.

- `cache.slow_link_warning` - used to turn off the warnings about having a slow
  cache link type. These warnings are thrown by `dvc pull` and `dvc checkout`
  when linking files takes longer than usual, to remind them that there are
  faster cache link types available than the defaults (`reflink,copy` – see
  `cache.type`). Accepts values `true` and `false`.

  > These warnings are automatically turned off when `cache.type` is manually
  > set.

- `cache.shared` - permissions for newly created or downloaded cache files and
  directories. The default permissions are `0o664`(rw-r--r--) for files and
  `0o755`(rwxr-xr-x) for directories. The only accepted value right now is
  `group`, which makes DVC use `0o664`(rw-rw-r--) for files and
  `0o775`(rwxrwxr-x) for directories, which is useful when you are using a a
  [shared development server](/doc/use-cases/shared-development-server).

- `cache.local` - name of a local remote to use as cache directory. (Refer to
  `dvc remote` for more information on "local remotes".) This will overwrite the
  value provided to `dvc config cache.dir` or `dvc cache dir`.

- `cache.ssh` - name of an
  [SSH remote to use as external cache](/doc/user-guide/managing-external-data#ssh).

  > Avoid using the same remote location that you are using for `dvc push`,
  > `dvc pull`, `dvc fetch` as external cache for your external outputs, because
  > it may cause possible file hash overlaps: the hash of a data file in
  > external storage could collide with a hash generated locally for another
  > file with a different content.

- `cache.s3` - name of an
  [Amazon S3 remote to use as external cache](/doc/user-guide/managing-external-data#amazon-s-3).

- `cache.gs` - name of a
  [Google Cloud Storage remote to use as external cache](/doc/user-guide/managing-external-data#google-cloud-storage).

- `cache.hdfs` - name of an
  [HDFS remote to use as external cache](/doc/user-guide/managing-external-data#hdfs).

- `cache.azure` - name of a Microsoft Azure Blob Storage remote to use as
  [external cache](/doc/user-guide/managing-external-data).

### state

See [DVC Files and Directories](/doc/user-guide/dvc-files-and-directories) to
learn more about the state file (database) that is used for optimization.

- `state.row_limit` - maximum number of entries in the state database, which
  affects the physical size of the state file itself, as well as the performance
  of certain DVC operations. The bigger the limit, the longer the file hash
  history that DVC can keep, in order to avoid sequential hash recalculations.
  The default limit is set to 10,000,000 rows.

- `state.row_cleanup_quota` - percentage of the state database that is going to
  be deleted when it hits the `state.row_limit`. When an entry in the database
  is used (e.g. during the `dvc status`) dvc updates the timestamp on that entry
  so that when it needs to cleanup the database it could sort them by the
  timestamp and remove the oldest ones. Default quota is set to 50(percent).

## Example: Set the debug level

```dvc
$ dvc config core.loglevel debug
```

## Example: Add an S3 remote, and set it as default

> 💡 Before adding an S3 remote, be sure to
> [Create a Bucket](https://docs.aws.amazon.com/AmazonS3/latest/gsg/CreatingABucket.html).

```dvc
$ dvc remote add myremote s3://bucket/path
$ dvc config core.remote myremote
```

> Note that this is equivalent to using `dvc remote add` with the
> `-d`/`--default` option.

## Example: Default remotes

Use remote `myremote` by default:

```dvc
$ dvc config core.remote myremote
```

Get the default remote:

```dvc
$ dvc config core.remote
myremote
```

Clear default remote value:

```dvc
$ dvc config --unset core.remote
```

The above command is equivalent to:

```dvc
$ dvc config core.remote -u
```

## Example: Cache config options

Set the <abbr>cache directory</abbr> to an absolute path:

```dvc
$ dvc config cache.dir /mnt/cache
$ dvc config cache.dir
/mnt/cache
```

or to a relative path (resolved from `./.dvc/`):

```dvc
$ dvc config cache.dir ../../mycache
$ dvc pull -q
$ ls ../mycache
2f/
```

Set cache type: if `reflink` is not available, use `copy`:

```dvc
$ dvc config cache.type reflink,copy
```

Protect DVC-tracked data files by making them read-only:

```dvc
$ dvc config cache.protected true
```
