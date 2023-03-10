# exp clean

Cleanup experiments temporary files.

## Synopsis

```usage
usage: dvc exp clean [-h] [-q | -v]
```

## Description

Runs housekeeping tasks within the <abbr>DVC repository</abbr>, such as removing
outdated internal experiments queue message files (to reduce disk space and
improve performance).

This is done automatically when running [queued experiments]. Running
`dvc exp clean` manually should not be required for typical use cases, but it
may be needed in the event that a queue worker unexpectedly crashed, or was
forcefully killed by something other than DVC commands.

[queued experiments]:
  /doc/user-guide/experiment-management/running-experiments#the-experiments-queue

## Options

- `-h`, `--help` - shows the help message and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information from executing the
  `dvc exp clean` command.
