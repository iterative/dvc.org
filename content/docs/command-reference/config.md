# config

Get or set <abbr>project</abbr>-level (or global) DVC configuration options.

## Synopsis

```usage
usage: dvc config [-h] [--global | --system | --project | --local]
                  [-q | -v] [-u]
                  [-l] [--show-origin] [name] [value]

positional arguments:
  name     Option name in format: section.option or remote.name.option
           e.g. 'core.check_update', 'cache.dir', 'remote.myremote.url'
  value    Option value.
```

## Description

You can query/set/replace/unset DVC configuration options with this command. It
takes a config option `name` (a config section and a key, separated by a dot)
and its `value` (any valid alpha-numeric string generally).

When reading config options (no `value` is given or `--list` is used), the
values are read from a combined set of values from the system, global, project,
and local config files (in that order). The `--system`, `--global`, `--project`,
and `--local` options can be used to read from that configuration only.

When writing (a `value` is given or `--unset` is used), the new value is written
to the project-level config file by default (`.dvc/config`). Options `--system`,
`--global` and `--local` can be used to write to that location instead.

⚠️ Note that `.dvc/config` is meant to be tracked by Git and should not contain
sensitive user info or secrets (passwords, SSH keys, etc). Use `--local` when in
doubt.

| Flag                          | Priority | Config file location |
| ----------------------------- | -------- | -------------------- |
| `--local`                     | 1        | `.dvc/config.local`  |
| None or `--project` (default) | 2        | `.dvc/config`        |

The `--global` and `--system` flags are also useful to set config options for
multiple projects or users, respectively.

<!-- Avoids new lines in the Flag columns (below). -->
<style>
  #markdown-root td:first-child code {
    white-space: nowrap;
  }
</style>

| Flag       | Priority | macOS location                                  | Linux location (typical\*) | Windows location                                          |
| ---------- | -------- | ----------------------------------------------- | -------------------------- | --------------------------------------------------------- |
| `--global` | 3        | `$HOME/Library/Application\ Support/dvc/config` | `$HOME/.config/dvc/config` | `%LocalAppData%\iterative\dvc\config`                     |
| `--system` | 4        | `/Library/Application\ Support/dvc/config`      | `/etc/xdg/dvc/config`      | `%AllUsersProfile%\Application Data\iterative\dvc\config` |

> \* For Linux, the global `dvc/config` may be found in `$XDG_CONFIG_HOME`, and
> the system-wide one in `$XDG_CONFIG_DIRS[0]`, if those env vars are defined.

> Note that the `--show-origin` flag can show you where a given config option
> `value` is currently stored.

## Command options (flags)

- `-u`, `--unset` - remove the specified config option `name` from a config
  file. Don't provide a `value` argument when employing this flag.

- `--system` - modify the system config file (e.g. `/etc/xdg/dvc/config`)
  instead of `.dvc/config`. Useful to apply config options to all the projects
  (all users) in the machine. May require superuser access e.g.
  `sudo dvc config --system ...` (Linux).

- `--global` - modify the global config file (e.g. `~/.config/dvc/config`)
  instead of the project's `.dvc/config`. Useful to apply config options to all
  your projects.

- `--project` - only use the project's config file (`.dvc/config`) when reading
  config values (this is the default when writing).

- `--local` - use the Git-ignored local config file (located in
  `.dvc/config.local`) instead of `.dvc/config`. This is useful to save private
  config values that you don't want to track and share with Git (credentials,
  private locations, etc.).

- `-l`, `--list` - lists all defined config values.

- `--show-origin` - when listing or getting config options, also show the
  location of the config file where each option `value` is found.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Configuration sections

The following config sections are written by this command to the appropriate
config file (`.dvc/config` by default), supporting different config options
within:

- [`core`](#core) - main section with the general config options
- [`remote`](#remote) - sections in the config file that describe particular
  remotes
- [`cache`](#cache) - options that affect the project's <abbr>cache</abbr>
- [`exp`](#exp) - options to change the default repo paths assumed by
  `dvc exp init`
- [`plots`](#plots) - contains an option to set custom HTML templates.
- [`state`](#state) - see [Internal directories and files][internals] to learn
  more about the state database.
- [`index`](#index) - see [Internal directories and files][internals] to learn
  more about remote index files.

[internals]: /doc/user-guide/project-structure/internal-files

### core

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
  <abbr>DVC files</abbr> created or modified by DVC commands. The files will not
  be committed. Accepts values `true` and `false` (default).

### remote

All `remote` sections contain a `url` value and can also specify `user`, `port`,
`keyfile`, `timeout`, `ask_password`, and other cloud-specific key/value pairs.
See `dvc remote add` and `dvc remote modify` for more information.

### cache

- `cache.dir` - set/unset cache directory location. A correct value is either an
  absolute path, or a path **relative to the config file location**. The default
  value is `cache`, that resolves to `.dvc/cache` (relative to the project
  config file location).

  > See also the helper command `dvc cache dir` to intuitively set this config
  > option, properly transforming paths relative to the current working
  > directory into paths relative to the config file location.

- `cache.type` - link type that DVC should use to link data files from cache to
  the workspace. Possible values: `reflink`, `symlink`, `hardlink`, `copy` or an
  ordered combination of those, separated by commas e.g:
  `reflink,hardlink,copy`. Default: `reflink,copy`

  If you set `cache.type` to `hardlink` or `symlink`, manually modifying tracked
  data files in the workspace would corrupt the cache. To prevent this, DVC
  automatically protects those kinds of links (making them read-only). Use
  `dvc unprotect` to be able to modify them safely.

  There are pros and cons to different link types. Refer to
  [File link types](/doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache)
  for a full explanation of each one.

  To apply changes to this config option in the workspace, restore all file
  links/copies from cache with `dvc checkout --relink`.

- `cache.slow_link_warning` - used to turn off the warnings about having a slow
  cache link type. These warnings are thrown by `dvc pull` and `dvc checkout`
  when linking files takes longer than usual, to remind them that there are
  faster cache link types available than the defaults (`reflink,copy` – see
  `cache.type`). Accepts values `true` and `false`.

  > These warnings are automatically turned off when `cache.type` is manually
  > set.

- `cache.shared` - permissions for newly created or downloaded cache files and
  directories. The only accepted value right now is `group`, which makes DVC use
  `664` (rw-rw-r--) for files and `775` (rwxrwxr-x) for directories. This is
  useful when [sharing a cache](/doc/user-guide/how-to/share-a-dvc-cache) among
  projects. The default permissions for cache files is system dependent. In
  Linux and macOS for example, they're determined using
  [`os.umask`](https://docs.python.org/3/library/os.html#os.umask).

The following parameters allow setting an
[external cache](/doc/user-guide/managing-external-data#setting-up-an-external-cache)
location. A [DVC remote](/doc/command-reference/remote) name is used (instead of
the URL) because often it's necessary to configure authentication or other
connection settings, and configuring a remote is the way that can be done.

- `cache.local` - name of a _local remote_ to use as external cache (refer to
  `dvc remote` for more info. on "local remotes".) This will overwrite the value
  in `cache.dir` (see `dvc cache dir`).

- `cache.s3` - name of an Amazon S3 remote to use as external cache.

- `cache.gs` - name of a Google Cloud Storage remote to use as external cache.

- `cache.ssh` - name of an SSH remote to use as external cache.

- `cache.hdfs` - name of an HDFS remote to use as external cache.

- `cache.webhdfs` - name of an HDFS remote with WebHDFS enabled to use as
  external cache.

> ⚠️ Avoid using the same [remote storage](/doc/command-reference/remote) used
> for `dvc push` and `dvc pull` as external cache, because it may cause file
> hash overlaps: the hash of an external <abbr>output</abbr> could collide with
> that of a local file with different content.

### exp

Sets the default paths assumed by `dvc exp init`. This can help avoid overriding
them repeatedly with that command's options, for example if all of your
experiments or projects use a similar structure.

- `exp.code` - path to your source file or directory <abbr>dependency</abbr>.

- `exp.params` - path to your <abbr>parameters</abbr> file.

- `exp.data` - path to your data file or directory dependency.

- `exp.models` - path to your model/artifact(s) file or directory
  <abbr>output</abbr>.

- `exp.metrics` - path to your metrics file output.

- `exp.plots` - path to your plots file or directory output.

- `exp.live` - path to your [DVCLive](/doc/dvclive) output logs.

### plots

- `plots.html_template` - sets a
  [custom HTML template](/doc/command-reference/plots#html-templates) for
  `dvc plots`. Accepts a path relative to the `.dvc/` folder.

### state

- `state.row_limit` - maximum number of entries in state databases. This affects
  the physical size of the state files, as well as the performance of certain
  DVC operations. The default is 10,000,000 rows. The bigger the limit, the
  longer the file hash history that DVC can keep, for example.

- `state.row_cleanup_quota` - percentage of the state database to be deleted
  when it reaches the `state.row_limit`. The default quota is 50%. DVC removes
  the oldest entries (created when `dvc status` is used, for example).

- `state.dir` - specify a custom location for the state databases (`links/` and
  `md5/` directories), by default in `.dvc/tmp`. This may be necessary when
  using DVC on NFS or other mounted volumes where SQLite encounters file
  permission errors.

### index

- `index.dir` - specify a custom location for the directory where remote index
  files will be stored, by default in `.dvc/tmp/index`. This may be necessary
  when using DVC on NFS or other mounted volumes.

### plots

- `plots.html_template` - sets a
  [custom HTML template](/doc/command-reference/plots#html-templates) for
  `dvc plots`. Accepts a path relative to the `.dvc/` folder.

- `plots.auto_open` - if `true`, DVC will automatically open the HTML file
  generated by `dvc plots` commands in a browser. `false` by default

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
$ dvc pull

$ ls ../mycache
2f/
```

Set cache type: if `reflink` is not available, use `copy`:

```dvc
$ dvc config cache.type reflink,copy
```
