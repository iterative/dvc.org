# Tips and tricks for DVC Projects

This guide provides general tips and tricks related to DVC, which can be
utilized while working on a project. Using the practices listed here, you can
manage your projects with DVC more efficiently.

## Using meta in dvc.yaml or .dvc files

DVC provides an optional `meta` field in `dvc.yaml` and `.dvc` file. It can be
used to add any user specific information. It also supports YAML content.

## Switching between datasets

You can quickly switch between a large dataset and a small subset without
modifying source code. To achieve this you need to change dependencies of
relevant stage either by using `dvc run` with the `-f` option or by manually
editing the stage in `dvc.yaml` file.
