# Live.log_params()

```py
def log_params(params: Dict[ParamLike]):
```

Also see `Live.log_param()`.

## Usage

```py
from dvclive import Live

live = Live()

params = {
    "num_classes": 10,
    "metrics": ["accuracy", "mae"],
    "training": {
        "epochs": 42,
        "batch_size": 128,
        "optimizer": {
            "name": "adam",
            "loss": "categorical_crossentropy",
            "learning_rate": 1e-3,
        },
    },
}
live.log_params(params)
```

## Description

On each `live.log_params(params)` call, DVCLive will write keys/values pairs in
the `params` dict to `{Live.dir}/params.yaml`:

```yaml
lr: 1e-3
n_iter: 50
```

<admon type="tip">

The logged params can be visualized with `dvc params`:

```cli
dvc params diff dvclive/params.yaml
```

If you use <abbr>DVC pipelines</abbr>, [parameter dependencies] are tracked
automatically, and you can skip logging them with DVCLive.

</admon>

## Parameters

- `params` - Dictionary with name/value pairs of parameters to be logged.

## Exceptions

- `dvclive.error.InvalidParameterType` - thrown if any of the parameter values
  in the `params` dict is not among supported types. Supported types include:

  ```python
  ParamLike = Union[
      int,
      float,
      str,
      bool,
      List["ParamLike"],
      Dict[str, "ParamLike"]
  ]
  ```

[parameter dependencies]:
  /doc/user-guide/pipelines/defining-pipelines#parameter-dependencies
