# DVC Files and Directories

Once initialized in a <abbr>project</abbr>, DVC populates its installation
directory (`.dvc/`) with the
[internal directories and files](#internal-directories-and-files) needed for DVC
operation.

Additionally, there are a few special kind of files created by certain
[DVC commands](/doc/command-reference):

- Files ending with the `.dvc` extension are placeholders to version data files
  and directories. A <abbr>DVC project</abbr> usually has one
  [`.dvc` file](#dvc-files) per large data file or dataset directory being
  tracked.
- The [`dvc.yaml` file](#dvcyaml-file) or _pipeline(s) file_ specifies stages
  that form the pipeline(s) of a project, and their connections (_dependency
  graph_ or DAG).

  These come with a matching [`dvc.lock` file](#dvclock-file) to track the
  latest file versions.

Both use human-friendly YAML schemas, described below. We encourage you to get
familiar with them so you may edit them freely, as needed. Both type of files
should be versioned with Git (for Git-enabled <abbr>repositories</abbr>).

## .dvc files

When you add a file or directory to a <abbr>DVC project</abbr> with `dvc add` or
`dvc import`, a `.dvc` file is created based on the data file name (e.g.
`data.xml.dvc`). These files contain the information needed to track the data
with DVC.

They use a simple [YAML](https://yaml.org/) format, meant to be easy to read,
edit, or even created manually by users. Here is a full sample:

```yaml
outs:
  - md5: a304afb96060aad90176268345e10355
    path: data.xml

# Comments and user metadata are supported.
meta:
  name: 'John Doe'
  email: john@doe.com
```

`.dvc` files can contain the following fields:

- `outs` (always present): List of <abbr>output</abbr> entries that represent
  the files or directories tracked with DVC. Typically there is only one per
  `.dvc` file (but several can be added or combined manually).
- `deps`: List of <abbr>dependency</abbr> entries for this stage, only present
  when `dvc import` and `dvc import-url` are used. Typically there is only one
  (but several can be added manually).
- `wdir` (optional): Working directory for the stage command to run in (relative
  to the file's location). If this field is not present explicitly, it defaults
  to `.` (the file's location).
- `meta` (optional): Arbitrary metadata can be added manually with this field.
  Any YAML contents is supported. `meta` contents are ignored by DVC, but they
  can be meaningful for user processes that read `.dvc` files.

An _output entry_ can consist of these fields:

- `md5`: Hash value for the file or directory being tracked with DVC
- `path`: Path to the file or directory (relative to `wdir` which defaults to
  the file's location)
- `cache`: Whether or not this file or directory is <abbr>cached</abbr> (`true`
  by default, if not present). See the `--no-commit` option of `dvc add`.

A _dependency entry_ consists of a these possible fields:

- `path`: Path to the dependency (relative to `wdir` which defaults to the
  file's location)
- `md5`: MD5 hash for the dependency (most [stages](/doc/command-reference/run))
- `etag`: Strong ETag response header (only HTTP <abbr>external
  dependencies</abbr> created with `dvc import-url`)
- `repo`: This entry is only for external dependencies created with
  `dvc import`, and can contains the following fields:

  - `url`: URL of Git repository with source DVC project
  - `rev`: Only present when the `--rev` option of `dvc import` is used.
    Specific commit hash, branch or tag name, etc. (a
    [Git revision](https://git-scm.com/docs/revisions)) used to import the
    dependency from.
  - `rev_lock`: Git commit hash of the external <abbr>DVC repository</abbr> at
    the time of importing or updating the dependency (with `dvc update`)

Note that comments can be added to `.dvc` files and `dvc.yaml` using the
`# comment` syntax. `meta` fields and `#` comments are preserved among
executions of the `dvc repro` and `dvc commit` commands, but not when a `.dvc`
file is overwritten by `dvc add`,`dvc import`, or `dvc import-url`.

## dvc.yaml file

When you add commands to a pipeline with `dvc run`, the `dvc.yaml` file is
created or updated. `dvc.yaml` files describe data pipelines, similar to how
[Makefiles](https://www.gnu.org/software/make/manual/make.html#Introduction)
work for building software. Additionally, a [`dvc.lock`](#dvclock-file) file is
also created to record the latest file versions.

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
    cmd: python train.py
    deps:
      - train.py
      - features
    outs:
      - model.pkl
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
- `params`: List of [parameter dependencies](/doc/command-reference/params).
  These are key paths referring to a YAML or JSON file (`params.yaml` by
  default).
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

`dvc.yaml` files also support `# comments`.

### dvc.lock file

For every `dvc.yaml` file, a corresponding `dvc.lock` (YAML) file is created or
updated by certain DVC commands (`dvc run`, `dvc repro`, `dvc commit`). It
describes the latest contents of the files involved in the pipeline(s). It has
several purposes:

- Basic tracking of intermediate and final results of a pipeline (similar to
  [`.dvc` files](#dvc-files))
- Allow DVC to detect when stage definitions, or their dependencies have
  changed. Such conditions invalidate states, requiring their reproduction (see
  `dvc status`, `dvc repro`).
- Provides a mapping of file and directory paths tracked in the
  <abbr>project</abbr> to their locations in the <abbr>cache</abbr> or
  [remote storage](/doc/command-reference/remote). This is needed internally by
  certain DVC commands to operate, such as `dvc checkout`, `dvc get`, and
  `dvc import`.

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
directory tracked by DVC:

- `md5` is the most common type of file hash, used for local file system
  dependencies, as well as SSH <abbr>external dependencies</abbr>.
- `etag` is used for HTTP, S3, Azure, and Google Cloud external dependencies.
- `checksum` is only used for HDFS external dependencies.

> Refer to [External Dependencies](/doc/user-guide/external-dependencies) for
> more information.

[parameter](/doc/command-reference/params#examples) key/value pairs are listed
separately under `params`, grouped by parameters file. (No hash value is needed
to lock params files, as these are not tracked as a whole.)

## Internal directories and files

- `.dvc/config`: This is a configuration file. The config file can be edited by
  hand or with the `dvc config` command.

- `.dvc/config.local`: This is a local configuration file, that will overwrite
  options in `.dvc/config`. This is useful when you need to specify private
  options in your config that you don't want to track and share through Git
  (credentials, private locations, etc). The local config file can be edited by
  hand or with the command `dvc config --local`.

- `.dvc/cache`: The <abbr>cache</abbr> directory will store your data in a
  special [structure](#structure-of-cache-directory). The data files and
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

## Structure of cache directory

There are two ways in which the data is stored in <abbr>cache</abbr>: As a
single file (eg. `data.csv`), or a directory of files.

For the first case, we calculate the file hash, a 32 characters long string
(usually MD5). The first two characters are used to name the directory inside
`.dvc/cache`, and the rest become the file name of the cached file. For example,
if a data file `Posts.xml.zip` has a hash value of
`ec1d2935f811b77cc49b031b999cbf17`, its path in the cache will be
`.dvc/cache/ec/1d2935f811b77cc49b031b999cbf17`.

> Note that file hashes are calculated from file contents only. 2 or more files
> with different names but the same contents can exist in the workspace and be
> tracked by DVC, but only one copy is stored in the cache. This helps avoid
> data duplication in cache and remotes.

For the second case, let us consider a directory with 2 images.

```dvc
$ tree data/images/
data/images/
├── cat.jpeg
└── index.jpeg

$ dvc add data/images
...
```

When running `dvc add` on this directory of images, a `data/images.dvc`
[DVC-file](/doc/user-guide/dvc-files-and-directories) is created, containing the
hash value of the directory:

```yaml
md5: 77e511dafe2178d936e54331d5d6288f
outs:
  - md5: 196a322c107c2572335158503c64bfba.dir
    path: data/images
    # ...
```

The directory in cache is stored as a JSON file (with `.dir` file extension)
describing it's contents, along with the files it contains in cache, like this:

```dvc
$ tree .dvc/cache
.dvc/cache/
├── 19
│   └── 6a322c107c2572335158503c64bfba.dir
├── d4
│   └── 1d8cd98f00b204e9800998ecf8427e
└── 20
    └── 0b40427ee0998e9802335d98f08cd98f
```

The cache file with `.dir` extension is a special text file that contains the
mapping of files in the `data/` directory (as a JSON array), along with their
hash values. The other two cache files are the files inside `data/`.

A typical `.dir` cache file looks like this:

```dvc
$ cat .dvc/cache/19/6a322c107c2572335158503c64bfba.dir
[{"md5": "dff70c0392d7d386c39a23c64fcc0376", "relpath": "cat.jpeg"},
{"md5": "29a6c8271c0c8fbf75d3b97aecee589f", "relpath": "index.jpeg"}]
```

See also `dvc cache dir` to set the location of the cache directory.
