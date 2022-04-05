# Machine Learning Model Registries

An **ML model registry** (or _model catalog_) works as a central repository
between data science projects and their applications. ML models and other data
artifacts can be browsed, shared, audited, tested, and deployed from here. DVC
repositories support all of this while integrating seamlessly with existing
development workflows.

![](/img/ml_model_registry_placement.jpg) _Model registry placement contrasts
with general [data registries] for reusable data sources or training sets._

[data registries]: /doc/use-cases/data-registries

Model registries provide data science teams with key capabilities:

- Store, organize, and track the versions of different models;
- Preserve full data provenance and lineage trails to ensure that modeling is
  reproducible;
- Share and control access to early-stage [experiments] and mature models alike;
- Provide an API to integrate models via common deployment tools;

[experiments]: https://dvc.org/doc/user-guide/experiment-management

The fastest way to build a model registry is to [import] them from one or more
DVC projects. It's also easy to bring in production-ready models from other
sources for DVC to [track], but you may need to attach special metadata in order
to enable certain registry features. In either case DVC records the model's
provenance.

Versioning needs can be addressed with Git, an underlying layer of all DVC
repos. Lineage is intrinsic to any artifact imported from other DVC projects, as
the connection is always preserved so you can consult the source's [data
pipeline]. And simple integration into Python code specifically is
straightforward using DVC's [Python API].

It's also possible to add any other metadata on usage, state, or other aspects
of your models, for example using Git tags. Or to export any model artifact for
manual deployments, all within the confines of standard DVC operations. However,
we can also look at other tools that further standardize this endeavour.
