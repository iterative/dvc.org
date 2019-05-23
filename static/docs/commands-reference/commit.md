# commit

Record changes to the repository by updating DVC files and saving outputs to
cache.

## Synopsis

```usage
usage: dvc commit [-h] [-q | -v]
                  [-f] [-d] [-R]
                  [targets [targets ...]]

positional arguments:
  targets               DVC files.
```

## Description

The `dvc commit` command is useful for several scenarios where a dataset is
being changed, a stage or pipeline is in development or one wishes to run
commands outside the control of DVC, or force DVC files update to save some time
rerunning the pipeline or a stage:

- Code or data for a stage is under active development, with rapid iteration of
  code or configuration or data. Run DVC commands (`dvc run`, `dvc repro`, and
  even `dvc add`) using the `--no-commit` option to avoid caching unnecessary
  data over and over again. Use `dvc commit` when the files are finalized.
- One can always execute the code used in a stage without using DVC (keep in
  mind that output files or directories in certain cases must first be
  unprotected or removed, see `dvc unprotect`). Or one could be developing code
  or data, repeatedly manually executing the code until it is working. Once it
  is finished, use `dvc add` or `dvc commit` or `dvc run` where appropriate
  update DVC stage files and to store data to the cache.
- Sometimes we want to clean up a code or configuration file in a way that does
  not cause a result change. We might write in-line documentation with comments
  (we do document our code don't we?), or change indentation, or comment-out
  some debugging printouts, or any other change which does not introduce a
  change in the pipeline result. `dvc commit` can help to avoid rerunning the
  pipeline in these cases by forcing the update of the DVC files.

The last two use cases are **not recommended**, and essentially force update the
DVC files and save data to cache. They are still useful, but keep in mind that
DVC can't guarantee reproducibility in those cases - you commit any data your
want. Let's take a look at what is happening in the fist scenario closely:

Normally DVC commands like `dvc add`, `dvc repro` or `dvc run`, commit the data
to the DVC cache as the last step. What _commit_ means is that DVC:

- Computes a checksum for the file/directory.
- Enters the checksum and file name into the DVC stage file.
- Tells the SCM to ignore the file/directory (e.g. add entry to `.gitignore`).
  If the workspace was initialized with no SCM support (`dvc init --no-scm`)
  this does not happen.
- Adds the file/directory or to the DVC cache.

There are many cases where the last step is not desirable (usually, rapid
iteration on some experiment). For the DVC commands where it is appropriate the
`--no-commit` option prevents the last step from occurring - thus, we are saving
some time and space, by not storing all the data artifacts for all the attempts
we do. The checksum is still computed and added to the DVC file, but the file is
not added to the cache. That's where the `dvc commit` command comes into play.
It handles that last step of adding the file to the DVC cache.

## Options

- `-d`, `--with-deps` - determines the files to commit by searching backwards in
  the pipeline from the named stage(s). The only files which will be committed
  are associated with the named stage, and the stages which execute earlier in
  the pipeline.

- `-R`, `--recursive` - the `targets` value is expected to be a directory path.
  With this option, `dvc commit` determines the files to commit by searching the
  named directory, and its subdirectories, for DVC files for which to commit
  data. Along with providing a `target`, or `target` along with `--with-deps`,
  it is yet another way to limit the scope of DVC files to upload.

- `-f`, `--force` - commit data even if checksums for dependencies or outputs
  did not change.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if all
  stages are up to date or if all stages are successfully rerun, otherwise exit
  with 1.

- `-v`, `--verbose` - displays detailed tracing information from executing the
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

Then download the precomputed data using:

```dvc
$ dvc pull --all-branches --all-tags
```

This data will be retrieved from a preconfigured remote cache.

</details>

## Example: Rapid iterations

Sometimes we want to iterate through multiple changes to configuration, or to
code, sometimes to data, trying multiple options, and improving the output of a
stage. To avoid filling the DVC cache with undesired intermediate results, we
can rerun the pipeline using the `dvc repro --no-commit` or a stage using the
`dvc run --no-commit` option to prevent data from being pushed to cache. When
development of the stage is finished `dvc commit` is used to store data files in
the DVC cache.

In the `featurize.dvc` stage, `src/featurize.py` is executed. A useful change to
make is adjusting a parameter to `CountVectorizer` in that script. Namely,
adjusting the `max_features` option in this line changes the resulting model:

```python
bag_of_words = CountVectorizer(stop_words='english',
            max_features=6000, ngram_range=(1, 2))
```

This option not only changes the trained model, it also introduces a change
which would cause the `featurize.dvc`, `train.dvc` and `evaluate.dvc` stages to
execute if we ran `dvc repro`. But if we want to try several values for this
option and save only the best result to the DVC cache, we can execute as so:

```dvc
$ dvc repro --no-commit evaluate.dvc
```

We can run this command as many times as we like, editing `featurize.py` any way
we like, and so long as we use `--no-commit` the data does not get saved to the
DVC cache. But it is instructive to verify that's the case.

First verification:

```dvc
$ dvc status

evaluate.dvc:
    changed deps:
        modified:           data/features
        modified:           model.pkl
train.dvc:
    changed outs:
        not in cache:       model.pkl
```

And we can look in the DVC cache to see if the new version of `model.pkl` is
indeed _not in cache_ as claimed. Look at `train.dvc` first:

```yaml
cmd: python src/train.py data/features model.pkl
deps:
- md5: d05e0201a3fb47c878defea65bd85e4d
  path: src/train.py
- md5: b7a357ba7fa6b726e615dd62b34190b4.dir
  path: data/features
  md5: b91b22bfd8d9e5af13e8f48523e80250
outs:
- cache: true
  md5: 70599f166c2098d7ffca91a369a78b0d
  metric: false
  path: model.pkl
  persist: false
wdir: .
```

To verify this instance of `model.pkl` is not in the cache, we must know how the
cache files are named. In the DVC cache the first two characters of the checksum
are used as a directory name, and the file name is the remaining characters.
Therefore, if the file had been committed to the cache it would appear in the
directory `.dvc/cache/70`. But:

```dvc
$ ls .dvc/cache/70
ls: .dvc/cache/70: No such file or directory
```

If we've determined the changes to `featurize.py` were successful, we can
execute this set of commands:

```dvc
$ dvc commit
$ dvc status
Pipeline is up to date. Nothing to reproduce.
$ ls .dvc/cache/70
599f166c2098d7ffca91a369a78b0d
```

And we've verified that `dvc commit` has saved the changes into the cache, and
that the new instance of `model.pkl` is in the cache.

## Example: Running without DVC

It is also possible to execute the commands that are executed by `dvc repro` by
hand. You won't have DVC helping you, but you have the freedom to run any script
you like, even ones not recorded in a DVC file. For example:

```dvc
$ python src/featurization.py data/prepared data/features
$ python src/train.py data/features model.pkl
$ python src/evaluate.py model.pkl data/features auc.metric
```

As before, `dvc status` will show which the files have changed, and when your
work is finalized `dvc commit` will commit everything to the cache.

## Example: Updating dependencies

Sometimes we want to clean up a code or configuration file in a way that does
not cause an execution change. We might write in-line documentation with
comments (we do document our code don't we?), or change indentation, or
comment-out some debugging printouts, or any other change which does not
introduce a change in the pipeline result.

```dvc
$ git status -s
M src/train.py

$ dvc status

train.dvc:
    changed deps:
        modified:           src/train.py
```

Let's edit one of the source files. It doesn't matter which one. You'll see that
both Git and DVC recognize a change was made.

If we ran `dvc repro` at this point the pipeline would be rerun. But since the
change was inconsequential, that would be a waste of time and CPU resources.
That's especially critical if the pipeline takes a long time to execute.

```dvc
$ git add src/train.py

$ git commit -m "CHANGED"
[master 72327bd] CHANGED
1 file changed, 2 insertions(+)

$ dvc commit
dependencies ['src/train.py'] of 'train.dvc' changed.
Are you sure you commit it? [y/n] y

$ dvc status

Pipeline is up to date. Nothing to reproduce.
```

Nothing special is required, we simply `commit` to both the SCM and DVC. Since
the pipeline is up to date, `dvc repro` will not do anything.
