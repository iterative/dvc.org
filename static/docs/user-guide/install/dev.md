# Install Development Version

If you want to test the latest version of DVC, before the official release, you
can install it from the code on GitHub. In this case it is highly recommended to
use [virtualenv](https://virtualenv.pypa.io/en/stable/), in order to encapsulate
your testing environment.

## Install master from GitHub

```dvc
$ virtualenv -p python3 .env
$ source .env/bin/activate
$ pip install gitpython
$ pip install git+https://github.com/iterative/dvc.git
```

> **Note**! `gitpython` should be installed first to allow `setup.py` to
> dynamically generate dvc version from the current git commit SHA. It allows us
> to distinguish official dvc release (e.g. `0.24.3`) from a development version
> (e.g. `0.24.3-9c7381`). For more information on naming convention, refer to
> [dvc version](/doc/command-reference/version).

## Install branch from GitHub

If you want to install instead a certain `<branch>`, you can add the branch name
after an `@`-sign, like this:

```dvc
$ virtualenv -p python3 .env
$ source .env/bin/activate
$ pip install gitpython
$ pip install git+https://github.com/iterative/dvc.git@<branch>
```
