# Using DVC Commands

DVC is a command-line tool. The typical use case for DVC goes as follows:

- In an existing Git repository, initialize a <abbr>DVC project</abbr> with
  `dvc init`.
- Copy source code files for modeling into the repository and track the files
  with DVC using the `dvc add` command.
- Process raw data with your own data processing and modeling code using the
  `dvc run` command, using the `--outs` option to outputs which will also be
  tracked by DVC after the code is executed.
- Sharing a Git repository with the source code of your ML
  [pipeline](/doc/commands-reference/pipeline) will not include the project's
  <abbr>cache</abbr>. Use [remote storage](/doc/commands-reference/remote) and
  `dvc push` to share this cache (data tracked by DVC).
- Use `dvc repro` to automatically reproduce your full pipeline, iteratively as
  input data or source code change.
