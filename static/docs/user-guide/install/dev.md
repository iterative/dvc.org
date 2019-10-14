# Install for testing and development

If you want to test the latest development version of DVC, you can install it
from GitHub. In this case it is highly recommended to use
[virtualenv](https://virtualenv.pypa.io/en/stable/), in order to encapsulate
your testing environment.

You can do it like this:

```bash
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

If you want to install instead a certain `<branch>`, you can add the branch name
after an `@`-sign, like this:

```bash
$ virtualenv -p python3 .env
$ source .env/bin/activate
$ pip install gitpython
$ pip install git+https://github.com/iterative/dvc.git@<branch>
```

If you want to install and test the DVC from the code that you are working on,
you can do it like this:

```bash
$ git clone https://github.com/iterative/dvc dvc-dev
$ mkdir test
$ cd test/

$ virtualenv -p python3 .env
$ source .env/bin/activate
$ pip install gitpython
$ pip install ../dvc-dev[all]
```
