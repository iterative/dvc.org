# studio

Set of commands to authenticate DVC with Studio and save the token to global
[DVC configuration]: [login](/doc/command-reference/studio/login),
[logout](/doc/command-reference/studio/logout),
[token](/doc/command-reference/studio/token),

[dvc configuration]:
  /doc/user-guide/project-structure/configuration#config-file-locations

## Synopsis

```usage
usage: dvc studio [-h] [-q | -v] {login,logout,token} ...

positional arguments:
  COMMAND
    login               Authenticate DVC with Studio host.
    logout              Logout user from Studio.
    token               View the token dvc uses to contact Studio.
```

## Description

`dvc studio` authenticate DVC with Studio and set the token. Once this token has
been properly configured, DVC will utilize it for seamlessly sharing live
experiments and sending notifications to Studio regarding any experiments that
have been pushed.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.
