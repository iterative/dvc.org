# YOLO

DVCLive allows you to add experiment tracking capabilities to your
[Ultralytics YOLO v8](https://docs.ultralytics.com/) projects.

## Usage

<p align='center'>
  <a href="https://colab.research.google.com/github/iterative/dvclive/blob/main/examples/DVCLive-YOLO.ipynb">
    <img src="https://colab.research.google.com/assets/colab-badge.svg" />
  </a>
</p>

If you have `dvclive` installed, the
[DVCLive callback](https://docs.ultralytics.com/reference/utils/callbacks/dvc/)
will be used for tracking experiments and logging `metrics`, `parameters`,
`plots` and the best `model` automatically.

```cli
$ pip install dvclive ultralytics
$ yolo train model=yolov8n.pt data=coco8.yaml epochs=5 imgsz=640
```

![YOLO Studio Table](/img/yolo-studio-table.png)
![YOLO Studio Plots](/img/yolo-studio-plots.gif)
