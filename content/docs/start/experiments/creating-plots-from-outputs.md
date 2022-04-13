### Creating plots from text with DVC

A useful plot to show the classification performance is the confusion matrix. In
order to produce it, DVC expects a CSV **plot file** in the form:

```csv
actual,predicted
0,0
0,2
...
```

> We added a [loop] comparing the results to generate this file from the
> predictions.

[loop]:
  https://github.com/iterative/example-dvc-experiments/blob/main/src/train.py#L123

After running the experiment with `dvc exp run`, DVC will produce
`plots/confusion.csv` file presenting the classifier performance and open it in
the browser:

```dvc
$ dvc plots show plots/confusion.csv --template confusion \
                                     -x actual -y predicted
file:///Users/.../example-dvc-experiments/plots/confusion.json.html
```

![confusion matrix](/img/start_visualization_confusion1.png)
