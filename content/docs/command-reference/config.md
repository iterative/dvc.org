# config

Get or set <abbr>project</abbr>-level (or global) DVC configuration options.

## Synopsis

```usage
usage: dvc config [-h] [--global | --system | --local] [-q | -v] [-u]
                  name [value]

positional arguments:
  name           Option name.
  value          Option value.
```

## Description

You can query/set/replace/unset DVC configuration options with this command. It
takes a config option `name` (a config section and a key, separated by a dot)
and its `value` (any valid alpha-numeric string generally).

If the config option `value` is not provided (and without `--unset`), this
command returns the current value of the config option, if found in the
corresponding config file.

This command reads and updates the DVC configuration files. By default, the
regular project's config file in `.dvc/config` is read or modified. This file is
meant to be tracked by Git and should not contain sensitive and/or user-specific
information (passwords, SSH keys, etc). Use the `--local` command option (flag)
instead, to set (or override) secrets:

| Flag           | Priority | Config file location |
| -------------- | -------- | -------------------- |
| `--local`      | 1        | `.dvc/config.local`  |
| None (default) | 2        | `.dvc/config`        |

The `--global` and `--system` flags are also available to set config options for
multiple projects and users, respectively:

| Flag       | Priority | Mac location                             | Linux location             | Windows location                                          |
| ---------- | -------- | ---------------------------------------- | -------------------------- | --------------------------------------------------------- |
| `--global` | 3        | `$HOME/Library/Application\ Support/dvc` | `$HOME/.config/dvc/config` | `%LocalAppData%\iterative\dvc\config`                     |
| `--system` | 4        | `/Library/Application\ Support/dvc`      | `/etc/dvc/config`          | `%AllUsersProfile%\Application Data\iterative\dvc\config` |

<!-- Avoids new lines in the Flag column (above). -->
<style>
  #markdown-root td:first-child code {
    white-space: nowrap;
  }
</style>

## Command options (flags)

- `-u`, `--unset` - remove a specified config option from a config file.

- `--local` - modify a Git-ignored local config file. This is useful when you
  need to specify private config option values that you don't want to track and
  share with Git (credentials, private locations, etc).

- `--global` - modify a global config file (e.g. `~/.config/dvc/config`) instead
  of the project's `.dvc/config`. Useful to apply config options to all your
  projects.

- `--system` - modify a system config file (e.g. `/etc/dvc/config`) instead of
  `.dvc/config`. Useful to apply config options to all the projects (all users)
  in the machine.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Configuration sections

The following config sections are written by this command to the project config
file (in `.dvc/config` by default), and they support the options below:

### core

This is the main section with the general config options:

- `core.remote` - name of the remote storage to use by default.

- `core.interactive` - whether to always ask for confirmation before reproducing
  each [stage](/doc/command-reference/run) in `dvc repro`. (Normally, this
  behavior requires using the `-i` option of that command.) Accepts values:
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

- `core.no_scm` - tells DVC to not expect or integrate with Git (even if the
  <abbr>project</abbr> is initialized inside a Git repo). Accepts values `true`
  and `false` (default). Set with the `--no-scm` option of `dvc init`
  ([more details](/doc/command-reference/init#initializing-dvc-without-git)).

- `core.check_update` - disable/enable DVC's automatic update checks, which
  notify the user when a new version is available. Accepts values `true`
  (default) and `false`.

- `core.autostage` - if enabled, DVC will automatically stage (`git add`)
  [DVC metafiles](/doc/user-guide/dvc-files-and-directories) created or modified
  by DVC commands (`dvc add`, `dvc run`, etc.). The files will not be committed.
  Accepts values `true` and `false` (default).

### remote

These are sections in the config file that describe particular remotes. They
contain a `url` value, and can also specify `user`, `port`, `keyfile`,
`timeout`, `ask_password`, and other cloud-specific key/value pairs for each
remote. See `dvc remote` for more information.

### cache

A DVC project <abbr>cache</abbr> is the hidden storage (by default located in
the `.dvc/cache` directory) for files that are tracked by DVC, and their
different versions. (See `dvc cache` and
[DVC Files and Directories](/doc/user-guide/dvc-files-and-directories#structure-of-the-cache-directory)
for more details.) This section contains the following options:

- `cache.dir` - set/unset cache directory location. A correct value is either an
  absolute path, or a path **relative to the config file location**. The default
  value is `cache`, that resolves to `.dvc/cache` (relative to the project
  config file location).

  > See also the helper command `dvc cache dir` to intuitively set this config
  > option, properly transforming paths relative to the current working
  > directory into paths relative to the config file location.

- `cache.type` - link type that DVC should use to link data files from cache to
  the workspace. Possible values: `reflink`, `symlink`, `hardlink`, `copy` or a
  combination of those, separated by commas e.g: `reflink,hardlink,copy`.

  By default, DVC will try `reflink,copy` link types in order to choose the most
  effective of those two. DVC avoids `symlink` and `hardlink` types by default
  to protect user from accidental cache and repository corruption.

  ⚠️ If you set `cache.type` to `hardlink` or `symlink` and manually modify
  tracked data files in the workspace, **you will corrupt the cache**. In an
  attempt to prevent that, DVC will automatically protect those file links (make
  them read-only). Use `dvc unprotect` to be able to modify them safely.

  There are pros and cons to different link types. Refer to
  [File link types](/doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache)
  for a full explanation of each one.

  To apply changes to this config option in the workspace, by restoring all file
  links/copies from cache, please use `dvc checkout --relink`. See that
  command's [options](/doc/command-reference/checkout#options) for more details.

- `cache.slow_link_warning` - used to turn off the warnings about having a slow
  cache link type. These warnings are thrown by `dvc pull` and `dvc checkout`
  when linking files takes longer than usual, to remind them that there are
  faster cache link types available than the defaults (`reflink,copy` – see
  `cache.type`). Accepts values `true` and `false`.

  > These warnings are automatically turned off when `cache.type` is manually
  > set.

- `cache.shared` - permissions for newly created or downloaded cache files and
  directories. The default is `0o664`(rw-r--r--) for files and `0o755`
  (rwxr-xr-x) for directories. The only accepted value right now is `group`,
  which makes DVC use `0o664` (rw-rw-r--) for files and `0o775` (rwxrwxr-x) for
  directories, which is useful when you are using a a
  [shared development server](/doc/use-cases/shared-development-server).

- `cache.local` - name of a _local remote_ to use as a
  [custom cache](/doc/user-guide/managing-external-data#examples) directory.
  (Refer to `dvc remote` for more information on "local remotes".) This will
  overwrite the value provided to `dvc config cache.dir` or `dvc cache dir`.

- `cache.s3` - name of an Amazon S3 remote to use as
  [external cache](/doc/user-guide/managing-external-data#examples).

- `cache.gs` - name of a Google Cloud Storage remote to use as
  [external cache](/doc/user-guide/managing-external-data#examples).

- `cache.ssh` - name of an SSH remote to use as
  [external cache](/doc/user-guide/managing-external-data#examples).

- `cache.hdfs` - name of an HDFS remote to use as
  [external cache](/doc/user-guide/managing-external-data#examples).

- `cache.webhdfs` - name of an HDFS remote with WebHDFS enabled to use as
  [external cache](/doc/user-guide/managing-external-data#examples).

> Avoid using the same [DVC remote](/doc/command-reference/remote) (used for
> `dvc push`, `dvc pull`, etc.) as external cache, because it may cause file
> hash overlaps: the hash of an external <abbr>output</abbr> could collide with
> a hash generated locally for another file with different content.

### state

See
[Internal directories and files](/doc/user-guide/dvc-files-and-directories#internal-directories-and-files)
to learn more about the state file (database) that is used for optimization.

- `state.row_limit` - maximum number of entries in the state database, which
  affects the physical size of the state file itself, as well as the performance
  of certain DVC operations. The default is 10,000,000 rows. The bigger the
  limit, the longer the file hash history that DVC can keep, in order to avoid
  sequential hash recalculations.

- `state.row_cleanup_quota` - percentage of the state database that is going to
  be deleted when it hits the `state.row_limit`. Default quota is set to 50%.
  When an entry in the database is used (e.g. during the `dvc status`), DVC
  updates the timestamp on that entry. This way, when the database needs a
  cleanup, DVC can sort entries chronologically, and remove the oldest ones.

## Example: Add an S3 remote, and set it as default

> 💡 Before adding an S3 remote, be sure to
> [Create a Bucket](https://docs.aws.amazon.com/AmazonS3/latest/gsg/CreatingABucket.html).

```dvc
$ dvc remote add myremote s3://bucket/path
$ dvc config core.remote myremote
```

> Note that this is equivalent to using `dvc remote add` with the
> `-d`/`--default` flag.

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
