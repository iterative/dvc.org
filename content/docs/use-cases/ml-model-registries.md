# Machine Learning Model Registries

An **ML model registry** (or _model catalog_) works as a central repository
between data science projects and their applications. ML models and other data
artifacts can be browsed, shared, audited, tested, and deployed from here. DVC
repositories support all of this while integrating seamlessly with existing
development workflows. Other tools from [Iterative](https://iterative.ai/)
further improve your model catalogs with more features and better usability.

![](/img/ml_model_registry_placement.jpg) _Model registry placement contrasts
with general [data registries] for reusable data sources or training sets._

[data registries]: /doc/use-cases/data-registries

DVC model registries provide your team with key collaborative capabilities:

- Store, organize, and track the [versions] of different models effectively.
- Full data [provenance] and [lineage] trails guarantee that your modeling is
  reproducible.
- Share and control access to early-stage [experiments] and production-ready
  models alike.
- Save performance [metrics and plots] to quickly evaluate and compare models.
- Train and visualize models on the cloud automatically with [CI/CD for
  ML][cml-dvc].
- Integrate published models with an [API] to download, deploy, roll-back, etc.

[versions]: /doc/use-cases/versioning-data-and-model-files
[gitops]: https://about.gitlab.com/topics/gitops/
[provenance]: /doc/start/data-and-model-access
[lineage]: /doc/command-reference/dag#directed-acyclic-graph
[metrics and plots]: /doc/start/metrics-parameters-plots
[experiments]: /doc/user-guide/experiment-management
[api]: /doc/api-reference
[cml-dvc]: https://cml.dev/doc/cml-with-dvc
