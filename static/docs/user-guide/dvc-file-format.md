# DVC-File Format

When you add a file (with `dvc add`) or a command (with `dvc run`) to a
[pipeline](/doc/get-started/pipeline), DVC creates a special text metafile with
the `.dvc` file extension (e.g. `process.dvc`), or with the default name
`Dvcfile`. DVC-files a.k.a. **stage files** contain all the needed information
to track your data and reproduce pipeline stages. The file itself contains a
simple YAML format that could be easily written or altered manually.

Check the [Syntax Highlighting](/doc/user-guide/plugins) to enable the
highlighting for your editor.

Here is an example of a DVC-file:

```yaml
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
locked: True

# Comments like this line persist through multiple executions of
# dvc repro/commit but not through dvc run/add/import commands.

 meta: # Special key to contain arbitary user data
  name: John
  email: john@xyz.com
```

## Structure

On the top level, `.dvc` file consists of such fields:

- `cmd`: a command that is being run in this stage;
- `deps`: a list of dependencies for this stage;
- `outs`: a list of outputs for this stage;
- `md5`: md5 checksum for this DVC-file;
- `locked`: whether or not this stage is locked from reproduction;
- `wdir`: a directory to run command in (default `.`);

A dependency entry consists of such fields:

- `path`: path to the dependency, relative to the `wdir` path;
- `md5`: md5 checksum for the dependency;

An output entry consists of such fields:

- `path`: path to the output, relative to the `wdir` path;
- `md5`: md5 checksum for the output;
- `cache`: whether or not dvc should cache the output;
- `metric`: whether or not this file is a metric file;

A metric entry consists of such fields:

- `type`: type of the metrics file (e.g. raw/json/tsv/htsv/csv/hcsv);
- `xpath`: path within the metrics file to the metrics data(e.g. `AUC.value` for
  `{"AUC": {"value": 0.624321}}`);

A `meta` entry consists of `key: value` pairs such as `name: John`. A meta entry
can have any valid YAML structure containing any number of attributes.
`"meta: string"` is also possible, it doesn't need to contain a hash (a.k.a.
dictionary) structure always.

Comments can be added to the DVC-file using `# comment` syntax. Comments and
meta values are preserved between multiple executions of `dvc repro` and
`dvc commit` commands.

> Note that comments and meta values are not preserved when a DVC-file is
> overwritten with the `dvc run`,`dvc add`,`dvc import-url` commands.
