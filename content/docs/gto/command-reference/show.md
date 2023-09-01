# show

Show the registry state, highest version, or what's assigned in stage.

## Synopsis

```usage
usage: gto show [-r <text>] [-a] [-A] [--json] [--plain]
                [--name] [--version] [--stage] [--ref]
                [--ro] [--av <integer>] [--vs <integer>]
                [--sort <text>] [-h]
                [name]

arguments:
  [name]           Artifact name to show. If empty, show registry
```

## Description

This is the entire state of the registry: all artifacts, their latest versions,
and the versions in each stage.

```cli
$ gto show -r https://github.com/iterative/example-gto
╒══════════╤══════════╤════════╤═════════╤════════════╕
│ name     │ latest   │ #dev   │ #prod   │ #staging   │
╞══════════╪══════════╪════════╪═════════╪════════════╡
│ churn    │ v3.1.1   │ v3.1.1 │ v3.0.0  │ v3.1.0     │
│ segment  │ v0.4.1   │ v0.4.1 │ -       │ -          │
│ cv-class │ v0.1.13  │ -      │ -       │ -          │
╘══════════╧══════════╧════════╧═════════╧════════════╛
```

Here we'll see artifacts that have Git tags or are annotated in
`artifacts.yaml`. The artifacts that have annotation, but have no Git tags, are
considered yet `unregistered` and will be marked with an asterisk, e.g.
`*annotated`. Use `--all-branches` or `--all-commits` to read `artifacts.yaml`
from more commits than just `HEAD`.

Add an artifact name to print all of its versions instead:

```cli
$ gto show churn
╒════════════╤═══════════╤══════════════╤═════════════════════╤══════════════╕
│ artifact   │ version   │ stage        │ created_at          │ ref          │
╞════════════╪═══════════╪══════════════╪═════════════════════╪══════════════╡
│ churn      │ v3.1.0    │ dev, staging │ 2022-08-28 16:58:50 │ churn@v3.1.0 │
│ churn      │ v3.0.0    │ prod         │ 2022-08-24 01:52:10 │ churn@v3.0.0 │
╘════════════╧═══════════╧══════════════╧═════════════════════╧══════════════╛
```

Note, that by default, assignments are sorted by the creation time (the latest
assignment wins). You can sort them by Semver with `--sort semver` option (the
greatest version in stage wins).

Finally, you can show the greatest version of the artifact, or what's currently
in a stage, using shortcuts like:

```cli
$ gto show churn@greatest
╒════════════╤═══════════╤═════════╤═════════════════════╤══════════════╕
│ artifact   │ version   │ stage   │ created_at          │ ref          │
╞════════════╪═══════════╪═════════╪═════════════════════╪══════════════╡
│ churn      │ v3.1.1    │ dev     │ 2022-11-09 13:40:33 │ churn@v3.1.1 │
╘════════════╧═══════════╧═════════╧═════════════════════╧══════════════╛

$ gto show churn#prod
╒════════════╤═══════════╤═════════╤═════════════════════╤══════════════╕
│ artifact   │ version   │ stage   │ created_at          │ ref          │
╞════════════╪═══════════╪═════════╪═════════════════════╪══════════════╡
│ churn      │ v3.0.0    │ prod    │ 2022-10-28 23:53:53 │ churn@v3.0.0 │
╘════════════╧═══════════╧═════════╧═════════════════════╧══════════════╛

$ gto show churn@v3.0.0
╒════════════╤═══════════╤═════════╤═════════════════════╤══════════════╕
│ artifact   │ version   │ stage   │ created_at          │ ref          │
╞════════════╪═══════════╪═════════╪═════════════════════╪══════════════╡
│ churn      │ v3.0.0    │ prod    │ 2022-10-28 23:53:53 │ churn@v3.0.0 │
╘════════════╧═══════════╧═════════╧═════════════════════╧══════════════╛
```

By default, GTO is configured to adhere to what we call "Environments"
mechanics: a single artifact version can be in multiple stages, but if you take
a specific stage, there will be only one version in it.

There are two other approaches that you may want to use - see the details under
collapsible sections below.

<details>

### Enable multiple versions in the same Stage workflow

Note: this functionality is experimental and subject to change. If you find it
useful, please share your feedback in GH issues to help us make it stable.

If you would like to see more than a single version assigned in a stage, use
`--vs` (short for `--versions-per-stage`), e.g. `-1` to show all versions.

```cli
$ gto show churn --vs -1
╒════════════╤═══════════╤══════════════╤═════════════════════╤══════════════╕
│ artifact   │ version   │ stage        │ created_at          │ ref          │
╞════════════╪═══════════╪══════════════╪═════════════════════╪══════════════╡
│ churn      │ v3.1.0    │ dev, staging │ 2022-08-28 16:58:50 │ churn@v3.1.0 │
│ churn      │ v3.0.0    │ dev, prod    │ 2022-08-24 01:52:10 │ churn@v3.0.0 │
╘════════════╧═══════════╧══════════════╧═════════════════════╧══════════════╛
```

</details>

<details>

### Enable Kanban-like workflow

Note: this functionality is experimental and subject to change. If you find it
useful, please share your feedback in GH issues to help us make it stable.

If you would like the latest stage to replace all the previous stages for an
artifact version, use `--vs` flag combined with `--av`
(`--assignments-per-version` for short):

```cli
$ gto show churn --av 1 --vs -1
╒════════════╤═══════════╤═════════╤═════════════════════╤══════════════╕
│ artifact   │ version   │ stage   │ created_at          │ ref          │
╞════════════╪═══════════╪═════════╪═════════════════════╪══════════════╡
│ churn      │ v3.1.0    │ staging │ 2022-08-28 16:58:50 │ churn@v3.1.0 │
│ churn      │ v3.0.0    │ dev     │ 2022-08-24 01:52:10 │ churn@v3.0.0 │
╘════════════╧═══════════╧═════════╧═════════════════════╧══════════════╛
```

In this case the version will always have a single stage (or have no stage at
all). This resembles Kanban workflow, when you "move" your artifact version from
one column ("stage-1") to another ("stage-2"). This is how MLFlow and some other
Model Registries work.

</details>

## Options

- `-r <text>`, `--repo <text>` - Local or remote repository [default: .]
- `-a`, `--all-branches` - Read heads from all branches
- `-A`, `--all-commits` - Read all commits
- `--json` - Print output in json format
- `--plain` - Print table in grep-able format
- `--name` - Show artifact name
- `--version` - Output artifact version
- `--stage` - Show artifact stage
- `--ref` - Show ref
- `--ro`, `--registered-only` - Show only registered versions
- `--av <integer>`, `--assignments-per-version <integer>` - Show N last stages
  for each version. -1 for all [default: -1]
- `--vs <integer>`, `--versions-per-stage <integer>` - Show N last versions for
  each stage. -1 for all. Applied after 'assignments-per-version' [default: 1]
- `--sort <text>` - Order assignments by timestamp or semver [default:
  timestamp]
- `-h`, `--help` - Show this message and exit.
