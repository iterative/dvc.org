# Track and Sync Versioned Data & Models

The fundamental workflow of most <abbr>DVC projects</abbr> includes the
following **basic operations**. These can be performed directly (as we cover
here) but are sometimes included automatically in advanced workflows, like
[pipelining] and [experiment management].

[pipelining]: /doc/user-guide/pipelines
[experiment management]: /doc/user-guide/experiment-management

## Tracking data

DVC is [similar to Git] here. To start tracking large files or directories (e.g.
data or machine learning models), "add" them to DVC with the `dvc add` command.
This <abbr>caches</abbr> the files and [links them] back to the
<abbr>workspace</abbr> (hiding them from Git). A matching `.dvc` file is
created.

To capture changes to tracked data, `dvc add` them again (`dvc commit` will also
do the trick). This caches the latest file contents and updates `.dvc` metafiles
accordingly.

[similar to git]:
  https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository
[links them]: /doc/user-guide/data-management/large-dataset-optimization

<admon type="info">

`.dvc` and other [metafiles] can be tracked (and [versioned](#versioning-data))
with Git.

[metafiles]: /doc/user-guide/project-structure

</admon>

If you need to move or rename tracked data, use `dvc move`. To stop tracking it,
use `dvc remove`. To also remove it from the cache, use `dvc gc`. See [more
details].

To wrap up, you can get an overview of DVC-tracked assets with
`dvc data status`. This will list changes to tracked files and directories as
well as files unknown to DVC (or Git):

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

[more details]: /doc/user-guide/how-to/stop-tracking-data

<admon type="tip">

Other related commands: `dvc status`, `dvc list`, `dvc import`,
`dvc import-url`, `dvc unprotect`.

</admon>

## Synchronizing data

DVC lets you [codify your data][data versioning] and ML models, configure the
project's storage location(s), and stop worrying about low-level file operations
like copying, moving, renaming, uploading, etc.

At a minimum, you'll have one data store: the project's <abbr>cache</abbr>.
[Data-tracking](#tracking-data) operations already keep it in sync with your
<abbr>workspace</abbr> most of the time.

<admon type="tip">

`dvc commit` and `dvc checkout` let you force-sync them if needed, for example
if unexpected errors occur (e.g. cache corruption).

</admon>

[data versioning]: /doc/use-cases/versioning-data-and-models

To add storage locations to share and back up your work, you can configure [DVC
remotes] using `dvc remote` commands (more on their [configuration]). Once this
is done, use `dvc push` and `dvc pull` (among others) to transfer data between
the project and remote storage.

[dvc remotes]: /doc/user-guide/data-management/remote-storage
[configuration]: /doc/user-guide/data-management/remote-storage#configuration

![Sync ops among locations](/img/sync-ops-locations.png) _Data sync operations
among locations_

<admon type="tip">

`dvc fetch` transfers files downstream halfway -- from remote storage to the
<abbr>cache</abbr>. This can be useful to make sure that some data is available
for checkout later.

</admon>

A more advanced strategy is to access and synchronize data assets directly from
misc. locations or other DVC projects (e.g. [data registry] pattern). See
`dvc list`, `dvc import`/`dvc import-url`, and `dvc update`, as well as the
[Python API].

[protected]: /doc/command-reference/unprotect
[data registry]: /doc/use-cases/data-registry
[python api]: /doc/api-reference

## Versioning data

Many `dvc` commands give out hints about `git` commands to follow then with.
This helps you complete the [data versioning] side of the operation (if needed).

![Versioning flow](/img/flow.png) _DVC metafiles represent your data and models
in the Git repo, while large files are stored in the cache (and/or remote
storage) and linked to your workspace._

Some common sequences:

- Check the `dvc data status` (or `dvc status`) before deciding what changes to
  track with Git.
- `dvc add` (or `dvc commit`) your data and then `git add` and `git commit` the
  resulting DVC metafiles. This registers DVC-tracked files with Git indirectly
  (without storing them in the Git repo).
- After you `git push` project versions associated with new or changed data, you
  may want to `dvc push` those data updates to a [DVC remote][dvc remotes].
- `git checkout` to switch project versions (commits, branches, etc.) and then
  `dvc checkout` to get the corresponding large files tracked by DVC into your
  <abbr>workspace</abbr>.
- `git clone` or `git pull` a DVC repository (e.g. to get others contributions),
  and then `dvc pull` the matching data files.

<admon type="tip">

Some of these are so common that DVC provides the `dvc install` helper command
to set up [certain Git hooks] that automate them.

[certain git hooks]: /doc/command-reference/install#installed-git-hooks

</admon>

Managing multiple versions of data or models (including their training
parameters and performance metrics) with Git is great, but sometimes requires
navigation aids. DVC provides comparison commands like `dvc diff` (similar to
`git diff`) to help with this. See also `dvc params diff`, `dvc metrics diff`,
and `dvc plots diff`.

<admon type="tip">

Another neat feature of some DVC commands is the `--rev` ([revision]) option.
This lets you specify a version of the project to operate from. For example,
`dvc import --rev a17b8fd` can import data associated with the source project
commit `a17b8fd`. Other commands with `--rev`: `dvc gc`, `dvc list`, etc.

</admon>

[git branches]:
  https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging
[tags]: https://git-scm.com/book/en/v2/Git-Basics-Tagging
[revision]: https://git-scm.com/docs/revisions
