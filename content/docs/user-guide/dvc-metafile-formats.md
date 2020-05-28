# DVC Metafile Formats

There are two special metafiles created by certain
[DVC commands](/doc/command-reference):

- Files ending with the `.dvc` extension are basic placeholders to version data
  files and directories. A <abbr>DVC project</abbr> can have multiple
  [`.dvc` files](#dvc-files).
- The [`dvc.yaml` file](#dvcyaml-file) or _pipeline(s) file_ specifies stages
  that form the pipeline(s) of a project, and their connections (_dependency
  graph_ or DAG).

Both use human-friendly YAML schemas, described below. We encourage you to get
familiar with them so you may edit them freely, as needed. Both type of files
should be versioned with Git (for Git-enabled <abbr>repositories</abbr>).

> See the [Syntax Highlighting](/doc/install/plugins) to learn how to enable the
> highlighting for your editor.

## .dvc files

When you add a file or directory to a <abbr>DVC project</abbr> with `dvc add` or
`dvc import`, a `.dvc` file is created based on the data file name (e.g.
`data.xml.dvc`). These files contain the basic information needed to track the
data with DVC.

They use a simple YAML format that can be easily written or altered manually.
Here is a sample:

```yaml
outs:
  - md5: a304afb96060aad90176268345e10355
    path: data.xml
# Manual comments can be added in.
```

`.dvc` files contain a single top field:

- `outs` - list of <abbr>outputs</abbr> for this `.dvc` file

An output entry can consist of these fields:

- `md5` - hash value for the output file
- `path` - path to the output in the <abbr>workspace</abbr>, relative to the
  location of the `.dvc` file
- `cache` - (optional) whether or not DVC should cache the output. `true` by
  default

Note that comments can be added to DVC metafiles using the `# comment` syntax.

> `.dvc` file comments are preserved among executions of the `dvc repro` and
> `dvc commit` commands, but not when a `.dvc` file is overwritten by
> `dvc add`,`dvc import`, or `dvc import-url`.

## dvc.yaml file

When you add commands to a pipeline with `dvc run`, the `dvc.yaml` file is
created or updated. Here's a simple example:

```yaml
stages:
  firstone:
    cmd: python cmd.py input.data output.data metrics.json
    deps:
    - cmd.py
    - input.data
    outs:
    - output.data
    metrics:
    - metrics.json
  nextone:
    cmd: python ...
    ...
```

`dvc.yaml` files consists of a group of `stages` with names provided explicitly
by the user with the `--name` (`-n`) option of `dvc run`. Each stage can contain
the following fields:

- `cmd` - executable command defined in this stage
- `deps` - list of <abbr>dependencies</abbr> for this stage
- `params` - (optional) list of the [parameter](/doc/command-reference/params)
  names and their current values
- `outs` - list of <abbr>outputs</abbr> for this stage
- `metric` - (optional) list of [metric](/doc/command-reference/metrics) files
- `locked` - (optional) whether or not this stage is locked from reproduction
- `always_changed` (optional) - whether or not this stage is considered as
  changed by commands such as `dvc status` and `dvc repro`. `false` by default

A dependency entry consists of a these possible fields:

- `path`: Path to the dependency, relative to the `wdir` path (always present)
- `md5`: MD5 hash for the dependency (most [stages](/doc/command-reference/run))
- `etag`: Strong ETag response header (only HTTP <abbr>external
  dependencies</abbr> created with `dvc import-url`)
- `repo`: This entry is only for external dependencies created with
  `dvc import`, and can contains the following fields:

  - `url`: URL of Git repository with source DVC project
  - `rev`: Only present when the `--rev` option of `dvc import` is used.
    Specific commit hash, branch or tag name, etc. (a
    [Git revision](https://git-scm.com/docs/revisions)) used to import the
    dependency from.
  - `rev_lock`: Git commit hash of the external <abbr>DVC repository</abbr> at
    the time of importing or updating (with `dvc update`) the dependency.

  > See the examples in
  > [External Dependencies](/doc/user-guide/external-dependencies) for more
  > info.

An output entry consists of these fields:

- `md5` - hash value for the output file
- `path` - path to the output in the <abbr>workspace</abbr>, relative to the
  location of the `.dvc` file
- `cache` - (optional) whether or not DVC should cache the output. `true` by
  default

Metrics entries can contain these fields:

- `type`: Type of the metric file (`json`)
- `xpath`: Path within the metric file to the metrics data(e.g. `AUC.value` for
  `{"AUC": {"value": 0.624321}}`)

`dvc.yaml` files also support `# comments`.

> `dvc.yaml` comments are preserved among executions of `dvc run`, `dvc repro`,
> and `dvc commit`.
