# Advanced dvc.yaml Usage

> ⚠️ These features will be released shortly, along with DVC 2.0 ⚠️

The following features are supported only via manual edition of `dvc.yaml` files
(`dvc run` cannot currently produce them).

## Templating

`dvc.yaml` supports a templating format to insert values from different sources
in the YAML structure itself. The sources can be
[parameters files](/doc/command-reference/params), or `vars` defined in
`dvc.yaml` instead.

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

DVC will track simple param values (numbers, strings, etc.) used in `${}` (they
will be listed by `dvc params diff`).

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

> DVC merges values from params files and `vars` as long as there are no leaf
> node collisions (so the two examples above can't be used simultaneously). For
> example, `{"grp": {"a": 1}}` can be merged with `{"grp": {"b": 2}}`, but not
> with `{"grp": {"a": 7}}`.

⚠️ Note that doesn't track values from `vars` like parameters (ignored by
`dvc params diff`).

To load additional params files, list them in the top `vars`, in the desired
order, e.g.:

> Their paths will be evaluated based on `wdir`, if one given.

```yaml
vars:
  - params.json
  - myvar: 'value'
  - config/myapp.yaml
```

(ℹ️) Note that the default `params.yaml` file is always loaded first, if
present.

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

Stage-specific values are also supported, with inner `vars`. You may also load
additional params files locally. For example:

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

⚠️ Important: Limitations of local `vars`:

- `wdir` cannot use values from local `vars`, as DVC uses the working directory
  first (to load any values from params files listed in `vars`).
- `foreach` is also incompatible with local `vars` at the moment.

The substitution expression supports these forms:

```yaml
${param} # Simple
${param.key} # Nested values through . (period)
${param.list[0]} # List elements via index in [] (square brackets)
```

> To use the expression literally in `dvc.yaml`, escape it with a backslash,
> e.g. `\${...`.

## Generating multiple stages

You can define more than one stage in a single `dvc.yaml` entry with the
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
substituting its value in expression `${item}`. The item's value is appended to
each stage name after a `@`. The final generated stages are saved to `dvc.lock`:

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

Importantly, dictionaries [from parameters](#templating) files can be used in
`foreach` multi-stages as well:

```yaml
stages:
  mystages:
    foreach: ${myobject} # From params.yaml
    do:
      cmd: ./script.py ${key} ${item.prop1}
      outs:
        - ${item.prop2}
```
