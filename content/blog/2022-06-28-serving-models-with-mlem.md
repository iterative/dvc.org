---
title: Serving ML Models with MLEM
date: 2022-06-28
description: >
  Once you have a machina learning model that's ready for production, getting it out can be
  complicated. In this tutorial, we're going to use MLEM to deploy a model
  to an API.
descriptionLong: >
  Getting a machine learning model out to our end users can be a difficult task. You have to
  make sure it's in the correct format for the environment and for the way it
  will be consumed. We're going to walk through how you can use MLEM to save
  your model and serve it with a web API.
picture: 2022-06-28/mlem-deploys.png
pictureComment: Serving Models with MLEM
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/syncing-data-to-aws-s3/1192
tags:
  - MLOps
  - DVC
  - Git
  - MLEM
  - Collaboration
---

Training an ML model is only one step in the process of getting
something useful out to the end users. The goal of machine learning projects is to
make an accurate model that provides predictions based on the data received from
a production environment. That could mean data coming from
an API or batch processing, for example.

Either way, you'll need to save your trained and validated model in format
that's consumable by other systems. That's why we'll be covering how to serve
models through an endpoint with [MLEM](https://mlem.ai/). We'll start by
training a simple model. You can get the repo we're working with
[here](https://github.com/iterative/stale-model-example/tree/mlem-serve).

## Train a model

There are instructions in the project
[README](https://github.com/iterative/stale-model-example/tree/mlem-serve#readme)
on how to get everything you need installed and running. Make sure you run a few
experiments with:

```dvc
$ dvc exp run
```

That way you can see what it's like actually training a model with DVC. We use
some bicycle data to make a prediction model that helps end users know how many
bikes to place around an area of the city. After you've run a few experiments,
take a look at the metrics table:

```dvc
$ dvc exp show --drop 'Created|./clf|./data|src/evaluate.py|./src/train.py|./models/model.pkl|./data/train.pkl'
```

_NOTE:_ We're dropping a lot of columns to simplify the data shown in the table.

```dvctable
  neutral:**Experiment**                metric:**avg_prec**   metric:**roc_auc**   param:**train.seed**   param:**train.n_est**   param:**train.min_split**
 ───────────────────────────────────────────────────────────────────────────────────────────
  workspace                  0.72417   0.38926   20210428     250           75
  mlem-serve                 0.76681   0.38867   20210428     300           75
  ├── c8d952b [exp-4b026]    0.72417   0.38926   20210428     250           75
  ├── da78e7c [exp-7a2e2]    0.74454    0.5528   20210428     450           75
  ├── b39470f [exp-5ebf6]    0.42526   0.82722   20210428     400           28
  ├── 03c6d57 [exp-f8c3a]    0.74454    0.5528   20210428     400           75
  ├── 75b1b3c [exp-2ba75]    0.67913   0.38207   20210428     350           75
  └── 40b0075 [exp-e0dc1]    0.76681   0.38867   20210428     300           75
 ───────────────────────────────────────────────────────────────────────────────────────────
```

Of course you would run many more experiments in order to determine the best
model for production, but in this example, the metrics for `exp-5ebf6` look
pretty good. So we'll take this model and get it ready to serve to production.

## Save the model

First, we need to install the `MLEM` package with:

```dvc
$ pip install 'mlem[fastapi]'
```

Then, inside of the `train.py` script, we need to add the MLEM import to save
the models as we experiment.

```python
# train.py

import os
import pickle5 as pickle
import sys
import yaml

from mlem.api import save
import numpy as np
from sklearn.ensemble import RandomForestClassifier
...
```

Then you can add the `save` function to the end of the training script.

```python
# train.py
...
clf = RandomForestClassifier(
    n_estimators=n_est, min_samples_split=min_split, n_jobs=2, random_state=seed
)

clf.fit(x, labels)

save(
    clf,
    "clf",
    sample_data=x,
    description="Random Forest Classifier",
)
```

_Note:_ If you want to see what is happening in the DVC pipeline, check out the
`dvc.yaml` file in the project.

There will be two new files in your repo: `clf` and `clf.mlem`. You'll be able
to load the model file into the evaluation script and make sure it gives you the
performance you need.

## Load the model for evaluation

We're going to load the MLEM model into our `src/evaluate.py` script. To do
that, you'll need to add the following import.

```python
# evaluate.py

import json
import math
import os
import sys

import pickle5 as pickle
import sklearn.metrics as metrics
import numpy as np
from mlem.api import apply
...
```

Now we can use the [`apply` function](https://mlem.ai/doc/api-reference/apply)
to make predictions with the model.

```python
# evaluate.py
...
x = matrix.iloc[:,1:11].values

cleaned_x = np.where(np.isnan(x), 0, x)
labels_pred = apply(model_file, cleaned_x, method="predict")

predictions_by_class = apply(model_file, cleaned_x, method="predict_proba")
predictions = predictions_by_class[:, 1]
...
```

The `predict` and `predict_proba` are methods available from the model and they
are used to get new predicted values and their probabilities for evaluation.
This, alond with everything else in the script, is how we get those metrics are
shown in the experiments table. Once you've validated the model and decided that
it performs well, it's ready to go to production.

## Serve the model to production

There are a couple of ways you can do this with MLEM:

- Create a Python package
- Serve the model with [FastAPI](https://fastapi.tiangolo.com/)

_Note:_ There is an experimental option to
[deploy the model directly to Heroku](https://mlem.ai/doc/get-started/deploying)
although this functionality is experimental and may have breaking changes.

### Custom Python package

Let's take a look at making a Python package and importing it into a
[Flask](https://flask.palletsprojects.com/en/2.1.x/) app. To make the Python
package, we'll run the following MLEM command.

```dvc
$ mlem build clf pip -c target=build/ -c package_name=bike_predictor
```

This takes our `clf.mlem` file and generates a Python package called
`bike_predictor` in the `build` directory. When you look in your project, you
should see that new `build` folder that has all of the files you need for an
independent Python package.

To build the package, you'll need to run the following command in the `build`
directory.

```dvc
$ python -m build --wheel
```

Then go back to the top level directory and run the following command to install
your new model package.

```dvc
$ pip install ./build/dist/bike_predictor-0.0.0-py3-none-any.whln
```

Now you can import this to your Flask API like so.

```python
# api.py
import os
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
import bike_predictor
...
```

You can then use the `predict` method on new data and run any other tasks you
need to in the API.

```python
# api.py
...
new_event = EventsModel(
    title=data["title"],
    date=data["date"],
    time=data["time"],
    location=data["location"],
    description=data["description"],
)

db.session.add(new_event)
db.session.commit()

bike_predictor.predict(new_event)
...
```

Then you can test this API out locally by running.

```dvc
$ python src/api.py
```

This will start up a local server on port 5000 and you'll be able to see your
model in action. From here, this can be deployed to any cloud environment as
long as you remember to include and install the model package.

### Serve with FastAPI

If you don't have an API to work with and don't need a Python package, you can
serve your model quickly using FastAPI with this command.

```dvc
$ mlem serve clf fastapi
```

This will run a local server and spin up an API for you so you can quickly test
out your model without needing a development team to work on the API initially.

That's it! Now you know how to train a model, save it, and deploy to some
external service quickly using MLEM!

## Conclusion

You can use this same process to train and serve any model through an API
endpoint very quickly. This can help with validation, collaborating with team
members, and it can help you see if there are any underlying issues in your
overall deployment process before you hear about it from users. MLEM can also be
used to create a model registry so you can store and switch between models
whenever you need to.
