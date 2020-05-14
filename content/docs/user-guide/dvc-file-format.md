# DVC-File Format

When you add a file (with `dvc add`) or a command (with `dvc run`) to a
[pipeline](/doc/command-reference/pipeline), DVC creates a special text metafile
with the `.dvc` file extension (e.g. `process.dvc`), or with the default name
`Dvcfile`. These **DVC-files** (a.k.a. stage files) contain all the needed
information to track your data and reproduce pipeline stages. The file itself
contains a simple YAML format that could be easily written or altered manually.

See the [Syntax Highlighting](/doc/install/plugins) to learn how to enable the
highlighting for your editor.

Here is a sample DVC-file:

```yaml
always_changed: true
locked: true
cmd: python cmd.py input.data output.data metrics.json
deps:
  - md5: da2259ee7c12ace6db43644aef2b754c
    path: cmd.py
  - md5: e309de87b02312e746ec5a500844ce77
    path: input.data
md5: 521ac615cfc7323604059d81d052ce00
outs:
  - cache: true
    md5: 70f3c9157e3b92a6d2c93eb51439f822
    metric: false
    path: output.data
  - cache: false
    md5: d7a82c3cdfd45c4ace13484a931fc526
    metric:
      type: json
      xpath: AUC
    path: metrics.json

# Comments like this line persist through multiple executions of
# dvc repro/commit but not through dvc run/add/import-url/get-url commands.

meta: # Special field to contain arbitary user data
  name: John
  email: john@xyz.com
```

## Structure

On the top level, `.dvc` file consists of these possible fields:

- `cmd`: Executable command defined in this stage
- `wdir`: Directory to run command in (default `.`)
- `md5`: MD5 hash for this DVC-file
- `deps`: List of dependencies for this stage
- `outs`: List of <abbr>outputs</abbr> for this stage
- `locked`: Whether or not this stage is locked from reproduction
- `always_changed`: Whether or not this stage is considered as changed by
  commands such as `dvc status` and `dvc repro` (default `false`)

A dependency entry consists of a these possible fields:

- `path`: Path to the dependency, relative to the `wdir` path (always present)
- `md5`: MD5 hash for the dependency (most [stages](/doc/command-reference/run))
- `etag`: Strong ETag response header (only HTTP <abbr>external
  dependencies</abbr> created with `dvc import-url`)
- `params`: If this is a [parameter dependency](/doc/command-reference/params)
  file, contains a list of the parameter names and their current values.
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

- `path`: Path to the output, relative to the `wdir` path
- `md5`: MD5 hash for the output
- `cache`: Whether or not DVC should cache the output
- `metric`: If this file is a [metric](/doc/command-reference/metrics), contains
  the following fields:

  - `type`: Type of the metric file (`json`)
  - `xpath`: Path within the metric file to the metrics data(e.g. `AUC.value`
    for `{"AUC": {"value": 0.624321}}`)

A `meta` entry consists of `key: value` pairs such as `name: John`. A meta entry
can have any valid YAML structure containing any number of attributes.
`"meta: string"` is also possible, it doesn't need to contain a _hash_ structure
(a.k.a. dictionary) always.

Comments can be added to the DVC-file using `# comment` syntax. Comments and
meta values are preserved among executions of the `dvc repro` and `dvc commit`
commands.

> Note that comments and meta values are not preserved when a DVC-file is
> overwritten with the `dvc run`,`dvc add`,`dvc import`, and `dvc import-url`
> commands.
