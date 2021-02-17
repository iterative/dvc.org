---
name: 'Stage'
match: ['stage', 'stages']
tooltip: >-
  A single step in a pipeline which may import data, run experiments and produce
  some (intermediate or final) output. Stages may depend other stages and they
  can be automatically invalidated when their dependencies change.
---
