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
remotes on macOS). The more `--jobs` specified, the more file descriptors need
to be open on the host file system for each download thread, and the limit may
be reached, causing this error.

To solve this, it's often possible to increase the open file descriptors limit,
with `ulimit` on UNIX-like system (for example `ulimit -n 1024`), or
[increasing Handles limit](https://blogs.technet.microsoft.com/markrussinovich/2009/09/29/pushing-the-limits-of-windows-handles/)
on Windows. Otherwise, please try using a lower `JOBS` value.

## Unable to find credentials {#no-credentials}

Make sure that you have your AWS credentials setup either through
[usual AWS configuration](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
or by setting `access_key_id` and `secret_access_key` with `dvc remote modify`.

## Unable to connect {#connection-error}

Make sure you are online and able to access your
[AWS S3 endpoint](https://docs.aws.amazon.com/general/latest/gr/s3.html), or
`endpointurl` if explicitly set with `dvc remote modify`.

## Bucket does not exist {#no-bucket}

Make sure your bucket
[exists](https://docs.aws.amazon.com/AmazonS3/latest/user-guide/create-bucket.html)
in the correct `region` and/or `endpointurl` (see `dvc remote modify`).

## Unable to detect cache type {#no-dvc-cache}

Unable to detect supported link types, as the
[cache directory](/doc/command-reference/config#cache) doesn't exist. It is
usually created automatically by DVC commands that need it, but you can create
it manually (e.g. `mkdir .dvc/cache`) to enable this check.

## Unable to acquire lock {#lock-issue}

You may encounter an error message saying `Unable to acquire lock` if you have
another DVC process running in the project. If that is not the case, it usually
means that DVC was terminated abruptly and manually removing the lock file in
`.dvc/tmp/lock` should resolve the issue.

If the issue still persists then it may be the case that you are running DVC on
some network filesystem like NFS, Lustre, etc. If so, the solution is to enable
`core.hardlink_lock` which can be done by running following command:

```dvc
$ dvc config core.hardlink_lock true
```

## Cannot add files in symlinked directory {#add-symlink}

DVC only supports [symlinked files](/doc/command-reference/add#add-symlink) as
valid targets for `dvc add`. If the target path is a directory symlink, or if
the target path contains any intermediate directory symlinks, `dvc add` will
fail.

## No possible cache types {#cache-types}

You may encounter this error if DVC cannot find a valid
[file link type](/doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache)
to use when linking data files from cache into your workspace. To resolve the
issue, you may need to
[reconfigure](/doc/user-guide/large-dataset-optimization#configuring-dvc-cache-file-link-type)
DVC to use alternative link types which are supported on your machine.

After reconfiguring cache types, you can re-link data files in your workspace
using:

```dvc
$ dvc checkout --relink
```

## DVC can only authenticate with Git remotes using SSH URLs {#git-auth}

[Experiment sharing](/doc/user-guide/experiment-management/sharing-experiments)
commands accept a `git_remote` argument. You may need to authenticate to use the
Git remote, for _write_ (`dvc exp push`) or _read_ (`dvc exp list`,
`dvc exp pull`) permissions.

DVC does not currently support authentication with [Git credentials]. This means
that unless the Git server allows unauthenticated HTTP write/read, you should
use an [SSH Git URL] for Git remotes used for listing, pulling or pushing
experiments.

[git credentials]: https://git-scm.com/docs/gitcredentials
[ssh git url]:
  https://git-scm.com/book/en/v2/Git-on-the-Server-The-Protocols#_the_protocols

## Could not open pickled 'index/md5/links' cache {#pickle}

You may encounter this error when using DVC on different Python versions with
the same <abbr>DVC project</abbr> directory, for example having created the
project on Python 3.8. in one environment and later attempting to update it from
a Python 3.7 env. This is due to temporary [internal directories] that can be
incompatible with older Python versions once created.

In these rare situations, it is safe to remove the corresponding tmp directory
and retry the DVC command. Specifically, one of:

- `.dvc/tmp/index`
- `.dvc/tmp/md5s`
- `.dvc/tmp/links`

[internal directories]:
  https://dvc.org/doc/user-guide/project-structure/internal-files
