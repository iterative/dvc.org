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

A `dvc.yaml` file is used to represent <abbr>pipelines</abbr> in the
<abbr>project</abbr>. `.dvc` and `dvc.yaml` files use human-friendly YAML 1.2
schema.

A `dvc.lock` file for each <abbr>DVC project</abbr> records the pipeline state
and track its outputs.

These files should be versioned by Git in Git-enabled repositories.
