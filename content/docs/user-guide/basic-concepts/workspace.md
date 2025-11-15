# Workspace

Setting up an effective data science project structure can be challenging. Do
you organize ML models in nested directory trees, link large datasets from
different locations, identify variations with ad hoc filename conventions?
Adding versioning needs and dependency management can easily turn this near
impossible.

A <abbr>DVC project</abbr> structure is simplified by encapsulating [data
versioning] and [pipelining] (e.g. machine learning workflows), among other
features. This leaves a _workspace_ directory with a clean view of your working
raw data, source code, data artifacts, etc. and a few
[metafiles](/user-guide/project-structure) that enable these features. A single
version of the project is visible at a time.

[data versioning]: /start/data-management/data-versioning
[pipelining]: /start/data-management/data-pipelines

<admon type="info">

The DVC workspace is analogous to the [working tree] in Git.

[working tree]: https://git-scm.com/docs/gitglossary#def_working_tree

</admon>

Files and directories in the workspace can be added to DVC (`dvc add`), or they
can be downloaded from external sources (`dvc get`, `dvc import`,
`dvc import-url`). Changes to the data, notebooks, models, and any related
machine learning artifact can be tracked (`dvc commit`), and their content can
be synchronized (`dvc checkout`). Tracked data can be removed (`dvc remove`)
from the workspace.

## Further Reading

- [Get Started](/start) with DVC
- DVC [Project Structure](/user-guide/project-structure)
