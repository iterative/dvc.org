# assign

Assign stage to specific artifact version.

## Synopsis

```usage
usage: gto assign [-r <text>] [--version <text>]
                  [--stage <text>] [-m <text>]
                  [--simple <text>] [--force] [--push] [--sr]
                  [-h]
                  name [ref]

arguments:
  name             Artifact name
  [ref]            Git reference to use
```

## Description

To assign an actionable stage for a specific artifact version use the same
`gto assign` command. Stages can mark the artifact readiness for a specific
consumer. You can plug in a real downsteam system via CI/CD or web hooks, e.g.
to redeploy an ML model.

```cli
$ gto assign awesome-model --version v0.0.1 --stage prod
Created git tag 'awesome-model#prod#1' that assigns stage to 'v0.0.1'
```

GTO creates a special Git tag in
[the standard format](/doc/gto/user-guide#git-tags-format).

## Options

- `-r <text>`, `--repo <text>` - Local or remote repository [default: .]
- `--version <text>` - If you provide REF, this will be used to name new version
- `--stage <text>` - Stage to assign
- `-m <text>`, `--message <text>` - Message to annotate the Git tag with
- `--simple <text>` - Use simple notation, e.g. `rf#prod` instead of `rf#prod-5`
  [supported values: auto, true, false] [default: auto]
- `--force` - Create the Git tag even if it already exists and is in effect
- `--push` - Push created tag automatically (experimental)
- `--sr`, `--skip-registration` - Don't register a version at specified commit
- `-h`, `--help` - Show this message and exit.

## Examples

Assign artifact "nn" to "prod" at specific Git ref instead of supplying artifact
version (note that this will also register a version if it doesn't exist):

```cli
$ gto assign nn abcd123 --stage prod
```

Assign stage at specific Git ref and name the version explicitly (this assumes
that version was not registered yet):

```cli
$ gto assign nn abcd123 --version v1.0.0 --stage prod
```
