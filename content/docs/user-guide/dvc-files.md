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

See the [internals guide](/doc/user-guide/dvc-internals) for the contents of the
`.dvc/` directory.

> See also [`.dvcignore`](/doc/user-guide/dvcignore).

## `.dvc` files

When you add a file or directory to a <abbr>DVC project</abbr> with `dvc add`,
`dvc import`, or `dvc import-url`, a `.dvc` file is created based on the data
file name (e.g. `data.xml.dvc`). These files contain the information needed to
track the data with DVC.

They use a simple [YAML](https://yaml.org/) format, meant to be easy to read,
edit, or even created manually. Here is a sample:

```yaml
outs:
  - md5: a304afb96060aad90176268345e10355
    path: data.xml
    desc: Cats and dogs dataset

# Comments and user metadata are supported.
meta:
  name: 'John Doe'
  email: john@doe.com
```

`.dvc` files can contain the following fields:

- `outs` (always present): List of [output entries](#output-entries) (details
  below) that represent the files or directories tracked with DVC. Typically
  there is only one (but several can be added or combined manually).
- `deps`: List of [dependency entries](#dependency-entries) (details below).
  Only present when `dvc import` or `dvc import-url` are used to generate this
  `.dvc` file. Typically there is only one (but several can be added manually).
- `wdir`: Working directory for the `outs` and `deps` paths (relative to the
  `.dvc` file's location). If this field is not present explicitly, it defaults
  to `.` (the `.dvc` file's location).
- `md5`: (only for <abbr>imports</abbr>) MD5 hash of the import `.dvc` file
  itself.
- `meta` (optional): Arbitrary metadata can be added manually with this field.
  Any YAML contents is supported. `meta` contents are ignored by DVC, but they
  can be meaningful for user processes that read `.dvc` files.

Note that comments can be added to `.dvc` files using the `# comment` format.
`meta` fields and `#` comments are preserved among executions of the `dvc repro`
and `dvc commit` commands, but not when a `.dvc` file is overwritten by
`dvc add`, `dvc move`, `dvc import`, or `dvc import-url`.

### Output entries

`outs` fields can contain these subfields:

- `path`: Path to the file or directory (relative to `wdir` which defaults to
  the file's location)
- `md5`, `etag`, or `checksum`: Hash value for the file or directory being
  tracked with DVC. MD5 is used for most locations (local file system and SSH);
  [ETag](https://en.wikipedia.org/wiki/HTTP_ETag#Strong_and_weak_validation) for
  HTTP, S3, or Azure [external outputs](/doc/user-guide/managing-external-data);
  and a special _checksum_ for HDFS and WebHDFS.
- `size`: Size of the file or directory (sum of all files).
- `nfiles`: If this output is a directory, the number of files inside
  (recursive).
- `isexec`: Whether this is an executable file. DVC preserves execute
  permissions upon `dvc checkout` and `dvc pull`. This has no effect on
  directories, or in general on Windows.
- `cache`: Whether or not this file or directory is <abbr>cached</abbr> (`true`
  by default, if not present). See the `--no-commit` option of `dvc add`.
- `persist`: Whether the output file/dir should remain in place while
  `dvc repro` runs. By default outputs are deleted when `dvc repro` starts (if
  this value is not present).
- `desc` (optional): User description for this output. This doesn't affect any
  DVC operations.

### Dependency entries

`deps` fields can contain these subfields:

- `path`: Path to the dependency (relative to `wdir` which defaults to the
  file's location)
- `md5`, `etag`, or `checksum`: Hash value for the file or directory being
  tracked with DVC. MD5 is used for most locations (local file system and SSH);
  [ETag](https://en.wikipedia.org/wiki/HTTP_ETag#Strong_and_weak_validation) for
  HTTP, S3, or Azure <abbr>external dependencies</abbr>; and a special
  _checksum_ for HDFS and WebHDFS. See `dvc import-url` for more information.
- `size`: Size of the file or directory (sum of all files).
- `nfiles`: If this dependency is a directory, the number of files inside
  (recursive).
- `repo`: This entry is only for external dependencies created with
  `dvc import`, and can contains the following fields:

  - `url`: URL of Git repository with source DVC project
  - `rev`: Only present when the `--rev` option of `dvc import` is used.
    Specific commit hash, branch or tag name, etc. (a
    [Git revision](https://git-scm.com/docs/revisions)) used to import the
    dependency from.
  - `rev_lock`: Git commit hash of the external <abbr>DVC repository</abbr> at
    the time of importing or updating the dependency (with `dvc update`)

## `dvc.yaml` file

`dvc.yaml` files describe data science or machine learning pipelines (similar to
how [Makefiles](https://www.gnu.org/software/make/manual/make.html#Introduction)
work for building software). Its YAML structure contains a list of stages which
can be written manually or generated by user code.

> A helper command, `dvc run`, is also available to add or update stages in
> `dvc.yaml`. Additionally, a `dvc.lock` file is also created or updated by
> `dvc run` and `dvc repro` to record the pipelines' state.

Here's a comprehensive `dvc.yaml` example:

```yaml
stages:
  features:
    cmd: jupyter nbconvert --execute featurize.ipynb
    deps:
      - data/clean
    params:
      - levels.no
    outs:
      - features
    metrics:
      - performance.json
  training:
    desc: Training stage description
    cmd: python train.py --out ${model_file}
    deps:
      - train.py
      - features
    outs:
      - ${model_file}:
          desc: My model description
    plots:
      - logs.csv:
          x: epoch
          x_label: Epoch
    meta: 'For deployment'
    # User metadata and comments are supported.
```

💡 You can parameterize this file with the special expression `${}`. See
[Parameterize `dvc.yaml`](#parameterize-dvcyaml) to learn more.

`dvc.yaml` files consists of a set of `stages` with names provided explicitly by
the user with the `--name` (`-n`) option of `dvc run`. Each stage can contain
the following fields:

- `cmd` (always present): Executable command defined in this stage
- `wdir`: Working directory for the stage command to run in (relative to the
  file's location). If this field is not present explicitly, it defaults to `.`
  (the file's location).
- `deps`: List of <abbr>dependency</abbr> file or directory paths of this stage
  (relative to `wdir` which defaults to the file's location). See
  [Dependency entries](#dependency-entries) above for more details.
- `params`: List of <abbr>parameter</abbr> dependency keys (field names) that
  are read from a YAML, JSON, TOML, or Python file (`params.yaml` by default)
- `outs`: List of <abbr>output</abbr> file or directory paths of this stage
  (relative to `wdir` which defaults to the file's location). See
  [Output entries](#output-entries) above for more details.
- `metrics`: List of [metrics files](/doc/command-reference/metrics), and
  optionally, whether or not this metrics file is <abbr>cached</abbr> (`true` by
  default, if not present). See the `--metrics-no-cache` (`-M`) option of
  `dvc run`.
- `plots`: List of [plot metrics](/doc/command-reference/plots), and optionally,
  their default configuration (subfields matching the options of
  `dvc plots modify`), and whether or not this plots file is <abbr>cached</abbr>
  ( `true` by default, if not present). See the `--plots-no-cache` option of
  `dvc run`.
- `frozen`: Whether or not this stage is frozen from reproduction
- `always_changed`: Whether or not this stage is considered as changed by
  commands such as `dvc status` and `dvc repro`. `false` by default
- `meta` (optional): Arbitrary metadata can be added manually with this field.
  Any YAML contents is supported. `meta` contents are ignored by DVC, but they
  can be meaningful for user processes that read or write `.dvc` files directly.
- `desc` (optional): User description for this stage. This doesn't affect any
  DVC operations.

`dvc.yaml` files also support `# comments`.

💡 We maintain a `dvc.yaml`
[schema](https://github.com/iterative/dvcyaml-schema) that can be used by
editors like [VSCode](/doc/install/plugins#visual-studio-code) or
[PyCharm](/doc/install/plugins#pycharmintellij) to enable automatic syntax
validation and auto-completion.

### `dvc.lock` file

For every `dvc.yaml` file, a matching `dvc.lock` (YAML) file usually exists.
It's created or updated by DVC commands such as `dvc run` and `dvc repro`.
`dvc.lock` describes the latest pipeline state. It has several purposes:

- Tracking of intermediate and final results of a pipeline — similar to
  [`.dvc` files](#dvc-files).
- Allow DVC to detect when stage definitions, or their dependencies have
  changed. Such conditions invalidate stages, requiring their reproduction (see
  `dvc status`, `dvc repro`).
- `dvc.lock` is needed internally for several DVC commands to operate, such as
  `dvc checkout`, `dvc get`, and `dvc import`.

Here's an example `dvc.lock` (based on the `dvc.yaml` example above):

```yaml
stages:
  features:
    cmd: jupyter nbconvert --execute featurize.ipynb
    deps:
      - path: data/clean
        md5: d8b874c5fa18c32b2d67f73606a1be60
    params:
      params.yaml:
        levels.no: 5
    outs:
      - path: features
        md5: 2119f7661d49546288b73b5730d76485
      - path: performance.json
        md5: ea46c1139d771bfeba7942d1fbb5981e
      - path: logs.csv
        md5: f99aac37e383b422adc76f5f1fb45004
```

Stage commands are listed again in `dvc.lock`, in order to know when their
definitions change in `dvc.yaml`.

Regular <abbr>dependencies</abbr> and all kinds of <abbr>outputs</abbr>
(including [metrics](/doc/command-reference/metrics) and
[plots](/doc/command-reference/plots) files) are also listed (per stage) in
`dvc.lock`, but with an additional field with a hash of their last known
contents. Specifically: `md5`, `etag`, or `checksum` are used (same as in `deps`
and `outs` entries of `.dvc` files).

Full <abbr>parameters</abbr> (key and value) are listed too (under `params`),
grouped by parameters file. And in the case of templated/parameterized
`dvc.yaml` files (see next section), their actual values are substituted into
the `dvc.lock` YAML structure.

### Parameterize `dvc.yaml`

`dvc.yaml` supports a templating format to reuse values from different sources
in the YAML structure itself. The sources can be external
[parameters](/doc/command-reference/params) files, or internal `vars` sections,
as detailed below.

Let's say we have `params.yaml` (default params file) with the following
contents:

```yaml
models:
  us:
    threshold: 10
    filename: 'model-us.hdf5'
```

Those values can be used anywhere in `dvc.yaml` with the `${}` _substitution
expression_:

<!-- prettier-ignore-start -->
```yaml
stages:
  build-us:
    cmd: >-
      python train.py
      --thresh ${models.us.threshold}
      --out ${models.us.filename}
    outs:
      - ${models.us.filename}:
        cache: true
```
<!-- prettier-ignore-end -->

Alternatively, values for substitution can be listed as top-level `vars` like
this:

```yaml
vars:
  - models:
      us:
        threshold: 10
  - desc: 'Reusable description'

stages:
  build-us:
    desc: ${desc}
    cmd: python train.py --thresh ${models.us.threshold}
```

⚠️ DVC merges external params and `vars` as long as there are no leaf node
collisions (so the two examples above can't be used simultaneously). For
example, `{"grp": {"a": 1}}` can be merged with `{"grp": {"b": 2}}`, but not
with `{"grp": {"a": 7}}`.

To load additional params files, list them in the top `vars` section in the
desired order, e.g.:

```yaml
vars:
  - params.json
  - myvar: 'value'
  - myconfig.yaml
```

(ℹ️) Note that the default `params.yaml` is always included first.

It's also possible to specify what to include from additional params files, with
a `:` colon:

```yaml
vars:
  - params.json:clean,feats

stages:
  featurize:
    cmd: ${feats.exec}
    deps:
      - ${clean.filename}
    outs:
      - ${feats.dirname}
```

Stage-specific values are also supported, with inner `vars` sections. You may
also load additional params files locally. For example:

```yaml
stages:
  build-us:
    vars:
      - params.json:build
      - model:
        filename: 'model-us.hdf5'
    cmd: python train.py ${build.epochs} --out ${model.filename}
    outs:
      - ${model.filename}
```

The substitution expression supports these forms:

```yaml
${param} # Simple
${param.key} # Nested values through . (period)
${param.list[0]} # List elements via index in [] (square brackets)
```

> To use the expression literally in `dvc.yaml`, escape it with a backslash,
> e.g. `\${...`.

### Defining multiple stages at once

You can generate more than one stage from a single `dvc.yaml` entry with the
following syntax. A `foreach` element accepts a list or dictionary with values
to iterate on, while `do` contains the regular stage fields (`cmd`, `outs`,
etc.). Here's a simple example:

```yaml
stages:
  echo: # Multi-stage
    foreach: # List of simple values
      - foo
      - bar
      - baz qux
    do:
      cmd: echo "${item}"
```

Upon `dvc repro`, each item in the list is expanded into its own stage by
substituting is value in expression `${item}`. The item's value is appended to
each stage name after a `@`. `dvc.lock` will reflect this:

```yaml
stages:
  echo@bar:
    cmd: echo "bar"
  echo@baz:
    cmd: echo "baz qux"
  echo@foo:
    cmd: echo "foo"
```

For lists containing complex values (e.g. dictionaries), the substitution
expression can use the `${item.key}` form. Stage names will be appended with a
zero-based index. For example:

```yaml
stages:
  train:
    foreach:
      - epochs: 3
        thresh: 10
      - epochs: 10
        thresh: 15
    cmd: python train.py ${item.epochs} ${item.thresh}
```

```yaml
# dvc.lock
stages:
  train@0:
    cmd: python train.py 3 10
  train@1:
    cmd: python train.py 10 15
```

DVC can also iterate on a dictionary given directly to `foreach`, resulting in
two substitution expressions being available: `${key}` and `${item}`. The former
is used for the stage names:

```yaml
stages:
  build:
    foreach:
      uk:
        epochs: 3
        thresh: 10
      us:
        epochs: 10
        thresh: 15
    do:
      cmd: python train.py '${key}' ${item.epochs} ${item.thresh}
      outs:
        - model-${key}.hdfs
```

```yaml
# dvc.lock
stages:
  build@uk:
    cmd: python train.py 'uk' 3 10
    outs:
      - model-uk.hdfs
  build@us: ...
```

Importantly, dictionaries from [parameters](#parameterize-dvcyaml) files can be
used in `foreach` multi-stages as well:

```yaml
stages:
  mystages:
    foreach: ${myobject} # From params.yaml
    do:
      cmd: ./script.py ${key} ${item.prop1}
      outs:
        - ${item.prop2}
```
