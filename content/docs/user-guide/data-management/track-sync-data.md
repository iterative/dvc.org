# Track and Sync Versioned Data

Basic [data management] operations constitute the fundamental workflow of most
<abbr>DVC projects</abbr>. This functionality can be used directly (as well
cover here) but it's also included automatically in other DVC workflows, like
[pipelining] and [experiment management].

[data management]: /doc/user-guide/data-management
[pipelining]: /doc/user-guide/pipelines
[experiment management]: /doc/user-guide/experiment-management

## Tracking data

DVC is [similar to Git] in this area. To start tracking large files or
directories, "add" them to DVC with the `dvc add` command. This hides the data
from Git, moves it to the <abbr>cache</abbr>, and [links it] back to the
<abbr>workspace</abbr>. It also creates an accompanying `.dvc` file (visible to
Git).

<admon type="info">

`.dvc` files can be tracked (and [versioned](#versioning-data)) with Git
directly.

</admon>

<details>

### Click to learn about _data codification_

<abbr>DVC projects</abbr> separate data from code by replacing large files, ML
models, etc. in your <abbr>workspace</abbr> with small [metafiles]; We call this
strategy _codification_ (of the data). The actual file contents are cached in an
independent data store and [linked] to your project.

![Code vs. data](/img/code-vs-data.png) _Separating code from data_

<admon type="info">

In order to [avoid duplicate content][linked], and to support [versioning
features][data versioning], files and directories are reorganized in the cache
into a [content-addressable structure].

</admon>

[metafiles]: /doc/user-guide/project-structure
[linked]: /doc/user-guide/data-management/large-dataset-optimization
[content-addressable structure]:
  /doc/user-guide/project-structure/internal-files#structure-of-the-cache-directory

</details>

To capture changes to tracked data, `dvc add` it again (alternatively,
`dvc commit` will also do the trick). This caches the latest data present in the
workspace and updates `.dvc` files accordingly (changes visible to Git).

If you need to move or rename tracked data, use `dvc move`. To stop tracking
data altogether, use `dvc remove`. To also remove it from the cache (either the
latest or historic versions), use `dvc gc`. See [more details].

Putting it all together, we can get an overview of the data in a project with
`dvc data status`. This will list changes to DVC-tracked data as well as files
unknown to DVC (or Git):

```cli
$ dvc data status
Not in cache:
        tmp/

DVC committed changes:
        added: data.xml
        modified: data/features/

DVC uncommitted changes:
        deleted: model.pkl
```

<admon type="tip">

Other commands partially related to tracking data: `dvc status`,
`dvc unprotect`, `dvc list`, `dvc import`, `dvc import-url`.

</admon>

[similar to git]:
  https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository
[links it]: /doc/user-guide/data-management/large-dataset-optimization
[more details]: /doc/user-guide/how-to/stop-tracking-data

## Synchronizing data

DVC lets you [codify your data], configure the project's storage location(s),
and stop worrying about low-level operations like copying, moving, renaming,
uploading and downloading, etc.

At a minimum, you'll have two locations: your <abbr>workspace</abbr> and a
<abbr>cache</abbr>. The [data tracking](#tracking-data) operations already keep
these in sync most of the time.

<admon type="tip">

`dvc commit` and `dvc checkout` let you force-sync them if needed, for example
if unexpected errors occur (e.g. cache corruption).

</admon>

To add storage locations to share and back up your work, you can configure [DVC
remotes] with the `dvc remote add` and `dvc remote modify` commands (see
`dvc remote` for more options). Once this is done, use `dvc push` and `dvc pull`
to transfer data between the project and remote storage.

![Sync ops among locations](/img/sync-ops-locations.png) _Data sync operations
among locations_

<!--
<admon type="info">

DVC remotes are similar to Git remotes, but for <abbr>cached</abbr> assets. This
means that they use the same [directory
structure][content-addressable structure] as the data cache.

</admon>
-->

<admon type="tip">

`dvc fetch` transfers files downstream halfway -- from remote storage to the
<abbr>cache</abbr>. This can be useful to make sure that some data is available
for checkout later.

</admon>

<admon type="info">

Regardless of the name, "remotes" may be set up anywhere: local file systems,
external devices or network locations, and remote servers or cloud platforms.

</admon>

A more advanced strategy is to access and synchronize data assets one way, from
misc. locations or other DVC projects (e.g. [data registry] pattern).
`dvc list`, `dvc import` or `dvc import-url`, and `dvc update` are the main
commands related to this.

[codify your data]: /doc/use-cases/versioning-data-and-models
[protected]: /doc/command-reference/unprotect
[dvc remotes]: /doc/command-reference/remote
[data registry]: /doc/use-cases/data-registry

## Versioning data

You may have noticed that most of the `dvc` commands give out hints about `git`
commands to follow with. This helps you complete the [data versioning] side of
the operation (if desired).

![Versioning flow](/img/flow.png) _A data versioning flow on top of Git_

Some common sequences:

- Check the `dvc data status` (or `dvc status`) before deciding what changes to
  track with Git.
- Use `git add` and `git commit` after you `dvc add` (or `dvc commit`) data.
  This registers the DVC-tracked data version with Git (without storing it in
  the Git repo).
- Create or merge [Git branches] to organize your project versions, or [tags] to
  manage milestones and releases (no DVC operations needed).
- `git checkout` to switch project versions (commits, branches, etc.), and then
  `dvc checkout` to get the data files associated with that version into your
  workspace.
- After you `git push` project versions associated with new or changed data, you
  may want to `dvc push` those data updates to a [DVC remote][dvc remotes].
- `git checkout` a DVC repository, or `git pull` its latest version (e.g. that
  someone else contributed), and then `dvc pull` the matching data updates.

<admon type="tip">

Some of these sequences are so common that DVC provides the `dvc install` helper
command to set up [certain Git hooks] that automate them.

[certain git hooks]: /doc/command-reference/install#installed-git-hooks

</admon>

Having multiple versions of data and ML models (including their training
parameters and performance metrics) within different Git commits is great, but
sometimes requires navigation aids. DVC provides comparison commands like
`dvc diff` (similar to `git diff`) to help with this. See also
`dvc params diff`, `dvc metrics diff`, and `dvc plots diff`.

<admon type="tip">

Another neat feature of some DVC commands is the `--rev` ([revision]) option.
This lets you specify a version of the project to operate from. For example,
`dvc import --rev a17b8fd` can import data associated with the source project
commit `a17b8fd`. Other commands with `--rev`: `dvc gc`, `dvc list`, etc.

</admon>

[data versioning]: /doc/user-guide/data-management/data-versioning
[git branches]:
  https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging
[tags]: https://git-scm.com/book/en/v2/Git-Basics-Tagging
[revision]: https://git-scm.com/docs/revisions
