# register

Create an artifact version to signify an important, published or released
iteration.

## Synopsis

```usage
usage: gto register [-r <text>] [--ver <text>] [-m <text>]
                    [--simple <text>] [--force] [--bump-major]
                    [--bump-minor] [--bump-patch] [--push] [-h]
                    name [ref]

arguments:
  name             Artifact name
  [ref]            Git reference to use for registration [default: HEAD]
```

## Description

Registering a version is usually done to mark significant changes to the
artifact. To release a new version (including the very first one), use
`gto register`.

```cli
$ gto register awesome-model HEAD --version v0.0.1
Created git tag 'awesome-model@v0.0.1' that registers a version
```

GTO creates a special Git tag for the artifact version, in
[the standard format](/doc/gto/user-guide#git-tags-format).

The version is now associated to the current Git commit (`HEAD`). You can use
another Git commit if you provide it's hexsha as an additional argument, like
`$ gto register awesome-model abc1234`.

## Options

- `-r <text>`, `--repo <text>` - Local or remote repository [default: .]
- `--version <text>`, `--ver <text>` - Version name in SemVer format
- `-m <text>`, `--message <text>` - Message to annotate the Git tag with
- `--simple <text>` - Use simple notation, e.g. `rf#prod` instead of `rf#prod-5`
  [supported values: auto, true, false] [default: auto]
- `--force` - Create the Git tag even if it already exists and is in effect
- `--bump-major` - Bump major version
- `--bump-minor` - Bump minor version
- `--bump-patch` - Bump patch version
- `--push` - Push created tag automatically (experimental)
- `-h`, `--help` - Show this message and exit.

## Examples

    Register new version at HEAD:
    $ gto register nn

    Register new version at a specific ref:
    $ gto register nn abc1234

    Assign version name explicitly:
    $ gto register nn --version v1.0.0

    Choose a part to bump version by:
    $ gto register nn --bump-minor
