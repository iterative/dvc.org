# Using DVC Commands

The core of DVC is a command line tool. These pages contain the specifications,
self-contained descriptions, and comprehensive usage examples for `dvc`
commands. Use `dvc -h` to list them.

<admon type="tip">

To run DVC commands in a specific directory, use `dvc --cd <path> ...` before
the actual command and its options/arguments (this does not change directories
in your terminal).

</admon>

<admon type="tip">

**New!** DVC is also available [for the VS Code IDE], which adds many DVC
operations [to the Command Palette].

[for the vs code ide]: /doc/vs-code-extension
[to the command palette]:
  https://github.com/iterative/vscode-dvc#useful-commands

</admon>

## Typical DVC workflow

- Initialize a <abbr>DVC project</abbr> in a Git repo with `dvc init` or
  `dvc exp init`.
- Copy data files or dataset directories for modeling into the project and use
  `dvc add` to tell DVC to <abbr>cache</abbr> and track them.
- Create a simple `dvc.yaml` file to codify a data processing
  [pipeline](/doc/command-reference/dag). It uses your own source code and
  specifies further data <abbr>outputs</abbr> for DVC to control.
- Execute or restore any version of your pipeline using `dvc repro`, or
  experiment on it with `dvc exp` features.
- Sharing the <abbr>repository</abbr> will not include locally cached data. Use
  [remote storage](/doc/command-reference/remote) with `dvc push` and `dvc pull`
  to share data artifacts.
