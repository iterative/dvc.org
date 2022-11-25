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
the "time dimension" ([Git history]).Here's a more concrete example:

[version control]:
  https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control
[codifying your data]: /doc/use-cases/versioning-data-and-models
[metafiles]: /doc/user-guide/project-structure
[git workflows]: https://www.atlassian.com/git/tutorials/comparing-workflows
[git history]:
  https://git-scm.com/book/en/v2/Git-Basics-Viewing-the-Commit-History

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

<!-- ## Cloud versioning

_New in DVC 2.30.0 (see `dvc version`)_

To simplify remote data operations, DVC now supports native versioning of files
and directories on several cloud providers. This means that you can browse your
files normally as you would see them in your local workspace.
-->
