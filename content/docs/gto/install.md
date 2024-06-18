# Installation

You'll need [Python](https://www.python.org/) to install GTO, and
[Git](https://git-scm.com/) to use it.

To check whether GTO is installed in your environment, run `which gto`. To check
which version is installed, run `gto --version`.

## Install as a Python library

GTO is distributed as a Python library, so it works on any OS. You can install
it with a package manager like [pip](https://pypi.org/project/pip/) or
[Conda](https://docs.conda.io/en/latest/).

<admon type="info">

We **strongly** recommend creating a [virtual environment] or using [pipx] to encapsulate
your local environment.

[virtual environment]: https://python.readthedocs.io/en/stable/library/venv.html
[pipx]:
  https://packaging.python.org/guides/installing-stand-alone-command-line-tools/

</admon>

```cli
$ pip install gto
```

This will install the [`gto`](/doc/gto/command-reference) command-line interface
(CLI) and make the Python API available for use in code.
