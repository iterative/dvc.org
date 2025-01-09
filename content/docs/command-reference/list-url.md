# list-url

<admon type="info">

Aliased to `dvc ls-url`

</admon>

List contents from a supported URL (for example `s3://`, `ssh://`, and other
protocols).

<admon type="tip">

Useful to find data to `dvc get-url` or `dvc import-url`.

</admon>

## Synopsis

```usage
usage: dvc list-url [-h] [-q | -v] [-R|-T] [-L depth] [--size] [--fs-config <name>=<value>] url

positional arguments:
  url              (See supported URLs in the description)
```

## Description

Lists files and directories from an external location. `dvc list-url` provides a
uniform interface to browse the contents of an external location using any
protocol that is understood by `dvc get-url` or `dvc import-url`. For example,
it is roughly equivalent to `aws s3 ls` when using the `s3://` protocol, or
`ssh user@host ls -a` when using `ssh://`.

The `url` argument specifies the location of the data to be listed. It supports
several kinds of external data sources:

| Type    | Description                  | `url` format example                  |
| ------- | ---------------------------- | ------------------------------------- |
| `s3`    | Amazon S3                    | `s3://bucket/data`                    |
| `azure` | Microsoft Azure Blob Storage | `azure://container/data`              |
| `gs`    | Google Cloud Storage         | `gs://bucket/data`                    |
| `ssh`   | SSH server                   | `ssh://user@example.com/path/to/data` |
| `local` | Local path                   | `/path/to/local/data`                 |

<admon type="info">

If you installed DVC via `pip` and plan to access cloud services as external
data sources, you might need to install these optional dependencies: `[s3]`,
`[azure]`, `[gs]`, `[oss]`, `[ssh]`. Alternatively, use `[all]` to include them
all. The command should look like this: `pip install "dvc[s3]"`. (This example
installs `boto3` library along with DVC to support S3 storage.)

</admon>

Only the root directory is listed by default, but the `-R` option can be used to
list files recursively.

## Options

- `-R`, `--recursive` - recursively list files in all subdirectories.

- `-T`, `--tree` - recurse into directories as a tree.

- `-L`, `--level <depth>` - limit the depth of recursion.

- `--size` - show sizes.

- `--fs-config <name>=<value>` - `dvc remote` config options for the target url.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise a non-zero value.

- `-v`, `--verbose` - displays detailed tracing information.

## Example: Amazon S3

This command will list objects and common prefixes under the specified path:

```cli
$ dvc list-url s3://bucket/path
```

DVC expects that AWS CLI is already
[configured](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html).
DVC will use the AWS credentials file to access S3.

## Example: SSH

```cli
$ dvc list-url ssh://user@example.com/path/to/data
```

Using default SSH credentials, the above command lists files and directories
inside `data`.

## Example: local file system

```cli
$ dvc list-url /local/path/to/data
```

The above command will list the `/local/path/to/data` directory.
