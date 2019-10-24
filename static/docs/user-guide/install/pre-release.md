# Install Pre-release Version

If you would like to install the latest version of DVC, you can do the
following:

> It's highly recommended using
> [Virtual Environment](https://packaging.python.org/tutorials/installing-packages/#creating-virtual-environments)
> or
> [pipx](https://packaging.python.org/guides/installing-stand-alone-command-line-tools/)
> for Python 3.6+ to keep your system environment safe.

```dvc
$ pip install gitpython
$ pip install git+https://github.com/iterative/dvc.git
```

> `gitpython` should be installed first to allow `setup.py` to dynamically
> generate dvc version from the current git commit SHA. It allows us to
> distinguish official dvc release (e.g. `0.24.3`) from a development version
> (e.g. `0.24.3-9c7381`). For more information on naming convention, refer to
> [dvc version](/doc/command-reference/version).

If you want to install instead a certain `<branch>`, you can add the branch name
after an `@`-sign, like this:

```dvc
$ pip install gitpython
$ pip install git+https://github.com/iterative/dvc.git@<branch>
```
