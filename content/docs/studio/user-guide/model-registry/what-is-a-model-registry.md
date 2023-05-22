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

- **Add/Log your model**: Start by
  [logging your model's performance metrics and artifacts](/doc/studio/user-guide/model-registry/add-a-model).

- **Compare model versions**:
  [Evaluate model metrics to find out the best candidate for the next release](/doc/studio/user-guide/model-registry/view-and-compare-models).

- **Register model versions**:
  [Mark an important iteration](/doc/studio/user-guide/model-registry/register-version)
  with a semantic model version.

- **Assign stage to model**:
  [Promote your models](/doc/studio/user-guide/model-registry/assign-stage) to
  `prod`, `dev` or any other stage.

- **Download specific model**:
  [Get the model version you want to use](/doc/studio/user-guide/model-registry/download-models).

- **Deploy with CI/CD**:
  [Set up automation](/doc/studio/user-guide/model-registry/download-models#deploying-and-publishing-models-in-cicd)
  to publish or deploy your model when you register new versions or assign
  stages.

You can take a look at Iterative's [public model registry] (read only) to get a
feel for what's possible.

[semantic versioning]: https://semver.org/
[gto]: https://mlem.ai/doc/gto
[mlem]: https://mlem.ai/
[`gto` cli]: https://mlem.ai/doc/gto/command-reference
[public model registry]: https://studio.iterative.ai/team/Iterative/models
[dvc]: /doc
