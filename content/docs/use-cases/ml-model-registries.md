# Machine Learning Model Registries

Dedicated **ML model registries** work as interfaces between mature data science
projects and their deployment for real-world applications. This is in contrast
with simple [data registries], which mainly provide efficient and persistent
storage for reusable data sources for multiple projects from a central
repository.

![](/img/ml_model_registry_placement.jpg) _Placement of a model registry in the
DS workflow_

Being more specialized, model registries require extended capabilities such as:

- Advanced versioning strategies to organize many model revisions
- Metadata about the intended model stage (test, audit, shadow, current, old)
- Information on how to use and evaluate models on production
- Ways to integrate the registry directly with existing deployment tools and
  services
- Detailed lineage connecting models to the source data used for training, and
  any other artifacts or metrics produced

[data registries]: /doc/use-cases/data-registries
