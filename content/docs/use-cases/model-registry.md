# Machine Learning Model Registries

A **model registry** is a central catalog for data artifacts produced in
multiple data science projects. Models can be discovered, audited, shared,
tested, and deployed from here. DVC enables these features on the Git ecosystem,
reducing friction between development and operations. Other tools from
[Iterative](https://iterative.ai/) provide with more advanced features and
better usability.

![](/img/ml_model_registry_placement.jpg) _A common placement for model
registries is between development and applications. See also [Data Registries]._

[data registries]: /doc/use-cases/data-registries

DVC model registries give your team with key collaborative capabilities:

- Store, organize, and track the versions of different models effectively.
- Full data provenance and lineage trails guarantee that your modeling is
  reproducible.
- Share and control access to early-stage [experiments] and production-ready
  models alike.
- Save performance [metrics and plots] to quickly evaluate and compare models.
- A platform to export, integrate, deploy, or roll-back published models

[experiments]: /doc/user-guide/experiment-management
[metrics and plots]: /doc/start/metrics-parameters-plots

Many of these benefits are built-into DVC: Your [data pipelines] and resulting
artifacts (including ML models and performance metadata) are **codified** into
one or mode <abbr>DVC projects</abbr>. This enables managing them with standard
Git [versioning] workflows. Large files can be pushed to [remote storage], an
efficient and scalable access point for your models.

To achieve the remaining goals, the final outputs of these model development
projects can be **packaged** and published in a global DVC repository. Existing
model files stored remotely are reused in this collection without copying them,
so building the registry is fast. Links to the original projects are preserved,
so you can always retrieve full lineage and provenance info.

Distributed DVC repos and managed storage are already great for [sharing] data
and models. And getting your ML models from the registry to production is also
properly tooled: deploy manually with the `dvc` [CLI], integrate with code using
DVC's Python [API], or even automate their training and delivery with [CI/CD for
ML][cml-dvc].

[data pipelines]: doc/start/data-pipelines
[versioning]: /doc/use-cases/versioning-data-and-model-files
[remote storage]: /doc/command-reference/remote
[sharing]: /doc/start/data-and-model-access
[cli]: /doc/command-reference
[api]: /doc/api-reference
[cml-dvc]: https://cml.dev/doc/cml-with-dvc
