# What is a Model Registry

Iterative Studio Model Registry is a central registry of all your Machine
Learning models. It enables ML teams to collaborate on models by providing model
organization, discovery, versioning, lineage (tracing the origin of the model)
and the ability to manage production statuses (eg, development, staging,
production, etc.) of your models on top of Git.

**_TODO: Replace the below with the MR release video_**

https://www.youtube.com/watch?v=hKf4twg832g

Iterative Studio Model Registry is built on top of Git, and uses Iterative’s
open-source Git-based tools GTO [link to GTO repo] and MLEM [link to MLEM site].

- GTO enables semantic versioning [link to https://semver.org/] and stage
  transitions of artifacts. It creates metadata files and Git tags to register
  models and their versions and to promote the models to different stages (dev,
  staging, production, etc.).
- MLEM parses ML models and extracts model metadata including framework,
  methods, input / output data schema, and requirements. These metadata files
  contain your models’ details and point to the models’ file path which could be
  in S3, GCP, or any other of your remote, or local, storages.

The model registry provides an interactive web interface to the metadata files
and Git tags. You can also use the model registry through the GTO CLI and Python
API [link to the GTO repo]. Any updates that you make from the CLI or API are
also reflected in the model registry in Iterative Studio.

In the model registry, you can find information about your models in the
following interfaces:

- The models in your model registry are organized in a central dashboard that
  facilitates search and discovery. [link to the “Models dashboard” docs page]
- Complete details of each model version are displayed in a separate model
  details page. [link to the “Model details page” docs page]
- The experiment tables for your projects also have `Models` columns that show
  the different models in that project’s Git repository.

You can perform the following actions to the models in your model registry:

- Add models to the registry. [link to the “register a model” docs page]
- Register new versions of the models. [link to the “version models” docs page]
- Promote model versions to different stages. [link to the “promote models” docs
  page]

Note that while you can get the basic Model Registry functionality within
Studio, there are more things you can do using the MLEM and GTO CLI. For
example, to save and deploy models, you will need to use MLEM, although future
iterations of the Model Registry may incorporate these tasks also. Similarly,
you can use GTO in your CI/CD actions to interpret Git tags for deploying the
models to the desired environment.
