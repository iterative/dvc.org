# Machine Learning Model Registries

An **ML model registry** (or _model catalog_) works as a central repository
between data science projects and their applications. ML models and other data
artifacts can be browsed, shared, audited, tested, and deployed from here. DVC
repositories support all of this while integrating seamlessly with existing
development workflows. Other tools from [Iterative](https://iterative.ai/)
further improve your model catalogs with more features and better usability.

![](/img/ml_model_registry_placement.jpg) _Model registry placement contrasts
with general [data registries] for reusable data sources or training sets._

<!-- TODO: Look up package registry diagrams for inspiration -->

[data registries]: /doc/use-cases/data-registries

DVC model registries provide your team with key collaborative capabilities:

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

To achieve the other goals, the final outputs of these model development
projects can be **packaged** and published in a global DVC repository. Existing
model files stored remotely are reused in this collection without copying them,
so building the registry is fast. Links to the original projects are preserved,
so you can always retrieve full lineage and provenance info.

DVC-managed storage makes it easy to share your ML models for collaboration or
production. DVC's [CLI] lets you pull and push them. The Python [API] lets you
integrate them in your code directly.

[data pipelines]: doc/start/data-pipelines
[versioning]: /doc/use-cases/versioning-data-and-model-files
[remote storage]: /doc/command-reference/remote
[share]: /doc/start/data-and-model-access
[cli]: /doc/command-reference
[api]: /doc/api-reference
