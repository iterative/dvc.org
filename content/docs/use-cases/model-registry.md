# Machine Learning Model Registry

A **model registry** is a tool to catalog ML models and their versions. Models
from your data science projects can be discovered, tested, shared, deployed, and
audited from there. [DVC](/doc), [GTO], and [MLEM] enable these capabilities on
top of Git, so you can stick to an existing software engineering stack. No more
divide between ML engineering and operations!

![](/img/ml_model_registry.jpg) _MLOps from modeling to production_

[gto]: https://github.com/iterative/gto
[mlem]: https://mlem.ai/

ML model registries give your team key capabilities:

- Collect and organize model [versions] from different sources effectively,
  preserving their data provenance and lineage information.
- Share metadata including [metrics and plots][mp] to help use and evaluate
  models.
- A standard interface to access all your ML artifacts, from early-stage
  [experiments] to production-ready models.
- Deploy specific models on different environments (dev, shadow, prod, etc.)
  without touching the applications that consume them.
- For security, control who can manage models, and audit their usage trails.

[versions]: /doc/use-cases/versioning-data-and-model-files
[mp]: /doc/start/metrics-parameters-plots
[experiments]: /doc/user-guide/experiment-management

Many of these benefits are built into DVC: Your [modeling process] and
[performance data][mp] become **codified** in Git-based <abbr>DVC
repositories</abbr>, making it possible to reproduce and manage models with
standard Git workflows (along with code). Large model files are stored
separately and efficiently, and can be pushed to [remote storage] -- a scalable
access point for [sharing].

<admon type="info">

See also [Data Registry](/doc/use-cases/data-registry).

</admon>

To make a Git-native registry (on top of DVC or not), one option is to use [GTO]
(Git Tag Ops). It tags ML model releases and promotions, and links them to
artifacts in the repo using versioned annotations. This creates abstractions for
your models, which lets you **manage their lifecycle** freely and directly from
Git.

And to **productionize** the models, you can save and package them with the
[MLEM] Python API or CLI, which automagically captures all the context needed to
distribute them. It can store model files on the cloud (by itself or with DVC),
list and transfer them within locations, wrap them as a local REST server, or
even containerize and deploy them to cloud providers!

This ecosystem of tools from [Iterative](https://iterative.ai/) brings your ML
process into [GitOps]. This means you can manage and deliver ML models with
software engineering methods such as continuous integration (CI/CD), which can
sync with the state of the artifacts in your registry.

[modeling process]: /doc/start/data-pipelines
[remote storage]: /doc/command-reference/remote
[sharing]: /doc/start/data-and-model-access
[via cml]: https://cml.dev/doc/cml-with-dvc
[gitops]: https://www.gitops.tech/
