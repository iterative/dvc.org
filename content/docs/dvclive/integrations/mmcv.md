# MMCV

The DVCLive - MMCV integration allows you to easily add experiment tracking
capabilities to your OpenMMlab projects.

The DVCLive - MMCV integration is
[maintained in the MMCV repository](https://github.com/open-mmlab/mmcv/blob/master/mmcv/runner/hooks/logger/dvclive.py).

## About MMCV

[MMCV](https://github.com/open-mmlab/mmcv) is a foundational library for
computer vision research and supports many research projects as below:

- [MMClassification](https://github.com/open-mmlab/mmclassification): OpenMMLab
  image classification toolbox and benchmark.
- [MMDetection](https://github.com/open-mmlab/mmdetection): OpenMMLab detection
  toolbox and benchmark.
- [MMDetection3D](https://github.com/open-mmlab/mmdetection3d): OpenMMLab's
  next-generation platform for general 3D object detection.
- [MMSegmentation](https://github.com/open-mmlab/mmsegmentation): OpenMMLab
  semantic segmentation toolbox and benchmark.
- [MMAction2](https://github.com/open-mmlab/mmaction2): OpenMMLab's
  next-generation action understanding toolbox and benchmark.
- [MMTracking](https://github.com/open-mmlab/mmtracking): OpenMMLab video
  perception toolbox and benchmark.
- [MMPose](https://github.com/open-mmlab/mmpose): OpenMMLab pose estimation
  toolbox and benchmark.
- [MMEditing](https://github.com/open-mmlab/mmediting): OpenMMLab image and
  video editing toolbox.
- [MMOCR](https://github.com/open-mmlab/mmocr): OpenMMLab text detection,
  recognition and understanding toolbox.
- [MMGeneration](https://github.com/open-mmlab/mmgeneration): OpenMMLab image
  and video generative models toolbox.

## Usage

To start using the integration you just need to add the following code to your
config file of **any** OpenMMlab project:

```python
log_config = dict(
    interval=0,
    hooks=[
        dict(type='DvcliveLoggerHook')
    ]
)
```

This will use the registered `DvcliveLoggerHook` to generate metrics _logs_ and
_summaries_ during training.

> 💡Without requiring additional modifications to your training code, you can
> use the DVCLive - MMCV integration alongside DVC. See
> [DVCLive with DVC](/doc/dvclive/user-guide/dvclive-with-dvc) for more info.

## Example repository

You can find a fully working example using the DVCLive - MMCV integration
alongside [MMClassification](https://github.com/open-mmlab/mmclassification) in
the following link:

https://github.com/iterative/example-ml-frameworks/tree/mmclassification
