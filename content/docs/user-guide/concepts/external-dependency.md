---
name: 'External Dependency'
match: ['external dependency', 'external dependencies']
---

# External Dependency

A <abbr>dependency</abbr> for a <abbr>stage</abbr> which points to an external
resource. It is tracked with a `.dvc` file and <abbr>cached</abbr>. External
dependencies are not checked for change and considered always
<abbr>frozen</abbr>.

An external dependency can be added with `dvc import` or `dvc import-url`
command. by adding it to `deps` section of `dvc.yaml`. It can refer to an HTTP,
Amazon S3, SSH, Google Cloud Storage or similar locations, or even other DVC
repositories. See
[External Dependencies](/doc/user-guide/external-dependencies).
