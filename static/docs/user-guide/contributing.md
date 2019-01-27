# Contributing

We welcome contributions to [DVC](https://github.com/iterative/dvc) by the
community.

## How to report a problem

Please search [issue tracker](https://github.com/iterative/dvc/issues) before
creating a new issue. Feel free to add issues related to the project and
[dvc.org](https://dvc.org) site.

## Submitting changes

* Open a new issue in the [issue tracker](https://github.com/iterative/dvc/issues).
* Get the latest development version. Fork and clone the repo:
  ```dvc
      $ git clone https://github.com/iterative/dvc.git
  ```
* Install requirements with `pip install -r requirements.txt` and
`pip install -r test-requirements.txt`. We **strongly** recommend initializing a
[virtual environment](https://virtualenv.pypa.io/en/latest/userguide/) before
installing the required libraries. For example: 
  ```dvc
      $ cd dvc
      $ virtualenv .env
      $ source .env/bin/activate
      $ pip install -r requirements.txt
      $ pip install -r test-requirements.txt
  ```
* Make changes. Check the paragraph below if you need to run it with your changes.
* Add tests for your change to `tests/test_*.py`.
* Run tests with `python -m tests` and make sure all of them pass.
* Submit a pull request, referencing any issues it addresses.

We will review your pull request as soon as possible. Thank you for contributing!

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

## Style guides
### Commit messages

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

### Python style guide
We are generally using [PEP8](https://www.python.org/dev/peps/pep-0008/?).
