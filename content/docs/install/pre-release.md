# Install Pre-release Version

If you want to test the latest stable version of DVC, ahead of official
releases, you can install it from our code repository GitHub.

> We **strongly** recommend creating a
> [virtual environment](https://docs.python.org/3/library/venv.html) or using
> [pipx](https://packaging.python.org/guides/installing-stand-alone-command-line-tools/)
> (on Python 3.8+) to encapsulate your local environment.

```cli
# Plain DVC
$ pip install git+https://github.com/iterative/dvc

# For cloud storage support, add `egg=dvc[option]` e.g. `s3`.
# Use `all` to include all available clouds.
$ pip install "git+https://github.com/iterative/dvc#egg=dvc[s3]"
```

> For information on our versioning convention, refer to
> [Components of DVC version](/command-reference/version#components-of-dvc-version).

To install a development version for contributing to the project, see the
[Development environment](/user-guide/contributing/core#development-environment)
guide.
