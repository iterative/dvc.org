# Using DVC Commands

DVC is a command line tool. For a listing of commands run `dvc -h`.

The typical DVC workflow goes as follows:

- In an existing Git repository, initialize a <abbr>DVC project</abbr> with
  `dvc init`.
- Copy data files or dataset directories for modeling into the repository, and
  track them with DVC using the `dvc add` command.
- Process raw data with your own source code, using `dvc.yaml` and/or the
  `dvc run` command, specifying further <abbr>outputs</abbr> that should also be
  tracked by DVC after the code is executed.
- Sharing a <abbr>DVC repository</abbr> with the codified ML
  [pipeline](/doc/command-reference/dag) will not include the project's
  <abbr>cache</abbr>. Use [remote storage](/doc/command-reference/remote) and
  `dvc push` to share this cache (data tracked by DVC).
- Use `dvc repro` to automatically reproduce your full pipeline iteratively as
  input data or source code change.

> 💡 To run any DVC command in a different directory, use
> `dvc --cd <path> command`.

These command references provide a precise specification, complete description,
and isolated usage examples for the `dvc` CLI tool. These are our most technical
documentation pages, similar to
[man-pages](https://www.kernel.org/doc/man-pages/) in Linux.
