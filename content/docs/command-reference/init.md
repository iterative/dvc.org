# init

Initialize a <abbr>DVC project</abbr> in the current working directory.

## Synopsis

```usage
usage: dvc init [-h] [-q | -v] [--no-scm] [-f] [--subdir]
```

## Description

DVC works best in a Git repository. This enables all features, providing the
most value. For this reason, `dvc init` (without flags) expects to run in a Git
repository root (a `.git/` directory should be present).

At DVC initialization, a new `.dvc/` directory is created for internal
configuration and <abbr>cache</abbr>
[files and directories](/doc/user-guide/dvc-files-and-directories#internal-directories-and-files),
that are hidden from the user. This directory is automatically staged with
`git add`, so it can be easily committed with Git.

The command [options](#options) can be used to start an alternative workflow for
advanced scenarios:

- [Initializing DVC in subdirectories](#initializing-dvc-in-subdirectories)
  (`--subdir`) - for monorepos and nested <abbr>DVC projects</abbr>
- [Initializing DVC without Git](#initializing-dvc-without-git) (`--no-scm`) -
  for very simple projects, version control systems other than Git, deployment
  automation, among other uses

### Initializing DVC in subdirectories

`--subdir` must be provided to initialize DVC in a subdirectory of a Git
repository. DVC still expects to find a Git root (will check all directories up
to the system root to find `.git/`). This options does not affect any config
files, `.dvc/` directory is created the same way as in the default mode. This
way multiple <abbr>DVC projects</abbr> can be initialized in a single Git
repository, providing isolation between projects.

#### When is this useful?

This option is mostly useful in the scenario of a
[monorepo](https://en.wikipedia.org/wiki/Monorepo) (Git repo split into several
project directories), but can also be used with other patterns when such
isolation is needed. `dvc init --subdir` mitigates possible limitations of
initializing DVC in the Git repo root:

- Repository maintainers might not allow a top level `.dvc/` directory,
  especially if DVC is already being used by several sub-projects (monorepo).

- DVC [internals](/doc/user-guide/dvc-files-and-directories) (config file, cache
  directory, etc.) would be shared across different subdirectories. This forces
  all of them to use the same DVC settings and
  [remote storage](/doc/command-reference/remote).

- By default, DVC commands like `dvc pull` and `dvc repro` explore the whole
  <abbr>DVC repository</abbr> to find DVC-tracked data and pipelines to work
  with. This can be inefficient for large monorepos.

- Commands such as `dvc status` and `dvc metrics show` would produce unexpected
  results if not constrained to a single project scope.

#### How does it affect DVC commands?

The <abbr>project</abbr> root is found by DVC by looking for `.dvc/` from the
current working directory, up. It defines the scope of action for most DVC
commands (e.g. `dvc repro`, `dvc pull`, `dvc metrics diff`, etc.) meaning that
only `dvc.yaml`, `.dvc` files, etc. inside the project are usable by the
commands.

With `--subdir`, the project root will be found before the Git root, causing the
scope of DVC commands run here is constrained to this project alone.

If there are multiple `--subdir` projects, but not nested, e.g.:

```dvc
.           # git init
├── .git
├── project-A
│   ├── .dvc    # dvc init --subdir
│   ...
├── project-B
│   ├── .dvc    # dvc init --subdir
│   ...
```

DVC considers A and B separate projects. Any DVC command run in `project-A` is
not aware of `project-B`. However, commands that involve versioning (like
`dvc diff`, among others) access the commit history from the Git root (`.`).

> `.` is not a DVC project in this case, so most DVC commands can't be run
> there.

If there are nested `--subdir` projects e.g.:

```dvc
project-A
├── .dvc        # git init && dvc init
├── .git
├── dvc.yaml
├── ...
├── project-B
│   ├── .dvc        # dvc init --subdir
│   ├── data-B.dvc
│   ...
```

Nothing changes for the inner projects. And any DVC command run in the outer one
actively ignores the nested project directories. For example, using `dvc pull`
in `project-A` wouldn't download data for the `data-B.dvc` file.

### Initializing DVC without Git

In rare cases, the `--no-scm` option might be desirable: to initialize DVC in a
directory that is not part of a Git repo, or to make DVC ignore Git. Examples
include:

- SCM other than Git is being used. Even though there are DVC features that
  require DVC to be run in the Git repo, DVC can work well with other version
  control systems. Since DVC relies on simple `dvc.yaml` files to manage
  <abbr>pipelines</abbr>, data, etc, they can be added into any version control
  system, thus providing large data files and directories versioning.

- There is no need to keep the history at all, e.g. having a deployment
  automation like running a data pipeline using `cron`.

In this mode, DVC features related to versioning are not available. For example
automatic creation and updating of `.gitignore` files on `dvc add` or `dvc run`,
as well as `dvc diff` and `dvc metrics diff`, which require Git revisions to
compare.

DVC sets the `core.no_scm` config option value to `true` in the DVC
[config](/doc/command-reference/config) when initialized this way. This means
that even if the project is tracked by Git, or if Git is initialized in it
later, DVC will keep operating detached from Git in this project.

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
