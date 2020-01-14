# Installation

Please double check that you don't already have DVC (for example running
`which dvc`) before trying to install it (again).

- [Install on MacOS](/doc/install/macos)
- [Install on Windows](/doc/install/windows)
- [Install on Linux](/doc/install/linux)

## Install as a Python library

When you install DVC with an environment manager like `pip` or `conda`, the
`dvc` package becomes available to the corresponding `python` interpreter. This
is particularly useful in order to access the [Python API](/doc/api-reference)
(`dvc.api` module).

> For API use, we **strongly** recommend having `dvc` in a requirements or setup
> file for your Python project, and installing it via and env manager such as
> `pip`.

## Advanced options

- Shell completion is automatically enabled by certain installation methods. If
  it does not work for you, please see
  [these instructions](/doc/install/completion) to set it up.

- You can [install a stable pre-release](/doc/install/pre-release) of DVC to
  stay ahead of official releases.

- Please also check out these 3rd-party tool [plugins](/doc/install/plugins),
  which might be useful.
