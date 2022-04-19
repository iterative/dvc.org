# Machine Learning Model Registries

A **model registry** is a central catalog for data artifacts produced in
multiple data science projects. Models can be discovered, audited, shared,
tested, and deployed from here. DVC works on top of Git to enable these
capabilities on your existing ecosystem. And other tools from
[Iterative](https://iterative.ai/) can provide further advanced features and
better usability as well.

![](/img/ml_model_registry_placement.jpg) _A common placement for model
registries is between development and applications. See also [Data Registries]._

[data registries]: /doc/use-cases/data-registries

DVC model registries give your team key collaborative capabilities:

- Store, organize, and track the [versions] of different models effectively.
- Full data provenance and lineage trails guarantee that your modeling is
  reproducible.
- Share and control access to early-stage [experiments] and production-ready
  models alike.
- Save performance [metrics and plots] to quickly evaluate and compare models.
- A platform to export, integrate, deploy, or roll-back published models

[experiments]: /doc/user-guide/experiment-management
[metrics and plots]: /doc/start/metrics-parameters-plots

Many of these benefits are built into DVC: Your [modeling process] and
performance metadata become **codified** in Git-based <abbr>DVC projects</abbr>.
This makes it possible to manage them with standard GitOps workflows. Large
files can be pushed to [remote storage], an efficient and scalable access point
for your models.

To achieve the remaining goals, the final outputs of these model development
projects can be **packaged** and published in a global DVC repository. Existing
model files stored remotely are reused without copying them, so building the
registry is fast. A connection to the original projects is preserved, so you can
always retrieve full lineage and provenance information.

DVC repos are already great for [sharing] data and models. Now you also have
proper tools to get models from the registry to production: deploy manually with
the `dvc` [CLI], integrate with code using DVC's Python [API], or even automate
their training and delivery with [CI/CD for ML][cml-dvc].

[modeling process]: doc/start/data-pipelines
[versions]: /doc/use-cases/versioning-data-and-model-files
[remote storage]: /doc/command-reference/remote
[sharing]: /doc/start/data-and-model-access
[cli]: /doc/command-reference
[api]: /doc/api-reference
[cml-dvc]: https://cml.dev/doc/cml-with-dvc
