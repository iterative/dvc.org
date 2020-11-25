# Using DVC Commands

DVC is a command line tool. Here we provide the specifications, complete
descriptions, and comprehensive usage examples for `dvc` commands. For a list of
commands, type `dvc -h`.

💡 To execute any DVC command in a different directory, use
`dvc --cd <path> ...` before the actual command and it's options/arguments (this
does not change directories in your terminal).

## Typical DVC workflow

- In an existing Git repository, initialize a <abbr>DVC project</abbr> with
  `dvc init`.
- Copy data files or dataset directories for modeling into the repository, and
  track them with DVC using the `dvc add` command.
- Process the data with your own source code, using `dvc.yaml` and/or the
  `dvc run` command, specifying further <abbr>outputs</abbr> that should also be
  tracked by DVC after the code is executed.
- Sharing a <abbr>DVC repository</abbr> with the codified data
  [pipeline](/doc/command-reference/dag) will not include the project's
  <abbr>cache</abbr>. Use [remote storage](/doc/command-reference/remote) and
  `dvc push` to share this cache (data tracked by DVC).
- Use `dvc repro` to automatically reproduce your full pipeline iteratively as
  input data or source code change.
