---
name: 'DVC Metafiles'
match: ['DVC files', 'files', 'directories']
tooltip: >-
  'DVC [metafiles](/doc/user-guide/glossary/dvc-metafiles) tooltip...'
---

<!--
Mention codification? + link to /doc/use-cases/versioning-data-and-model-files
-->

# DVC Metafiles

<!-- _from dvc-files-and-directories_ -->

Once initialized in a <abbr>project</abbr>, DVC populates its installation
directory (`.dvc/`) with the
[internal directories and files](#internal-directories-and-files) needed for DVC
operation.

Additionally, there are a few metafiles that support DVC's features:

- Files ending with the `.dvc` extension are placeholders to track data files
  and directories. A <abbr>DVC project</abbr> usually has one `.dvc` file per
  large data file or directory being tracked.
- `dvc.yaml` files (or _pipelines files_) specify stages that form the
  pipeline(s) of a project, and how they connect (_dependency graph_ or DAG).

  These normally have a matching `dvc.lock` file to record the pipeline state
  and track its <abbr>outputs</abbr>.

Both `.dvc` files and `dvc.yaml` use human-friendly YAML 1.2 schemas, described
below. We encourage you to get familiar with them so you may create, generate,
and edit them on your own.

Both the internal directory and these metafiles should be versioned with Git (in
Git-enabled <abbr>repositories</abbr>).
