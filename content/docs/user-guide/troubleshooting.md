# Troubleshooting

Here we provide help for some of the problems that DVC user might stumble upon.

<!--
This file uses a special engine feature for the following headers, so that a
custom anchor link is used. Just add {#custom-anchor} after each title:
-->

## Failed to pull data from the cloud {#missing-files}

Users may encounter errors when running `dvc pull` and `dvc fetch`, like
`WARNING: Cache 'xxxx' not found.` or
`ERROR: failed to pull data from the cloud`. The most common cause is changes
pushed to Git without the corresponding data being uploaded to the
[DVC remote](/doc/command-reference/remote). Make sure to `dvc push` from the
original <abbr>project</abbr>, and try again.

## Too many open files error {#many-files}

A known problem some users run into with the `dvc pull`, `dvc fetch` and
`dvc push` commands is `[Errno 24] Too many open files` (most common for S3
remotes on MacOS). The more `--jobs` specified, the more file descriptors need
to be open on the host file system for each download thread, and the limit may
be reached, causing this error.

To solve this, it's often possible to increase the open file descriptors limit,
with `ulimit` on UNIX-like system (for example `ulimit -n 1024`), or
[increasing Handles limit](https://blogs.technet.microsoft.com/markrussinovich/2009/09/29/pushing-the-limits-of-windows-handles/)
on Windows. Otherwise, please try using a lower `JOBS` value.

## Unable to find credentials {#no-credentials}

Make sure that you have your AWS credentials setup either through
[usual AWS configuration](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
or using [DVC configs](/doc/command-reference/remote/modify).

## Unable to connect {#connection-error}

Make sure you have a working internet connection and you are able to access your
[AWS S3 endpoint](https://docs.aws.amazon.com/general/latest/gr/s3.html) or, if
[explicitly configured](/doc/command-reference/remote/modify), your
`endpointurl`.

## Bucket does not exist {#no-bucket}

Make sure
[your bucket exists](https://docs.aws.amazon.com/AmazonS3/latest/user-guide/create-bucket.html)
in the correct
[`region` and/or `endpointurl`](/doc/command-reference/remote/modify).
