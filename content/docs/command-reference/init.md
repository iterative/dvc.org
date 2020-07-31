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

The command [options](#options) can be used to start an alternative workflow for
advanced scenarios:

- [Initializing DVC in subdirectories](#initializing-dvc-in-subdirectories)
  (`--subdir`) - for monorepos and nested <abbr>DVC projects</abbr>
- [Initializing DVC without Git](#initializing-dvc-without-git) (`--no-scm`) -
  for very simple projects, SCM other than Git, deployment automation, among
  other uses

At DVC initialization, a new `.dvc/` directory is created for internal
configuration and <abbr>cache</abbr>
[files and directories](/doc/user-guide/dvc-files-and-directories#internal-directories-and-files),
that are hidden from the user. This directory is automatically staged with
`git add`, so it can be easily committed with Git.

### Initializing DVC in subdirectories

`--subdir` must be provided to initialize DVC in a subdirectory of a Git
repository. DVC still expects to find the Git repository (will check all
directories up to the system root to find `.git/`). This options does not affect
any config files, `.dvc/` directory is created the same way as in the default
mode. This way multiple <abbr>DVC projects</abbr> can be initialized in a single
Git repository, providing isolation between projects.

#### When is this useful?

This option is mostly useful in the scenario of a
[monorepo](https://en.wikipedia.org/wiki/Monorepo) (Git repository split into
several project directories), but can also be used with other patterns when such
isolation is needed. `dvc init --subdir` mitigates the issues of initializing
DVC in the Git repo root:

- Repository maintainers might not allow a top level `.dvc/` directory,
  especially if DVC is being used by several sub-projects (monorepo).

- DVC config file, cache directory,
  [etc.](/doc/user-guide/dvc-files-and-directories) are shared across different
  sub-projects. This makes it difficult to use different DVC settings,
  [remote storage](/doc/command-reference/remote) locations, etc.

- Many DVC commands can explore the whole <abbr>DVC repository</abbr> to find
  DVC-tracked data and pipelines to work with. This can be undesirable and
  inefficient for large monorepos.

#### How does it affect DVC commands?

The <abbr>project</abbr> root is found by DVC by looking for `.dvc/` from the
current working directory, up. It defines the scope of action for most DVC
commands (e.g. `dvc repro`, `dvc pull`, `dvc metrics diff`), meaning that only
`dvc.yaml`, `.dvc` files, etc. inside the project are usable by the commands.

With `--subdir`, the project root will be found before the Git root, making sure
the scope of DVC commands run here is constrained to this project alone, even if
there are more DVC-related files elsewhere in the repo. Similarly, DVC commands
run outside this project root will ignore its contents.

**Simple structures**: multiple `--subdir` projects, not nested, e.g.:

```dvc
.
├── .git      # plain Git repo
├── project-A
│   ├── .dvc    # dvc init --subdir
│   ...
├── project-B
│   ├── .dvc    # dvc init --no-scm
│   ...
```

DVC considers these separate projects. Any DVC command run in `project-A` is not
aware of `project-B`. However, commands that involve versioning (like
`dvc checkout`) can access the commit history from the Git root (`.`), when run
in `--subdir` projects.

> `.` is not a DVC project in this case, so most DVC commands can't be run
> there.

**Advanced structures**: If there are nested projects, either `--subdir`,
[`--no-scm`](#initializing-dvc-without-git), or full <abbr>DVC
repositories</abbr> (with their own Git root) e.g.:

```dvc
.           # full DVC+Git repo
├── .dvc
├── .git
├── dvc.yaml
├── ...
├── project-A   # initialized with
│   ├── .dvc    # --subdir or --no-scm
│   ├── data.dvc
│   ...
├── project-B
│   ├── .dvc    # a full sub-repo
│   ├── .git    # (no --subdir)
│   ├── data.dvc
│   ...
```

Nothing changes for the inner projects. And any DVC command run in the outer one
(`.`) actively ignores the nested `project-A/` and `project-B/` directories. For
example, using `dvc pull` in `.` wouldn't download data for the `data.dvc`
files.

> Note that nesting Git repos is a questionable practice, unless employing Git
> submodules.

### Initializing DVC without Git

In rare cases, the `--no-scm` option might be desirable: to initialize DVC in a
directory that is not part of a Git repo, or to make DVC ignore Git. Examples
include:

- SCM other than Git is being used. Even though there are DVC features that
  require DVC to be run in the Git repo, DVC can work well with other version
  control systems. Since DVC relies on simple `dvc.yaml` files to manage
  <abbr>pipelines</abbr>, data, etc, they can be added into any SCM thus
  providing large data files and directories versioning.

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
