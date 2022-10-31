# Live.log_param()

```py
 def log_param(name: str, val: ParamLike):
```

Also see `Live.log_params()`.

## Usage

```py
from dvclive import Live

live = Live()

live.log_param("lr", 1e-3)
live.log_param("n_iter", 50)
```

## Description

On each `live.log_param(name, val)` call, DVCLive will write the `name`
parameter to `{Live.dir}/params.yaml` with the corresponding `val`:

```yaml
lr: 1e-3
n_iter: 50
```

<admon type="tip">

The logged params can be visualized with `dvc params`:

```cli
$ dvc params diff dvclive/params.yaml
```

</admon>

## Parameters

- `name` - Name of the parameter being logged.

- `val` - The value to be logged.

## Exceptions

- `dvclive.error.InvalidParameterType` - thrown if the parameter value is not
  among supported types. Supported types include:

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
