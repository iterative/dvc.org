# commit

Record changes to DVC-tracked files in the <abbr>project</abbr>, by saving them
to the <abbr>cache</abbr> and updating the `dvc.lock` or `.dvc` files.

## Synopsis

```usage
usage: dvc commit [-h] [-q | -v] [-f] [-d] [-R]
                  [targets [targets ...]]

positional arguments:
  targets        Limit command scope to these stages or .dvc files.
                 Using -R, directories to search for stages or .dvc
                 files can also be given.
```

## Description

The `dvc commit` command is useful for several scenarios, when data already
tracked by DVC changes: when a [stage](/doc/command-reference/run) or
[pipeline](/doc/command-reference/dag) is in development/experimentation; to
force-update the `dvc.lock` or `.dvc` files without reproducing stages or
pipelines; or to mark existing files/dirs as stage <abbr>outputs</abbr>. These
scenarios are further detailed below.

- Code or data for a stage is under active development, with multiple iterations
  (experiments) in code, configuration, or data. Use the `--no-commit` option of
  DVC commands (`dvc add`, `dvc run`, `dvc repro`) to avoid caching unnecessary
  data repeatedly. Use `dvc commit` when the DVC-tracked data is final.

  💡 For convenience, a pre-commit Git hook is available to remind you to
  `dvc commit` when needed. See `dvc install` for more details.

- Sometimes we want to edit source code, config, or data files in a way that
  doesn't cause changes in the results of their data pipeline. We might write
  add code comments, change indentation, remove some debugging printouts, or any
  other change that doesn't cause changed stage outputs. However, DVC will
  notice that some <abbr>dependencies</abbr> have changed, and expect you to
  reproduce the whole pipeline. If you're sure no pipeline results would change,
  use `dvc commit` to force update the `dvc.lock` or `.dvc` files and cache.

- In some cases, we have previously executed a stage, and later notice that some
  of the files/directories used by the stage as dependencies or created as
  outputs are missing from `dvc.yaml`. It is possible to
  [add missing data to an existing stage](/docs/user-guide/how-to/add-deps-or-outs-to-a-stage),
  and then `dvc commit` can be used to save outputs to the cache (and update
  `dvc.lock`)

- It's always possible to manually execute the command or source code used in a
  stage without DVC (outputs must be unprotected or removed first in certain
  cases, see `dvc unprotect`). Once the desired result is reached, use
  `dvc commit` to update the `dvc.lock` file(s) and store changed data to the
  cache.

Let's take a look at what is happening in the first scenario closely. Normally
DVC commands like `dvc add`, `dvc repro` or `dvc run` commit the data to the
<abbr>cache</abbr> after creating or updating a `dvc.lock` or `.dvc` file. What
_commit_ means is that DVC:

- Computes a hash for the file/directory.
- Enters the hash value and file name in the `dvc.lock` or `.dvc` file.
- Tells Git to ignore the file/directory (adding them to `.gitignore`). (Note
  that if the <abbr>project</abbr> was initialized with no Git support
  (`dvc init --no-scm`), this does not happen.)
- Adds the file(s) in question to the cache.

There are many cases where the last step is not desirable (for example rapid
iterations on an experiment). The `--no-commit` option prevents it (on the
commands where it's available). The file hash is still computed and added to the
`dvc.lock` or `.dvc` file, but the actual data is not cached. And this is where
the `dvc commit` command comes into play: It performs that last step when
needed.

Note that it's best to avoid the last three scenarios. They essentially
force-update the `dvc.lock` or `.dvc` files and save data to cache. They are
still useful, but keep in mind that DVC can't guarantee reproducibility in those
cases.

## Options

- `-d`, `--with-deps` - determines files to commit by tracking dependencies to
  the target stages or `.dvc` files. If no `targets` are provided, this option
  is ignored. By traversing all stage dependencies, DVC searches backward from
  the target stages in the corresponding pipelines. This means DVC will not
  commit files referenced in later stages than the `targets`.

- `-R`, `--recursive` - determines the files to commit by searching each target
  directory and its subdirectories for stages or `.dvc` files to inspect. If
  there are no directories among the `targets`, this option is ignored.

- `-f`, `--force` - commit data even if hash values for dependencies or outputs
  did not change.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information from executing the
  `dvc add` command.

## Examples

Let's employ a simple <abbr>workspace</abbr> with some data, code, ML models,
pipeline stages, such as the <abbr>DVC project</abbr> created for the
[Get Started](/doc/tutorials/get-started). Then we can see what happens with
`git commit` and `dvc commit` in different situations.

<details>

### Click and expand to setup the project

Start by cloning our example repo if you don't already have it:

```dvc
$ git clone https://github.com/iterative/example-get-started
$ cd example-get-started
```

Now let's install the requirements. But before we do that, we **strongly**
recommend creating a
[virtual environment](https://python.readthedocs.io/en/stable/library/venv.html):

```dvc
$ python3 -m venv .env
$ source .env/bin/activate
$ pip install -r src/requirements.txt
```

Download the precomputed data using:

```dvc
$ dvc pull --all-branches --all-tags
```

</details>

## Example: Rapid iterations

Sometimes we want to iterate through multiple changes to configuration, code, or
data, trying different ways to improve the output of a stage. To avoid filling
the <abbr>cache</abbr> with undesired intermediate results, we can run a single
stage with `dvc run --no-commit`, or reproduce an entire pipeline using
`dvc repro --no-commit`. This prevents data from being pushed to cache. When
development of the stage is finished, `dvc commit` can be used to store data
files in the cache.

In the `featurize` stage, `src/featurization.py` is executed. A useful change to
make is adjusting the parameters for that script. The parameters are defined in
the `params.yaml` file. Updating the value of the `max_features` param to 6000
changes the resulting model:

```yaml
featurize:
  max_features: 6000
  ngrams: 2
```

This edit introduces a change that would cause the `featurize`, `train` and
`evaluate` stages to execute if we ran `dvc repro`. But if we want to try
several values for `max_features` and save only the best result to the cache, we
can run it like this:

```dvc
$ dvc repro --no-commit
```

We can run this command as many times as we like, editing `params.yaml` any way
we like, and so long as we use `--no-commit`, the data does not get saved to the
cache. Let's verify that's the case:

First verification:

```dvc
$ dvc status
featurize:
	changed outs:
		not in cache:       data/features
train:
	changed outs:
		not in cache:       model.pkl
```

Now we can look in the cache directory to see if the new version of `model.pkl`
is _not in cache_ indeed. Let's look at the latest state of `train` in
`dvc.lock` first:

```yaml
train:
  cmd: python src/train.py data/features model.pkl
  deps:
    - path: data/features
      md5: de03a7e34e003e54dde0d40582c6acf4.dir
    - path: src/train.py
      md5: ad8e71b2cca4334a7d3bb6495645068c
  params:
    params.yaml:
      train.n_estimators: 100
      train.seed: 20170428
  outs:
    - path: model.pkl
      md5: 9aba000ba83b341a423a81eed8ff9238
```

To verify this instance of `model.pkl` is not in the cache, we must know the
path to the cached file. In the cache directory, the first two characters of the
hash value are used as a subdirectory name, and the remaining characters are the
file name. Therefore, had the file been committed to the cache, it would appear
in the directory `.dvc/cache/9a`. Let's check:

```dvc
$ ls .dvc/cache/9a
ls: .dvc/cache/9a: No such file or directory
```

If we've determined the changes to `params.yaml` were successful, we can execute
this set of commands:

```dvc
$ dvc commit
$ dvc status
Data and pipelines are up to date.
$ ls .dvc/cache/70
ba000ba83b341a423a81eed8ff9238
```

We've verified that `dvc commit` has saved the changes into the cache, and that
the new instance of `model.pkl` is there.

## Example: Running commands without DVC

It is also possible to execute the commands that are executed by `dvc repro` by
hand. You won't have DVC helping you, but you have the freedom to run any
command you like, even ones not defined in `dvc.yaml` stages. For example:

```dvc
$ python src/featurization.py data/prepared data/features
$ python src/train.py data/features model.pkl
$ python src/evaluate.py model.pkl data/features auc.metric
```

As before, `dvc status` will show which files have changed, and when your work
is finalized `dvc commit` will commit everything to the <abbr>cache</abbr>.

## Example: Updating dependencies

Sometimes we want to clean up a code or configuration file in a way that doesn't
cause a change in its results. We might write in-line documentation with
comments, change indentation, remove some debugging printouts, or any other
change that doesn't produce different output of pipeline stages.

```dvc
$ git status -s
M src/train.py

$ dvc status
train:
	changed deps:
		modified:           src/train.py
```

Let's edit one of the source code files. It doesn't matter which one. You'll see
that both Git and DVC recognize a change was made.

If we ran `dvc repro` at this point, this pipeline would be reproduced. But
since the change was inconsequential, that would be a waste of time and CPU.
That's especially critical if the corresponding stages take lots of resources to
execute.

```dvc
$ git add src/train.py

$ git commit -m "CHANGED"
[master 72327bd] CHANGED
1 file changed, 2 insertions(+)

$ dvc commit
dependencies ['src/train.py'] of 'train.dvc' changed.
Are you sure you commit it? [y/n] y

$ dvc status
Data and pipelines are up to date.
```

Instead of reproducing the pipeline for changes that do not produce different
results, just use `commit` on both Git and DVC.
