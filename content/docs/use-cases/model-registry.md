# Machine Learning Model Registry

A **model registry** is a tool to catalog ML models and their versions. Models
from your data science projects can be discovered, audited, shared, tested, and
deployed from here. [Iterative](https://iterative.ai/) tools like
[DVC](https://dvc.org/doc), [GTO], and [MLEM] enable these capabilities on top
of Git, so you can stick to an existing software engineering stack. No more
divide between ML engineering and operations!

![](/img/ml_model_registry_placement.jpg) _A common placement for model
registries unifies ML development and application. See also [Data Registries]._

[gto]: https://github.com/iterative/gto
[mlem]: https://mlem.ai/
[data registries]: /doc/use-cases/data-registries

Model registries can give your team key capabilities:

- Collect and present your models, from early-stage [experiments] to
  production-ready, including their [metrics, plots], or other metadata to help
  use and evaluate them.
- Organize and track model [versions] effectively; with full data provenance and
  lineage information based on [reproducible modeling].
- A single interface to access specific models, both for collaboration (from
  other teammate machines) and to productionize them (e.g. via CI/CD).
- Designate certain models for different environments stages (dev, shadow, prod,
  etc.) without having to touch the applications that use them.
- For security, control who can manage models, and audit their usage trails.

[experiments]: /doc/user-guide/experiment-management
[metrics, plots]: /doc/start/metrics-parameters-plots
[versions]: /doc/use-cases/versioning-data-and-model-files
[reproducible modeling]: /doc/start/data-pipelines

Many of these benefits are built into DVC: Your [modeling process] and
performance information become **codified** in Git-based <abbr>DVC
projects</abbr>. This makes it possible to manage them with standard Git
workflows along with code. Large model files are stored separately and
efficiently, and can be pushed to [remote storage] -- a scalable access point
for [sharing].

An additional route to build a Git-native registry is to **annotate** ML models
in your repos using tags. [GTO] (Git Tag Ops) is a tool to do just that! The
annotations carry meaningful metadata, such as a model file path, deployment
env, etc. and get codified in the repo. GTO also helps manage your models
lifecycle: promoting versions, rolling back, and reviewing history.

And to fully **package** models, you can introduce [MLEM] in any Python code
that uses common ML libraries. It automagically codifies all the context needed
to produce them, and is able to push them to any cloud storage (by itself or via
DVC), list and transfer them among locations, or even serve them directly!

Each of these complementary methods brings your ML process to GitOps practices,
especially to manage and deploy models with mature software delivery methods.
This means for example Github Actions or Gitlab CI/CD, which can now
automatically sync with the state of the artifacts in your model registry.

[modeling process]: doc/start/data-pipelines
[remote storage]: /doc/command-reference/remote
[sharing]: /doc/start/data-and-model-access
[via cml]: https://cml.dev/doc/cml-with-dvc
