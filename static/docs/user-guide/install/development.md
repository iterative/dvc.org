# Development Version

If you want to test the latest stable version of DVC, ahead of official
releases, you can install it from our code repository GitHub. It's highly
recommended to use a virtual environment for Python such as
[virtualenv](https://virtualenv.pypa.io/en/stable/), in order to encapsulate
your testing environment:

```dvc
$ virtualenv -p python3 .env
$ source .env/bin/activate
$ pip install gitpython
$ pip install git+https://github.com/iterative/dvc
$ which dvc
.../.env/bin/dvc
```

> `gitpython` allows the installation process to generate a DVC version using
> the current Git commit SHA. This lets us to distinguish official DVC releases
> (e.g. `0.64.3`) from a development version (e.g. `0.64.3-9c7381`). For more
> information on our versioning convention, refer to
> [Components of DVC version](/doc/command-reference/version#components-of-dvc-version).

To install a development version for contributing to the project, refer to
[Development environment](/doc/user-guide/contributing#development-environment).
