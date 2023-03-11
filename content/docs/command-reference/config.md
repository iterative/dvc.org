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

You can query/set/replace/unset [DVC configuration] options with this command.
It takes a config option `name` (a [config section] and a key, separated by a
dot) and its `value` (any valid alpha-numeric string generally).

When reading config options (no `value` is given or `--list` is used), the
values are read from a combined set of values from the system, global, project,
and local config files (in that order). The `--system`, `--global`, `--project`,
and `--local` options can be used to read from that configuration only.

When writing (a `value` is given or `--unset` is used), the new value is written
to the project-level config file by default (`.dvc/config`). Options `--system`,
`--global` and `--local` can be used to write to that location instead.

[dvc configuration]: /doc/user-guide/project-structure/configuration
[config section]:
  /doc/user-guide/project-structure/configuration#configuration-sections

<admon type="warn">

`.dvc/config` is meant to be tracked by Git and should not contain sensitive
user info or secrets (passwords, SSH keys, etc). Use `--local` when in doubt.

</admon>

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

<admon type="info">

\* For Linux, the global file may be found in `$XDG_CONFIG_HOME`, and the system
file in `$XDG_CONFIG_DIRS[0]`, if those env vars are defined.

</admon>

<admon type="tip">

The `--show-origin` flag can show you where a given config option `value` is
currently stored.

</admon>

Refer to [Configuration sections][config section] to explore which config
options (`name`) are accepted.

## Command options/flags

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

## Example: Add an S3 remote, and set it as default

> 💡 Before adding an S3 remote, be sure to
> [Create a Bucket](https://docs.aws.amazon.com/AmazonS3/latest/gsg/CreatingABucket.html).

```cli
$ dvc remote add myremote s3://bucket/path
$ dvc config core.remote myremote
```

> Note that this is equivalent to using `dvc remote add` with the
> `-d`/`--default` flag.

## Example: Default remotes

Use remote `myremote` by default:

```cli
$ dvc config core.remote myremote
```

Get the default remote:

```cli
$ dvc config core.remote
myremote
```

Clear default remote value:

```cli
$ dvc config --unset core.remote
```

The above command is equivalent to:

```cli
$ dvc config core.remote -u
```

## Example: Cache config options

Set the <abbr>cache directory</abbr> to an absolute path:

```cli
$ dvc config cache.dir /mnt/cache
$ dvc config cache.dir
/mnt/cache
```

or to a relative path (resolved from `./.dvc/`):

```cli
$ dvc config cache.dir ../../mycache
$ dvc pull

$ ls ../mycache
2f/
```

Set cache type: if `reflink` is not available, use `copy`:

```cli
$ dvc config cache.type reflink,copy
```
