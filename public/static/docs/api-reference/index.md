# Python API

When you [install](/doc/install) DVC with an package manager like `pip` or
`conda`, the `dvc` package becomes available to the corresponding Python
environment. While most of the package implements our
[command-line tool](/doc/command-reference), we wrote the `dvc.api` module to
expose special functions you can use in your Python source code.

> For API use, we **strongly** recommend having `dvc` in a requirements file for
> your Python project, and installing it with a package manager (in a
> [virtual environment](https://packaging.python.org/tutorials/installing-packages/#creating-virtual-environments)
> preferably).

To use the API, import the module first with:

```py
import dvc.api
```

This reference provides the details about the API functions (inside `dvc.api`):
their purpose, usage, and examples. Please note that they also have inline
documentation, which you get from the module's
[source code](https://github.com/iterative/dvc/blob/master/dvc/api.py).

> Please don't hesitate in sending a feature request
> [on GitHub](https://github.com/iterative/dvc.org/issues) with ideas of other
> functions we could add to the Python API.

Please choose a function from the navigation sidebar to the left, or click the
`Next` button below to jump into the first one ↘
