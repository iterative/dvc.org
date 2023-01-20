# Data Management for Machine Learning

<!--
## Data Management for Machine Learning
-->

Where and how to store data and ML model files is one of the first decisions
your team will face. But traditional back-up strategies do not fit the data
science lifecycle. Large files end up scattered throughout several buckets.
Overlapping dataset versions coexist, causing leakage and inefficient use of
space. The project evolution is harder to track. What was the name of the best
model? Is it safe to delete `huge_split.zip`? Can others reproduce my results?

![Direct access storage](/img/direct_access_storage.png) _The S3 bucket on the
right is shared (and bloated) by several people and projects. You need to know
the exact location of the correct files, and use cloud-specific tools (e.g. AWS
CLI) to access them directly._

To maintain control and visibility over all your data and models, DVC stores
large files and directories for you in a structured way. It tracks them by
logging their locations and unique descriptions in **code-like metafiles**.

![DVC-cached storage](/img/dvc_managed_storage.png)

![]() _DVC writes `.dvc` files next to large files. A data cache indexes them
with `md5` checksums. Mass storage only holds unique files pushed with DVC for
back up or sharing._

Committing DVC metafiles to Git along your ML source files creates
**reproducible project versions**: Its history becomes easy to review, rewind,
and repeat going forward (by anyone). There's no need to come up with naming
schemes for changed data and model files.

![Versioning data with Git](/img/project_versioning.png) _You can use Git
history to store different dataset and model versions without renaming any files
in your workspace. The project cache grows as more relevant versions are
tracked._

## How it works

Let's consider a simplified, hypothetical ML project:

```
training.csv
validation.xml
model.bin
src/train.py
```

DVC appends unique <abbr>project</abbr> data and model file contents to a hidden
<abbr>cache</abbr>. Entries in this data store are organized by content hashes,
similar to an index.

```cli
.dvc/cache
├── 0a/aa77e # training.csv
├── 3f/db533 # validation.xml before
├── 6a/2aa4b # validation.xml now
├── a7/28107 # first model.bin
    ...
```

<!-- But what about old versions? -->

<!-- While DVC caching prevents file duplicates (optimizing storage), it can also store old data that's no longer relevant. -->

<!-- Prevents accidental deletions. -->

Now that they're cached safely, DVC-tracked data and models in the
<abbr>workspace</abbr> can be [replaced with file links], so you can continue
seeing and using them. File hashes (usually MD5) are written in human-readable
YAML [metafiles] next to the original data.

```git
  training.csv -> .dvc/cache/0a/aa77e
+ training.csv.dvc
  validation.xml -> .dvc/cache/6a/2aa4b
+ validation.xml.dvc
  model.bin
  ...
```

```yaml
# validation.xml.dvc
  ...
  md5: 6a26845d4000daa4bfb196017e103355
  path: validation.xml
```

[metafiles]: /doc/user-guide/project-structure
[replaced with file links]:
  /doc/user-guide/data-management/large-dataset-optimization

<admon type="info" title="Data codification">

DVC replaces data in the project with code-like files (and links) as explain
above. Codifying data lets you treat it as a first-class citizen in any code
repository because metafiles can be [versioned with Git] (or any SCM) along with
code, config, etc.

[versioned with git]:
  https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control

</admon>

<!-- Technical diagram? -->

<!-- It's also cleaner since there's no need for special file names like `2020-03_training_split (256x256)` to organize variations (use repo branches or tags instead). -->

## Benefits and tradeoffs

Adopting DVC's approach requires a few key changes to your workflow:

1. Relevant data and models are registered in a code repository (typically Git).
1. Data operations (add, remove, move, etc.) happen [indirectly]: DVC checks the
   metadata to locate files in both sides.
1. Stored objects managed with DVC are not intended for handling manually.

[indirectly]: https://en.wikipedia.org/wiki/Indirection

At the same time, it comes with many benefits (recap):

- Easily manage **data as code** and [optimize space usage][file links]
  automatically.
- DVC keeps track of large files and directories for you, mapping them between
  your <abbr>workspace</abbr> and storage.
- Easily share, distribute, and migrate data among one or more storage locations
  ([multiple providers supported]).
- Your <abbr>repository</abbr> stays small and easy **collaborate** on (using
  regular [Git workflows]).
- [Data versioning] guarantees ML **reproducibility**.
- Use a **consistent interface** to access and sync data anywhere (via [CLI],
  [API], [IDE], or [web]), regardless of the storage platform (S3, GDrive, NAS,
  etc.).
- Data **integrity** based on a Git-based storage; Data **security** through an
  authored project history that can be audited.
- Advanced features: [Data registries], [ML pipelines], [CI/CD for ML],
  [productize] your ML models, and more!

[multiple providers supported]:
  /doc/command-reference/remote/add#supported-storage-types
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

In summary, DVC establishes a mature method to manage data assets for ML
projects, letting you focus on more important tasks like exploration,
preparation, cross validation, etc.

<!-- ## Storage locations

The cache is the first storage layer for you and your team to share and
collaborate, but more can be defined in DVC [config files] (using `dvc remote`
commands). These storage locations let you back up and share data, features, ML
models, etc. Supported platforms include SSH, Amazon S3, Google Cloud Storage,
Microsoft Azure, among [many more].

[config files]: /doc/user-guide/project-structure/internal-files
[many more]: /doc/command-reference/remote/add#supported-storage-types
-->
