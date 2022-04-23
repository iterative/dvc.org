# Machine Learning Model Registry

A **model registry** is a central catalog for ML models produced in data science
projects. Different models can be discovered, audited, shared, tested, and
deployed from here. DVC works on top of Git to enable these capabilities on your
existing software engineering stack. And other tools from
[Iterative](https://iterative.ai/) provide more features and better usability.

![](/img/ml_model_registry_placement.jpg) _A common placement for model
registries is between development and applications. See also [Data Registries]._

[data registries]: /doc/use-cases/data-registries

Model catalogs give your team key collaborative capabilities:

- Store, organize, and track the [versions] of different models effectively.
- Full data provenance and lineage trails guarantee that your modeling is
  reproducible.
- Share and control access to any data artifact, from early-stage [experiment]
  results to production-ready models.
- Save performance [metrics and plots] to quickly evaluate and compare models.
- An interface to access specific model versions from other systems (e.g. for
  CI/CD)

[versions]: /doc/use-cases/versioning-data-and-model-files
[experiment]: /doc/user-guide/experiment-management
[metrics and plots]: /doc/start/metrics-parameters-plots

Many of these benefits are built into DVC: Your [modeling process] and
performance metadata become **codified** in Git-based <abbr>DVC projects</abbr>.
This makes it possible to manage them with standard GitOps workflows along with
code. Large model files are stored separately and can be pushed to [remote
storage], an efficient and scalable access point.

The relevant outputs of these model development projects can then be
**packaged** together with their metadata, and published in a [global Git
repository]. With DVC, existing model files stored remotely are reused, so
building the registry is fast. A connection to the original projects is
preserved, so you can always get the full lineage and provenance information.

DVC repos are already great for [sharing] data and models. They can also help
you get models from the registry to production: deploying manually with the
`dvc` [CLI] or integrating in code using DVC's Python [API]. You can even
automate their training and delivery [via CML]. In fact any downstream system
can sync with you models lifecycle using _GTO_.

[modeling process]: doc/start/data-pipelines
[remote storage]: /doc/command-reference/remote
[global git repository]: #model-registries-based-on-annotated-git-tags
[sharing]: /doc/start/data-and-model-access
[cli]: /doc/command-reference
[api]: /doc/api-reference
[via cml]: https://cml.dev/doc/cml-with-dvc

## Model Registries based on annotated Git tags

[GTO] (Git Tag Ops) is a free, open-source tool that let's you turn any Git
repository into an artifact registry. Tag artifact versions and annotate them
with meaningful metadata. Manage model states throughout their lifecycle:
promoting for production, rolling back, and reviewing their history. And any
Git-based system can [sync with these events].

GTO integrates nicely into DVC repos by using [metafiles] as annotations for
your artifacts.

[gto]: https://github.com/iterative/gto
[sync with these events]:
  https://github.com/iterative/gto#getting-right-versions-in-downstream-systems
[metafiles]: doc/user-guide/project-structure
