# dvc.api.scm

Group of utility functions to get lists of Git
[revisions](https://git-scm.com/docs/revisions) in a <abbr>DVC
repository</abbr>.

```py
def all_branches(repo: Optional[str] = None) -> List[str]:
```

```py
def all_commits(repo: Optional[str] = None) -> List[str]:
```

```py
def all_tags(repo: Optional[str] = None) -> List[str]:
```

## Usage:

```py
import dvc.api

branches = dvc.api.scm.all_branches()
commits = dvc.api.scm.all_commits()
tags = dvc.api.scm.all_tags()
```

## Description

Get a list of all Git branches/commits/tags in a DVC repository.

Returns the names for branches and tags and the SHAs for commits.

## Parameters

- `repo` - specifies the location of the DVC project. It can be a URL or a file
  system path. Both HTTP and SSH protocols are supported for online Git repos
  (e.g. `[user@]server:project.git`). _Default_: The current project (found by
  walking up from the current working directory tree).

## Example: Passing results to `dvc.api.exp_show()`

The results of the `dvc.api.scm` functions can be passed to the `revs` argument
of `dvc.api.exp_show()`:

```py
import dvc.api
import pandas as pd

all_tags = dvc.api.scm.all_tags()
exps = dvc.api.exp_show(revs=all_tags)
```
