# Python API

When you [install](/doc/install) DVC in an environment, the `dvc` package
becomes available for usage in Python source code. While most of its code is the
internal implementation of the `dvc` command-line tool, we wrote the `dvc.api`
module to expose special user functions that we hope you may find useful!

> Please don't hesitate in sending a feature request
> [on GitHub](https://github.com/iterative/dvc.org/issues) with ideas of other
> functions we could add to the Python API.

This reference provides the details about our API functions, their purpose,
usage, and examples. Please note that they also have internal documentation
which you can see in the module's
[source code](https://github.com/iterative/dvc/blob/master/dvc/api.py).

Please choose from the navigation sidebar to the left, or click the `Next`
button below ↘
