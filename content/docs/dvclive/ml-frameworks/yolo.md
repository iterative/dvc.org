# YOLO

DVCLive allows you to add experiment tracking capabilities to your
[Ultralytics YOLO v8](https://docs.ultralytics.com/) projects.

## Usage

<p align='center'>
  <a href="https://colab.research.google.com/github/iterative/dvclive/blob/main/examples/DVCLive-YOLO.ipynb">
    <img src="https://colab.research.google.com/assets/colab-badge.svg" />
  </a>
</p>

If you have `dvclive` installed,
[Ultralytics YOLO v8](https://docs.ultralytics.com/) will use DVCLive for
tracking experiments, logging `metrics`, `parameters`, `plots` and the best
`model` automatically.

```shell
$ pip install dvclive ultralytics
$ yolo train model=yolov8n.pt data=coco8.yaml epochs=5 imgsz=640
```
