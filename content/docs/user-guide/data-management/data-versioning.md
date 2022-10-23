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

## Project configuration

Besides metafiles, <abbr>DVC projects</abbr> may contain a config file
(`.dvc/config`) that can also be treated as code when it comes to version
control.

<admon icon="book">

See `dvc config` for more information on DVC config.

</admon>

Some times it's important to version configuration changes along with
corresponding data updates. Most notably, if you [set up remote storage] and
`dvc push` data for others to `dvc pull` later, you should `git commit` both the
metafile(s) and `.dvc/config` to the repo.

Advanced situations where this is may also be necessary:

- When migrating to a [shared cache]
- If you enable `dvc cache hydra` and then create an [experiment queue] with
  [param composition] to run from another environment

[set up remote storage]:
  /doc/user-guide/data-management/remote-storage#configuration
[shared cache]: doc/user-guide/how-to/share-a-dvc-cache
[experiment queue]:
  /doc/user-guide/experiment-management/running-experiments#the-experiments-queue
[param composition]: /doc/user-guide/experiment-management/hydra-composition
