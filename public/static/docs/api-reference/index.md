# Python API

When you [install](/doc/install) DVC in an environment, the `dvc` package
becomes available to the corresponding `python` interpreter. While most of the
package implements our [command-line tool](/doc/command-reference), we wrote the
`dvc.api` module to expose special functions you can use in your Python source
code.

> Please don't hesitate in sending a feature request
> [on GitHub](https://github.com/iterative/dvc.org/issues) with ideas of other
> functions we could add to the Python API.

Import the API with:

```py
import dvc.api
```

This reference provides the details about our API functions, their purpose,
usage, and examples. Please note that they also have internal documentation
which you can see in the module's
[source code](https://github.com/iterative/dvc/blob/master/dvc/api.py).

Please choose from the navigation sidebar to the left, or click the `Next`
button below ↘
