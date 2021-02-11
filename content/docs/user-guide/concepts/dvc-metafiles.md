---
name: 'DVC Metafiles'
match: ['DVC files', 'files', 'directories']
tooltip: >-
  Files used by DVC to track the changes in <abbr>workspace</abbr>. They can be
  placeholders for data files/directories or represent <abbr>pipelines</abbr>.
---

<!--
Mention codification? + link to /doc/use-cases/versioning-data-and-model-files
-->

# DVC Metafiles

Once initialized in a <abbr>project</abbr>, DVC populates its installation
directory (`.dvc/`) with a set of files needed for DVC operation. These are used
to track the changes in data and represent <abbr>pipelines</abbr>.

Files ending with the `.dvc` extension are placeholders to track data files and
directories. There is a `.dvc` file for each data file or directory being
tracked.

`*/dvc.yaml` files are used to represent <abbr>pipelines</abbr> in the
<abbr>project</abbr>. There may be multiple `dvc.yaml` files in different
directories to contain different pipelines.

`*.dvc` and `*/dvc.yaml` files use human-friendly YAML 1.2 schema.

`*.dvc` and `*/dvc.yaml` files should be tracked by Git in Git-enabled
repositories.

A `dvc.lock` file for each `dvc.yaml` records the pipeline state and track its
outputs. `dvc.lock` contains hash values for the <abbr>dependencies</abbr> and
<abbr>outputs</abbr>. It's a text file and can be checked in to Git but manual
edits to this file are not recommended.

A <abbr>DVC project</abbr> can be created using only `*.dvc` and `dvc.yaml`
files without checking in any other large files. These files are enough to
represent data, pipelines and artifacts of a project, hence can be used to
reproduce and distribute a full ML project without attaching large data or model
files.

## Further Reading

- [Versioning Data and Model Files](/doc/use-cases/versioning-data-and-model-files)
- [`.dvc` files specification](/doc/user-guide/project-structure/dvc-files)
- [Internal Files](/doc/user-guide/project-structure/internal-files)
- [Pipelines Files](/doc/user-guide/project-structure/pipelines-files)
