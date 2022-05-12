# Machine Learning Model Registry

A **model registry** is a tool to catalog ML models and their versions. Models
from your data science projects can be discovered, audited, shared, tested, and
deployed from here. [Iterative](https://iterative.ai/) tools like
[DVC](https://dvc.org/doc), [GTO], and [MLEM] enable these capabilities on top
of Git, so you can stick to an existing software engineering stack. No more
division between ML and App operations!

![](/img/ml_model_registry_placement.jpg) _A common placement for model
registries is between development and applications. See also [Data Registries]._

[gto]: https://github.com/iterative/gto
[mlem]: https://mlem.ai/
[data registries]: /doc/use-cases/data-registries

Model registries give your team key capabilities:

- Collect and present your models to others, from early-stage [experiments] to
  production-ready, including [metrics, plots], or other metadata to help use
  and evaluate them.
- Organize and track model [versions] effectively; with full data provenance and
  lineage information based on [reproducible modeling].
- An interface to access specific models from other systems (e.g. in CI/CD or
  production).
- (Re)place different models on certain environments stages (dev, shadow, prod,
  etc.) without having to touch the applications that use them.
- Control who can manage models for added security, and audit the trail of
  updates.

[experiments]: /doc/user-guide/experiment-management
[metrics, plots]: /doc/start/metrics-parameters-plots
[versions]: /doc/use-cases/versioning-data-and-model-files
[reproducible modeling]: /doc/start/data-pipelines

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
state, deployment env, etc. This helps manage your models lifecycle: promoting
versions, rolling back, and reviewing their history.

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
[studio]: https://studio.iterative.ai/
[importing]: /doc/use-cases/data-registries#building-registries
[sync]:
  https://github.com/iterative/gto#getting-right-versions-in-downstream-systems
[dvc metafile]: doc/user-guide/project-structure
