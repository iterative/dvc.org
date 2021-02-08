---
name: 'Dependency'
match: ['dependency', 'dependencies']
tooltip: >-
    A file or directory in a <abbr>pipeline</abbr> that is used as an input to a
    stage. Dependencies are listed `deps` section of `dvc.yaml` or `.dvc` file.
description: >-
    A file or directory in a <abbr>pipeline</abbr> that is used as an input to a
    stage. Dependencies are listed `deps` section of `dvc.yaml` or `.dvc` file.
---

# Dependency

A file or directory in a <abbr>pipeline</abbr> that is used as an input to a
stage. Dependencies are listed `deps` section of `dvc.yaml` or `.dvc` file.
(See `dvc run`)

When a <abbr>stage</abbr> is run, it is considered valid if **none** of the
dependencies are changed after previous run. If a dependency of a
<abbr>stage</abbr> is changed, the stage is considered invalid and outdated. In
this case DVC runs the stage again when running the pipeline. 

A dependency can be internal or external. Internal dependencies are found
within the <abbr>workspace</abbr> and <abbr>external dependencies</abbr> are in
other locations like <abbr>remotes</abbr>.



