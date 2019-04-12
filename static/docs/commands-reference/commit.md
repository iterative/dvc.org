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
* Tells the SCM to ignore the file (e.g. add entry to `.gitignore`).  If the
  workspace was initialized with no SCM support (`dvc init --no-scm`) this does
  not happen.
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

Let's start with the example workspace used in the
[Getting Started](/doc/get-started) tutorial.  Setup requires these steps:

```dvc
    $ git clone https://github.com/iterative/example-get-started
    $ cd example-get-started
    $ dvc pull
```

The workspace in the Git repository is preconfigured with a DVC remote containing
precomputed data we can use in the following examples.

## Example: Editing a data file

Sometimes we want to edit a data or configuration file and rerun the pipeline to
see what difference it makes.  To replace a data file we'd use the `dvc remove`
command, but to edit it we use `dvc unprotect`.

```dvc
    $ ls -l data/
    total 74072
    -rw-r--r--  2 david  admin  37916850 Apr 11 17:03 data.xml

    $ dvc unprotect data/data.xml
    [##############################] 100% Unprotecting 'data/data.xml'

    $ ls -l data/
    total 74072
    -rw-r--r--  1 david  admin  37916850 Apr 11 17:06 data.xml
```

The `1` in link count here indicates DVC has unprotected the file.  For other
link types this will appear in different ways.  At this point we can safely edit
the data file.

After editing the file we can use `dvc commit` to update the changes.

```dvc
    $ dvc commit
    ...
    outputs ['data/data.xml'] of 'data/data.xml.dvc' changed. Are you sure you commit it? [y/n] y
    ...
    dependencies ['data/data.xml'] of 'prepare.dvc' changed. Are you sure you commit it? [y/n] y
```

Because this file is referenced from two DVC files, we are queried twice.

## Example: Running the pipeline without committing data changes

As was suggested in the previous section, sometimes we want to change the data
to try different options.  To avoid filling the cache with temporary results as
you try different algorithms we can unprotect all affected files, and use the
`dvc repro --no-commit` option to prevent the cache from being updated.

We start with unprotecting the files involved in the affected stages:

```dvc
    $ dvc unprotect data/data.xml data/prepared/ data/features/ model.pkl 
```

We can now edit `data/data.xml` or any file in the `src` directory.

To rerun the pipeline without committing data to the cache:

```dvc
    $ dvc repro --no-commit train.dvc 
```

And we might end up with a status like this:

```dvc
    $ dvc status

    data/data.xml.dvc:
        changed outs:
            not in cache:       data/data.xml
    evaluate.dvc:
        changed deps:
            modified:           data/features
            modified:           model.pkl
    train.dvc:
        changed outs:
            not in cache:       model.pkl
```

Once we're satisfied with the changes, they can be committed to the DVC cache:

```dvc
    $ dvc commit
    ... commit output
    $ dvc status
    Pipeline is up to date. Nothing to reproduce.
```

## Example: Execute a stage on a remote machine

Sometimes code must be executed somewhere else, for example on an HPC cluster or
a machine with attached GPU's.  In this case let examine how to execute the
`train.dvc` stage elsewhere.

We can execute the stages prior to `train.dvc` like so:

```dvc
    $ dvc repro data/data.xml.dvc prepare.dvc featurize.dvc 

    Stage 'data/data.xml.dvc' didn't change.
    Pipeline is up to date. Nothing to reproduce.
    Stage 'data/data.xml.dvc' didn't change.
    Stage 'prepare.dvc' didn't change.
    Pipeline is up to date. Nothing to reproduce.
    Stage 'data/data.xml.dvc' didn't change.
    Stage 'prepare.dvc' didn't change.
    Stage 'featurize.dvc' didn't change.
    Pipeline is up to date. Nothing to reproduce.
```

This ensures that all other data is up-to-date and we are ready to run the
`train.dvc` stage elsewhere.

Because the `train.dvc` stage has `model.pkl` as its output, we need to
unprotect that file because it will be updated from results computed on the
remote machine:

```dvc
    $ dvc unprotect model.pkl 
```

Next we must copy any required files to the remote machine and execute the
required commands on that machine.  Once it is finished we copy back the results
and commit them to the DVC cache.

```dvc
    $ dvc commit
```


