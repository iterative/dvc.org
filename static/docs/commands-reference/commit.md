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
to the DVC cache as the last step. What _commit_ means is that DVC:

* Computes a checksum for the file, or for the contents of a directory 
  structure.
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

The `dvc commit` command is useful for several scenarios where a file is being
added, a stage is in development, or one wishes to run commands outside the
control of DVC. One must first use `dvc unprotect` to allow editing some of the
data files, and otherwise run DVC commands using the `--no-commit` option.
See [Update a Tracked File](/doc/user-guide/update-tracked-file) for further
advice.

* Code or data for a stage is under active development, with rapid iteration of
  code or configuration or data. Run DVC commands using the `--no-commit`
  option, and use `dvc commit` when the files are finalized.
* One can always execute the code used in a stage without using DVC, but the
  output files must first be unprotected. Or one could be developing code or
  data, repeatedly manually executing the code until it is working. Once it is
  finished, use `dvc add` or `dvc commit` or `dvc run` where appropriate to
  add files or DVC stages to the pipeline, or to store data to the cache.

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

To explore `dvc commit` let's consider a simple workspace with several stages,
the example workspace used in the [Getting Started](/doc/get-started) tutorial.

<details>

### Click and expand to setup the project

This step is optional, and you can run it only if you want to run this examples
in your environment. First, you need to download the project:

```dvc
    $ git clone https://github.com/iterative/example-get-started
```

Second, let's install the requirements. But before we do that, we **strongly**
recommend creating a virtual environment with `virtualenv` or a similar tool:

```dvc
    $ cd example-get-started
    $ virtualenv -p python3 .env
    $ source .env/bin/activate
```

Now, we can install requirements for the project:

```dvc
    $ pip install -r requirements.txt
```

</details>

## Example: Running the pipeline without committing data changes

Sometimes we want to iterate through multiple changes to data, or configuration,
or to code, trying multiple options. To avoid filling the cache with temporary
results we can unprotect some files, so we can edit them, and rerun the pipeline
using the `dvc repro --no-commit` option to prevent the cache from being
updated.

We start with unprotecting a file to edit:

```dvc
    $ dvc unprotect data/data.xml 
```

In this example pipeline everything is derived from that file. We may want to
change the input data, for example to increase the training data set. This step
lets us safely edit the data file. If we instead wish to edit code in the `src`
directory it is not necessary to unprotect this file.

To rerun the pipeline without committing data to the cache:

```dvc
    $ dvc repro --no-commit train.dvc 
```

We can repeat editing files and rerunning the pipeline as many times as desired
until we're satisfied with the result.

After rerunning the pipeline with `--no-commit` the status might look like this:

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

Once we're satisfied with the changes, they can be committed to the DVC cache
and to the SCM repository:

```dvc
    $ git commit
    ... as needed to record changes into the repository
    $ dvc commit
    ... commit output
    $ dvc status
    Pipeline is up to date. Nothing to reproduce.
```

## Example: Adding a data file without immediate commit

Sometimes we want to add a file to a pipeline, but the file is not finalized.
In this example pipeline, we might have additional data to use. Rather than add
that data to `data.xml` we might want to put it in a second file. Then we would
rewrite scripts like `prepare.py` to use both data files. 

For this example let's only look at the process of using `dvc add --no-commit`
to add the file without immediately saving it to the cache, and later running
`dvc commit` to save it to the cache.

In the workspace setup for the previous example, run these commands:

```dvc
    $ cp data/data.xml data/data2.xml
```

Now edit `data2.xml`, it doesn't matter what change you make just change it.
This mimics having a new data file. Editing the file ensures the copy will have
a different checksum. If two files happen to have the same checksum, DVC will
store one entry in the cache for both files.

```dvc
    $ dvc add data/data2.xml --no-commit

    Adding 'data/data2.xml' to 'data/.gitignore'.
    Saving information to 'data/data2.xml.dvc'.

    To track the changes with git run:

        git add data/.gitignore data/data2.xml.dvc
```

This created a matching DVC file for `data2.xml`, added an entry to `.gitignore`
and suggests we can commit the files to the SCM.

```dvc
    $ cat data/data.xml.dvc 
    md5: dd3616a28331a1a47e63dde650ce05f6
    outs:
    - cache: true
      md5: 19c0d5556733569ad5a57c5ffae4247b
      metric: false
      path: data/data.xml
      persist: false
    wdir: ..

    $ cat data/data2.xml.dvc 
    md5: 9383739085d4b2eb95fd34a23384391d
    outs:
    - cache: true
      md5: 9f3470fcf2a5eaca2e38fddd1f83ebdd
      metric: false
      path: data/data2.xml
      persist: false
    wdir: ..
```

In the DVC file we see a checksum was calculated, and that the checksum indeed
differs from `data.xml`. In the DVC cache the first two characters of the
checksum are used as a directory name, and the file name is the remaining
characters. Therefore, if the file had been committed to the cache it would
appear in the directory `.dvc/cache/9f`. But:

```dvc
    $ ls .dvc/cache/9f
    ls: .dvc/cache/9f: No such file or directory
```

Indeed it is not in the cache, as desired.

After working with the new file we decide it is ready to be committed to the
cache. We will see this:

```dvc
    $ dvc commit
    ... commit output
    $ ls .dvc/cache/9f
    3470fcf2a5eaca2e38fddd1f83ebdd
```

