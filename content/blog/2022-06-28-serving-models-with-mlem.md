---
title: Serving Models with MLEM
date: 2022-06-28
description: >
  Once you have a model that's ready for production, getting it out can be a
  complicated step. In this tutorial, we're going to use MLEM to deploy a model
  to an API.
descriptionLong: >
  Getting models out to our end users is usually a difficult task. You have to
  make sure it's in the correct format for the environment and for the way it
  will be consumed. We're going to walk through how you can use MLEM to save
  your model and serve it through an API.
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

Training a machine learning model is only one step in the process of getting
something useful out to the end users. The goal of machine learning projects to
make an accurate model that provides predictions based on the data received from
a production environment. That could mean making predictions on data coming from
an API or do some batch predictions.

Either way, you'll need to save your trained and validated model in format
that's consumable by other systems. That's why we'll be covering how to serve
models through an endpoint with [MLEM](https://mlem.ai/). We'll start by
training a simple model. You can get the repo we're working with
[here](https://github.com/iterative/stale-model-example/tree/mlem-serve).

## Train a model

There are instructions in the project
[README](https://github.com/iterative/stale-model-example/tree/mlem-serve#readme)
on how to get everything you need installed and running. Make sure you run at
least one experiment with:

```dvc
$ dvc exp run
```

That way you can see what it's like actually training a model with DVC. We use
some bicycle data to make a prediction model that helps end users know how many
bikes to place around an area of the city. After you've run an experiment, take
a look at the metrics table:

```dvc
$ dvc exp show --drop Created
```

```dvctable

```

Of course you would run many more experiments in order to determine the best
model for production, but in this example, the metrics look pretty good. So
we'll take this model and get it ready to serve to production.

## Save the model

First, we need to install the `MLEM` package with:

```dvc
$ pip install mlem
```

Then, inside of the `train.py` script, we need to add the MLEM import to save
the models as we experiment.

```python
# train.py

import os
import pickle
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

Note: You can also run this training script and the evaluation script with
`dvc exp run`. If you want to see what is happening in the DVC pipeline, check
out the `dvc.yaml` file in the project.

There will be two new files in your repo: `clf` and `clf.mlem`. You'll be able
to load the model file into the evaluation script and make sure it gives you the
performance you need. Once you've validated the model, which we've done by
looking at that table earlier, it's ready to go to production.

## Serve the model to production

## Conclusion

You can use this same process to train and serve any model through an API
endpoint very quickly. This can help with validation, collaborating with team
members, and it can help you see if there are any underlying issues in your
overall deployment process before you hear about it from users. MLEM can also be
used to create a model registry so you can store and switch between models
whenever you need to.
