# Contributing

We welcome contributions to [DVC](https://github.com/iterative/dvc) by the
community.

## How to report a problem

Please search [issue tracker](https://github.com/iterative/dvc/issues) before
creating a new issue (problem or an improvement request). Feel free to add
issues related to the project and [dvc.org](https://dvc.org) site.

If you feel that you can fix or implement it, please read a few paragraphs below
to learn how to submit your changes.

## Submitting changes

* Open a new issue in the
[issue tracker](https://github.com/iterative/dvc/issues).
* Setup the [development environment](#development-environment) if you need to
run tests or [run](#running-development-version) the
DVC with your changes.
* Fork [DVC](https://github.com/iterative/dvc.git) and prepare necessary
changes.
* Add tests for your changes to `tests/test_*.py`.
* [Run tests](#running-tests) and make sure all of them pass.
* Submit a pull request, referencing any issues it addresses.

We will review your pull request as soon as possible. Thank you for
contributing!

## Development environment

* Get the latest development version. Fork and clone the repo:
  ```dvc
      $ git clone git@github.com:<username>/dvc.git
  ```
* Make sure that you have python 3 installed. Version 3.6 or higher is required
to run style checkers on pre-commit. On Mac OS, use `brew` to install the
latest version of python.
* Install the requirements with `pip install -r requirements.txt` and
`pip install -r tests/requirements.txt`. We **strongly** recommend initializing a
[virtual environment](https://virtualenv.pypa.io/en/latest/userguide/) before
installing the required libraries. For example: 
  ```dvc
      $ cd dvc
      $ virtualenv --python python3 .env
      $ source .env/bin/activate
      $ pip install -r requirements.txt
      $ pip install -r tests/requirements.txt
  ```
* Install coding style pre-commit hooks with
  ```dvc
      $ pip install pre-commit
      $ pre-commit install
  ```

That should be it. You should be ready to make changes, run tests do commits! If
you experience any problems, please don't hesitate to ping us in our
[chat](/chat).

## Running tests

The simplest way to run tests:

```dvc
    $ cd dvc
    $ python -m tests
```

Internally, it is using `nosetest` to run the full test suite and report the
result. At the very end you should see something like this:

```dvc
    $ python -m tests

    ...

    Ran 344 tests in 22.446s

    OK (SKIP=7)
```

Otherwise, for each failed test you should see and output like this that should
help you identify the problem:

```
    $ python -m tests

    ...

    ============================================================
    ERROR: test_run (tests.test_metrics.TestCachedMetrics)
    ------------------------------------------------------------


    -------------------- >> begin captured stdout << ---------------------

    ...


    FAILED
```

You can pass any additional arguments to the script that will override the
default `--all-modules` `nosetests`'s scope:

To run a single test case:

```dvc
    $ python -m tests tests/test_metrics.py:TestCachedMetrics
```

To pass additional arguments:

```dvc
    $ python -m tests -x -s tests
```

## Running development version

To run DVC from its Git repository you need to setup your environment:

* Export `DVC_HOME` variable that is pointing to the root of your repository:
    ```dvc
      $ export DVC_HOME=/home/user/git/dvc
    ```

* Modify and export `PATH` variable to include location of our wrapper script:
    ```dvc
      $ export PATH=$PATH:$DVC_HOME/bin
    ```

* Check that `dvc` points to your repository:
    ```dvc
      $ which dvc
      /home/user/git/dvc/bin/dvc
    ```

## Commit style guide

Format:

```
    (component): (short description)

    (long description)

    Fixes #(github issue id).
```

Message types:

* *component* - name of a component that this patch is affecting. Use `dvc`
in a general case;
* *short description* - short description of the patch;
* *long description* - If needed, longer message describing the patch in more
details;
* *github issue id* - An id of the github issue that this patch is addressing;

Example:

```
  remote: add support for Amazon S3

  Fixes #123
```

## Code style guide

We are using [PEP8](https://www.python.org/dev/peps/pep-0008/?) and are 
checking that our code is formated with [black](https://github.com/ambv/black).
