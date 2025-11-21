# DVC Project

Initialized by running `dvc init` in your <abbr>workspace</abbr> directory, a
DVC project will contain all of the [DVC metafiles and
directories][dvc-metafiles], such as the <abbr>cache</abbr>, `dvc.yaml`, and
`.dvc` files. Any other files referenced from these DVC metafiles are also
considered part of the project (e.g.
[metrics files](/command-reference/metrics)).

[dvc-metafiles]: /user-guide/project-structure

> `dvc destroy` can be used to remove all DVC-specific files from the directory,
> in effect deleting the DVC project.

## DVC repository

A DVC project in a Git repository can also be called a _DVC repository_ or "the
repo". This setup enables the [versioning features] of DVC (recommended). Files
tracked by Git are considered part of the DVC project when referenced from DVC
metafiles such as `dvc.lock`; for example source code that is used as a
<abbr>stage</abbr> command (`cmd` field in `dvc.yaml`).

[versioning features]: /start

## Further Reading

- [Get Started](/start) with DVC
- DVC [Project Structure](/user-guide/project-structure)
