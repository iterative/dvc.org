# What is a Model Registry

Iterative Studio Model Registry is a central registry of all your Machine
Learning models. It enables ML teams to collaborate on models by providing model
organization, discovery, versioning, lineage (tracing the origin of the model)
and the ability to manage production statuses (eg, development, staging,
production, etc.) of your models on top of Git.

https://www.youtube.com/watch?v=DYeVI-QrHGI

Iterative Studio Model Registry is built on top of Git, and uses Iterative’s
open-source Git-based tools [GTO] and [MLEM] and [DVC].

Model registry enable end-to-end workflows:

- **Add/Log your model**: Start by logging your model's performance metrics and
  artifacts with [dvclive]. This tool integrates seamlessly with your existing
  ML framework, enabling you to log everything you need to later use and
  evaluate models.

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

<!-- These steps provide a streamlined workflow from model development to deployment,
supporting all stages of ML model lifecycle.



- [GTO] enables [semantic versioning] and stage transitions of artifacts. It
  creates metadata files and Git tags to register models and their versions and
  to assign stages (e.g. development, staging, production) to them.
- [MLEM] parses ML models and extracts model metadata including framework,
  methods, input / output data schema, and requirements. These metadata files
  contain your models’ details and point to the models’ file paths which could
  be in S3, GCP, or any other of your remote, or local, storages. -->

<!-- The model registry provides an interactive web interface to the metadata files
and Git tags. You can also use the model registry through the [`gto` CLI]. Any
updates that you make from the CLI or API are also reflected in the model
registry in Iterative Studio. -->

<!-- In the model registry, you can find information about your models in the
following interfaces:

- The models in your model registry are organized in a
  [central dashboard](/doc/studio/user-guide/model-registry/view-models#models-dashboard)
  that facilitates search and discovery.
- Complete details of each model version are displayed in a separate
  [model details page](/doc/studio/user-guide/model-registry/view-models#model-details-page).
- The experiment tables for your projects also have
  [`model` columns](/doc/studio/user-guide/model-registry/view-models#model-columns-in-the-projects-experiment-table)
  that show the different models in that project’s Git repository. -->

<!-- <admon type="tip"> -->

You can take a look at Iterative's [public model registry] (read only) to get a
feel for what's possible.

<!-- </admon> -->

<!-- You can perform the following actions to the models in your model registry:

- [Add models to the registry](/doc/studio/user-guide/model-registry/add-a-model)
- [Download models from the registry](/doc/studio/user-guide/model-registry/download-models)
- [Register new versions of the models](/doc/studio/user-guide/model-registry/register-version)
- [Assign stages to model versions](/doc/studio/user-guide/model-registry/assign-stage)
 -->

<!-- Note that while you can get the basic Model Registry functionality within
Iterative Studio, there are more things you can do using the [MLEM] and [GTO]
command line interface (CLI). For example, to save and deploy models, you will
need to use MLEM, although future iterations of the Model Registry may
incorporate these tasks also. Similarly, you can use [GTO] in your CI/CD actions
to interpret Git tags for deploying the models to the desired environment. -->

[semantic versioning]: https://semver.org/
[gto]: https://mlem.ai/doc/gto
[mlem]: https://mlem.ai/
[`gto` cli]: https://mlem.ai/doc/gto/command-reference
[public model registry]: https://studio.iterative.ai/team/Iterative/models
[dvc]: /doc
