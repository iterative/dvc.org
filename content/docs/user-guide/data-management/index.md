# Data Management for Machine Learning

<!--
## Data Management for Machine Learning
-->

Where and how to store datasets and ML model files is one of the first decisions
your team will face. But as time progresses, unnecessary files may end up
scattered throughout multiple buckets. Overlapping contents cause data leakage
and inefficient storage. The project evolution is not easily to track, so
multiple data versions coexist (error-prone and not secure). What was the name
of the best model? Can others reproduce your results? _Example:_

![Direct access storage](/img/direct_access_storage.png) _The S3 bucket on the
right is shared (and bloated) by several people and projects. You need to know
the exact location of the correct files, and use cloud-specific tools (e.g. AWS
CLI) to access them directly._

DVC captures information that describes your data. This allows datasets to exist
in a <abbr>project</abbr> regardless of where and how they're actually stored.
Their storage can be (re)[organized efficiently] without affecting original
projects. _Click on **v1.0** and **test** below for an example:_

[organized efficiently]:
  /doc/user-guide/data-management/large-dataset-optimization

<toggle>
<tab title="test">

![DVC managed storage (test)](/img/dvc_managed_storage_0.png)

</tab>
<tab title="v1.0">

![DVC managed storage (1.0)](/img/dvc_managed_storage_1.png)

</tab>
</toggle>

![]() _DVC [metadata] including folder structure is saved a in Git repository.
The shared storage (right) contains unique, indexed data objects, minimizing its
size; You access them using DVC [synchronization] features._

Every file and directory that matters at a given time is tracked by DVC. And Git
let's you record of many such times (project versions). You'll be able to know
when/why any data was included (visibility), guarantee storage integrity, and
secure its access. Sharing data stores is not a problem, and they're easy to
migrate across platforms ([multiple providers supported]).

[metadata]: /doc/user-guide/project-structure/dvc-files#specification
[synchronization]:
  /doc/start/data-management/data-versioning#storing-and-sharing
[multiple providers supported]:
  /doc/command-reference/remote/add#supported-storage-types

Just keep in mind these key changes to your workflow, required by our approach:

1. Relevant data and models are registered in a code repository (typically Git).
1. Data operations (add, remove, move, etc.) happen [indirectly]: DVC checks the
   metadata to locate files in both sides.
1. Stored objects managed with DVC are not intended for handling manually.

[indirectly]: https://en.wikipedia.org/wiki/Indirection

## More details and benefits

![DVC data process](/img/dvc-data-process.png) _Overall mechanism for managing
data with DVC_

When DVC tracks existing, new, or updated data in your <abbr>project</abbr>, it
takes a unique snapshot of that data in tiny [metafiles] (e.g. `mydata.dvc`).
These placeholders point to the underlying files, which DVC moves to a
[content-addressable] <abbr>cache</abbr> (eliminating duplicates). File links
are created in your <abbr>workspace</abbr> so you continue working with the
expected files transparently.

[metafiles]: /doc/user-guide/project-structure
[content-addressable]: https://en.wikipedia.org/wiki/Content-addressable_storage

<details>

### Click to learn about _data codification_.

DVC replaces data in the project with code-like metafiles (and file links, as
explain above). We could say that the data gets "codified".

</details>

Separating the description of your data from its storage lets you treat data as
a first-class citizen in a code repository, by committing it with [Git version
control] along with ML source code, configuration files, etc. This keeps the
workspace small and clean -- no need for special file names or nested folders to
organize data or model variations.

[git version control]:
  https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control

<!-- Sample code/terminal blocks... -->

<toggle>
<tab title="Yesterday">

```cli
$ ls -hop
total 228B
    0B  A
  128B  b/
  160B  c/
```

</tab>
<tab title="Today">

```cli
$ ls -hop
total 228K
    0K  A
  128K  b/
  160K  c/
```

</tab>
<tab title="Tomorrow">

```cli
$ ls -hop
total 228M
    0M  A
  128M  b/
  160M  c/
```

</tab>
</toggle>

Adopting DVC's approach requires a low effort and has many benefits (recap):

- Easily manage **data as code** and [optimize space usage] automatically.
- DVC keeps track of large files and directories for you, mapping them between
  your <abbr>workspace</abbr> and one or more storage locations ([multiple
  providers supported]).
- Your project <abbr>repository</abbr> stays small and easy to share for
  **collaboration** ([Git workflows]).
- [Data versioning] guarantees ML **reproducibility**: Restore previous project
  states (with Git) and find the right data, code, and parameters used at the
  time.
- Use a **consistent interface** to access and sync data anywhere (via [CLI],
  [API], [IDE], or [web]), regardless of the storage platform (S3, GDrive, NAS,
  etc.).
- Data **integrity** based on append-only storage and Git's unchanging history;
  Data **security** given the authored history of project changes that can be
  traced and audited.
- Advanced features: [Data registries], [ML pipelines], [CI/CD for ML],
  [productize] your ML models, and more!

[optimize space usage]:
  /doc/user-guide/data-management/large-dataset-optimization
[git workflows]:
  https://git-scm.com/book/en/v2/Distributed-Git-Distributed-Workflows
[data versioning]: /doc/use-cases/versioning-data-and-models
[cli]: /doc/command-reference
[api]: /doc/api-reference
[ide]: /doc/vs-code-extension
[web]: /doc/studio
[data registries]: /doc/use-cases/data-registry
[ml pipelines]: /doc/user-guide/pipelines
[ci/cd for ml]: https://cml.dev/
[productize]: https://mlem.ai/

In summary, DVC establishes a standard way to manage data for ML projects,
letting you focus on more important tasks like data exploration, preparation,
cross validation, etc.

<!-- ## Storage locations

The cache is the first storage layer for you and your team to share and
collaborate, but more can be defined in DVC [config files] (using `dvc remote`
commands). These storage locations let you back up and share data, features, ML
models, etc. Supported platforms include SSH, Amazon S3, Google Cloud Storage,
Microsoft Azure, among [many more].

[config files]: /doc/user-guide/project-structure/internal-files
[many more]: /doc/command-reference/remote/add#supported-storage-types

[]:
  /doc/user-guide/project-structure/internal-files#structure-of-the-cache-directory
-->
