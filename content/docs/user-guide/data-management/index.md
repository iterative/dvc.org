# Data Management for Machine Learning

<!--
## Data Management for Machine Learning
-->

Where and how to store data and model files is one of the first decisions your
team will have to make. Typically, files end up scattered throughout multiple
buckets. Everyone can read and write which is not secure. Duplicated content is
hard to find, so outdated datasets overlap with the latest version. You start
formatting folder names with dates, but others still can't reproduce your
results...

![Direct storage access](/img/manual_data_management.png) _Managing data
manually does not scale and quickly becomes a consuming job._

DVC gives you a structure that lets you take control of your existing [storage
platforms]. It provides visibility over all your data and helps secure their
access.

![DVC data access](/img/dvc_managed_storage.png) _DVC's approach_

Your storage is managed from an immutable <abbr>repository</abbr>, implementing
append-only data stores. Content changes can be [properly versioned],
guaranteeing the [reproducibility] of any state of your project. DVC tracks
where the underlying files reside, avoiding duplicates along the way.

[storage platforms]: /doc/command-reference/remote/add#supported-storage-types
[properly versioned]: /doc/use-cases/versioning-data-and-models
[reproducibility]: /doc/user-guide/pipelines

Key workflow changes to keep in mind:

1. You must set up a <abbr>DVC project</abbr> and its storage locations.
1. Stored objects are [reorganized] by DVC (not intended for manual handling).
1. Data operations happen indirectly, through a code repository (typically on
   Git).

[reorganized]:
  /doc/user-guide/project-structure/internal-files#structure-of-the-cache-directory
[indirectly]: https://en.wikipedia.org/wiki/Indirection

More benefits:

- Work in a small and clean <abbr>workspace</abbr> linked to one or more storage
  locations.
- Automatic <abbr>caching</abbr> decouples your project code and configuration
  from storage and maximizes [space efficiency].
- DVC backs up, restores, and [synchronizes] everything with a few fast
  operations that do not change.
- You get an authored project history that ban be traced and audited.
- Use a consistent interface to access data anywhere (via [CLI], [API], [IDE],
  or [web]).
- Enable advanced features such as [data registries], [ML pipelines], [CI/CD for
  ML], [productization], and more!

[space efficiency]: /doc/user-guide/data-management/large-dataset-optimization
[synchronizes]: /doc/command-reference/remote
[cli]: /doc/command-reference
[api]: /doc/api-reference
[ide]: /doc/vs-code-extension
[web]: /doc/studio
[data registries]: /doc/use-cases/data-registry
[ml pipelines]: /doc/user-guide/pipelines
[ci/cd for ml]: https://cml.dev/
[productization]: https://mlem.ai/

<!-- ## Usage / More details

DVC establishes a standard way to manage data for ML projects, letting you focus
on more important tasks like data exploration, preparation, etc.

<!-- More technical diagram? -/->

Clean project structure

<!-- Sample code/terminal blocks... -/->

[metafiles] (pointers) / Codification (indirection?)
You can capture all these [with Git] along with the rest of your project's code

[metafiles]: /doc/user-guide/project-structure

Content-addressable cache

Storage locations defined in [config files]

[config files]: /doc/user-guide/project-structure/internal-files
-->
