# CI and ML

ML engineers and data scientists face many unique challenges. Some of these can
be solved by adopting well-established concepts from traditional software
engineering and development. A good example is using version control both for
the code and for the [data](/doc/use-cases/versioning-data-and-model-files). A
less common adoption is
[unit testing](https://en.wikipedia.org/wiki/Software_testing#Testing_levels)
the various stages of a data processing pipeline. Here is a non exhaustive list
of a few other unique challenges:

- Automatically re-train models upon changes
- Systematically compare (and report) performance of different versions of a
  model
- Test data correctness when new datasets are introduced
- Train a model which is computationally intensive or requires special
  environment (e.g. GPU)

[CI](https://en.wikipedia.org/wiki/Continuous_integration) is a core principal
of nowadays software development in general and DevOps in particular. In a
nutshell, it is aimed at frequent code, data, and model check-ins, automatic
testing, and fast feedback. DVC provides a solid basis for automating model
training and testing with constructs like pipelines and metrics. To streamline
DVC into CI tools we've built a complementary tool, Continuous Machine Learning
([CML](http://www.cml.dev)). Putting these tools together allows the bulding and
**coding** of flows that can help tackling the aforementioned problems and many
others. We will next dive a little deeper and outline how to harness these tools
into CI flows that tackle the first two challenges.

> The following code snippets are for demonstration purposes. Note that we use
> GitHub Actions and
> [workflow files](https://docs.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow#creating-a-workflow-file)
> in the following examples; the same ideas can be implemented also when using
> other hosting solution that suports CI (e.g. GitLab).

## Automatic model training

Due to the complexity of the computations or special requirements of the
training environment, for example, a training process can be very demanding.
Nevertheless, it is very much desired to re-train whenever new data is available
and/or changes were made to the model itself. Similarly, a test suite of a
project is very involved and complex. CI is used to perform the testing; let it
be on various platforms and environments, or simply move the testing load from a
developer’s local machine to a dedicated testing platform. Just like CI helps
when it comes to runing complex test suite, it can also help when the need for
training arises.

![](/img/ci_for_ml_retrain_model.jpg) _Model training flow_

Assuming that in a project’s repository a DVC pipeline is defined for training a
model. You can ask your CI tool to call `dvc pull` and, voilà, it now has access
to the _right_ data needed for training. The reproducing pipeline can be
arbitrary complicated and comprise of many steps; regardless of all, `dvc repro`
will yield a newly trained model. This new model will be tracked and pushed to
the remote cache (note `dvc push`) and will be "linked" to the PR.

```yml
# .github/workflows/train_model.yml

name: Retrain model
on:
  pull_request:
    types: synchronize

jobs:
  train:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Set up the environment on the runner
        run: |
          apt-get update -y
          apt-get install python3-dev -y
          pip install -r requirements.txt

      - name: DVC fetch the data used by the branch
        run: dvc pull

      - name: DVC retrain the model
        run: dvc repro

      - name: Track the newly trained model
        run: |
          dvc add model.pkl
          git config --global user.name 'Your Name'
          git config --global user.email 'my@enail.com'
          git add model.pkl.dvc
          git commit -m "Model retrained upon sync to PR"
          git push
          dvc push
```

**Bonus (⚡️):** It might be that the training needs a tailored environment.
This can be achieved by defining a runner that accommodates the required
environment (for example a GPU).

## Seamless model evaluation

![](/img/ci_for_ml_evaluate_models.jpg) _Evaluating different models against the
same validation dataset_

An fundamental part of a prediction model’s quality, except its underlying code
that can and should be tested, is its performance. Just like you wouldn’t merge
code that fails tests into your `master` branch, you would not want to adopt a
model that under-performs in comparison to the one you already have deemed
stable on the `master` branch. It is common that one or more developers are
maintaining or trying to improve a model that’s considered stable. In this case,
before replacing this model with a new one, you would like to evaluate the new
model’s performance and compare it to the performance of the “stable” model. For
this comparison to be meaningful, you would like to evaluate the performances
against the _same_ validation set.

```yml
name: Evaluate model
on:
  pull_request:
    types: synchronize

jobs:
  evaluate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Set up the environment on the runner
        run: |
          apt-get update -y
          apt-get install python3-dev -y
          pip install -r requirements.txt

      - name: DVC fetch the data used by the branch
        run: dvc pull

      - name: DVC retrain the model
        run: dvc repro

      - name: Compare metrics to master
        run: |
          git fetch --prune
          dvc metrics diff --show-md master >> report.md

      - name: Visualize loss function diff
        run: |
          dvc plots diff --target loss.csv --show-vega master > vega.json
          vl2png vega.json | cml-publish --md >> report.md
          cml-send-comment report.md
```

In this example, `dvc pull` will assert that the evaluation of the model is
using the predefined validation dataset. Next, `dvc repro` will evaluate the
model (and if needed will also train the model). Lastly,
[CML](https://github.com/iterative/cml#using-cml-with-dvc) will help integrating
the results of the comparison into the discussion in the pull request.

![](/img/ci_for_ml_long_report.png) _Performance report_

**Bonus (⚡️):** In addition, you can set up the workflow to fail and in turn
block a merge, if the performance of the new model is worse than those yielded
by the model in master. Or, as discussed before, use the flow to train the model
itself.

## What’s next?

As you can see, the duo DVC and CML fits perfectly to the CI world. This
combination introduces a vast horizon of possibilities and opportunities for
developing robust and flexible workflows that will help you maintain the highest
quality of your ML and data products. For example, data integrity can be
validated inside your [data registry](/doc/use-cases/data-registries). By adding
a a CI flow that pulls the new data, using `dvc pull` and running all needed
validations on the newly obtained data, you can improve the quality of the data
used across all your projects.
