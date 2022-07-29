# What is a Model Registry

Iterative Studio Model Registry is a central registry of all your Machine
Learning models. It enables ML teams to collaborate on models by providing model
organization, discovery, versioning, lineage (tracing the origin of the model)
and the ability to manage production statuses (eg, development, staging,
production, etc.) of your models on top of Git.

https://www.youtube.com/watch?v=DYeVI-QrHGI

Iterative Studio Model Registry is built on top of Git, and uses Iterative’s
open-source Git-based tools [GTO] and [MLEM].

- [GTO] enables [semantic versioning] and stage transitions of artifacts. It
  creates metadata files and Git tags to register models and their versions and
  to assign stages (e.g. development, staging, production) to them.
- [MLEM] parses ML models and extracts model metadata including framework,
  methods, input / output data schema, and requirements. These metadata files
  contain your models’ details and point to the models’ file paths which could
  be in S3, GCP, or any other of your remote, or local, storages.

The model registry provides an interactive web interface to the metadata files
and Git tags. You can also use the model registry through the [GTO CLI and
Python API][gto]. Any updates that you make from the CLI or API are also
reflected in the model registry in Iterative Studio.

In the model registry, you can find information about your models in the
following interfaces:

- The models in your model registry are organized in a
  [central dashboard](/doc/studio/user-guide/model-registry/view-models#models-dashboard)
  that facilitates search and discovery.
- Complete details of each model version are displayed in a separate
  [model details page](/doc/studio/user-guide/model-registry/view-models#model-details-page).
- The experiment tables for your projects also have
  [`model` columns](/doc/studio/user-guide/model-registry/view-models#model-columns-in-the-projects-experiment-table)
  that show the different models in that project’s Git repository.

You can perform the following actions to the models in your model registry:

- [Add models to the registry](/doc/studio/user-guide/model-registry/add-a-model)
- [Register new versions of the models](/doc/studio/user-guide/model-registry/register-version)
- [Assign stages to model versions](/doc/studio/user-guide/model-registry/assign-stage)

Note that while you can get the basic Model Registry functionality within
Iterative Studio, there are more things you can do using the [MLEM] and [GTO]
command line interface (CLI). For example, to save and deploy models, you will
need to use MLEM, although future iterations of the Model Registry may
incorporate these tasks also. Similarly, you can use GTO in your CI/CD actions
to interpret Git tags for deploying the models to the desired environment.

[semantic versioning]: https://semver.org/
[gto]: https://github.com/iterative/gto
[mlem]: https://mlem.ai/
