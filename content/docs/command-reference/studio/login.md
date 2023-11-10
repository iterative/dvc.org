## studio login

Authorize DVC with Studio to save the token to global [DVC configuration].

[dvc configuration]:
  /doc/user-guide/project-structure/configuration#config-file-locations

## Synopsis

```usage
usage: dvc studio login [-h] [-q | -v] [-H <hostname>] [-s <scopes>] [-n <name>] [-d]
```

## Description

By default, this command authorize dvc with Studio with default scopes and a
random name as token name.

## Options

- `-h`, `--help` - show this help message and exit
- `-q`, `--quiet` - Be quiet.
- `-v`, `--verbose` - Be verbose.
- `-H <hostname>`, `--hostname <hostname>` - The hostname of the Studio instance
  to authenticate with.
- `-s <scopes>`, `--scopes <scopes>` - The scopes for the authentication token.
- `-n NAME`, `--name <name>` - The name of the authentication token. It will be
  used to identify token shown in Studio profile.
- `-d`, `--use-device-code` - Use authentication flow based on user code. You
  will be presented with user code to enter in browser. DVC will also use this
  if it cannot launch browser on your behalf.
