# Using DVC Commands

DVC is a command line tool. Here we provide the specifications, complete
descriptions, and comprehensive usage examples for `dvc` commands. For a list of
commands, type `dvc -h`.

💡 To execute any DVC command in a different directory, use
`dvc --cd <path> ...` before the actual command and its options/arguments (this
does not change directories in your terminal).

## Typical DVC workflow

- Initialize a <abbr>DVC project</abbr> in a Git repo with `dvc init`.
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
