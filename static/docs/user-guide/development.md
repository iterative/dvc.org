# Development Version

If you would like to install the latest version of DVC, you can do the
following.

> **Note**! `gitpython` should be installed first to allow `setup.py` to
> dynamically generate dvc version from the current git commit SHA. It allows us
> to distinguish official dvc release (e.g. `0.24.3`) from a development version
> (e.g. `0.24.3-9c7381`).

```dvc
$ pip install gitpython
$ pip install git+git://github.com/iterative/dvc
```

Note that this will automatically upgrade your system's DVC version to the
latest development version. To encapsulate your dev environment, we highly
recommend using [virtualenv](https://virtualenv.pypa.io/en/stable/)
