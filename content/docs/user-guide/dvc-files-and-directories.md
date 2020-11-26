# DVC Files and Directories

Once initialized in a <abbr>project</abbr>, DVC populates its installation
directory (`.dvc/`) with the
[internal directories and files](#internal-directories-and-files) needed for DVC
operation.

Additionally, there are a few metafiles that support DVC's features:

- Files ending with the `.dvc` extension are placeholders to track data files
  and directories. A <abbr>DVC project</abbr> usually has one `.dvc` file per
  large data file or directory being tracked.
- `dvc.yaml` files (or _pipelines files_) specify stages that form the
  pipeline(s) of a project, and how they connect (_dependency graph_ or DAG).

  These normally have a matching `dvc.lock` file to record the pipeline state
  and track its <abbr>outputs</abbr>.

Both `.dvc` files and `dvc.yaml` use human-friendly YAML 1.2 schemas, described
below. We encourage you to get familiar with them so you may create, generate,
and edit them on your own.

Both the internal directory and these metafiles should be versioned with Git (in
Git-enabled <abbr>repositories</abbr>).

## `.dvc` files

When you add a file or directory to a <abbr>DVC project</abbr> with `dvc add`,
`dvc import`, or `dvc import-url`, a `.dvc` file is created based on the data
file name (e.g. `data.xml.dvc`). These files contain the information needed to
track the data with DVC.

They use a simple [YAML](https://yaml.org/) format, meant to be easy to read,
edit, or even created manually. Here is a sample:

```yaml
outs:
  - md5: a304afb96060aad90176268345e10355
    path: data.xml
    desc: cats and dogs dataset

# Comments and user metadata are supported.
meta:
  name: 'John Doe'
  email: john@doe.com
```

`.dvc` files can contain the following fields:

- `outs` (always present): List of <abbr>output</abbr> entries (details below)
  that represent the files or directories tracked with DVC. Typically there is
  only one (but several can be added or combined manually).
- `deps`: List of <abbr>dependency</abbr> entries (details below). Only present
  when `dvc import` or `dvc import-url` are used to generate this `.dvc` file.
  Typically there is only one (but several can be added manually).
- `wdir`: Working directory for the `outs` and `deps` paths (relative to the
  `.dvc` file's location). If this field is not present explicitly, it defaults
  to `.` (the `.dvc` file's location).
- `md5`: (only for <abbr>imports</abbr>) MD5 hash of the import `.dvc` file
  itself.
- `meta` (optional): Arbitrary metadata can be added manually with this field.
  Any YAML contents is supported. `meta` contents are ignored by DVC, but they
  can be meaningful for user processes that read `.dvc` files.

An _output entry_ (`outs`) consists of these fields:

- `path`: Path to the file or directory (relative to `wdir` which defaults to
  the file's location)
- `md5`, `etag`, or `checksum`: Hash value for the file or directory being
  tracked with DVC. MD5 is used for most locations (local file system and SSH);
  [ETag](https://en.wikipedia.org/wiki/HTTP_ETag#Strong_and_weak_validation) for
  HTTP, S3, or Azure [external outputs](/doc/user-guide/managing-external-data);
  and a special _checksum_ for HDFS and WebHDFS.
- `size`: Size of the file or directory (sum of all files).
- `nfiles`: If a directory, number of files inside.
- `cache`: Whether or not this file or directory is <abbr>cached</abbr> (`true`
  by default, if not present). See the `--no-commit` option of `dvc add`.
- `desc`: User description for this output. This doesn't affect any DVC
  operations.

A _dependency entry_ (`deps`) consists of these fields:

- `path`: Path to the dependency (relative to `wdir` which defaults to the
  file's location)
- `md5`, `etag`, or `checksum`: Hash value for the file or directory being
  tracked with DVC. MD5 is used for most locations (local file system and SSH);
  [ETag](https://en.wikipedia.org/wiki/HTTP_ETag#Strong_and_weak_validation) for
  HTTP, S3, or Azure <abbr>external dependencies</abbr>; and a special
  _checksum_ for HDFS and WebHDFS. See `dvc import-url` for more information.
- `size`: Size of the file or directory (sum of all files).
- `nfiles`: If a directory, number of files inside.
- `repo`: This entry is only for external dependencies created with
  `dvc import`, and can contains the following fields:

  - `url`: URL of Git repository with source DVC project
  - `rev`: Only present when the `--rev` option of `dvc import` is used.
    Specific commit hash, branch or tag name, etc. (a
    [Git revision](https://git-scm.com/docs/revisions)) used to import the
    dependency from.
  - `rev_lock`: Git commit hash of the external <abbr>DVC repository</abbr> at
    the time of importing or updating the dependency (with `dvc update`)

Note that comments can be added to `.dvc` files using the `# comment` syntax.
`meta` fields and `#` comments are preserved among executions of the `dvc repro`
and `dvc commit` commands, but not when a `.dvc` file is overwritten by
`dvc add`, `dvc move`, `dvc import`, or `dvc import-url`.

## `dvc.yaml` file

`dvc.yaml` files describe data science or machine learning pipelines, similar to
how [Makefiles](https://www.gnu.org/software/make/manual/make.html#Introduction)
work for building software. Its YAML structure contains a list of stages which
can be written manually or generated by user code.

> A helper command, `dvc run`, is also available to add or update stages in
> `dvc.yaml`. Additionally, a `dvc.lock` file is also created or updated by
> `dvc run` and `dvc repro`, to record the pipeline state.

Here's a comprehensive `dvc.yaml` example:

```yaml
stages:
  features:
    cmd: jupyter nbconvert --execute featurize.ipynb
    deps:
      - data/clean
    params:
      - levels.no
    outs:
      - features
    metrics:
      - performance.json
  training:
    desc: train your model
    cmd: python train.py
    deps:
      - train.py
      - features
    outs:
      - model.pkl:
          desc: my model description
    plots:
      - logs.csv:
          x: epoch
          x_label: Epoch
    meta: 'For deployment'
    # User metadata and comments are supported.
```

`dvc.yaml` files consists of a group of `stages` with names provided explicitly
by the user with the `--name` (`-n`) option of `dvc run`. Each stage can contain
the possible following fields:

- `cmd` (always present): Executable command defined in this stage
- `wdir`: Working directory for the stage command to run in (relative to the
  file's location). If this field is not present explicitly, it defaults to `.`
  (the file's location).
- `deps`: List of <abbr>dependency</abbr> file or directory paths of this stage
  (relative to `wdir` which defaults to the file's location)
- `params`: List of <abbr>parameter</abbr> dependency keys (field names) that
  are read from a YAML, JSON, TOML, or Python file (`params.yaml` by default).
- `outs`: List of <abbr>output</abbr> file or directory paths of this stage
  (relative to `wdir` which defaults to the file's location), and optionally,
  whether or not this file or directory is <abbr>cached</abbr> (`true` by
  default, if not present). See the `--no-commit` option of `dvc run`.
- `metrics`: List of [metrics files](/doc/command-reference/metrics), and
  optionally, whether or not this metrics file is <abbr>cached</abbr> (`true` by
  default, if not present). See the `--metrics-no-cache` (`-M`) option of
  `dvc run`.
- `plots`: List of [plot metrics](/doc/command-reference/plots), and optionally,
  their default configuration (subfields matching the options of
  `dvc plots modify`), and whether or not this plots file is <abbr>cached</abbr>
  ( `true` by default, if not present). See the `--plots-no-cache` option of
  `dvc run`.
- `frozen`: Whether or not this stage is frozen from reproduction
- `always_changed`: Whether or not this stage is considered as changed by
  commands such as `dvc status` and `dvc repro`. `false` by default
- `meta` (optional): Arbitrary metadata can be added manually with this field.
  Any YAML contents is supported. `meta` contents are ignored by DVC, but they
  can be meaningful for user processes that read or write `.dvc` files directly.
- `desc` (optional): User description for this stage. This doesn't affect any
  DVC operations.

`dvc.yaml` files also support `# comments`.

💡 We maintain a `dvc.yaml`
[schema](https://github.com/iterative/dvcyaml-schema) that can be used by
editors like [VSCode](/doc/install/plugins#visual-studio-code) or
[PyCharm](/doc/install/plugins#pycharmintellij) to enable automatic syntax
checks and auto-completion.

### `dvc.lock` file

For every `dvc.yaml` file, a matching `dvc.lock` (YAML) file usually exists.
It's created or updated by DVC commands such as `dvc run` and `dvc repro`.
`dvc.lock` describes the latest pipeline state. It has several purposes:

- Tracking of intermediate and final results of a pipeline — similar to
  [`.dvc` files](#dvc-files).
- Allow DVC to detect when stage definitions, or their dependencies have
  changed. Such conditions invalidate stages, requiring their reproduction (see
  `dvc status`, `dvc repro`).
- `dvc.lock` is needed internally for several DVC commands to operate, such as
  `dvc checkout`, `dvc get`, and `dvc import`.

Here's an example `dvc.lock` based on the one in [`dvc.yaml`](#dvcyaml-file)
above:

```yaml
stages:
  features:
    cmd: jupyter nbconvert --execute featurize.ipynb
    deps:
      - path: data/clean
        md5: d8b874c5fa18c32b2d67f73606a1be60
    params:
      params.yaml:
        levels.no: 5
    outs:
      - path: features
        md5: 2119f7661d49546288b73b5730d76485
      - path: performance.json
        md5: ea46c1139d771bfeba7942d1fbb5981e
      - path: logs.csv
        md5: f99aac37e383b422adc76f5f1fb45004
```

Stage commands are listed again in `dvc.lock`, in order to know when their
definitions change in the `dvc.yaml` file.

Regular <abbr>dependencies</abbr> and all kinds of <abbr>outputs</abbr>
(including [metrics](/doc/command-reference/metrics) and
[plots](/doc/command-reference/plots) files) are also listed (per stage) in
`dvc.lock`, but with an additional field to store the hash value of each file or
directory tracked by DVC. Specifically: `md5`, `etag`, or `checksum` (same as in
`deps` and `outs` entries of [`.dvc` files](#dvc-files)).

Full <abbr>parameters</abbr> (key and value) are listed separately under
`params`, grouped by parameters file.

## Internal directories and files

- `.dvc/config`: This is a configuration file. The config file can be edited by
  hand or with the `dvc config` command.

- `.dvc/config.local`: This is a local configuration file, that will overwrite
  options in `.dvc/config`. This is useful when you need to specify private
  options in your config that you don't want to track and share through Git
  (credentials, private locations, etc). The local config file can be edited by
  hand or with the command `dvc config --local`.

- `.dvc/cache`: The <abbr>cache</abbr> directory will store your data in a
  special [structure](#structure-of-the-cache-directory). The data files and
  directories in the <abbr>workspace</abbr> will only contain links to the data
  files in the cache. (Refer to
  [Large Dataset Optimization](/doc/user-guide/large-dataset-optimization). See
  `dvc config cache` for related configuration options.

  > Note that DVC includes the cache directory in `.gitignore` during
  > initialization. No data tracked by DVC will ever be pushed to the Git
  > repository, only [DVC-files](/doc/user-guide/dvc-files-and-directories) that
  > are needed to download or reproduce them.

- `.dvc/plots`: Directory for
  [plot templates](/doc/command-reference/plots#plot-templates)

- `.dvc/tmp`: Directory for miscellaneous temporary files

- `.dvc/tmp/index`: Directory for remote index files that are used for
  optimizing `dvc push`, `dvc pull`, `dvc fetch` and `dvc status -c` operations

- `.dvc/tmp/state`: This file is used for optimization. It is a SQLite database,
  that contains hash values for files tracked in a DVC project, with respective
  timestamps and inodes to avoid unnecessary file hash computations. It also
  contains a list of links (from cache to <abbr>workspace</abbr>) created by DVC
  and is used to cleanup your workspace when calling `dvc checkout`.

- `.dvc/tmp/state-journal`: Temporary file for SQLite operations

- `.dvc/tmp/state-wal`: Another SQLite temporary file

- `.dvc/tmp/updater`: This file is used store the latest available version of
  DVC. It's used to remind the user to upgrade when the installed version is
  behind.

- `.dvc/tmp/updater.lock`: Lock file for `.dvc/tmp/updater`

- `.dvc/tmp/lock`: Lock file for the entire DVC project

- `.dvc/tmp/rwlock`: JSON file that contains read and write locks for specific
  dependencies and outputs, to allow safely running multiple DVC commands in
  parallel

## Structure of the cache directory

The DVC cache is a
[content-addressable storage](https://en.wikipedia.org/wiki/Content-addressable_storage)
(by default in `.dvc/cache`), which adds a layer of indirection between code and
data.

There are two ways in which the data is <abbr>cached</abbr>: As a single file
(eg. `data.csv`), or as a directory.

### Files

DVC calculates the file hash, a 32 characters long string (usually MD5). The
first two characters are used to name the directory inside the cache, and the
rest become the file name of the cached file. For example, if a data file has a
hash value of `ec1d2935f811b77cc49b031b999cbf17`, its path in the cache will be
`.dvc/cache/ec/1d2935f811b77cc49b031b999cbf17`.

> Note that file hashes are calculated from file contents only. 2 or more files
> with different names but the same contents can exist in the workspace and be
> tracked by DVC, but only one copy is stored in the cache. This helps avoid
> data duplication.

### Directories

Let's imagine [adding](/doc/command-reference/add) a directory with 2 images:

```dvc
$ tree data/images/
data/images/
├── cat.jpeg
└── index.jpeg

$ dvc add data/images
```

The directory is cached as a JSON file with `.dir` extension. The files it
contains are stored in the cache regularly, as explained earlier. It looks like
this:

```dvc
.dvc/cache/
├── 19
│   └── 6a322c107c2572335158503c64bfba.dir
├── d4
│   └── 1d8cd98f00b204e9800998ecf8427e
└── 20
    └── 0b40427ee0998e9802335d98f08cd98f
```

The `.dir` file contains the mapping of files in `data/images` (as a JSON
array), including their hash values:

```dvc
$ cat .dvc/cache/19/6a322c107c2572335158503c64bfba.dir
[{"md5": "dff70c0392d7d386c39a23c64fcc0376", "relpath": "cat.jpeg"},
{"md5": "29a6c8271c0c8fbf75d3b97aecee589f", "relpath": "index.jpeg"}]
```

That's how DVC knows that the other two cached files belong in the directory.
