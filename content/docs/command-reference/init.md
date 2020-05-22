# init

Initialize a <abbr>DVC project</abbr> in the current working directory.

## Synopsis

```usage
usage: dvc init [-h] [-q | -v] [--no-scm] [-f] [--subdir]
```

## Description

DVC works on top of a Git repository by default. This enables all features,
providing the most value. It means that `dvc init` (without flags) expects to
run in a Git repository root (a `.git/` directory should be present).

The command [options](#options) can be used to start an alternative workflow for
advanced scenarios:

- [Initializing DVC in subdirectories](#initializing-dvc-in-subdirectories) -
  support for monorepos, nested <abbr>DVC projects</abbr>, etc.
- [Initializing DVC without Git](#initializing-dvc-without-git) - support for
  SCM other than Git, deployment automation cases, etc.

At DVC initialization, a new `.dvc/` directory is created for internal
configuration and <abbr>cache</abbr>
[files and directories](/doc/user-guide/dvc-files-and-directories), that are
hidden from the user. This directory is automatically staged with `git add`, so
it can be easily committed with Git.

### Initializing DVC in subdirectories

`--subdir` must be provided to initialize DVC in a subdirectory of a Git
repository. DVC still expects to find the Git repository (will check all
directories up to the root to find `.git`). This options does not affect any
config files, `.dvc` directory is created the same way as in the default mode.
This way multiple DVC projects (including nested ones) could be initialized in a
single Git repository providing isolation and granular project management.

#### When is this useful?

`--subdir` is mostly used in the scenario of a
[monorepo](https://en.wikipedia.org/wiki/Monorepo), but also can be used in
other workflows when such isolation and/or advanced granularity is needed.

Let's imagine we have an existing Git repository that is split into sub-projects
(monorepo). In this case `dvc init --subdir` can be run in one or many
sub-projects to mitigate the issues of initializing in the Git repository root:

- Repository maintainers might not allow extra `.dvc` top level directory,
  especially if DVC is being used by a small number of sub-projects.

- Not enough isolation/granularity - DVC config, cache, and other files are
  shared across different sub-projects. Means that it's not easy to use
  different remote storages, for example, for different sub-projects, etc.

- Not enough isolation/granularity - commands like `dvc pull`, `dvc checkout`,
  and others analyze the whole repository to look for
  [DVC-files](/doc/user-guide/dvc-file-format) to download files and
  directories, to reproduce <abbr>pipelines</abbr>, etc. It can be expensive in
  the large repositories with a lot of projects.

- Not enough isolation/granularity - commands like `dvc metrics diff`,
  `dvc pipeline show` and others by default dump all the metrics, all the
  pipelines, etc.

#### How does it affect DVC commands?

No matter what mode is used, DVC looks for the `.dvc` directory when it starts
(from the current working directory and up). Location of the found `.dvc`
directory determines the root of the DVC project. (In case of `--subdir` it
might happen that Git repository root is located at different path than the DVC
project root.)

DVC project root defines the scope for the most DVC commands. Mostly meaning
that all DVC-file under the root path are being analyzed.

If there are multiple DVC sub-projects but they _are not_ nested, e.g.:

```
.
├── .git
|
├── project-A
│   └── .dvc
│   ...
├── project-B
│   └── .dvc
│   ...
```

DVC considers them a two separate DVC projects. Any DVC command that is being
run in the `project-A` is not aware about DVC `project-B`. DVC does not consider
Git repository root an initialized DVC project in this case and commands that
require DVC project will raise an error.

On the other hand, if there _are_ nested DVC projects, e.g.:

```
project-A
├── .dvc
├── data-A.dvc
│   ...
└── project-B
    ├── .dvc
    ├── data-B.dvc
    │   ...
```

Nothing changes for the `project-B`. But for any DVC command being run in the
`project-A` ignores the whole directory `project-B/`, meaning for example:

```dvc
$ cd project-A
$ dvc pull
```

won't download or checkout data for the `data-B.dvc` file.

### Initializing DVC without Git

In rare cases, the `--no-scm` option might be desirable: to initialize DVC in a
directory that is not part of a Git repo, or to make DVC ignore Git. Examples
include:

- SCM other than Git is being used. Even though there are DVC features that
  require DVC to be run in the Git repo, DVC can work well with other version
  control systems. Since DVC relies on simple text
  [DVC-files](/doc/user-guide/dvc-file-format) to manage <abbr>pipelines</abbr>,
  data, etc, they can be added into any SCM thus providing large data files and
  directories versioning.

- There is no need to keep the history at all, e.g. having a deployment
  automation like running a data pipeline using `cron`.

In this mode DVC features that depend on Git being present are not available -
e.g. managing `.gitignore` files on `dvc add` or `dvc run` to avoid committing
DVC-tracked files into Git, or `dvc diff` and `dvc metrics diff` that accept
Git-revisions to compare, etc.

DVC sets the `core.no_scm` config option value to `true` in the DVC
[config](/doc/command-reference/config) when it is initialized this way. It
means that even if the project was Git-tracked already or Git is initialized in
it later, DVC keeps operating in the detached from Git mode.

## Options

- `-f`, `--force` - remove `.dvc/` if it exists before initialization. Will
  remove any existing local cache. Useful when a previous `dvc init` has been
  corrupted.

- `--subdir` - initialize the DVC project in the current working directory,
  _even if it's not the Git repository root_. (If run in a project root, this
  option is ignored.) It affects how other DVC commands behave afterwards,
  please see
  [Initializing DVC in subdirectories](#initializing-dvc-in-subdirectories) for
  more details.

- `--no-scm` - initialize the DVC project detached from Git. It means that DVC
  doesn't try to find or use Git in the directory it's initialized in. Certain
  DVC features are not available in this mode, please see
  [Initializing DVC without Git](#initializing-dvc-without-git) for more
  details.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples: Most common initialization workflow

Create a new <abbr>DVC repository</abbr> (requires to be run in the Git
repository root):

```dvc
$ mkdir example && cd example
$ git init
$ dvc init
$ git status
...
        new file:   .dvc/.gitignore
        new file:   .dvc/config

$ git commit -m "Init DVC"
```

Note that the <abbr>cache</abbr> directory (among others) is not tracked with
Git. It contains data and model files, and will be managed by DVC.

```dvc
$ cat .dvc/.gitignore
/state
/lock
...
/cache
```

## Examples: Initializing DVC in a subdirectory

Create a new <abbr>DVC repository</abbr> in a subdirectory of a Git repository:

```dvc
$ mkdir repo && cd repo

$ git init
$ mkdir project-a && cd project-a

$ dvc init --subdir
```

In this case, Git repository is inside `repo` directory, while <abbr>DVC
repository</abbr> is inside `repo/project-a`.

```dvc
$ tree repo -a
repo
├── .git
.
.
.
└── project-a
    └── .dvc
```
