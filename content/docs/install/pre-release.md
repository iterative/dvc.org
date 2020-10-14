# Install Pre-release Version

If you want to test the latest stable version of DVC, ahead of official
releases, you can install it from our code repository GitHub.

> We **strongly** recommend creating a
> [virtual environment](https://python.readthedocs.io/en/stable/library/venv.html)
> or using
> [pipx](https://packaging.python.org/guides/installing-stand-alone-command-line-tools/)
> (on Python 3.6+) to encapsulate your local environment.

```dvc
# Should be installed before DVC. See details below.
$ pip install gitpython

# Basic version.
$ pip install git+https://github.com/iterative/dvc

# With cloud storage support, add `egg=dvc[option]`,
# e.g. `s3` for AWS S3, `all` - to support all availabe remote storages.
# See full list in the `extras_require` section here:
# https://github.com/iterative/dvc/blob/master/setup.py
$ pip install "git+https://github.com/iterative/dvc#egg=dvc[s3]"
```

> `gitpython` allows the installation process to generate a DVC version using
> the current Git commit hash. This lets us to distinguish official DVC releases
> (e.g. `0.64.3`) from a development version (e.g. `0.64.3-9c7381`). For more
> information on our versioning convention, refer to
> [Components of DVC version](/doc/command-reference/version#components-of-dvc-version).

To install a development version for contributing to the project, please see
[Development environment](/doc/user-guide/contributing/core#development-environment).
