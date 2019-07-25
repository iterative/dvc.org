# unlock

Unlock [DVC-file](/doc/user-guide/dvc-file-format)
([stage](/doc/commands-reference/run)). See `dvc lock` for more information.

## Synopsis

```usage
usage: dvc unlock [-h] [-q | -v] targets [targets ...]

positional arguments:
  targets        DVC-files to unlock.
```

## Description

There are several reasons that can produce data files to be locked in a DVC
project, `dvc lock` being the most obvious one.

Note that by default, <abbr>import stages</abbr> (both with `dvc import` and
`dvc import-url`) are locked in their DVC-files (via fields `lock: true` and
`rev_lock`). You may simply use `dvc update` on them to force updating the
imported file, directory, or <abbr>data artifact</abbr> from the external data
source. For a locked stage, `dvc update` does `dvc unlock` + `dvc repro` +
`dvc lock`, basically.

> If `dvc unlock` is used on locked imported stages, they will start to be
> checked by `dvc status`, and updated by `dvc repro`.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example

- First, let's create a sample DVC-file:

  ```dvc
  $ echo foo > foo
  $ dvc add foo
  Adding 'foo'...

  $ dvc run -d foo -o bar cp foo bar
  Running command:
    cp foo bar
  ...
  ```

- Then, let's change the file `foo` that the stage described in `bar.dvc`
  depends on:

  ```dvc
  $ rm foo
  $ echo foo1 > foo
  $ dvc status

  bar.dvc
          deps
                  changed:  foo
  foo.dvc
          outs
                  changed:  foo
  ```

- Now, let's lock the `bar` stage:

  ```dvc
  $ dvc lock bar.dvc
  $ dvc status

    foo.dvc
            outs
                    changed:  foo
  ```

- Run `dvc unlock` to unlock it back:

  ```dvc
  $ dvc unlock bar.dvc
  $ dvc status

    bar.dvc
            deps
                    changed:  foo
    foo.dvc
            outs
                    changed:  foo
  ```
