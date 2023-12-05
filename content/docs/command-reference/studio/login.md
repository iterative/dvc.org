## studio login

Authenticate DVC with Studio to save the token to global [DVC configuration].

[dvc configuration]:
  /doc/user-guide/project-structure/configuration#config-file-locations

## Synopsis

```usage
usage: dvc studio login [-h] [-q | -v] [-H <hostname>] [-s <scopes>] [-n <name>] [-d]
```

## Description

By default, this command authenticates the DVC with Studio using default scopes
and assigns a random name as the token name.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.

- `-H <hostname>`, `--hostname <hostname>` - The hostname of the Studio instance
  to authenticate with.

- `-s <scopes>`, `--scopes <scopes>` - The scopes for the authentication token.

- `-n <name>`, `--name <name>` - The name of the authentication token. It will
  be used to identify token shown in Studio profile.

- `-o`, `--no-open` - Use authentication flow based on user code. You will be
  presented with user code to enter in browser. DVC will also use this if it
  cannot launch browser on your behalf.

## Available scopes

- `EXPERIMENTS` - Experiment operations
- `DATASETS` - Dataset operations
- `MODELS` - Model registry operations
