---
name: 'Frozen Dependency'
match: ['frozen dependency', 'frozen dependencies']
tooltip: >-
  A frozen <abbr>dependency</abbr> is considered _not changed_ for a
  <abbr>stage</abbr> even if it has changed. A stage that depends only to frozen
  dependencies is not run.
---

# Frozen Dependency

A frozen <abbr>dependency</abbr> is considered _not changed_ for a
<abbr>stage</abbr> even if it has changed. A stage that depends only to frozen
dependencies is not run.

Typically <abbr>import stages</abbr> produce frozen dependencies. A dependency
can be explicitly frozen by `dvc freeze` and unfrozen by `dvc unfreeze`. It is
also possible to change `frozen` parameter of dependencies in `dvc.yaml`
manually.
