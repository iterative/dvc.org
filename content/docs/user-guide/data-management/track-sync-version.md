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
from Git, moves it to the <abbr>cache</abbr>, [links it] back to the
<abbr>workspace</abbr>, and creates an accompanying `.dvc` file (visible to
Git). Now your code (including DVC metafiles) is physically separated from your
data!

<admon type="info">

`.dvc` files can be tracked (and versioned) with Git directly. This ties
everything together (more about this in [Versioning data](#versioning-data)
below).

</admon>

To check what's happening with the data in your project, use `dvc data status`.
This will list changes to DVC-tracked data as well as files unknown to DVC (or
Git).

To capture changes to tracked data, `dvc add` it again. Alternatively,
`dvc commit` will also do the trick. This caches the latest data present in the
workspace and updates `.dvc` files accordingly (changes visible to Git). If you
need to move or rename tracked data without content changes, use `dvc move`.

Finally, to stop tracking data, use `dvc remove`. To also remove it from the
cache (either the latest or historic versions), use `dvc gc`. See [more
details].

<admon type="tip">

Other commands related to tracking data: `dvc unprotect`, `dvc import`, and
`dvc import-url`.

</admon>

[similar to git]:
  https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository
[links it]: /doc/user-guide/data-management/large-dataset-optimization
[more details]: /doc/user-guide/how-to/stop-tracking-data

## Synchronizing data

...

<!--
remote add, modify, etc.
push
fetch
pull
-->

## Versioning data

...

<!--
dvc diff
-->
