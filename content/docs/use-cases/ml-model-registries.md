# Machine Learning Model Registries

A dedicated **ML model registry** (or _model catalog_) works as a central
repository between mature data science projects and their real-world
applications. This placement contrasts with general [data registries] -- which
provide persistent storage for reusable data sources or training sets. Models on
the other hand are final artifacts we want to audit, test, or deploy.

[data registries]: /doc/use-cases/data-registries

![](/img/ml_model_registry_placement.jpg) _Placement of a model registry in the
DS lifecycle_

Being specialized, model registries may require further capabilities such as:

- Advanced versioning to help organize different models and their updates
- Metadata about the model provenance and state (inactive, shadow, current)
- Information on how to use and evaluate models on production
- Support for model integration via existing deployment tools and services
- Full lineage connecting models to the dataset(s), code, and configuration used
  for training, and any other artifacts and metrics produced

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
manual deployments, all within the confines of standard DVC operations.
