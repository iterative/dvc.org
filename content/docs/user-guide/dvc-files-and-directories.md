# DVC Files and Directories

Once initialized in a <abbr>project</abbr>, DVC populates its installation
directory (`.dvc/`) with the
[internal directories and files](#internal-directories-and-files) needed for DVC
operation.

Additionally, there are two special kind of files created by certain
[DVC commands](/doc/command-reference):

- Files ending with the `.dvc` extension are placeholders to version data files
  and directories. A <abbr>DVC project</abbr> usually has one
  [`.dvc` file](#dvc-files) per large data file or dataset directory being
  tracked.
- The [`dvc.yaml` file](#dvcyaml-file) or _pipeline(s) file_ specifies stages
  that form the pipeline(s) of a project, and their connections (_dependency
  graph_ or DAG).

Both use human-friendly YAML schemas, described below. We encourage you to get
familiar with them so you may edit them freely, as needed. Both type of files
should be versioned with Git (for Git-enabled <abbr>repositories</abbr>).

## .dvc file

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

- `outs` (always present): List of <abbr>output</abbr> entries for this `.dvc`
  file. Typically there is only one (but several can be added manually).
- `deps`: List of <abbr>dependency</abbr> entries for this stage, only present
  when `dvc import` and `dvc import-url` are used. Typically there is only one
  (but several can be added manually).
- `meta` (optional): Arbitrary metadata can be added manually with this field.
  Any YAML contents is supported. `meta` contents are ignored by DVC, but they
  can be meaningful for user processes that read `.dvc` files.

An _output entry_ can consist of these fields:

- `md5`: Hash value for the output file
- `path`: Path to the output in the <abbr>workspace</abbr>, relative to the
  location of the `.dvc` file
- `cache`: Whether or not DVC should cache the output. `true` by default

A _dependency entry_ consists of a these possible fields:

- `path`: Path to the dependency, relative to the `wdir` path (always present)
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
    the time of importing or updating (with `dvc update`) the dependency.

Note that comments can be added to `.dvc` files and `dvc.yaml` using the
`# comment` syntax. `meta` fields and `#` comments are preserved among
executions of the `dvc repro` and `dvc commit` commands, but not when a `.dvc`
file is overwritten by `dvc add`,`dvc import`, or `dvc import-url`.

## dvc.yaml files

When you add commands to a pipeline with `dvc run`, the `dvc.yaml` file is
created or updated. Here's a simple example:

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
- `deps`: List of <abbr>dependency</abbr> file or directory paths of this stage
- `params`: List of the [parameters](/doc/command-reference/params). These are
  key paths referring to another YAML file (`params.yaml` by default).
- `outs`: List of <abbr>output</abbr> file or directory paths of this stage
- `metrics`: List of [metric files](/doc/command-reference/metrics)
- `plots`: List of [plot metrics](/doc/command-reference/plots) and optionally,
  their default configuration (subfields matching the options of
  `dvc plots modify`).
- `frozen`: Whether or not this stage is frozen from reproduction
- `always_changed`: Whether or not this stage is considered as changed by
  commands such as `dvc status` and `dvc repro`. `false` by default
- `meta` (optional): Arbitrary metadata can be added manually with this field.
  Any YAML contents is supported. `meta` contents are ignored by DVC, but they
  can be meaningful for user processes that read or write `.dvc` files directly.

`dvc.yaml` files also support `# comments`. `meta` fields and `#` comments are
always preserved in `dvc.yaml` stages.

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
  [Plot templates](/doc/command-reference/plots#plot-templates)

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
