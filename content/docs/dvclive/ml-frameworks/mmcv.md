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
        dict(type='TextLoggerHook'),
        dict(type='DvcliveLoggerHook', save_dvc_exp=True)
    ]
)
```

## Parameters

- `model_file` - (`None` by default) - The name of the file where the model will
  be saved at the end of each `step`.

- `**kwargs` - Any additional arguments will be used to instantiate a new
  [`Live`] instance.

## Examples

- Using `**kwargs` to customize [`Live`].

```python
log_config = dict(
    interval=100,
    hooks=[
        dict(type='TextLoggerHook'),
        dict(
            type='DvcliveLoggerHook',
            save_dvc_exp=True,
            dir="custom_dir"
        )
    ]
)
```

[`live`]: /doc/dvclive/live
