# Using DVC Commands

DVC is a command-line tool. The typical use case for DVC goes as follows

- In an existing Git repository, initialize a DVC repository with `dvc init`.
- Copy source files for modeling into the repository and convert the files into
  DVC data files with `dvc add` command.
- Process source data files through your data processing and modeling code using
  the `dvc run` command.
- Use `--outs` option to specify `dvc run` command outputs which will be
  converted to DVC data files after the code runs.
- Clone a git repo with the code of your ML application pipeline. However, this
  will not copy your DVC cache. Use cloud storage settings and `dvc push` to
  share the cache (data).
- Use `dvc repro` to quickly reproduce your pipeline on a new iteration, after
  your data item files or source code of your ML application are modified.
