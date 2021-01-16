# DVC Files

DVC has a few special YAML 1.2 file formats that support its features:

- Files ending with the `.dvc` extension ("dot DVC files") are placeholders to
  track data files and directories. A <abbr>DVC project</abbr> usually has one
  `.dvc` file per data file or directory being tracked.
- `dvc.yaml` files (or _pipelines files_) specify stages that form the
  pipeline(s) of a project, and how they connect (_dependency graph_ or DAG).

  These normally have a matching `dvc.lock` file to record the pipeline state
  and track its <abbr>outputs</abbr>.

> Note that all these metafiles are meant to be versioned with Git (in
> Git-enabled <abbr>repositories</abbr>).

Both `.dvc` files and `dvc.yaml` use human-friendly schemas, described in this
section. We encourage you to get familiar with them so you may modify, write, or
generate them on your own.

### Related guides

See [DVC Internals](/doc/user-guide/dvc-internals) for the contents of the
`.dvc/` directory.

[`.dvcignore`](/doc/user-guide/dvcignore) files let you exclude files or
directories from DVC operations.

💡 Refer to [How to Merge Conflicts](/doc/user-guide/how-to/merge-conflicts) for
tips on managing DVC files with Git.
