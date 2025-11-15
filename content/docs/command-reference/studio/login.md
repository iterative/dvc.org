## studio login

Authenticate DVC with Studio to save a
[client access token](https://docs.datachain.ai/studio/api#authorization) to
global [DVC configuration].

[dvc configuration]:
  /user-guide/project-structure/configuration#config-file-locations

## Synopsis

```usage
usage: dvc studio login [-h] [-q | -v] [-H <hostname>] [-s <scopes>] [-n <name>] [-d]
```

## Description

By default, this command authenticates the DVC with Studio using default scopes
and assigns a random name as the token name.

## Options

- `-H <hostname>`, `--hostname <hostname>` - the hostname of the Studio instance
  to authenticate with. Defaults to `https://studio.datachain.ai`.

- `-s <scopes>`, `--scopes <scopes>` - comma separated values of
  [scopes](https://docs.datachain.ai/studio/api#authorization) for the
  authentication token. Accepted scope values are `EXPERIMENTS`, `MODELS`, and
  `DATASETS`. Defaults to all available scopes.

- `-n <name>`, `--name <name>` - the name of the authentication token. It will
  be used to identify token shown in Studio profile. Defaults to a random name.

- `-o`, `--no-open` - use authentication flow based on user code. You will be
  presented with user code to enter in browser. DVC will also use this if it
  cannot launch browser on your behalf.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.
