# get-url

Download or copy file or directory from any supported URL (for example `s3://`,
`ssh://`, and other protocols) or local directory to the local file system.

> Unlike `dvc import-url`, this command does not track the downloaded data
> file(s) (does not create a DVC-file).

## Synopsis

```usage
usage: dvc get-url [-h] [-q | -v] url [out]

positional arguments:
  url            (See supported URLs in the description.)
  out            Destination path to put data to.
```

## Description

In some cases it's convenient to get a data file or directory from a remote
location. The `dvc get-url` command helps the user do so. The `url` argument
should provide the location of the data to be downloaded, while `out` can be
used to specify the (path and) file name desired for the downloaded data file or
directory.

> This command doesn't require an existing DVC project to run in. It's a
> single-purpose command that can be used out of the box after installing DVC.

DVC supports several types of (local or) remote locations (protocols):

| Type    | Discussion                                              | URL format                                 |
| ------- | ------------------------------------------------------- | ------------------------------------------ |
| `local` | Local path                                              | `/path/to/local/file`                      |
| `s3`    | Amazon S3                                               | `s3://mybucket/data.csv`                   |
| `gs`    | Google Storage                                          | `gs://mybucket/data.csv`                   |
| `ssh`   | SSH server                                              | `ssh://user@example.com:/path/to/data.csv` |
| `hdfs`  | HDFS                                                    | `hdfs://user@example.com/path/to/data.csv` |
| `http`  | HTTP to file with _strong ETag_ (see explanation below) | `https://example.com/path/to/data.csv`     |

> `remote://myremote/path/to/file` notation just means that a DVC
> [remote](/doc/commands-reference/remote) `myremote` is defined, and when DVC
> is running it internally expands this URL into a regular S3, SSH, GS, etc URL
> by appending `/path/to/file` to the `myremote`'s configured base path.

Another way to understand the `dvc get-url` command is as a tool for downloading
data files.

> See `dvc get` to download data from other DVC repositories (e.g. Github URLs).

On GNU/Linux systems for example, instead of `dvc get-url` with HTTP(S) it's
possible to instead use:

```dvc
$ wget https://example.com/path/to/data.csv
```

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

<details>

### Click and expand for a local example

```dvc
$ dvc get-url /local/path/to/data
```

The above command will copy the `/local/path/to/data` file or directory into
`./dir`.

</details>

### Click for AWS S3 example

This command will copy an S3 object into the current working directory with the
same file name:

```dvc
$ dvc get-url s3://bucket/path
```

By default DVC expects your AWS CLI is already
[configured](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html).
DVC will be using default AWS credentials file to access S3. To override some of
these settings, you could the options described in `dvc remote modify`.

We use `boto3` library to set up a client and communicate with AWS S3. The
following API methods may be performed:

- `list_objects_v2`, `list_objects`
- `head_object`
- `download_file`
- `upload_file`
- `delete_object`
- `copy`

So make sure you have the following permissions enabled to enable all the above
operations:

- `s3:ListBucket`
- `s3:GetObject`
- `s3:PutObject`
- `s3:DeleteObject`

</details>

<details>

### Click for Google Cloud Storage example

```dvc
$ dvc get-url gs://bucket/path file
```

The above command downloads the `/path` file (or directory) into `./file`.

</details>

<details>

### Click for SSH example

```dvc
$ dvc get-url ssh://user@example.com/path/to/data
```

Using default SSH credentials, the above command gets the `data` file (or
directory).

</details>

<details>

### Click for HDFS example

```dvc
$ dvc get-url hdfs://user@example.com/path/to/data
```

</details>

<details>

### Click for HTTP example

> Both HTTP and HTTPS protocols are supported.

```dvc
$ dvc get-url https://example.com/path/to/data
```

</details>

<details>
