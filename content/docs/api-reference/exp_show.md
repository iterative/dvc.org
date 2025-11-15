# dvc.api.exp_show()

Get DVC <abbr>experiments</abbr> tracked in a <abbr>DVC repository</abbr>.

```py
def exp_show(
    repo: Optional[str] = None,
    revs: Optional[Union[str, List[str]]] = None,
    num: int = 1,
    param_deps: bool = False,
    force: bool = False,
    config: Optional[dict] = None,
) -> List[Dict]:
```

## Usage:

```py
import dvc.api

exps = dvc.api.exp_show()
```

## Description

Get DVC <abbr>experiments</abbr> tracked in a <abbr>DVC repository</abbr> and
returns a list of dictionaries, where each dictionary represents an experiment:

```json
[
  {
    "Experiment": "paled-acre",
    "rev": "883442c",
    "Created": "Apr 19, 2023",
    "dice_multi": 0.8590125166103912,
    "train.arch": "squeezenet1_1"
  },
  {
    "Experiment": "vocal-suer",
    "rev": "231e504",
    "Created": "Apr 19, 2023",
    "dice_multi": 0.8997336177828745,
    "train.arch": "resnet34"
  },
  {
    "Experiment": "banal-hogs",
    "rev": "ff4a08a",
    "Created": "Apr 19, 2023",
    "dice_multi": 0.8758231459806097,
    "train.arch": "alexnet"
  }
]
```

Without arguments, this function gets all <abbr>experiments</abbr> derived from
the Git `HEAD`.

## Parameters

- `repo` - specifies the location of the DVC project. It can be a URL or a file
  system path. Both HTTP and SSH protocols are supported for online Git repos
  (e.g. `[user@]server:project.git`). _Default_: The current project (found by
  walking up from the current working directory tree).

- `revs` - List of Git commits (any
  [revision](https://git-scm.com/docs/revisions) such as a branch or tag name, a
  commit hash or an [experiment](/command-reference/exp) name). _Default_:
  `None` (current working tree will be used)

- `param_deps` - whether to retrieve only params that are stage dependencies.
  _Default_: `False`.

- `config` - [config](/command-reference/config) dictionary to pass to the DVC
  project. This is merged with the existing project config and can be used to,
  for example, provide credentials to the `remote`. See
  [dvc.api.open](/api-reference/open) for examples.

## Example: Create a Pandas DataFrame

The format returned by `dvc.api.exp_show()` can be directly converted to a
[Pandas DataFrame](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.html):

```py
import dvc.api
import pandas as pd

df = pd.DataFrame(dvc.api.exp_show())
```

You can manipulate the Pandas DataFrame to use a subset of the columns and clean
up the rows:

```py
columns = ["Experiment", "dice_multi", "train.arch"]

df = pd.DataFrame(dvc.api.exp_show(), columns=columns)

df.dropna(inplace=True)
df.reset_index(drop=True, inplace=True)

df.to_markdown()
```

|     | Experiment | train.arch    | dice_multi |
| --: | :--------- | :------------ | ---------: |
|   0 | paled-acre | squeezenet1_1 |   0.859013 |
|   1 | vocal-suer | resnet34      |   0.891619 |
|   2 | banal-hogs | alexnet       |   0.875823 |

## Example: Passing `revs` from `dvc.api.scm`

The results of the [`dvc.api.scm`] functions can be passed to the `revs`
argument:

```py
import dvc.api
import pandas as pd

all_tags = dvc.api.scm.all_tags()
exps = dvc.api.exp_show(revs=all_tags)
```

[`dvc.api.scm`]: /api-reference/scm
