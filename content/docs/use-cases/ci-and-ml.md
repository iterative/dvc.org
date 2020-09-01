# CI and ML

## Motivation

ML engineers and data scientists face many unique challenges. Some of these
challenges can be solved by adopting well-established concepts from traditional
software engineering and development. Probably the most common adoption is
versioning control. Another adoption, unfortunately less common though, could be
unit testing the various stages of a data processing pipeline. Here is a non
exhaustive list of a few other unique challenges:

- Automatically re-train models upon changes.
- Systematically compare (and report) performance of different versions of a
  model.
- Test data correctness when new datasets are introduced.
- Handle a model training that is computationally intensive.

Combining a version control tool (like `git`) together with `dvc` and `cml`
opens a wide spectrum of possibilities that can help building better and smarter
data products. Adding [CI](https://en.wikipedia.org/wiki/Continuous_integration)
concepts to this triple allows the bulding and **coding** of flows that can help
tackling the aforementioned problems and many others. In this article, you will
learn about a few CI use cases utilizing `dvc` and `cml`.

_Remarks:_ The code snippets in this article are for demonstration purposes and
not actually running snippets. Furthermore, it is assumed that the `git`
repository is hosted on `GitHub`; the same ideas can be implemented when using
`GitLab` or any other hosting solution that suports CI.

## Automatic model training

Training a model is often a very demanding process. Nevertheless, it is very
much desired to re-train whenever new data is available and/or changes were made
to the model itself. Similarly, a test suite of a project is very involved and
complex. CI is used to perform the testing; let it be on various platforms and
environments, or simply move the testing load from a developer’s local machine
to a dedicated testing platform. Just like CI helps when it comes to runing
complex test suite, it can also help when the need for training arises.

![](/img/ci_for_ml_retrain_model.jpg) _Model training flow_

Assuming that in a project’s repository a `dvc` pipeline is defined for training
a model. You can ask your CI tool to call `dvc pull` and, voilà, it now has
access to the _right_ data needed for training. The reproducing pipeline can be
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

### Bonus

It might be that the training needs a tailored environment. This can be achieved
by defining a runner that accommodates the required environment (for example a
GPU).

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
[`cml`](http://www.cml.dev) will help integrating the results of the comparison
into the discussion in the pull request.

![](/img/ci_for_ml_long_report.png) _Performance report_

### Bonus

In addition, you can set up the workflow to fail and in turn block a merge, if
the performance of the new model is worse than those yielded by the model in
master. Or, as discussed before, use the flow to train the model itself.

## What’s next?

As you can see, the duo `dvc` and `cml` fits perfectly to the CI world. This
combination introduces a vast horizon of possibilities and opportunities for
developing robust and flexible workflows that will help you maintain the highest
quality of your ML and data products.

For example, data integrity can be validated inside your
[data registry](/doc/use-cases/data-registries). By adding a a CI flow that
pulls the new data, using `dvc pull` and running all needed validations on the
newly obtained data, you can improve the quality of the data used across all
your projects.

It is now your turn to build even better products! Good luck and reach out to
our community if you need anything.
