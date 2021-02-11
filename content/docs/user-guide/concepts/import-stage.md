---
name: 'Import Stage'
match: ['import stage', 'import stages', 'imports']
tooltip: >-
  Import stage is a <abbr>stage</abbr> where the <abbr>external
  dependencies</abbr> are imported to the workspace from <abbr>remotes</abbr>.
  [📖](/doc/user-guide/concepts/import-stage)
---

# Import Stage

`.dvc` file created with `dvc import` or `dvc import-url`, which represents a
file or directory from an external source. It has an external dependency (the
data source), an implicit download command, and the imported data itself as
output.

A Machine Learning or Data Science project usually depends on existing data.
This data should be imported to the <abbr>workspace</abbr> in order to
transform, analyze or train models. This importing step is reflected in DVC as
the import stage. It depends on external data and describes to download it.
Import stage becomes a dependency to later stages and allows to reproduce a
project from ground up.

Once imported the external data is not checked for change everytime. (Doing this
would require to download it on every occasion.) Instead `dvc update` command is
used to retrieve the most recent copy of an import stage.

Note that there are also `dvc get` and `dvc get-url` commands to retrieve any
files from remote locations. However these don't track the downloaded files and
`dvc update` doesn't update them.
