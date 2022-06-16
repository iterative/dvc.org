# dvc.api.params_show()

Returns all the <abbr>params</abbr> associated with the given
<abbr>DVC repository</abbr>.

```py
def params_show(
    *targets: str,
    repo: Optional[str] = None,
    stages: Optional[Union[str, Iterable[str]]] = None,
    rev: Optional[str] = None,
    deps: bool = False,
) -> Dict:
```

#### Usage:

```py
import dvc.api

params = dvc.api.params_show()
```

## Description

Retrieves the <abbr>params</abbr> tracked in a <abbr>DVC repository</abbr>.

Without arguments, this function will retrieve all <abbr>params</abbr> from all parameter files, for the current revision.

See the options bellow to restrict the <abbr>params</abbr> retrieved.

## Parameters

- **`*targets`** (str, optional): Names of the parameter files to retrieve <abbr>params</abbr> from.
  If no `targets` are provided, all parameter files will be used.
  Note that targets don't necessarily have to be defined in `dvc.yaml`

- **`repo`** (str, optional): location of the <abbr>DVC repository</abbr>.
  Defaults to the current project (found by walking up from thecurrent working directory tree).
  It can be a URL or a file system path.
  Both HTTP and SSH protocols are supported for online Git repos (e.g. [user@]server:project.git).

- **`stages`** (Union[str, Iterable[str]], optional): Name(s) of the stages to retrieve <abbr>params</abbr> from.
  Defaults to `None`.
  If no stages are provided, all parameters from all stages will be retrieved.

- **`rev`**: (str, optional): Name of the `Git revision`_ to retrieve <abbr>params</abbr> from.
  Example of git revision can be a branch or tag name, a commit hash or a dvc experiment name.
  Defaults to `HEAD`.
  If `repo` is not a Git repo, this option is ignored.

- **`deps`**: (bool, optional): Whether to retrieve only <abbr>params</abbr> that are
  <abbr>stage</abbr> dependencies or not.
  Defaults to `False`.


## Example: No arguments.

> Working on https://github.com/iterative/example-get-started

```py
import json
import dvc.api
params = dvc.api.get_params()
print(json.dumps(params, indent=4))
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
        "n_est": 50,
        "min_split": 0.01
    }
}
```

## Example: Filtering with `stages`.

> Working on https://github.com/iterative/example-get-started

`stages` can a single string:

```py
import json
import dvc.api
params = dvc.api.get_params(stages="prepare")
print(json.dumps(params, indent=4))
```
```json
{
    "prepare": {
        "split": 0.2,
        "seed": 20170428
    }
}
```

Or an iterable of strings:

```py
import json
import dvc.api
params = dvc.api.get_params(stages=["prepare", "train"])
print(json.dumps(params, indent=4))
```
```json
{
    "prepare": {
        "split": 0.2,
        "seed": 20170428
    },
    "train": {
        "seed": 20170428,
        "n_est": 50,
        "min_split": 0.01
    }
}
```

## Example: Using `rev`.

> Working on https://github.com/iterative/example-get-started

```py
import json
import dvc.api
params = dvc.api.get_params(rev="tune-hyperparams")
print(json.dumps(params, indent=4))
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

## Example: Using `targets`.

> Working on `multi-params-files` folder of https://github.com/iterative/pipeline-conifguration

You can pass a single target:

```py
import json
import dvc.api
params = dvc.api.params_show(
  "params.yaml")
print(json.dumps(params, indent=4))
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
        "metrics": [
            "f1",
            "roc-auc"
        ],
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
print(json.dumps(params, indent=4))
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

## Example: Git URL as `repo`.


```py
import json
import dvc.api
params = dvc.api.get_params(
    repo="https://github.com/iterative/demo-fashion-mnist")
print(json.dumps(params, indent=4))
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