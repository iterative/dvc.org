# config

Get or set repository or global DVC config options.

```usage
usage: dvc config [-h] [-q | -v] [--global] [--system] [--local]
                  [-u] name [value]

positional arguments:
    name                  Option name
    value                 Option value
```

## Description

You can query/set/replace/unset DVC configuration options with this command. It
takes a config option `name` (a section and a key, separated by a dot) and its
`value`.

This command reads and overwrites the DVC config file `.dvc/config`. If
`--local` option is specified, `.dvc/config.local` is modified instead.

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
  specify private config options in your config, that you don't want to track
  and share through Git.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Configuration sections

These are the `name` parameters that can be used with `dvc config`, or the
sections in the project config file (`.dvc/config`).

### core

This is the main section with the general config options:

- `core.loglevel` - log level that the `dvc` command should use. Possible values
  are: `info`, `debug`, `warning`, `error`.

- `core.remote` - name of the remote that should be used by default.

- `core.interactive` - whether to always ask for confirmation before reproducing
  each stage in `dvc repro`. By default this behavior requires the use of option
  `-i` in that command. Accepts values `true` and `false`.

- `core.analytics` - used to turn off
  [anonymized usage statistics](/doc/user-guide/analytics). Accepts values
  `true` (default) and `false`.

### remote

These are sections in the config file that describe particular remotes. These
sections contain a `url` value, and can also specify `user`, `port`, `keyfile`,
`timeout`, `ask_password`, and other cloud-specific key/value pairs for each
remote. See `dvc remote` for more information.

### cache

The DVC cache is a hidden storage (by default located in the `.dvc/cache`
directory) for files that are under DVC control, and their different versions.
(See `dvc cache` and
[DVC internal files](/doc/user-guide/dvc-files-and-directories) for more
details.)

- `cache.dir` - set/unset cache directory location. A correct value must be
  either an absolute path or a path **relative to the config file location**.
  The default value is `cache`, which resolved relative to the default project
  config location results in `.dvc/cache`.

  > See also helper command `dvc cache dir` that properly transform paths
  > relative to the present working directory into relative to the project
  > config file.

- `cache.protected` - makes files in the workspace read-only. Possible values
  are `true` or `false` (default). Run `dvc checkout` for the change go into
  effect. (It affects only files that are under DVC control.)

  Due to the way DVC handles linking between the data files in the cache and
  their counterparts in the working directory, it's easy to accidentally corrupt
  the cached version of a file by editing or overwriting it. Turning this config
  option on forces you to run `dvc unprotect` before updating a file, providing
  an additional layer of security to your data.

  It's highly recommended to enable this mod when `cache.type` is set to
  `hardlink` or `symlink`.

- `cache.type` - link type that DVC should use to link data files from cache to
  your workspace. Possible values: `reflink`, `symlink`, `hardlink`, `copy` or a
  combination of those, separated by commas e.g: `reflink,hardlink,copy`.

  By default, DVC will try `reflink,copy` link types in order to choose the most
  effective of those two. DVC avoids `symlink` and `hardlink` types by default
  to protect user from accidental cache and repository corruption.

  > **Note!** If you manually set `cache.type` to `hardlink` or `symlink`, **you
  > will corrupt the cache** if you modify tracked data files in the workspace.
  > See the `cache.protected` config option above and corresponding
  > `dvc unprotect` command to modify files safely.

  There are pros and cons to different link types. Refer to
  [File link types](/docs/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache)
  for a full explanation of each one.

- `cache.slow_link_warning` - used to turn off the warnings about having a slow
  cache link type. These warnings are thrown by `dvc pull` and `dvc checkout`
  when linking files takes longer than usual, to remind them that there are
  faster cache link types available than the defaults (`reflink,copy` – see
  `cache.type`). Accepts values `true` and `false`.

  > These warnings are automatically turned off when `cache.type` is manually
  > set.

- `cache.local` - name of a local remote to use as local cache. This will
  overwrite the value provided to `dvc config cache.dir` or `dvc cache dir`.
  Refer to `dvc remote` for more information on "local remotes".

- `cache.ssh` - name of an
  [SSH remote to use as external cache](/doc/user-guide/external-outputs#ssh).

- `cache.s3` - name of an
  [Amazon S3 remote to use as external cache](/doc/user-guide/external-outputs#amazon-s-3).

- `cache.gs` - name of a
  [Google Cloud Storage remote to use as external cache](/doc/user-guide/external-outputs#google-cloud-storage).

- `cache.hdfs` - name of an
  [HDFS remote to use as external cache](/doc/user-guide/external-outputs#hdfs).

- `cache.azure` - name of an Azure remote to use as
  [external cache](/doc/user-guide/external-outputs).

### state

State config options. Check the
[DVC Files and Directories](/doc/user-guide/dvc-files-and-directories) to learn
more about the state file that is used for optimization.

- `state.row_limit` - maximum number of entries in the state database which
  affects the physical size of the state file itself as well as the performance
  of certain DVC operations. The bigger the limit the more checksum history DVC
  can keep in order to avoid sequential checksum recalculations for the files.
  Default limit is set to 10 000 000 rows.

- `state.row_cleanup_quota` - percentage of the state database that is going to
  be deleted when it hits the `state.row_limit`. When an entry in the database
  is used (e.g. during the `dvc status`) dvc updates the timestamp on that entry
  so that when it needs to cleanup the database it could sort them by the
  timestamp and remove the oldest ones. Default quota is set to 50(percent).

## Examples: Core config options

Set the `dvc` log level to `debug`:

```dvc
$ dvc config core.loglevel debug
```

Add an S3 remote and set it as the project default:

```dvc
$ dvc remote add myremote s3://bucket/path
$ dvc config core.remote myremote
```

## Examples: Default remotes

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

which is equivalent to:

```dvc
$ dvc config core.remote -u
```

## Examples: Cache config options

Set the cache directory to an absolute path:

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

Protect data files under DVC control by making them read-only:

```dvc
$ dvc config cache.protected true
```
