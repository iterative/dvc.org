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
large files and directories for you in an [organized] way. It tracks them by
logging their locations and unique descriptions in text-based [metafiles].
_Click on **v1.0** and **test** below for an example:_

[organized]:
  /doc/user-guide/project-structure/internal-files#structure-of-the-cache-directory
[metafiles]: /doc/user-guide/project-structure

<!--
<toggle>
<tab title="test">
-->

![DVC managed storage](/img/dvc_managed_storage_0.png) _An cache index by
content signatures is introduced, eliminating the **overlap** across datasets.  
DVC [synchronizes] storage under the hood._

<!--
<toggle>

</tab>
<tab title="v1.0">

![DVC managed storage (v2)]()

</tab>
</toggle>
-->

[metadata]: /doc/user-guide/project-structure/dvc-files#specification
[synchronizes]: /doc/start/data-management/data-versioning#storing-and-sharing

Committing DVC metafiles [to Git] along your ML source files creates
[reproducible] project versions: Its history becomes easy to review, rewind, and
repeat going forward (by anyone). There's no need to come up with naming schemes
for changed data and model files.

[to git]:
  https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository
[reproducible]: /doc/user-guide/pipelines

This approach requires a few key changes to your workflow:

1. Relevant data and models are registered in a code repository (typically Git).
1. Data operations (add, remove, move, etc.) happen [indirectly]: DVC checks the
   metadata to locate files in both sides.
1. Stored objects managed with DVC are not intended for handling manually.

[indirectly]: https://en.wikipedia.org/wiki/Indirection

## More details and benefits

<!-- Full diagram -->

When DVC tracks existing, new, or updated data in your <abbr>project</abbr>, it
writes a unique description about it to tiny [metafiles] (e.g. `dataset.dvc`).
These include a content signature that is used to index a data
<abbr>cache</abbr>. The underlying files are appended there (preventing
duplicates and deletions) and replaced by file links in your
<abbr>workspace</abbr>: You continue using the data normally.

<details>

### Click to learn about _data codification_.

DVC replaces data in the project with code-like metafiles (and file links) as
explain above. We could say that the data gets "codified". This in effect
creates references from your workspace to the cache so that DVC can manage the
data transparently.

</details>

Separating data description from storage lets you treat it as a first-class
citizen in any code repository by committing the metafiles with [Git version
control] along with other small files (code, config, etc.). This keeps the
project complete and small at the same time. It's also cleaner since there's no
need for special file names like `2020-03_training_split (256x256)` to organize
variations (use repo branches or tags instead).

[git version control]:
  https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control

<!-- Sample code/terminal blocks (to copy/paste?) -->

Adopting DVC's approach requires a low effort and has many benefits (recap):

<!--
Sharing data stores is not a problem, and they're easy to
migrate across platforms ([multiple providers supported]).

[multiple providers supported]:
  /doc/command-reference/remote/add#supported-storage-types
-->

<!-- You can also distribute parts or entire copies of an independent data caches. -->

- Easily manage **data as code** and [optimize space usage] automatically.
- DVC keeps track of large files and directories for you, mapping them between
  your <abbr>workspace</abbr> and one or more storage locations ([multiple
  providers supported]).
- Your project <abbr>repository</abbr> stays small and easy to share for
  **collaboration** ([Git workflows]).
- [Data versioning] guarantees ML **reproducibility**.
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
-->
