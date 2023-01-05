# Data Management for Machine Learning

<!--
## Data Management for Machine Learning
-->

Where and how to store datasets and ML model files is one of the first decisions
your team will face. But as time progresses, unnecessary files may end up
scattered throughout multiple buckets and folders. Overlapping contents cause
data leakage and inefficient storage. The project evolution is not easily to
track, so multiple data versions coexist (error-prone and not secure). What was
the name of the best model? Will others be able to reproduce your results?

![Direct storage access](/img/direct_access_storage.png) _Managing code, data,
and models manually does not scale: The S3 bucket on the left is shared by
various people and projects; The user on the right needs to know the exact
location of the correct files, and uses cloud-specific tools (e.g. AWS CLI) to
access them directly._

DVC gives your data stores a structure, helping you take control of existing
[storage platforms]. It maintains visibility over all your data and helps secure
its access.

![DVC data access](/img/dvc_managed_storage.png) _DVC captures the structure of
your datasets in a code repository, which can be versioned with Git. The storage
(left) can now be reorganized to eliminate duplication; You access data with
`dvc` (multi-cloud support) -- it checks the metadata to locate files in both
sides._

DVC lets you describe the entire <abbr>project</abbr> in a Git repository, so
you can go back to any previous state and find the right data, code, parameters,
etc. used at that time. In other words: [data versioning] guarantees [ML
reproducibility].

This requires a few key changes to your workflow:

1. Data and models must be registered in a code repository (typically on Git).
1. Stored objects are [reorganized] by DVC (not intended for manual handling).
1. Data operations (drop, update, transfer, etc.) happen indirectly -- through
   the repo.

[storage platforms]: /doc/command-reference/remote/add#supported-storage-types
[data versioning]: /doc/use-cases/versioning-data-and-models
[ml reproducibility]: /doc/user-guide/pipelines
[reorganized]:
  /doc/user-guide/project-structure/internal-files#structure-of-the-cache-directory

## How it works

<abbr>DVC repositories</abbr> contain [metafiles] (e.g. `data.dvc`) that act as
pointers, [linking]? to your data files and directories. This keeps your project
folder small and comprised mainly of text-like code and configuration files you
can [version with Git] normally. DVC moves your assets (large files, binaries,
etc.) to a content-addressable <abbr>cache</abbr>, eliminating any duplicates.

[metafiles]: /doc/user-guide/project-structure
[linking]: /doc/user-guide/data-management/large-dataset-optimization
[register]: /doc/command-reference/add
[generate]: /doc/command-reference/repro
[version with git]:
  https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control

<!-- More technical diagram? -->

<details>

### Click for deeper learning: data _codification_ and _indirection_.

These are two important concepts behind **data version control**. First, large
files and directories are replaced by [file links] and tiny code-like metafiles.
We can also call this "data as code".

This DVC-generated code contains references to the underlying files in the cache
(which have been renamed). All data operations going forward happen
**[indirectly]**, reading/writing metafiles in the repo first (handled
automatically by `dvc` operations).

[file links]:
  https://towardsdatascience.com/reflinks-vs-symlinks-vs-hard-links-and-how-they-can-help-machine-learning-projects-b77b89cdbab1
[indirectly]: https://en.wikipedia.org/wiki/Indirection

</details>

Now that your data is tracked by DVC (and its code with Git) there's no need to
come up with special file names or directory structures to handle dataset
variations -- you can use [Git branching] instead. This keeps your project clean
and manageable at any scale.

[git branching]:
  https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging

<!-- Sample code/terminal blocks... -->

The built-in cache included in every <abbr>DVC project</abbr> isolates your
project logic from storage needs. Files are renamed and [reorganized] based on
their contents (using simple hashes) to flatten any directory structure and
prevent duplication.

The cache is the first storage layer for you and your team to share and
collaborate, but more can be defined in DVC [config files] (using `dvc remote`
commands). These storage locations let you back up and share data, features, ML
models, etc. Supported platforms include SSH, Amazon S3, Google Cloud Storage,
Microsoft Azure, among [many more].

[config files]: /doc/user-guide/project-structure/internal-files
[many more]: /doc/command-reference/remote/add#supported-storage-types

## Why it's better

DVC's approach has a low cost (indirect access, work with Git) and many
benefits:

- Work in a small and clean <abbr>workspace</abbr> linked to one or more storage
  locations.
- Automatic <abbr>caching</abbr> decouples your project code and configuration
  from storage and maximizes [space efficiency].
- DVC backs up, restores, and [synchronizes] everything with a few fast
  operations that do not change.
- You get an authored history of data changes that can be traced and audited.
- Use a consistent interface to access data anywhere (via [CLI], [API], [IDE],
  or [web]).
- Enable advanced features such as [data registries], [ML pipelines], [CI/CD for
  ML], [productize] your models, and more!

[space efficiency]: /doc/user-guide/data-management/large-dataset-optimization
[synchronizes]: /doc/command-reference/remote
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
