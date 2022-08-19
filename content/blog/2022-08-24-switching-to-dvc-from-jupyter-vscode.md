---
title: Converting a Jupyter Notebook to a DVC Project
date: 2022-08-24
description: >
  Working with notebooks is common in machine learning. That's why we're
  covering some tools that make it easy to do more with a complex project.
descriptionLong: >
  Once you've run some experiments in a Jupyter notebook, you know that you
  can't save each experiment. Now, if you're using the Jupyter VS Code
  extension, we can show you how to make those experiments reproducible with the
  addition of the DVC VS Code extension.
picture: 2022-08-24/jupyter-to-dvc.png
pictureComment: Using the DVC VS Code Extension with a Jupyter Notebook
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/syncing-data-to-aws-s3/1192
tags:
  - MLOps
  - DVC
  - Git
  - VS Code
  - Juptyer Notebooks
---

For many machine learning engineers, the starting point of a project is a
Jupyter notebook. This is fine for running a few experiments, but there comes a
point where you need to scale the project to accomodate hundreds or even
thousands more experiments. These experiments for your model will include
different hyperparameter values, different code, and potentially different
resources. It will be important to track the experiments you run so that when
you find an exceptional model, you'll be able to reproduce it and get it ready
for production.

In this tutorial, we're going to start a project with a Juptyer notebook in VS
Code. Then we'll convert it to a DVC pipeline to make reproducible experiments
and use the DVC VS Code extension to run new experiments and see how to compare
them all.
[Here's the project](https://github.com/iterative/stale-model-example/tree/jupyter-to-dvc)
we'll be working with.

## Start training with the notebook

Many times you'll start a machine learning (ML) project with a few cells in a
notebook just to test out some thoughts you have. So you might have a notebook
where you set some hyperparameters, load your data, train a model, and evaluate
its metrics. Then you might add more cells to save the model, run comparisons
with other models, have different versions of the same cells, or anything else
because you had more thoughts you want to test out. That's similar to what we're
doing in the `bicycle_experiments.ipynb` file.

![Jupyter notebook cells](/uploads/images/2022-08-24/jupyter-notebook.png)

We have all of the cells in place so we can start running experiments. This is
usually fine for training models for a while. Then it turns into a situation
where you have cells all over the place and some aren't useful after a certain
point, but they stay in the notebook, adding clutter and noise.

Eventually, you'll likely find a great model with your notebook experiments, but
you have no idea which cells you ran or which data was used to train this model.

That makes reproducing the experiment impossible and you're left with a great
model you may not be able to use in production. Once you reach the point where
you are trying to reproduce models or compare metrics from multiple experiments,
it might make sense to look at a data versioning and model experiment tracking
tool like DVC.

## Refactor the Jupyter notebook to Python scripts

We're going to take the existing Jupyter notebook and break the cells out into
files and stages that DVC tracks for you. First, we'll create a `train.py` file
to handle the model training stage of the experiment. This file will have the
`Get params`, `Load training data`, and `Train model` cells from the earlier
notebook. We've added another step to save the model as part of making the
experiment reproducible.

```python
# train.py

import os
import pickle5 as pickle
import sys

import numpy as np
import yaml
from sklearn.ensemble import RandomForestClassifier

params = yaml.safe_load(open("params.yaml"))["train"]

input = sys.argv[1]
output = sys.argv[2]
seed = params["seed"]
n_est = params["n_est"]
min_split = params["min_split"]

with open(os.path.join(input, "train.pkl"), "rb") as fd:
    matrix = pickle.load(fd)

labels = matrix.iloc[:, 11].values
x = matrix.iloc[:,1:11].values

clf = RandomForestClassifier(
    n_estimators=n_est, min_samples_split=min_split, n_jobs=2, random_state=seed
)

clf.fit(x, labels)

with open(output, "wb") as fd:
    pickle.dump(clf, fd)
```

Next, we'll make an `evaluate.py` file that will take a saved model and get the
metrics for how well it performs. This file will have the `Set test variables`,
`Load model and test data`, `Get model predictions`,
`Calculate model performance metrics`, and `Save model performance metrics`
notebook cells.

```python
# evaluate.py

import json
import math
import os
import pickle5 as pickle
import sys

import sklearn.metrics as metrics
import numpy as np

model_file = sys.argv[1]
test_file = os.path.join(sys.argv[2], "test.pkl")
scores_file = sys.argv[3]
prc_file = sys.argv[4]
roc_file = sys.argv[5]

with open(model_file, "rb") as fd:
    model = pickle.load(fd)

with open(test_file, "rb") as fd:
    matrix = pickle.load(fd)

x = matrix.iloc[:,1:11].values

cleaned_x = np.where(np.isnan(x), 0, x)
labels_pred = model.predict(cleaned_x)

predictions_by_class = model.predict_proba(cleaned_x)
predictions = predictions_by_class[:, 1]

print(predictions)

precision, recall, prc_thresholds = metrics.precision_recall_curve(labels_pred, predictions, pos_label=1)

fpr, tpr, roc_thresholds = metrics.roc_curve(labels_pred, predictions, pos_label=1)

avg_prec = metrics.average_precision_score(labels_pred, predictions)
roc_auc = metrics.roc_auc_score(labels_pred, predictions)

nth_point = math.ceil(len(prc_thresholds) / 1000)
prc_points = list(zip(precision, recall, prc_thresholds))[::nth_point]

with open(scores_file, "w") as fd:
    json.dump({"avg_prec": avg_prec, "roc_auc": roc_auc}, fd, indent=4)

with open(prc_file, "w") as fd:
    json.dump(
        {
            "prc": [
                {"precision": p, "recall": r, "threshold": t}
                for p, r, t in prc_points
            ]
        },
        fd,
        indent=4,
    )

with open(roc_file, "w") as fd:
    json.dump(
        {
            "roc": [
                {"fpr": fp, "tpr": tp, "threshold": t}
                for fp, tp, t in zip(fpr, tpr, roc_thresholds)
            ]
        },
        fd,
        indent=4,
    )
```

Now you have all of the steps that you executed in your Jupyter notebook in a
couple of files that you can easily edit and track across all of your
experiments. This might take some time as you'll need to go through your
notebook and identify relevant cells, refactor code, add new functions, or
import different libraries to make working scripts. But the big pay-off is that
you'll now have a reproducible way to train your models.

This is a great time to commit these changes to your Git repo with the following
commands:

```cli
$ git add train.py evaluate.py
$ git commit -m "converted notebook to Python"
```

## Create the DVC pipeline

Now we can create a DVC pipeline that executes these scripts to record the code,
data, and metrics for each of your experiments. If you look in the project's
`dvc.yaml`, you'll see the stages we execute on an experiment run.

```yaml
stages:
  train:
    cmd: python src/train.py ./data/ ./models/model.pkl
    deps:
      - ./data/train.pkl
      - ./src/train.py
    params:
      - train.seed
      - train.n_est
      - train.min_split
    outs:
      - ./models/model.pkl
  evaluate:
    cmd:
      python ./src/evaluate.py ./models/model.pkl ./data scores.json prc.json
      roc.json
    deps:
      - ./data
      - ./models/model.pkl
      - ./src/evaluate.py
    metrics:
      - scores.json:
          cache: false
```

The `stages` tell DVC which steps you want to execute and what should happen in
each step. Usually, you'll execute a script or a command in each stage that may
link to the next stage in the pipeline via the `outs`. We only have 2 stages in
this pipeline: a `train` stage that handles the model training and outputs the
model and an `evaluate` stage that takes the model and stores some metrics about
it.

Each of these stages has a `cmd` that executes the Python scripts we wrote with
the required arguments. They both have defined dependencies in `deps` that let
DVC know what needs to be available for a stage to execute before it starts
running. The `train` stage has some `params` that represent the hyperparameter
values we want to use in the current experiment. This is how DVC is able to
track the values used in each experiment.

The `train` stage also has `outs` defined which takes the model generated at the
end of the experiment and saves it to this location. Meanwhile, the `evaluate`
stage has a `metrics` section that defines what DVC will use for metrics when
we're ready to compare experiments.

This runs everything in the same order that the Jupyter notebook did with a
trackable structure since we're executing Python scripts now. When you run
`dvc exp run` to conduct an experiment, you can check out your metrics with
either the CLI command `dvc exp show` or with
[the DVC VS Code extension](https://marketplace.visualstudio.com/items?itemName=Iterative.dvc).

```dvctable
─────────────────────────────────────────────────────────────────────────────────────────────────────────────>
  neutral:**Experiment**                neutral:**Created**        metric:**avg_prec**   metric:**roc_auc**   param:**train.seed**   param:**train.n_est**   param:**train.min_split**   >
 ────────────────────────────────────────────────────────────────────────────────────────────────────────────>
  **workspace**                 **-**               **0.76681**   **0.38867**   **20210428**     **300**           **75**                >
  **jupyter-to-dvc**            **Aug 18, 2022**    **0.76681**   **0.38867**   **20210428**     **300**           **75**                >
  └── 4a070a7 [exp-b8925]   Ayg 18, 2022    0.76681   0.38867   20210428     300           75                >
 ────────────────────────────────────────────────────────────────────────────────────────────────────────────>
```

_with CLI tool_

![metrics in DVC VS Code extension](/uploads/images/2022-08-24/dvc-exp-in-vscode.png)

_with DVC VS Code extension_

You can also run experiments directly using the DVC VS Code extension.

![run experiments in DVC VS Code extension](/uploads/images/2022-08-24/experiments-in-extension.png)

## Conclusion

In this post, we covered how to convert your Jupyter notebook into a DVC
project. When your project gets to the point you need to go back to old
experiments, it's probably time to consider using something more advanced than
Jupyter notebooks. Keeping track of data versions across experiments along with
the code that was used to run them can get messy quickly so it's good to know
about tools that can make it easier for you. If you want to learn more about
experiment reproducibility and how to handle that with DVC, you should check out
our in-depth [Iterative tools course](https://learn.iterative.ai/)!
