# dvc.api.params_show()

Load <abbr>parameters</abbr> (name and values) tracked in a <abbr>DVC
project</abbr>.

```py
def params_show(
    *targets: str,  # Optional
    stages: Optional[Union[str, Iterable[str]]] = None,
    repo: Optional[str] = None,
    rev: Optional[str] = None,
    deps: bool = False,
) -> Dict:
```

## Usage:

```py
import dvc.api

params = dvc.api.params_show()
```

## Description

Retrieves <abbr>params</abbr> keys and values from a <abbr>DVC project</abbr>
and returns a dictionary, such as:

```json
{
  "split": 0.2,
  "seed": 20170428
}
```

Without arguments, this function will retrieve all params from all tracked
parameter files (used in any `dvc.yaml` file). This applies to the current
project version when using Git (including any changes in the working tree).

The function parameters (below) let you restrict what's retrieved.

## Parameters

- `*targets` - paths to one or more valid parameter file(s) to retrieve params
  from. For example, `"params.py, myparams.toml"`. If no `targets` are provided,
  all param files tracked in any `dvc.yaml` will be used by default. Note that
  explicit targets don't have to be used in a `dvc.yaml` (unless `deps=True`).

- `repo` - specifies the location of the DVC project. It can be a URL or a file
  system path. Both HTTP and SSH protocols are supported for online Git repos
  (e.g. `[user@]server:project.git`). _Default_: The current project (found by
  walking up from the current working directory tree).

- `stages` - one or more names of the stage(s) to retrieve params from.
  _Default_: `None` (all parameters from all stages will be retrieved).

- `rev` - Git commit (any [revision](https://git-scm.com/docs/revisions) such as
  a branch or tag name, a commit hash or an
  [experiment](/doc/command-reference/exp) name). If `repo` is not a Git repo,
  this option is ignored. _Default_: `None` (current working tree will be used)

- `deps` - whether to retrieve only params that are stage dependencies. Accepts
  `True` or `False` (_default_).

## Example: Filter by stage name(s)

> Working on https://github.com/iterative/example-get-started, file
> `src/featurization.py`.

`stages` can be a single name (string):

```git
+import json
-import yaml

-params = yaml.safe_load(open("params.yaml"))["featurize"]
+import dvc.api
+
+params = dvc.api.get_params(stages="featurize")
+params = json.dumps(params, indent=2)

 ...
-max_features = params["max_features"]
-ngrams = params["ngrams"]
+max_features = params["featurize"]["max_features"]
+ngrams = params["featurize"]["ngrams"]
```

Or an iterable of strings:

```py
import json
import dvc.api
params = dvc.api.get_params(stages=["featurize", "train"])
```

```json
{
  "featurize": {
    "max_features": 200,
    "ngrams": 2
  },
  "train": {
    "seed": 20170428,
    "n_est": 50,
    "min_split": 0.01
  }
}
```

## Example: Load specific parameter file(s)

You can pass any valid param file path as target to load all of the parameters
defined in it:

```py
import json
import dvc.api
params = dvc.api.params_show("params.yaml")
```

```json
{
  "run_mode": "prod",
  "configs": {
    "dev": "configs/params_dev.yaml",
    ...
```

Or multiple path targets:

```py
import json
import dvc.api
params = dvc.api.params_show(
  "configs/params_dev.yaml", "configs/params_prod.yaml")
```

```json
{
  "configs/params_prod.yaml:run_mode": "prod",
  "configs/params_prod.yaml:config_file": "configs/params_prod.yaml",
  ...
  "configs/params_dev.yaml:run_mode": "dev",
  "configs/params_dev.yaml:config_file": "configs/params_dev.yaml",
  ...
```

## Example: Use a remote DVC repository

You can use the `repo` argument to retrieve parameters from any <abbr>DVC
repository</abbr> without having to clone it locally.

```py
import json
import dvc.api
params = dvc.api.get_params(
    repo="https://github.com/iterative/demo-fashion-mnist")
```

```json
{
  "train": {
    "batch_size": 128,
    "hidden_units": 64,
    "dropout": 0.4,
    ...
```

## Example: Specify a project version

> Working on https://github.com/iterative/example-get-started

You can retrieve params from arbitrary Git commits, for example a branch name:

```py
import json
import dvc.api
params = dvc.api.get_params(rev="tune-hyperparams")
```

```json
{
  "prepare": {
    "split": 0.2,
    "seed": 20170428
  },
  "featurize": {
    "max_features": 200,
    "ngrams": 2
  },
  "train": {
    "seed": 20170428,
    "n_est": 100,
    "min_split": 8
  }
}
```
