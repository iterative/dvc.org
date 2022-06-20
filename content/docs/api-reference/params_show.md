# dvc.api.params_show()

Load <abbr>parameters</abbr> (name and values) tracked in a <abbr>DVC
project</abbr>.

```py
def params_show(
    *targets: str,  # Optional
    repo: Optional[str] = None,
    stages: Optional[Union[str, Iterable[str]]] = None,
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
and returns a JSON structure such as:

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

- `*targets` - names of one or more valid parameter file to retrieve params
  from. For example, `"params.py, myparams.toml"`. If no `targets` are provided,
  all param files tracked in any `dvc.yaml` will be used by default. Note that
  explicit targets don't have to be used in a `dvc.yaml`, however.

- `repo` - specifies the location of the DVC project. It can be a URL or a file
  system path. Both HTTP and SSH protocols are supported for online Git repos
  (e.g. `[user@]server:project.git`). _Default_: The current project (found by
  walking up from the current working directory tree).

- `stages` - name or names of the stages to retrieve params from. If `None`, all
  parameters from all stages will be retrieved. _Default_: `None`.

- `rev` - Git commit (any [revision](https://git-scm.com/docs/revisions) such as
  a branch or tag name, a commit hash or an
  [experiment](/doc/command-reference/exp) name). If `repo` is not a Git repo,
  this option is ignored. _Default_: `None` (current working tree will be used)

- `deps` - whether to retrieve only params that are stage dependencies or not.
  Accepts `True` or `False` (_default_).

## Example: Filter by stage name(s)

> Working on https://github.com/iterative/example-get-started

`stages` can be a single name (string):

```py
import json
import dvc.api
params = dvc.api.get_params(stages="featurize")
print(json.dumps(params, indent=2))
```

```json
{
  "featurize": {
    "max_features": 200,
    "ngrams": 2
  }
}
```

Or an iterable of strings:

```py
import json
import dvc.api
params = dvc.api.get_params(stages=["featurize", "train"])
print(json.dumps(params, indent=2))
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

## Example: Specify a project version

> Working on https://github.com/iterative/example-get-started

You can also retrieve params from arbitrary Git
[revisions](https://git-scm.com/docs/revisions):

```py
import json
import dvc.api
params = dvc.api.get_params(rev="tune-hyperparams")
print(json.dumps(params, indent=2))
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

## Example: Filter by parameter files

> Working on
> https://github.com/iterative/pipeline-conifguration/tree/main/multi-params-files

You can pass a single param file as target:

```py
import json
import dvc.api
params = dvc.api.params_show("params.yaml")
print(json.dumps(params, indent=2))
```

```json
{
  "run_mode": "prod",
  "configs": {
    "dev": "configs/params_dev.yaml",
    "test": "configs/params_test.yaml",
    "prod": "configs/params_prod.yaml"
  },
  "evaluate": {
    "dataset": "micro",
    "size": 5000,
    "metrics": ["f1", "roc-auc"],
    "metrics_file": "reports/metrics.json",
    "plots_cm": "reports/plot_confusion_matrix.png"
  }
}
```

Or multiple targets:

```py
import json
import dvc.api
params = dvc.api.params_show(
  "configs/params_dev.yaml", "configs/params_prod.yaml")
print(json.dumps(params, indent=2))
```

```json
{
  "configs/params_prod.yaml:run_mode": "prod",
  "configs/params_prod.yaml:config_file": "configs/params_prod.yaml",
  "configs/params_prod.yaml:data_load": {
    "dataset": "large",
    "sampling": {
      "enable": true,
      "size": 50000
    }
  },
  "configs/params_prod.yaml:train": {
    "epochs": 1000
  },
  "configs/params_dev.yaml:run_mode": "dev",
  "configs/params_dev.yaml:config_file": "configs/params_dev.yaml",
  "configs/params_dev.yaml:data_load": {
    "dataset": "development",
    "sampling": {
      "enable": true,
      "size": 1000
    }
  },
  "configs/params_dev.yaml:train": {
    "epochs": 10
  }
}
```

## Example: Show parameters from a remote DVC repository

You can use the `repo` argument to retrieve parameters from a <abbr>DVC
repository</abbr> without the need of cloning it and/or navigate to it locally:

```py
import json
import dvc.api
params = dvc.api.get_params(
    repo="https://github.com/iterative/demo-fashion-mnist")
print(json.dumps(params, indent=2))
```

```json
{
  "train": {
    "batch_size": 128,
    "hidden_units": 64,
    "dropout": 0.4,
    "num_epochs": 10,
    "lr": 0.001,
    "conv_activation": "relu"
  }
}
```
