# commit

Record changes to the repository by saving outputs to cache.

## Synopsis

```usage
    usage: dvc commit [-h] [-q | -v] [-f] [-d] [-R] [targets [targets ...]]

    positional arguments:
      targets               DVC files.
```

## Description

Normally DVC commands like `dvc add`, `dvc repro` or `dvc run`, commit the data
to the DVC cache as the last step. What _commit_ means is that DVC

* Computes a checksum for the file
* Enters the checksum and file name into the DVC stage file
* Tells the SCM to ignore the file (e.g. add entry to `.gitignore`)
* Adds the file to the DVC cache

There are many cases where the last step is not desirable. For the DVC commands
where it is appropriate the `--no-commit` option prevents the last step from
occurring. The checksum is still computed and added to the DVC file, but the
file is not added to the cache.

That's where the `dvc commit` command comes into play. It handles that last
step of adding the file to the DVC cache.

The `dvc commit` command is useful for several scenarios where a stage is in
development, or takes a long time to run, or must be run on another machine
with higher compute power. The key is to run DVC commands in a mode where data
is not immediately committed to the cache (the `--no-commit` or `--no-exec`
options), and to commit the data as a separate step performed when it is certain
the data is finalized.

* Code for a stage is under active development, with lots of temporary files
  sitting in the workspace. Committing those temporary files would clutter up
  the cache, so it's better to commit them when development is finished.
* Execution of a stage takes a long time to run, like 24 hours, or requires
  specialized hardware like GPU's or an HPC cluster. The pipeline and cache
  might be on one machine, like a laptop, and execution of the long-running
  stage might be manually coordinated with the data added to the cache using
  `dvc commit` when ready.

## Options

* `-d`, `--with-deps` - determines the files to commit by searching backwards in
  the pipeline from the named stage(s). The only files which will be committed
  are associated with the named stage, and the stages which execute earlier in
  the pipeline.

* `-R`, `--recursive` - the `targets` value is expected to be a directory path.
  With this option, `dvc commit` determines the files to commit by searching the
  named directory, and its subdirectories, for DVC files for which to commit
  data. Along with providing a `target`, or `target` along with `--with-deps`,
  it is yet another way to limit the scope of DVC files to upload.

* `-f`, `--force` - commit data even if checksums for dependencies or outputs
  did not change.

* `-h`, `--help` - prints the usage/help message, and exit.

* `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if all
  stages are up to date or if all stages are successfully rerun, otherwise exit
  with 1.

* `-v`, `--verbose` - displays detailed tracing information from executing the
  `dvc add` command.


## Examples

With an already set-up DVC workspace we can exercise `--no-commit` and
`dvc commit` like so:

```dvc
    $ echo foo > foo
    $ dvc add foo
    $ dvc run -d foo -o bar --no-commit 'echo bar > bar'
    ... possible long-running command execution
    $ dvc status
    bar.dvc:
            changed outs:
                    missing cache:      bar
    $ dvc commit
    $ dvc status
    Pipeline is up to date. Nothing to reproduce.
```

