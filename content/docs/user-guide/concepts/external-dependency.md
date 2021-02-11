---
name: 'External Dependency'
match: ['external dependency', 'external dependencies']
tooltip: >-
  External dependency is a dependency for a stage which points to an external
  (remote) resource outside of the workspace.
  [📖](/doc/user-guide/concepts/external-dependency)
---

# External Dependency

A <abbr>dependency</abbr> for a <abbr>stage</abbr> which points to an external
(remote) resource outside of the <abbr>workspace</abbr>. It is tracked with a
`.dvc` file and <abbr>cached</abbr> during experiment runs.

An external dependency can be added with `dvc import` or `dvc import-url`
command. by adding it to `deps` section of `dvc.yaml`. It can refer to an HTTP,
Amazon S3, SSH, Google Cloud Storage or similar locations or other DVC
repositories.

Note that _dependency_ and <abbr>output</abbr> describe the _roles_ of a file
with respect to a stage. A file can be a dependency to stage, output of another
stage or neither if it's not involved in a pipeline. _External_ and _internal_
are orthogonal attributes to this role and shows whether the file is located in
local `.dvc/cache` or not. External storage locations are defined and managed by
`dvc remote`.

## Further Reading

- [External Dependencies](/doc/user-guide/external-dependencies) in the User's
  Guide.
