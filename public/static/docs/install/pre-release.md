# Install Pre-release Version

If you want to test the latest stable version of DVC, ahead of official
releases, you can install it from our code repository GitHub.

> We **strongly** recommend creating a
> [virtual environment](https://packaging.python.org/tutorials/installing-packages/#creating-virtual-environments)
> or using
> [pipx](https://packaging.python.org/guides/installing-stand-alone-command-line-tools/)
> (on Python 3.6+) to encapsulate your local environment.

```dvc
$ pip install gitpython
$ pip install git+https://github.com/iterative/dvc
```

> `gitpython` allows the installation process to generate a DVC version using
> the current Git commit SHA. This lets us to distinguish official DVC releases
> (e.g. `0.64.3`) from a development version (e.g. `0.64.3-9c7381`). For more
> information on our versioning convention, refer to
> [Components of DVC version](/doc/command-reference/version#components-of-dvc-version).

To install a development version for contributing to the project, please refer
to
[Development environment](/doc/user-guide/contributing/core#development-environment).
