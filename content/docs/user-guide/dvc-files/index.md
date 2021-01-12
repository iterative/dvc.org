# DVC Files

There are a few special DVC file formats that enable its features:

- Files ending with the `.dvc` extension ("dot DVC files") are placeholders to
  track data files and directories. A <abbr>DVC project</abbr> usually has one
  `.dvc` file per large data file or directory being tracked.
- `dvc.yaml` files (or _pipelines files_) specify stages that form the
  pipeline(s) of a project, and how they connect (_dependency graph_ or DAG).

  These normally have a matching `dvc.lock` file to record the pipeline state
  and track its <abbr>outputs</abbr>.

Both `.dvc` files and `dvc.yaml` use human-friendly YAML 1.2 schemas, described
below. We encourage you to get familiar with them so you may create, generate,
and edit them on your own.

These metafiles should be versioned with Git (in Git-enabled
<abbr>repositories</abbr>).

See [DVC Internals](/doc/user-guide/dvc-internals) for the contents of the
`.dvc/` directory.

See also [`.dvcignore`](/doc/user-guide/dvcignore).
