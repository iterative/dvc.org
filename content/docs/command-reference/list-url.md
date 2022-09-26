# list-url

> Aliased to `dvc ls-url`

List contents from a supported URL (for example `s3://`, `ssh://`, and other
protocols).

> Useful to find data to `dvc get-url` or `dvc import-url`.

## Synopsis

```usage
usage: dvc ls-url [-h] [-q | -v] [-R] url

positional arguments:
  url              See `dvc get-url` for full list of supported URLs.
```

## Description

Lists files and directories from an external location. `dvc ls-url` is
equivalent to a wrapper providing a uniform interface around various listing
commands such as `aws s3 ls` or `ssh user@host ls -a`.

The `url` argument specifies the location of the data to be listed. It supports
several kinds of external data sources:

| Type    | Description                  | `url` format example                  |
| ------- | ---------------------------- | ------------------------------------- |
| `s3`    | Amazon S3                    | `s3://bucket/data`                    |
| `azure` | Microsoft Azure Blob Storage | `azure://container/data`              |
| `gs`    | Google Cloud Storage         | `gs://bucket/data`                    |
| `ssh`   | SSH server                   | `ssh://user@example.com/path/to/data` |
| `local` | Local path                   | `/path/to/local/data`                 |

> If you installed DVC via `pip` and plan to access cloud services as external
> data sources, you might need to install these optional dependencies: `[s3]`,
> `[azure]`, `[gs]`, `[oss]`, `[ssh]`. Alternatively, use `[all]` to include
> them all. The command should look like this: `pip install "dvc[s3]"`. (This
> example installs `boto3` library along with DVC to support S3 storage.)

Only the root directory is listed by default, but the `-R` option can be used to
list files recursively.

## Options

- `-R`, `--recursive` - recursively list files of all subdirectories.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise a non-zero value.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

<details>

### Amazon S3

This command will list objects and common prefixes under the specified path:

```dvc
$ dvc ls-url s3://bucket/path
```

DVC expects that AWS CLI is already
[configured](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html).
DVC will use the AWS credentials file to access S3.

</details>

<details>

### SSH

```dvc
$ dvc ls-url ssh://user@example.com/path/to/data
```

Using default SSH credentials, the above command lists files and directories
inside `data`.

</details>

<details>

### local

```dvc
$ dvc get-url /local/path/to/data
```

The above command will list the `/local/path/to/data` directory.

</details>
