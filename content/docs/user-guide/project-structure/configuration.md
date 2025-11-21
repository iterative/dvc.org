# DVC Configuration

Once initialized in a <abbr>project</abbr>, DVC populates its installation
directory with [internal files], which include `.dvc/config`, the default
configuration file.

Config files can be composed manually (or programmatically), or managed with the
helper command `dvc config`.

[internal files]: /user-guide/project-structure/internal-files

## Config file locations

<admon type="warn">

`.dvc/config` is meant to be tracked by Git and should not contain sensitive
user info or secrets (passwords, SSH keys, etc).

</admon>

DVC supports saving configuration outside of the <abbr>repository</abbr>, either
in a Git-ignored file alongside the regular config file or in other places in
your file system. These locations and their loading priority are detailed below:

<!-- Avoids new lines in the Flag columns (below). -->
<style>
  #markdown-root td:first-child code {
    white-space: nowrap;
  }
</style>

| Priority | Type              | macOS location                                  | Linux location (typical\*) | Windows location                                          |
| -------- | ----------------- | ----------------------------------------------- | -------------------------- | --------------------------------------------------------- |
| 1        | Local             | `.dvc/config.local`                             | _Same_                     | _Same_                                                    |
| 2        | Project (default) | `.dvc/config`                                   | _Same_                     | _Same_                                                    |
| 3        | Global            | `$HOME/Library/Application\ Support/dvc/config` | `$HOME/.config/dvc/config` | `%LocalAppData%\iterative\dvc\config`                     |
| 4        | System            | `/Library/Application\ Support/dvc/config`      | `/etc/xdg/dvc/config`      | `%AllUsersProfile%\Application Data\iterative\dvc\config` |

<admon type="info">

\* For Linux, the global file may be found in `$XDG_CONFIG_HOME`, and the system
file in `$XDG_CONFIG_DIRS[0]`, if those env vars are defined.

</admon>

<admon type="tip">

See also `dvc config` flags `--local`, `--global`, and `--system`.

</admon>

## Configuration sections

The following config sections are written by this command to the appropriate
config file (`.dvc/config` by default), supporting different config options
within:

- [`core`](#core) - main section with the general config options
- [`remote`](#remote) - sections in the config file that describe [remote
  storage]
- [`cache`](#cache) - options that affect the project's <abbr>cache</abbr>
- [`db`](#db) - sections in the config file that describe [database connections]
- [`exp`](#exp) - options around [experiments] configuration.
- [`hydra`](#hydra) - options around [Hydra Composition] for experiment
  configuration.
- [`parsing`](#parsing) - options around the parsing of [dictionary unpacking].
- [`plots`](#plots) - options for configuring `dvc plots`.
- [`state`](#state) - see [Internal directories and files][internals] to learn
  more about the state database.
- [`studio`](#studio) - options for configuring DVC Studio token
- [`index`](#index) - see [Internal directories and files][internals] to learn
  more about remote index files.

[remote storage]: /user-guide/data-management/remote-storage
[hydra composition]: /user-guide/experiment-management/hydra-composition
[database connections]: /command-reference/import-db#database-connections
[dictionary unpacking]:
  /user-guide/project-structure/dvcyaml-files#dictionary-unpacking
[internals]: /user-guide/project-structure/internal-files
[dvc experiments]: /user-guide/experiment-management

<details>

## core

- [`core.remote`](#remote) - name of the default remote storage

- `core.interactive` - whether to always ask for confirmation before reproducing
  each [stage](/command-reference/stage/add) in `dvc repro`. (Normally, this
  behavior requires using the `-i` option of that command.) Accepts values:
  `true` and `false`.

- `core.analytics` - used to turn off
  [anonymized usage statistics](/user-guide/analytics). Accepts values `true`
  (default) and `false`.

- `core.checksum_jobs` - number of threads for computing file hashes. Accepts
  positive integers. The default value is `max(1, min(4, cpu_count() // 2))`.

- `core.hardlink_lock` - use hardlink file locks instead of the default ones,
  based on [`flock`](https://linux.die.net/man/2/flock) (i.e. project lock file
  `.dvc/lock`). Accepts values `true` and `false` (default). Useful when the DVC
  project is on a file system that doesn't properly support file locking (e.g.
  [NFS v3 and older](https://nfs.sourceforge.net)).

- `core.no_scm` - tells DVC to not expect or integrate with Git (even if the
  <abbr>project</abbr> is initialized inside a Git repo). Accepts values `true`
  and `false` (default). Set with the `--no-scm` option of `dvc init`
  ([more details](/command-reference/init#initializing-dvc-without-git)).

- `core.check_update` - disable/enable DVC's automatic update checks, which
  notify the user when a new version is available. Accepts values `true`
  (default) and `false`.

- `core.autostage` - if enabled, DVC will automatically stage (`git add`)
  <abbr>DVC files</abbr> created or modified by DVC commands. The files will not
  be committed. Accepts values `true` and `false` (default).

- `core.site_cache_dir` - specify a custom location for misc temporary files.
  Read more [here](/user-guide/project-structure/internal-files#site-cache-dir).

</details>

<details>

## remote

Unlike most other sections, configuration files may have more than one
`'remote'`. All of them require a unique `"name"` and a `url` value. They can
also specify `jobs`, `verify`, and many platform-specific key/value pairs like
`port` and `password`.

<admon icon="book">

See [Remote Storage Configuration] for more details.

[remote storage configuration]:
  /user-guide/data-management/remote-storage#configuration

</admon>

For example, the following config file defines a `temp` remote in the local file
system (located in `/tmp/dvcstore`), and marked as default (via [`core`](#core)
section):

```ini
['remote "temp"']
    url = /tmp/dvcstore
[core]
    remote = temp
```

</details>

<details>

## cache

- `cache.dir` - set/unset cache directory location. A correct value is either an
  absolute path, or a path **relative to the config file location**. The default
  value is `cache`, that resolves to `.dvc/cache` (relative to the project
  config file location).

  <admon type="tip">

  See also the helper command `dvc cache dir` to intuitively set this config
  option, properly transforming paths relative to the current working directory
  into paths relative to the config file location.

  </admon>

- `cache.type` - link type that DVC should use to link data files from cache to
  the workspace. Possible values: `reflink`, `symlink`, `hardlink`, `copy` or an
  ordered combination of those, separated by commas e.g:
  `reflink,hardlink,copy`. Default: `reflink,copy`

  <admon type="info">

  There are pros and cons to different link types. Refer to [File link types]
  for a full explanation of each one.

  </admon>

  If you set `cache.type` to `hardlink` or `symlink`, manually modifying tracked
  data files in the workspace would corrupt the cache. To prevent this, DVC
  automatically protects those kinds of links (making them read-only). Use
  `dvc unprotect` to be able to modify them safely.

  To apply changes to this config option in the workspace, restore all file
  links/copies from cache with `dvc checkout --relink`.

- `cache.slow_link_warning` - used to turn off the warnings about having a slow
  cache link type. These warnings are thrown by `dvc pull` and `dvc checkout`
  when linking files takes longer than usual, to remind them that there are
  faster cache link types available than the defaults (`reflink,copy` – see
  `cache.type`). Accepts values `true` and `false`.

  <admon type="info">

  These warnings are automatically turned off when `cache.type` is manually set.

  </admon>

- `cache.shared` - permissions for newly created or downloaded cache files and
  directories. The only accepted value right now is `group`, which makes DVC use
  `444` (r--r--r--) for files and `775` (rwxrwxr-x) for directories. This is
  useful when [sharing a cache] among projects. The default permissions for
  cache files is system dependent. In Linux and macOS for example, they're
  determined using [`os.umask`].

[file link types]:
  /user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache
[sharing a cache]: /user-guide/how-to/share-a-dvc-cache
[`os.umask`]: https://docs.python.org/3/library/os.html#os.umask

</details>

<details>

## db

Similar to `remote`, configuration files may have more than one `'db'`. All of
them require a unique `"name"` and a `url` value which is a connection string to
connect to the database. They can also specify `username` and `password`
options, which is used to combine with provided `url`, which is what is passed
to the appropriate database drivers to connect to the database.

<admon type="warn">

Set `password` to a Git-ignored local config file (`.dvc/config.local`) so that
no secrets are leaked through Git.

</admon>

As an example, the following config file defines a `pgsql` database connection
to connect to the `dbname` database as a user `user` hosted at `host` url. The
`postgresql://` defines a driver to be used to connect to that database.

```ini
['db "pgsql"']
  url = "postgresql://user@host/dbname
```

The name, `pgsql` for example, can be used to specify what database to connect
to, in commands like `import-db`.

</details>

<details>

## exp

Sets the defaults for <abbr>experiment</abbr> configuration.

- `exp.auto_push` - [push experiment] automatically after `dvc exp run` and
  `dvc exp save`. Accepts values `true` and `false` (default).
- `exp.git_remote` - Git remote name or URL used to [push experiment] and [send
  live metrics and plots] to DVC Studio. Defaults to `origin`.

[push experiment]: /user-guide/experiment-management/sharing-experiments

</details>

<details>

## hydra

Sets the defaults for <abbr>experiment</abbr> configuration via [Hydra
Composition].

- `hydra.enabled` - enables Hydra [config composition].
- `hydra.config_dir` - location of the directory containing Hydra [config
  groups]. Defaults to `conf`.
- `hydra.config_name` - the name of the file containing the Hydra [defaults
  list] (located inside `hydra.config_dir`). Defaults to `config.yaml`.
- `hydra.plugins_path` - location of the parent directory of `hydra_plugins`,
  where Hydra will automatically discover [plugins]. Defaults to the root of the
  DVC repository.

[config composition]:
  https://hydra.cc/docs/tutorials/basic/your_first_app/composition/
[config groups]:
  https://hydra.cc/docs/tutorials/basic/your_first_app/config_groups/
[defaults list]: https://hydra.cc/docs/tutorials/basic/your_first_app/defaults/
[plugins]:
  https://hydra.cc/docs/advanced/plugins/develop/#automatic-plugin-discovery-process

</details>

<details>

## parsing

- `parsing.bool` - Controls the templating syntax for boolean values when used
  in [dictionary unpacking].

  Valid values are `"store_true"` (default) and `"boolean_optional"`, named
  after [Python `argparse` actions].

  Given the following `params.yaml`:

  ```yaml
  dict:
    bool-true: true
    bool-false: false
  ```

  And corresponding `dvc.yaml`:

  ```yaml
  stages:
    foo:
      cmd: python foo.py ${dict}
  ```

  When using `store_true`, `cmd` will be:

  ```shell
  python foo.py --bool-true
  ```

  Whereas when using `boolean_optional`, `cmd` will be:

  ```shell
  python foo.py --bool-true --no-bool-false
  ```

- `parsing.list` - Controls the templating syntax for list values when used in
  [dictionary unpacking].

  Valid values are `"nargs"` (default) and `"append"`, named after [Python
  `argparse` actions].

  Given the following `params.yaml`:

  ```yaml
  dict:
    list: [1, 2, 'foo']
  ```

  And corresponding `dvc.yaml`:

  ```yaml
  stages:
    foo:
      cmd: python foo.py ${dict}
  ```

  When using `nargs`, `cmd` will be:

  ```shell
  python foo.py --list 1 2 'foo'
  ```

  Whereas when using `append`, `cmd` will be:

  ```shell
  python foo.py --list 1 --list 2 --list 'foo'
  ```

[python `argparse` actions]:
  https://docs.python.org/3/library/argparse.html#action

</details>

<details>

## plots

- `plots.auto_open` - if `true`, DVC will automatically open the HTML file
  generated by `dvc plots` commands in a browser. `false` by default

- `plots.html_template` - sets a
  [custom HTML template](/command-reference/plots/show#custom-html-templates)
  for `dvc plots`. Accepts a path relative to the `.dvc/` folder.

- `plots.out_dir` - changes the default value for `dvc plots show --out` and
  `dvc plots diff --out`. The original default value is `dvc_plots`.

</details>

<details>

## state

<admon type="warn">

This section is obsolete since DVC 2.48.0. Modifying these config options will
have no effect.

</admon>

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

</details>

<details>

## studio

- `studio.token` - DVC Studio access token to use. When this is set, DVC uses
  this to share [live experiments] and notify Studio about [pushed experiments].
  For security reasons, we advise setting token to either a local or a global
  config. This can also be specified through `DVC_STUDIO_TOKEN` environment
  variable, which will override any value in `studio.token`.

  [Get the token](https://studio.datachain.ai/user/_/profile?section=accessToken)
  or check
  [this guide on how to create an access token](https://docs.datachain.ai/studio/api#authorization).

- `studio.offline` - Disables sharing live experiments even if `studio.token` is
  set or the token has been specified in `DVC_STUDIO_TOKEN`. Offline mode can
  also be specified through `DVC_STUDIO_OFFLINE` environment variable, which
  will override any value in `studio.offline`. Accepts values `true` and
  `false`.

- `studio.url` - URL of Studio to use (in case of self-hosted DVC Studio
  instance). This can also be specified through `DVC_STUDIO_URL` environment
  variable, which will override any value in `studio.url`. If not set,
  `https://studio.datachain.ai` is used.

[pushed experiments]: /user-guide/experiment-management/sharing-experiments

</details>

<details>

## index

<admon type="warn">

This section is obsolete since DVC 2.48.0. Modifying these config options will
have no effect.

</admon>

- `index.dir` - specify a custom location for the directory where remote index
  files will be stored, by default in `.dvc/tmp/index`. This may be necessary
  when using DVC on NFS or other mounted volumes.

</details>
