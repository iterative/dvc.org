---
name: 'Stage'
match: ['stage', 'stages']
tooltip: >-
  A stage is a single unit of execution in a pipeline that produces some
  (intermediate or final) output.
---

# Stage

A stage is a single unit of execution in a <abbr>pipeline</abbr> that takes some
input and produces some <abbr>output</abbr>. A stage is defined by its
<abbr>dependencies</abbr>, its command and its <abbr>outputs</abbr>.

Stages that depend on other stages can be invalidated by the change in their
dependencies. A stage may have multiple dependencies, multiple commands and
multiple outputs. A stage can also have <abbr>parameter</abbr> dependencies to
represent model hyperparameters and similar changes during execution.

A stage may also represent an <abbr>import</abbr> from outside sources.

## Further Reading

- `dvc run` command reference
