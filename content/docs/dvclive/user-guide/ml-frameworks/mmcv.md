# MMCV

The DVCLive - MMCV integration allows you to easily add experiment tracking
capabilities to your OpenMMlab projects.

The integration is
[maintained in the DVCLive repository](https://github.com/iterative/dvclive/blob/master/dvclive/mmcv.py)

## About MMCV

[MMCV](https://github.com/open-mmlab/mmcv) is a foundational library for
computer vision research and supports many research projects part of
[OpenMMLab](https://github.com/open-mmlab).

## Usage

To start using the integration you just need to add the following line to your
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

This will use the registered `DvcliveLoggerHook` to generate metrics _logs_ and
_summaries_ during training.

> 💡Without requiring additional modifications to your training code, you can
> use the DVCLive - MMCV integration alongside DVC. See
> [DVCLive with DVC](/doc/dvclive/user-guide/dvclive-with-dvc) for more info.

## Parameters

- `model_file` - The name of the file where the model will be saved at the end
  of each `step`.

Example:

```python
log_config = dict(
    interval=100,
    hooks=[
        dict(type='TextLoggerHook'),
        dict(type='DvcliveLoggerHook', model_file="my_model.pth")
    ]
)
```

## Example repository

You can find a fully working example using the DVCLive - MMCV integration
alongside [MMClassification](https://github.com/open-mmlab/mmclassification) in
the following link:

https://github.com/iterative/example-ml-frameworks/tree/mmclassification
