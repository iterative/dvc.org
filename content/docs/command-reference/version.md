# version

Display the DVC version along with environment and project information.

## Synopsis

```usage
usage: dvc version [-h] [-q | -v]
```

## Description

`dvc version` outputs the following information about the system/environment:

| Line                                        | Detail                                                                                                                                                               |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`DVC version`](#components-of-dvc-version) | Version of DVC, and name of the binary or package manager (`pip`, `conda`, etc.) used to install DVC (along with a Git commit hash in case of a development version) |
| `Platform`                                  | Version of Python in the environment where DVC is initialized, and information about the operating system                                                            |
| `Supports`                                  | Type of [remote storages](/doc/command-reference/remote/add#supported-storage-types) that are supported (their required dependencies are installed)                  |
| `Cache types`                               | [Type of links](/doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache) supported (between <abbr>workspace</abbr> and <abbr>cache</abbr>)      |
| `Cache directory`                           | Filesystem type (e.g. ext4, FAT, etc.) and drive on which the <abbr>cache</abbr> directory is mounted                                                               |
| `Workspace directory`                       | Filesystem type (e.g. ext4, FAT, etc.) and drive on which the <abbr>workspace</abbr> is mounted                                                           |
| `Repo`                                      | Shows whether we are in a DVC repo and/or Git repo                                                                                                                   |

> If `dvc version` is executed outside a DVC project, neither `Cache` nor
> `Workspace` info is printed.

> Note that if you've installed DVC using `pip`, you will need to install
> `psutil` manually with `pip install psutil` in order for `dvc version` to
> report file system information. Please see the original
> [issue on GitHub](https://github.com/iterative/dvc/issues/2284) for more info.

### Components of DVC version

The detail of DVC version depends upon the way of installing DVC.

- **Official release**: official releases (for example `1.7.2`) are stable
  versions that have upgraded features and bug fixes.
  [These instructions](/doc/install) include ways to install DVC using the
  official package stored in [Python Packaging Authority](https://www.pypa.io/).
  We mark these official releases with
  [tags](https://github.com/iterative/dvc/releases) on DVC's repository. Any
  issues reported with the official build can be traced using the
  `_BASE_VERSION` constant in our
  [core repo](https://github.com/iterative/dvc/blob/master/dvc/version.py).

  > 💡 To only get this number, use `dvc -V`.

- **Development version**: `pip install git+git://github.com/iterative/dvc` will
  install DVC using the `master` branch of DVC's repository. Please see
  [development version](/doc/user-guide/contributing/core#development-environment),
  another way of setting it up.

  The master branch is constantly updated with changes that might not be ready
  to publish yet. Therefore, installing with this method might result in usage
  issues. To trace any error reported with this setup, we need to know exactly
  which version is being used. For this we rely on a Git commit hash that is
  displayed in the output of `dvc version` like this: `1.7.4+292cab.mod`. The
  part before `+` is the `_BASE_VERSION`, and the following part is the commit
  hash of the tip of the `master` branch. The optional suffix `.mod` means that
  code is modified.

- **Binary or Package manager**: shows how DVC was downloaded and
  [installed](/doc/install).

  DVC can be installed from one of the binary releases:

  - Debian package (`.deb`) - file used to install packages in several Linux
    distributions, like Ubuntu
  - Red Hat package (`.rpm`) - file used to install packages in some Linux based
    distributions, such as Fedora, CentOS, etc.
  - PKG file (`.pkg`) - file used to install apps on MacOS
  - Windows executable (`.exe`) - file used to install applications on Windows

  These downloads are available from our [home page](/). They ultimately contain
  a binary bundle, which is the executable file of a software application,
  meaning that it will run natively on a specific platform (Linux, Windows,
  MacOS).

  > We use [PyInstaller](https://pythonhosted.org/PyInstaller/) to bundle our
  > source code into the binary package app.

  DVC can also be downloaded and installed using a package manager:

  - [DVC's GitHub repository](https://github.com/iterative/dvc) - where core
    source code is hosted
  - [The Python Package Index (PyPI)](https://pypi.org/project/dvc/) - source
    code is stored as a Python package
  - [Homebrew package manager](https://formulae.brew.sh/formula/dvc) (for MacOS
    systems) - source code is stored as Python package

  This method of installation involves downloading DVC source code, and
  following certain setup instructions (see the
  [development](/doc/install/pre-release) guide) to build the application before
  being able to it.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Getting the DVC version and environment information:

Inside a DVC project:

```dvc
$ dvc version

DVC version: 1.7.4 (pip)
---------------------------------
Platform: Python 3.8.3 on Linux-5.4.0-47-generic-x86_64-with-debian-buster-sid
Supports: All remotes
Cache types: hardlink, symlink
Cache directory: ext4 on /dev/sda1
Workspace directory: ext4 on /dev/sda1
Repo: dvc, git
```

Outside a DVC project:

```dvc
$ dvc version

DVC version: 1.7.4 (pip)
---------------------------------
Platform: Python 3.8.3 on Linux-5.4.0-47-generic-x86_64-with-debian-buster-sid
Supports: All remotes
```
