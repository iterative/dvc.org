# deprecate

Deprecate artifact, deregister a version, or unassign a stage.

## Synopsis

```usage
usage: gto deprecate [-r <text>] [-m <text>] [--simple <text>]
                     [--force] [-d] [--push] [-h]
                     name [version] [stage]

arguments:
  name             Artifact name
  [version]        Artifact version
  [stage]          Stage to unassign
```

## Description

The command supports three use cases:

```cli
# deprecate an artifact:
$ gto deprecate nn

# deprecate a version:
$ gto deprecate nn v0.0.1

# unassign a stage:
$ gto deprecate nn v0.0.1 prod
```

### Unassigning a stage

Sometimes you need to mark an artifact version no longer ready for a specific
consumer, and maybe signal a downstream system about this. You can use
`gto deprecate` for that:

```cli
$ gto deprecate awesome-model v0.0.1 prod
Created git tag 'awesome-model#prod!#2' that unassigns a stage from 'v0.0.1'
```

<details>

### Unassigning a stage: some details and options

GTO creates a special Git tag in
[the standard format](/doc/gto/user-guide#git-tags-format).

Note, that later you can create this stage again, if you need to, by calling
`$ gto assign` again.

You also may want to delete the git tag instead of creating a new one. This is
useful if you don't want to keep extra tags in you Git repo, don't need history
and don't want to trigger a CI/CD or another downstream system. For that, you
can use:

```cli
$ gto deprecate awesome-model v0.0.1 prod --delete
Deleted git tag 'awesome-model#prod#1' that assigned a stage to 'v0.0.1'
To push the changes upstream, run:
git push origin awesome-model#prod#1 --delete
```

</details>

### Deregister a version

Sometimes you need mark a specific artifact version as a no longer ready for
usage. You could just delete a git tag, but if you want to preserve a history of
the actions, you may again use `gto deprecate`.

```cli
$ gto deprecate awesome-model v0.0.1
Created git tag 'awesome-model@v0.0.1!' that deregistered a version.
```

<details>

### Deregister a version: some details and options

If you want to deregister the version by deleting the Git tags itself, you could
use

```cli
$ gto deprecate awesome-model v0.0.1 --delete
Deleted git tag 'awesome-model@v0.0.1' that registered a version.
Deleted git tag 'awesome-model#prod#1' that assigned a stage to 'v0.0.1'.
Deleted git tag 'awesome-model#prod!#2' that unassigned a stage to 'v0.0.1'.
To push the changes upstream, run:
git push origin awesome-model@v0.0.1 awesome-model#prod#1 awesome-model#prod!#2 --delete
```

This includes all Git tags related to the version: a tag that registered it and
all tags that assigned stages to it.

</details>

### Deprecating an artifact

Sometimes you need to need to mark the artifact as "deprecated", usually meaning
it's outdated and will no longer be developed. To do this, you could run:

```cli
$ gto deprecate awesome-model
Created Git tag 'awesome-model@deprecated' that deprecates an artifact.
```

<details>

### Deprecating an artifact: some details and options

With `awesome-model@deprecated` Git tag the artifact will be considered
deprecated until you register a new version or assign a new stage to it after
the deprecation.

If you want to deprecate an artifact by deleting git tags, you'll need to delete
all of them for the artifact. You could do that with

```cli
$ gto deprecate awesome-model --delete
Deleted git tag 'awesome-model@v0.0.1' that registered a version.
Deleted git tag 'awesome-model#prod#1' that assigned a stage to 'v0.0.1'.
Deleted git tag 'awesome-model#prod!#2' that unassigned a stage to 'v0.0.1'.
To push the changes upstream, run:
git push origin awesome-model@v0.0.1 awesome-model#prod#1 awesome-model#prod!#2 --delete
```

</details>

## Options

- `-r <text>`, `--repo <text>` - Local or remote repository [default: .]
- `-m <text>`, `--message <text>` - Message to annotate the Git tag with
- `--simple <text>` - Use simple notation, e.g. `rf#prod` instead of `rf#prod-5`
  [supported values: auto, true, false] [default: auto]
- `--force` - Create the Git tag even if it already exists and is in effect
- `-d`, `--delete` - Delete the git tag(s) instead of creating the new one
- `--push` - Push created tag automatically (experimental)
- `-h`, `--help` - Show this message and exit.
