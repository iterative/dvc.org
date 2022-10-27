# Installation

<admon>

DVC does not replace or include Git. You must have `git` in your system to
enable important features such as [data versioning] and [quick experimentation]
(recommended).

[data versioning]: /doc/use-cases/versioning-data-and-models
[quick experimentation]:
  /doc/user-guide/experiment-management/experiments-overview

</admon>

- [Install on macOS](/doc/install/macos)
- [Install on Windows](/doc/install/windows)
- [Install on Linux](/doc/install/linux)

To check whether DVC is installed or which version you have, use `dvc version`.

## Install as a Python library

DVC can be used as a Python library with a package manager like `pip` or
`conda`, or as a Python [project requirement] if needed. The Python API module
is `dvc.api`.

[project requirement]:
  https://pip.pypa.io/en/latest/user_guide/#requirements-files

## Advanced options

- You can [install a stable pre-release](/doc/install/pre-release) of DVC to
  stay ahead of official releases.

- Shell completion is automatically enabled by certain installation methods. If
  it does not work for you, please see
  [these instructions](/doc/install/completion) to set it up.

- Please also check out these 3rd-party tool [plugins](/doc/install/plugins),
  which might be useful.
