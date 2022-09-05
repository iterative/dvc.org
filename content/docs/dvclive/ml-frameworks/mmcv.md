# MMCV

DVCLive allows you to add experiment tracking capabilities to your
[OpenMMlab](https://github.com/open-mmlab) projects.

## Usage

Register the
[`DvcliveLoggerHook`](https://github.com/open-mmlab/mmcv/blob/master/mmcv/runner/hooks/logger/dvclive.py)
the following in the config file of your
[OpenMMlab](https://github.com/open-mmlab) project:

```python
log_config = dict(
    interval=100,
    hooks=[
       dict(type='TextLoggerHook')
        dict(type='TextLoggerHook'),
        dict(type='DvcliveLoggerHook')
    ]
)
```

## Parameters

- `model_file` - (`None` by default) - The name of the file where the model will
  be saved at the end of each `step`.

- `**kwargs` - Any additional arguments will be passed to
  [`Live`](/docs/dvclive/api-reference/live).

## Examples

- Using `model_file`.

```python
log_config = dict(
    interval=100,
    hooks=[
        dict(type='TextLoggerHook'),
        dict(type='DvcliveLoggerHook', model_file="my_model.pth")
    ]
)
```

- Using `**kwargs` to customize [`Live`](/docs/dvclive/api-reference/live).

```python
log_config = dict(
    interval=100,
    hooks=[
        dict(type='TextLoggerHook'),
        dict(
            type='DvcliveLoggerHook',
            model_file="my_model.pth",
            path="custom_path"
        )
    ]
)
```
