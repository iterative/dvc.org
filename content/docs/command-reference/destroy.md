# destroy

Remove all <abbr>DVC files</abbr> and
[internals](/user-guide/project-structure/internal-files) from a <abbr>DVC
project</abbr>.

## Synopsis

```usage
usage: dvc destroy [-h] [-q | -v] [-f]
```

## Description

`dvc destroy` removes `dvc.yaml`, `.dvc` files, and the internal `.dvc/`
directory from the <abbr>project</abbr>.

Note that the <abbr>cache directory</abbr> will be removed as well. If you have
setup [symlinks](/user-guide/data-management/large-dataset-optimization) (from
cache to workspace) in your project, DVC will replace them with the latest
versions of the actual files and directories first, so that your data is intact
after destruction.

> Refer to [Project Structure](/user-guide/project-structure) for more details
> on the directories and files deleted by this command.

## Options

- `-f`, `--force` - do not prompt when destroying this project.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

```cli
$ dvc init
$ echo foo > foo
$ dvc add foo
$ ls -a

.dvc .git code.py foo foo.dvc

$ dvc destroy
This will destroy all information about your pipelines, all data files...
Are you sure you want to continue?
yes

$ ls -a

.git code.py foo
```
