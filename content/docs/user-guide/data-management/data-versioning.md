# Data Versioning

DVC enables [version control] for data science. But DVC does not actually
implement versioning directly! Instead, DVC focuses on [codifying your data]:
generating small [metafiles] that you can handle with standard [Git workflows]
(commits, branching, pull requests, etc.).

The resulting projects are neatly organized in the "space dimension", having
only the files and directories needed at the time and without complicated, ad
hoc file names like `2022-10-20_linear-model_v2-Carl`. Project versions live in
the "time dimension" ([Git history]).

![Versioned ML project](/img/versioned-project.png) _Navigate versions with Git
commits_

**Data version control** is the unifying trait across DVC features (data
management and beyond).

<admon icon="book">

Refer to [Versioning Data and Models] to learn more.

[versioning data and models]: /doc/use-cases/versioning-data-and-models

</admon>

[version control]:
  https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control
[codifying your data]: /doc/use-cases/versioning-data-and-models
[metafiles]: /doc/user-guide/project-structure
[git workflows]: https://www.atlassian.com/git/tutorials/comparing-workflows
[git history]:
  https://git-scm.com/book/en/v2/Git-Basics-Viewing-the-Commit-History

<!--
## Cloud versioning

_New in DVC 2.30.0 (see `dvc version`)_

To simplify remote data operations, DVC now supports native versioning of files
and directories on several cloud providers. This means that you can browse your
files normally as you would see them in your local workspace.
-->
