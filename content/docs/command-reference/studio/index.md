# studio

Command to authorize DVC with Studio and save the token to global [DVC
configuration].

[dvc configuration]:
  /doc/user-guide/project-structure/configuration#config-file-locations

## Synopsis

```usage
usage: dvc studio [-h] [-q | -v] {login,logout,token} ...

positional arguments:
  {login,logout,token}  Use `dvc studio CMD --help` to display command-specific help.
    login               Authenticate DVC with Studio host
    logout              Logout user from Studio
    token               View the token dvc uses to contact Studio

options:
  -h, --help            show this help message and exit
  -q, --quiet           Be quiet.
  -v, --verbose         Be verbose.
```

## Description

`dvc studio` authorize dvc with Studio and set the token. When this is set, DVC
uses this to share live experiments and notify Studio about pushed experiments.

## Options

- `-h`, `--help` - show this help message and exit
- `-q`, `--quiet` - Be quiet
- `-v`, `--verbose` - Be verbose
