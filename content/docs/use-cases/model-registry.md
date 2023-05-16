# Machine Learning Model Registry

A **model registry** is a tool to catalog ML models and their versions. Models
from your data science projects can be discovered, tested, shared, deployed, and
audited from there. [DVC], [GTO], and [MLEM] enable these capabilities on top of
Git, so you can stick to an existing software engineering stack. No more
division between ML engineering and operations!

In addition, [Studio model registry] enables your teams to **collaborate** on
projects with greater efficiency. It provides a unified platform to organize,
discover, version, manage model stages (e.g. dev, shadow, prod) and track their
lineage using these open-source tools.

![](/img/ml_model_registry.jpg) _MLOps from modeling to production_

[gto]: https://mlem.ai/doc/gto
[mlem]: https://mlem.ai/

ML model registry enable end-to-end workflows:

- **Add/Log your model using dvclive**: Start by logging your model's
  performance metrics and artifacts with [dvclive]. This tool integrates
  seamlessly with your existing ML framework, enabling you to log everything you
  need to later use and evaluate models.

- **Compare model versions using Studio**: Once you've logged your models, use
  [Studio] UI or [DVC] CLI to compare different versions of your models. Studio
  provides a comprehensive and intuitive interface for comparing metrics,
  parameters, and plots across different model versions.

- **Register model versions**: After comparing your models in [Studio], you can
  register a semantic model version to mark an important iteration using
  [Studio] UI or [GTO] CLI (Git Tag Ops). Collecting and organizing model
  [versions] preserves their data provenance and lineage information.

- **Assign stage to model**: With your model registered, you can use [Studio] UI
  or [GTO] CLI to manage the lifecycle of your models. You can assign models to
  specific tasks or stages (e.g. dev, shadow, prod), and promote models through
  these stages as they prove their performance.

- **Download specific model**: To use a specific model, you can download the
  latest or requested model version, or the version in selected stage using
  [DVC].

- **Deploy with CI/CD**: To enable automation, you can setup CI/CD workflow that
  publish or deploy your model. CI/CD will be triggered upon version
  registration or stage assignment automatically, since they're executed by
  creating a Git tags. To wrap your models in REST API and deploy them to
  various platforms such as Sagemaker or Kubernetes, you can use [MLEM].

These steps provide a streamlined workflow from model development to deployment,
leveraging the power of ML model registries.

[modeling process]: /doc/start/data-management/data-pipelines
[remote storage]: /doc/user-guide/data-management/remote-storage
[accessing and sharing]:
  /doc/user-guide/data-management/discovering-and-accessing-data
[via cml]: https://cml.dev/doc/cml-with-dvc
[gitops]: https://www.gitops.tech/
[dvclive]: /doc/live
[Studio model registry]:
  (/doc/studio/user-guide/model-registry/what-is-a-model-registry)
[Studio]: (/doc/studio/user-guide/model-registry/what-is-a-model-registry)
[dvc]: /doc
