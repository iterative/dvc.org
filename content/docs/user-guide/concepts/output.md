---
name: Output
match: [output, outputs]
tooltip: >-
  A file, directory or metric produced as a result of a stage. It can also mean artifacts added to the project. 
---

# Output

A file, directory, <abbr>metric</abbr> or <abbr>plot</abbr> produced as a
_result_ of a <abbr>stage</abbr>. (cf. <abbr>dependency</abbr>). A stage may
have multiple outputs which in turn can be a dependency to other stages in a
<abbr>pipeline</abbr>.

Outputs are recorded in `outs` section of `dvc.yaml` or `.dvc` file.

Any file or directory added to <abbr>project</abbr> with `dvc add` is considered
an output. In the most basic case, a file is an output of itself.

A file or directory added to the <abbr>repository</abbr> using `dvc import`
as an <abbr>external dependency</abbr> can also be considered an output of
another repository.

A file or directory defined with `-o` or `-O` options of `dvc run` is considered
an output of that <abbr>stage</abbr>.

Outputs and dependencies of a <abbr>pipeline</abbr> can be explicitly reported
by `dvc dag` using its `--outs` parameter.
