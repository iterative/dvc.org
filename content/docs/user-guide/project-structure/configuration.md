# DVC Configuration

Once initialized in a <abbr>project</abbr>, DVC populates its installation
directory with [internal files], which include `.dvc/config`, the default
configuration file.

[internal files]: /doc/user-guide/project-structure/internal-files

<admon type="warn">

`.dvc/config` is meant to be tracked by Git and should not contain sensitive
user info or secrets (passwords, SSH keys, etc). Other
[config file locations](#config-file-locations) can be used as well.

</admon>

Config files can be composed manually (or programmatically), or managed with the
helper command `dvc config`.

## Config file locations

DVC supports saving configuration in a Git-ignored file inside the
<abbr>repository</abbr>, or in other plcaes in your file system. These locations
and their loading priority are detailed below:

<!-- Avoids new lines in the Flag columns (below). -->
<style>
  #markdown-root td:first-child code {
    white-space: nowrap;
  }
</style>

| Priority | Type              | macOS location                                  | Linux location (typical\*) | Windows location                                          |
| -------- | ----------------- | ----------------------------------------------- | -------------------------- | --------------------------------------------------------- |
| 1        | Local             | `.dvc/config.local`                             | _N/A_                      | _N/A_                                                     |
| 2        | Project (default) | `.dvc/config`                                   | _N/A_                      | _N/A_                                                     |
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
- [`exp`](#exp) - options to change the default repo paths assumed by
  `dvc exp init`
- [`hydra`](#hydra) - options around [Hydra Composition] for experiment
  configuration.
- [`parsing`](#parsing) - options around the parsing of [dictionary unpacking].
- [`plots`](#plots) - options for configuring `dvc plots`.
- [`state`](#state) - see [Internal directories and files][internals] to learn
  more about the state database.
- [`index`](#index) - see [Internal directories and files][internals] to learn
  more about remote index files.

[remote storage]: /doc/user-guide/data-management/remote-storage
[hydra composition]: /doc/user-guide/experiment-management/hydra-composition
[dictionary unpacking]:
  /doc/user-guide/project-structure/dvcyaml-files#dictionary-unpacking
[internals]: /doc/user-guide/project-structure/internal-files

### core

- [`core.remote`](#remote) - name of the default remote storage

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

Unlike most other sections, configuration files may have more than one
`'remote'`. All of them require a unique `"name"` and a `url` value. They can
also specify `jobs`, `verify`, and many platform-specific key/value pairs like
`port` and `password`.

<admon icon="book">

See [Remote Storage Configuration] for more details.

[remote storage configuration]:
  /doc/user-guide/data-management/remote-storage#configuration

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

### cache

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
  `664` (rw-rw-r--) for files and `775` (rwxrwxr-x) for directories. This is
  useful when [sharing a cache] among projects. The default permissions for
  cache files is system dependent. In Linux and macOS for example, they're
  determined using [`os.umask`].

[file link types]:
  /doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache
[sharing a cache]: /doc/user-guide/how-to/share-a-dvc-cache
[`os.umask`]: https://docs.python.org/3/library/os.html#os.umask

The following parameters allow setting an [external cache] location. A
`dvc remote` name is used (instead of the URL) because often it's necessary to
configure authentication or other connection settings, and configuring a remote
is the way that can be done.

[external cache]:
  /doc/user-guide/data-management/managing-external-data#setting-up-an-external-cache

- `cache.local` - name of a [local remote] to use as external cache. This will
  overwrite the value in `cache.dir` (see `dvc cache dir`).

- `cache.s3` - name of an Amazon S3 remote to use as external cache.

- `cache.gs` - name of a Google Cloud Storage remote to use as external cache.

- `cache.ssh` - name of an SSH remote to use as external cache.

- `cache.hdfs` - name of an HDFS remote to use as external cache.

- `cache.webhdfs` - name of an HDFS remote with WebHDFS enabled to use as
  external cache.

  <admon type="warn">

  Avoid using the same [remote storage] used for `dvc push` and `dvc pull` as
  external cache, because it may cause file hash overlaps: the hash of an
  external <abbr>output</abbr> could collide with that of a local file with
  different content.

  [remote storage]: /doc/user-guide/data-management/remote-storage

  </admon>

[local remote]:
  /doc/user-guide/data-management/remote-storage#file-systems-local-remotes

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

### hydra

Sets the defaults for <abbr>experiment</abbr> configuration via [Hydra
Composition].

- `hydra.enabled` - enables Hydra [config composition].
- `hydra.config_dir` - location of the directory containing Hydra [config
  groups]. Defaults to `conf`.
- `hydra.config_name` - the name of the file containing the Hydra [defaults
  list] (located inside `hydra.config_dir`). Defaults to `config.yaml`.

[config composition]:
  https://hydra.cc/docs/tutorials/basic/your_first_app/composition/
[config groups]:
  https://hydra.cc/docs/tutorials/basic/your_first_app/config_groups/
[defaults list]: https://hydra.cc/docs/tutorials/basic/your_first_app/defaults/

### parsing

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

### plots

- `plots.auto_open` - if `true`, DVC will automatically open the HTML file
  generated by `dvc plots` commands in a browser. `false` by default

- `plots.html_template` - sets a
  [custom HTML template](/doc/command-reference/plots/show#custom-html-templates)
  for `dvc plots`. Accepts a path relative to the `.dvc/` folder.

- `plots.out_dir` - changes the default value for `dvc plots show --out` and
  `dvc plots diff --out`. The original default value is `dvc_plots`.

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