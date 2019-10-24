# Install Development Version

> To encapsulate your working environment, we highly recommend using
> [virtualenv](https://virtualenv.pypa.io/en/stable/).

If you would like to install the latest version of DVC, you can do the
following:

```dvc
$ pip install gitpython
$ pip install git+https://github.com/iterative/dvc.git
```

> **Note**! `gitpython` should be installed first to allow `setup.py` to
> dynamically generate dvc version from the current git commit SHA. It allows us
> to distinguish official dvc release (e.g. `0.24.3`) from a development version
> (e.g. `0.24.3-9c7381`). For more information on naming convention, refer to
> [dvc version](/doc/command-reference/version).

If you want to install instead a certain `<branch>`, you can add the branch name
after an `@`-sign, like this:

```dvc
$ pip install gitpython
$ pip install git+https://github.com/iterative/dvc.git@<branch>
```
