# Troubleshooting

In this section we cover some of the known issues that DVC user might stumbe
upon.

## Too many open files error

A known problem some users run into with `pull`, `fetch` and `push` commands is
`[Errno 24] Too many open files` (most common for S3 remotes on MacOS). The more
`--jobs` specified, the more file descriptors need to be open on the host file
system for each download thread, and the limit may be reached, causing this
error.

To solve this, it's often possible to increase the open file descriptors limit,
for example with `ulimit -n` on UNIX-like system, or
[increasing Handles limit](https://blogs.technet.microsoft.com/markrussinovich/2009/09/29/pushing-the-limits-of-windows-handles/)
on Windows. Otherwise, please try using a lower `JOBS` value.
