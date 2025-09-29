---
title: Productionize your models with MLEM in a Git-native way
date: 2022-06-01
description: >
  Introducing MLEM - one tool to run your models anywhere.
descriptionLong: >
  We’re excited to announce the launch of our latest open source offering,
  [MLEM](https://mlem.ai)! MLEM is a tool that automatically extracts meta
  information like environment and frameworks from models and standardizes that
  information into a human-readable format within Git. ML teams can then use the
  model information for deployment into downstream production apps and services.
  MLEM easily connects to solutions like Heroku to dramatically decrease model
  deployment time.
picture: 2022-06-01/mlem-rocket.png
author: aguschin
commentsUrl: https://discuss.dvc.org/t/introducing-mlem/1198
tags:
  - Machine Learning
  - MLEM
  - GTO
  - Serving
  - Deployment
  - Model Registry
  - MLOps
  - Productionization
  - Release
---

With MLEM ML teams get a single tool to **run your models anywhere** that
strikes to cover all model productionization scenarios you have.

MLEM enables this via **model metadata codification**: saving all information
that is required to use a model later. Besides packaging a model for deployment
it can be used for many things, including search and documentation. To make it
even more convenient, MLEM uses human-readable YAML files for that.

Finally, using Git to keep that metainformation allows you to create a
**Git-native model registry**, allowing you to handle model lifecycle management
in Git, getting all benefits of CI/CD. Which makes your ML team one step closer
to GitOps.

We built MLEM to address issues that MLOps teams have around managing model
information as they move them from training and development to production and,
ultimately, retirement. The Git-based model
([one of our core philosophies](https://iterative.ai/why-iterative/)) aligns
model operations and deployment with software development teams – information
and automation are all based on familiar DevOps tools – so that deploying any
model into production is that much faster.

# Model metadata codification

Capturing model-specific information requires an understanding of the
Programming language and ML frameworks they're created with. That's why MLEM is
a Python-specific tool. To provide a developer-first experience, MLEM exposes
carefully designed CLI to help you manage DevOps parts of the workflow from CLI
and Python API to handle model productionization programmatically.

It's easy to start using MLEM, since it integrates nicely into your existing
training workflows by adding a couple of lines:

```python
import mlem
mlem.api.save(
    my_model,
    "mlem-model",
    sample_data=train
)
```

That produces two files: model binary and model metadata, which is a `.mlem`
file:

```shell
$ ls models
mlem-model mlem-model.mlem
```

MLEM automatically detects everything you need to run the model: ML framework,
model dependencies (i.e. Python requirements), methods, and input/output data
schema (note, that we didn't specify those above at `save`!).

This enables easy codification of arbitrary complex models, such as a Python
function in which you average a couple of frameworks or a custom Python class
that uses different libraries to generate the features and make a prediction.
MLEM saves this information in a simple human-readable YAML file:

```yaml
# mlem-model.mlem
artifacts:
  data:
    hash: b7f7e869f2b9270c516b546f09f49cf7
    size: 166864
    uri: mlem-model
description: Random Forest Classifier
labels:
  - random-forest
  - classifier
model_type:
  methods:
    predict_proba:
      args:
        - name: data
          type_:
            columns:
              - sepal length (cm)
              - sepal width (cm)
              - petal length (cm)
              - petal width (cm)
            dtypes:
              - float64
              - float64
              - float64
              - float64
            index_cols: []
            type: dataframe
      name: predict_proba
      returns:
        dtype: float64
        shape:
          - null
          - 3
        type: ndarray
  type: sklearn
object_type: model
requirements:
  - module: sklearn
    version: 1.0.2
  - module: pandas
    version: 1.4.1
  - module: numpy
    version: 1.22.3
```

To make ML model development Git-native, MLEM can work with DVC to manage
versions of a model stored remotely in the cloud. Committing both model
metainformation (`mlem-model.mlem`) and a pointer to the model binary
(`mlem-model.dvc` or `dvc.lock` if you train it in a DVC pipeline) to Git allows
you to enable GitFlow and other Software Engineering best practices like GitOps.

# Running your models anywhere

The main goal of MLEM is to provide you with a single tool that enables any kind
of model productionization scenarios. For MLEM, there are three main groups of
those scenarios:

- **Use** a model directly with MLEM.
- **Export** a model to a format that can be used by other tools.
- **Deploy** a model to a production environment or cloud provider.

The first one allows you to import your model into a Python runtime, run predict
against some dataset directly in the command line, or serve the model with MLEM
from your CLI.

```python
$ python
>>> import mlem
>>> model = mlem.api.load("mlem-model")
>>> model.predict(test)
[[0.4, 0.3, 0.3], [0.2, 0.5, 0.3]]
```

```shell
$ mlem apply mlem-model test.csv
[[0.4, 0.3, 0.3], [0.2, 0.5, 0.3]]
```

```shell
$ mlem serve ml-model fastapi
⏳️ Loading model from ml-model.mlem
Starting fastapi server...
💅 Adding route for /predict
💅 Adding route for /predict_proba
Checkout openapi docs at <http://0.0.0.0:8080/docs>
INFO:     Started server process [5750]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8080 (Press CTRL+C to quit)
```

The second one allows you to export your models as a Python package, build a
Docker Image, or export it as some special format (like `.onnx` which is coming
soon).

```shell
$ mlem build mlem-model pip -c package_name=mlem-translate -c target=build/
⏳️ Loading model from ml-model.mlem
💼 Written `ml-package` package data to `build/`
$ tree build/
build
├── MANIFEST.in
├── ml-package
│   ├── __init__.py
│   ├── model
│   └── model.mlem
├── requirements.txt
└── setup.py
```

The last one allows you to deploy models to deployment providers, such as Heroku
(with AWS Sagemaker and Kubernetes coming soon).

```shell
$ mlem deployment run myservice -m mlem-model -t staging -c app_name=mlem-quick-start
⏳️ Loading deployment from my-service.mlem
🔗 Loading link to staging.mlem
🔗 Loading link to mlem-model.mlem
💾 Updating deployment at my-service.mlem
🛠 Creating docker image for heroku
  🛠 Building MLEM wheel file...
  💼 Adding model files...
  🛠 Generating dockerfile...
  💼 Adding sources...
  💼 Generating requirements file...
  🛠 Building docker image registry.heroku.com/mlem-quick-start/web...
  ✅  Built docker image registry.heroku.com/mlem-quick-start/web
  🔼 Pushing image registry.heroku.com/mlem-quick-start/web to registry.heroku.com
  ✅  Pushed image registry.heroku.com/mlem-quick-start/web to registry.heroku.com
💾 Updating deployment at my-service.mlem
🛠 Releasing app mlem-quick-start formation
💾 Updating deployment at my-service.mlem
✅  Service mlem-quick-start is up. You can check it out at https://mlem-quick-start.herokuapp.com/
```

Since MLEM is both CLI-first and API-first tool, you can productionize your
models just as easy with Python API:

```python
$ python
>>> from mlem.api import serve, build, deploy
```

# Git-native model registry

[versions]: https://dvc.org/doc/use-cases/versioning-data-and-model-files
[mp]: https://dvc.org/doc/start/metrics-parameters-plots
[experiments]: https://dvc.org/doc/user-guide/experiment-management
[gto]: https://github.com/iterative/gto
[mlem]: https://mlem.ai/
[modeling process]: https://dvc.org/doc/start/data-pipelines
[remote storage]: https://dvc.org/doc/command-reference/remote
[sharing]: https://dvc.org/doc/start/data-and-model-access
[via cml]: https://cml.dev/doc/cml-with-dvc
[gitops]: https://www.gitops.tech/

MLEM is a core building block for a Git-based ML model registry, together with
other Iterative tools, like GTO and DVC.

ML model registries give your team key capabilities:

- Collect and organize model [versions] from different sources effectively,
  preserving their data provenance and lineage information.
- Share metadata including [metrics and plots][mp] to help use and evaluate
  models.
- A standard interface to access all your ML artifacts, from early-stage
  [experiments] to production-ready models.
- Deploy specific models on different environments (dev, shadow, prod, etc.)
  without touching the applications that consume them.
- For security, control who can manage models, and audit their usage trails.

Many of these benefits are built into DVC: Your [modeling process] and
[performance data][mp] become **codified** in Git-based <abbr>DVC
repositories</abbr>, making it possible to reproduce and manage models with
standard Git workflows (along with code). Large model files are stored
separately and efficiently, and can be pushed to [remote storage] -- a scalable
access point for [sharing].

To make a Git-native registry, one option is to use [GTO] (Git Tag Ops). It tags
ML model releases and promotions, and links them to artifacts in the repo using
versioned annotations. This creates abstractions for your models, which lets you
**manage their lifecycle** freely and directly from Git.

```shell
$ gto show
╒══════════════════════╤══════════╤════════╤═════════╕
│ name                 │ latest   │ #stage │ #prod   │
╞══════════════════════╪══════════╪════════╪═════════╡
│ pet-face-recognition │ v3.1.0   │ -      │ v3.0.0  │
│ mlem-blep-classifier │ v0.4.1   │ v0.4.1 │ -       │
│ dog-bark-translator  │ v0.0.1   │ -      │ v0.0.1  │
╘══════════════════════╧══════════╧════════╧═════════╛

$ mlem apply dog-bark-translator ./short-dog-phrase.wav
🐶🚀🎉
```

For more information, visit our
[model registry page](https://iterative.ai/model-registry).

# What next?

⭐ **Star [MLEM on GitHub](https://github.com/iterative/mlem)** and let us know
what you think!

![Umbrella dog](../uploads/images/2022-06-01/mlem-repo-umbrella-dog.gif 'Machine Learning should be mlemming!')

Machine Learning should be mlemming! 🚀

Resources:

- [Documentation](https://mlem.ai/doc)
- [MLEM website](https://mlem.ai)
- [MLEM on GitHub](https://github.com/iterative/mlem)
- [Building an ML model registry](https://iterative.ai/model-registry/)

---

_Have something great to say about our tools? We'd love to hear it! Head to
[this page](https://testimonial.to/iterative-open-source-community-shout-outs)
to record or write a Testimonial! Join our
[Wall of Love ❤️](https://testimonial.to/iterative-open-source-community-shout-outs/all)_

_Do you have any use case questions or need support? Join us in
[Discord](https://discord.com/invite/dvwXA2N)!_

_Head to the [DVC Forum](https://discuss.dvc.org/) to discuss your ideas and
best practices._

📰 [Join our Newsletter](https://share.hsforms.com/1KRL5_dTbQMKfV7nDD6V-8g4sbyq)
to stay up to date with news and contributions from the Community!
