---
name: 'Stage'
match: ['stage', 'stages']
---

# Stage

A stage is a single unit of execution in a <abbr>pipeline</abbr> that takes
some input and produces an output. A stage is defined by its
<abbr>dependencies</abbr>, its command and its <abbr>outputs</abbr>. 

A stage may have multiple dependencies, multiple commands and multiple outputs.
A stage can also have <abbr>parameter dependencies</abbr> to represent model
hyperparameters and similar changes during execution. See `dvc run` for
defining a stage. 

A stage may also represent an <abbr>import</abbr> from outside sources.


