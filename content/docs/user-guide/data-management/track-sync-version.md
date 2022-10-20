# Track, Sync, and Version Data

Basic [data management] operations constitute the fundamental workflow of most
DVC projects. This functionality can be used directly (as well cover here) but
it's also included automatically in more advanced features like [pipelining] and
[experiment management].

[data management]: /doc/user-guide/data-management
[pipelining]: /doc/user-guide/pipelines
[experiment management]: /doc/user-guide/experiment-management

## Tracking data

DVC is [similar to Git] in this area. To start tracking large files or
directories, "add" them to DVC with the `dvc add` command. This hides the data
from Git, moves it to the <abbr>cache</abbr>, and [links it] back to the
<abbr>workspace</abbr>. It also creates an accompanying `.dvc` file (visible to
Git). Now your code and configuration files are physically separated from your
data!

<admon type="info">

`.dvc` files can be tracked (and versioned) with Git directly (see
[Versioning](#versioning-data)).

</admon>

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

Other commands related to tracking data: `dvc unprotect`, `dvc import`,
`dvc import-url`.

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
[cache directory]. The [data tracking](#tracking-data) operations already keep
these in sync most of the time.

<admon type="tip">

The `dvc commit` and `dvc checkout` commands (normally for
[versioning](#versioning-data)) let you force-sync them. This can be useful when
unexpected errors occur (e.g. cache corruption).

</admon>

To enable additional storage locations, you can configure [DVC remotes] with the
`dvc remote add` and `dvc remote modify` commands (see `dvc remote` for more
options). Once this is done, use the `dvc push` and `dvc pull` commands to
transfer data between the project and remote storage. This is the main mechanism
to share and back up your work.

![Sync ops among locations](/img/sync-ops-locations.png) _Data sync operations
among locations_

<admon type="tip">

`dvc fetch` transfers files downstream halfway -- from remote storage to the
<abbr>cache</abbr>. This can be useful to make sure that some data is available
for checkout later.

</admon>

<admon type="info">

Regardless of the name, "remotes" may be set up anywhere: local file systems,
external devices or network locations, and remote servers or cloud platforms.

</admon>

It's also possible to access and synchronize data assets one way from misc.
locations or from other DVC projects (e.g. [data registry] pattern). `dvc list`,
`dvc import` or `dvc import-url`, and `dvc update` are the main commands for
this.

[codify your data]: /doc/use-cases/versioning-data-and-models
[cache directory]: /doc/user-guide/data-management#the-data-cache
[protected]: /doc/command-reference/unprotect
[dvc remotes]: /doc/user-guide/data-management#remote-storage
[data registry]: /doc/use-cases/data-registry

## Versioning data

You may have noticed that most of the tracking and synchronization commands give
hints about `git` commands to follow DVC operations. That's because the unifying
aspect across DVC features (for data management and beyond) is [data
versioning].

<!--
commit(s)
checkout(s)
git ...
install
dvc diff
--rev
-->

[data versioning]: /doc/user-guide/data-management#data-versioning
