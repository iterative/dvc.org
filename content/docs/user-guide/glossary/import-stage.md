---
name: 'Import Stage'
match: ['import stage', 'import stages', 'imports']
---

`.dvc` file created with `dvc import` or `dvc import-url`, which represents a
file or directory from an external source. It has an external dependency (the
data source), an implicit download command, and the imported data itself as
output.
