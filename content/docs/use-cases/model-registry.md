# Machine Learning Model Registry

A **model registry** is a tool to catalog ML models and their versions. Models
from your data science projects can be discovered, audited, shared, tested, and
deployed from here.  
DVC works on top of Git to enable these capabilities on your existing software
engineering stack. Other tools from [Iterative](https://iterative.ai/) provide
complementary features and more usability.

![](/img/ml_model_registry_placement.jpg) _A common placement for model
registries is between development and applications. See also [Data Registries]._

[data registries]: /doc/use-cases/data-registries

Model registries give your team key capabilities:

- Store and present your models to others, from early-stage [experiment] results
  to production-ready models.
- Collect, organize, and track the [versions] of different models effectively;
  with full data provenance and lineage trails based on [reproducible modeling].
- Save performance [metrics and plots] or other metadata to evaluate or compare
  models.
- An interface to access specific model versions from other systems (e.g. in
  CI/CD or production environments)

[experiment]: /doc/user-guide/experiment-management
[versions]: /doc/use-cases/versioning-data-and-model-files
[reproducible modeling]: /doc/start/data-pipelines
[metrics and plots]: /doc/start/metrics-parameters-plots

Many of these benefits are built into DVC: Your [modeling process] and
performance information become **codified** in Git-based <abbr>DVC
projects</abbr>. This makes it possible to manage them with standard GitOps
workflows along with code. Large model files are stored separately and
efficiently, and can be pushed to [remote storage] -- a scalable access point.

DVC repos are also great for [sharing] any data artifact. You can get the models
described by DVC into production in a few ways: by deploying with the `dvc`
[CLI], or integrating into Python code using the [API]. You can even automate
their training and delivery [via CML].

To build a Git-native registry, the ML models in your repos can be annotated
using tags. [GTO] (Git Tag Ops) is a tool to do just that! The annotations carry
meaningful metadata, such as a model file path (or [DVC metafile]), development
stage, deployment environment, etc. This helps you manage your models lifecycle:
promoting versions, rolling back, and reviewing their history.

This approach is like **packaging** the models with their related information,
plus dependencies with DVC. They can be consolidated virtually using a smart
tool like [Studio], or by moving or [importing] the assets into a central repo.
This is compatible with systems like Github Actions or Gitlab CI/CD, which can
automatically [sync] with your model management events.

[modeling process]: doc/start/data-pipelines
[remote storage]: /doc/command-reference/remote
[sharing]: /doc/start/data-and-model-access
[cli]: /doc/command-reference
[api]: /doc/api-reference
[via cml]: https://cml.dev/doc/cml-with-dvc
[gto]: https://github.com/iterative/gto
[studio]: https://studio.iterative.ai/
[importing]: /doc/use-cases/data-registries#building-registries
[sync]:
  https://github.com/iterative/gto#getting-right-versions-in-downstream-systems
[dvc metafile]: doc/user-guide/project-structure
