---
title: Package and deploy your models with MLEM
date: 2022-05-24
description: >
  Introducing MLEM -- Machine Learning Engineering Management for Model
  Deployment and Management.
descriptionLong: >
  We’re excited to announce the launch of our latest open source offering,
  [MLEM](https://mlem.ai)! MLEM is a tool that automatically extracts meta
  information like environment and frameworks from models and standardizes that
  information into a human-readable format within Git. ML teams can then use the
  model information for deployment into downstream production apps and services.
  MLEM easily connects to solutions like Heroku to dramatically decrease model
  deployment time.
picture: 2022-05-24/mlem-rocket.png
author: aguschin
# commentsUrl: TODO
tags:
  - Machine Learning
  - Deployment
  - Model Registry
  - MLOps
---

We built MLEM to address issues that MLOps teams have around managing model
information as they move them from training and development to production and,
ultimately, retirement. MLEM is meant to help teams automate the collection of
information around how the model was trained, what the model is for, and
operational requirements around deployment.

Just like all our [other](https://dvc.org) [tools](https://cml.dev), MLEM uses
your Git service to store model information and connects with CI/CD solutions
for deployment (like Heroku). This Git-based model
([one of our core philosophies](https://iterative.ai/why-iterative/)) aligns
model operations and deployment with software development teams – information
and automation is all based on familiar DevOps tools – so that deploying any
model into production is that much faster.

With MLEM, ML teams get:

- Human-readable information about a model for search and documentation
- One-step automated deployment across any cloud
- Fast model registry setup based on Git

# Human-readable models

It's easy to start using MLEM, since it integrates nicely in your existing
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

MLEM automatically detects everything you need to run the model: ML framework
you use, as well as model dependencies (i.e. Python requirements), methods and
input/output data schema. MLEM saves this information in a simple human-readable
YAML file:

```yaml
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

# Running your models anywhere

The main goal of MLEM is to provide you a single tool that enables any kind of
model usage scenarios. Three main groups of those are:

- using the model with the MLEM's help,
- exporting a model to a format that can be used by other tools,
- and deploying a model to a production environment.

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

The second one allows you to package your models as a Python package, build a
Docker Image, or export it as some other format (e.g. `.onnx` which is coming
soon).

```shell
$ mlem pack mlem-model pip -c package_name=mlem-translate -c target=build/
⏳️ Loading model from ml-model.mlem
💼 Written `ml-package` package data to `build`
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
(AWS Sagemaker and Kubernetes are coming).

```shell
$ mlem deploy create myservice -m mlem-model -t staging -c app_name=mlem-quick-start
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

# Fast model registry setup based on Git

[versions]: /doc/use-cases/versioning-data-and-model-files
[mp]: /doc/start/metrics-parameters-plots
[experiments]: /doc/user-guide/experiment-management
[gto]: https://github.com/iterative/gto
[mlem]: https://mlem.ai/
[modeling process]: /doc/start/data-pipelines
[remote storage]: /doc/command-reference/remote
[sharing]: /doc/start/data-and-model-access
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

To make a Git-native registry (on top of DVC or not), one option is to use [GTO]
(Git Tag Ops). It tags ML model releases and promotions, and links them to
artifacts in the repo using versioned annotations. This creates abstractions for
your models, which lets you **manage their lifecycle** freely and directly from
Git.

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

# What next?

Check out [MLEM on GitHub](https://github.com/iterative/mlem) today and let us
know what you think! MLEM is a core building block for a Git-based model
registry – for more information, visit our [model registry page](https://iterative.ai/model-registry).

Resources:

- [Documentation](https://mlem.ai/doc)
- [MLEM website](https://mlem.ai)
- [MLEM on GitHub](https://github.com/iterative/mlem)
- Building an ML model registry

<!-- <admon type="warn">

This guide will result in a Jupyter server running on provisioned AWS hardware.
While TPI helps you do this as cheaply as possible, there are still costs
involved. Make sure you
[understand AWS pricing](https://aws.amazon.com/ec2/pricing/) to avoid unwelcome
charges to your credit card.

</admon> -->
