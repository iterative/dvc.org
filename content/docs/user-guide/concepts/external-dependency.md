---
name: 'External Dependency'
match: ['external dependency', 'external dependencies']
tooltip: >-
  External dependency is a <abbr>dependency</abbr> for a <abbr>stage</abbr>
  which points to an external resource outside of the workspace.
---

# External Dependency

A <abbr>dependency</abbr> for a <abbr>stage</abbr> which points to an external
resource outside of <abbr>workspace</abbr>. It is tracked with a `.dvc` file and
<abbr>cached</abbr> during experiment runs. External dependencies are not
checked for change and considered always <abbr>frozen</abbr>.

An external dependency can be added with `dvc import` or `dvc import-url`
command. by adding it to `deps` section of `dvc.yaml`. It can refer to an HTTP,
Amazon S3, SSH, Google Cloud Storage or similar locations or other DVC
repositories. For detailed information see
[External Dependencies](/doc/user-guide/external-dependencies).
