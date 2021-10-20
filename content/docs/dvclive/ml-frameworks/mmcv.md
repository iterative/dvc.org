# MMCV

DVCLive allows you to easily add experiment tracking capabilities to your
OpenMMlab projects.

## About MMCV

[MMCV](https://github.com/open-mmlab/mmcv) is a foundational library for
computer vision research and supports many research projects part of
[OpenMMLab](https://github.com/open-mmlab).

## Usage

To start using the DVCLive you just need to add the following line to your
config file of **any** OpenMMlab project:

```git
log_config = dict(
    interval=100,
    hooks=[
-        dict(type='TextLoggerHook')
+        dict(type='TextLoggerHook'),
+        dict(type='DvcliveLoggerHook')
    ]
)
```

This will use the registered
[`DvcliveLoggerHook`](https://github.com/iterative/dvclive/blob/master/dvclive/mmcv.py)
to generate metrics _logs_ and _summaries_ during training.

> 💡Without requiring additional modifications to your training code, you can
> use DVCLive alongside DVC. See
> [DVCLive with DVC](/doc/dvclive/dvclive-with-dvc) for more info.

## Parameters

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
            path="custom_path",
            summary=False)
    ]
)
```
