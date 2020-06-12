---
name: 'External Dependency'
match: ['external dependency', 'external dependencies']
---

A stage dependency (`dep` field in [`dvc.yaml`](/doc/user-guide/dvc-file-format)
or in an [import stage](/doc/command-reference/import) `.dvc` file) with origin
in an external source, for example HTTP, SSH, Amazon S3, Google Cloud Storage
remote locations, or even other DVC repositories. See
[External Dependencies](/doc/user-guide/external-dependencies).
