# Data Versioning

<admon type="tip">

**Data version control** is the unifying trait across DVC features.

</admon>

DVC enables [version control] for data science. But DVC does not actually
implement versioning directly! Instead, DVC focuses on [codifying your data]:
generating small [metafiles] that you can handle with standard [Git workflows]
(commits, branching, pull requests, etc.).

![Versioned ML project](/img/versioned-project.png) _Navigate versions with Git
commits_

The resulting projects are neatly organized in the "space dimension", having
only the files and directories needed at the time and without complicated, ad
hoc file names like `2022-10-20_linear-model_v2-Carl`. Project versions live in
the "time dimension" ([Git history]). Here's a more concrete example:

[version control]:
  https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control
[codifying your data]: /doc/use-cases/versioning-data-and-models

<!-- [codifying your data]: #separating-data-from-code-codification -->

[metafiles]: /doc/user-guide/project-structure
[git workflows]: https://www.atlassian.com/git/tutorials/comparing-workflows
[git history]:
  https://git-scm.com/book/en/v2/Git-Basics-Viewing-the-Commit-History

## Organization and optimization

DVC helps you keep a clean project directory by [caching your data] separate
from code and configuration (including DVC metafiles). The same mechanisms
[optimize] space and time.

<cards>

<card heading="Traditional">

```cli
data_v0/      300M
├── file_1
├── ...
└── file_100

data_v1/      1.7G
├── file_1
├── ...
└── file_700

data_v1.0.3/  1.8G
├── file_1
├── ...
└── file_800

TOTAL   1600f 3.8G
```

<admon type="warn">

Datasets overlap in your project.

</admon>

</card>

<card heading="With DVC">

```cli
$ git checkout v0..n
$ dvc checkout
```

```cli
data.dvc    # v0
data/       100f  300M
```

```cli
data.dvc    # v1
data/       700f  1.7G
```

```cli
data.dvc    # v2
data/       800f  1.8G

.dvc/cache  827f  3.5G
```

<admon type="info">

<abbr>Caching</abbr> de-duplicates all files.

[dvc cache]:
  /doc/user-guide/project-structure/internal-files#structure-of-the-cache-directory

</admon>

</card>

</cards>

[caching your data]:
  /doc/user-guide/project-structure/internal-files#structure-of-the-cache-directory
[optimize]: /doc/user-guide/data-management/large-dataset-optimization

<!-- ## Cloud versioning

_New in DVC 2.30.0 (see `dvc version`)_

To simplify remote data operations, DVC now supports native versioning of files
and directories on several cloud providers. This means that you can browse your
files normally as you would see them in your local workspace.
-->

<!-- ## Separating data from code (codification)

DVC replaces large files and directories with small [metafiles] that describe
the assets. We call this _data codification_. Data files are moved to a separate
<abbr>cache</abbr> but kept virtually (linked) in the workspace. This separates
your data from code (including metafiles).

![]() _Cache structure?_

<admon type="tip">

This also allows you to version project files with Git, a battle-tested [SCM]
tool.

[scm]: https://www.atlassian.com/git/tutorials/source-code-management

</admon>

Your experience can stay consistent because DVC works [indirectly], by checking
the metafiles and [configuration] of your <abbr>project</abbr> to find out where
and how to handle files. This is transparent to you as user, but it's important
to understand the mechanics in general.

<!-- [codifying your data]: /doc/use-cases/versioning-data-and-models -/->
[indirectly]: https://en.wikipedia.org/wiki/Indirection
[configuration]: /doc/command-reference/config
-->

To learn more about [data management], click the `Next` button below ↘

[data management]: /doc/user-guide/data-management
