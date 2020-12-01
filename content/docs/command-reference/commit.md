# commit

<abbr>Cache</abbr> changed files and directories tracked by DVC, and update the
corresponding `dvc.lock` or `.dvc` files if needed.

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

This command can be useful for several scenarios, when
[stages](/doc/command-reference/run) are under development, or to force-update
the cache without having to execute stage commands again (avoiding `dvc repro`).

> Note that this does not register project versions. That can be done with
> `git commit` (if using Git).

Normally, `dvc repro` and `dvc run` finish up with the same steps as `dvc add`,
for each <abbr>output</abbr> involved. In summary:

- Compute the hash value of the file or directory and save it in the `dvc.lock`
  or `.dvc` file.
- If using Git, append the file/directory path to `.gitignore`.
- Store the data in question in the <abbr>cache</abbr>.

For stages under development, the last step can be skipped with the
`--no-commit` option of those commands. This avoids caching unfinished data
(hash values are still calculated and added to `dvc.lock` or `.dvc` files). This
is where `dvc commit` comes into play: It performs that last step when needed.

💡 For convenience, a pre-commit Git hook is available to remind you to
`dvc commit` when needed. See `dvc install` for more info.

Other scenarios include:

- Often we edit source code, configuration, or input data in a way that doesn't
  cause changes to any outputs, for example reformatting data, adding code
  comments, etc. However, DVC notices all changes to <abbr>dependencies</abbr>
  and expects you to reproduce the corresponding stages. Use `dvc commit`
  instead to force accepting the changes without having to `dvc repro`.

- Sometimes, after executing a stage, we realize that we forgot to specify some
  of its dependencies or outputs in `dvc.yaml`. Fortunately it's possible to
  [add the missing deps/outs](/docs/user-guide/how-to/add-deps-or-outs-to-a-stage),
  and `dvc commit` may be needed to finalize the remedy (see link).

- It's also possible to execute stage commands by hand (without `dvc repro`), or
  to manually modify their output files or directories. Use `dvc commit` to
  register the changes with DVC once you're done.

  > Note that `dvc unprotect` (or removing the outputs) is usually required
  > before rewriting files/dirs tracked by DVC.

Note that it's best to try avoiding these scenarios, where the cache,
`dvc.lock`, and `.dvc` files are force-updated. DVC can't guarantee
reproducibility in those cases.

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

## Example: Executing stage commands without DVC

Sometimes you may want to execute stage commands manually (instead of using
`dvc repro`). You won't have DVC helping you, but you'll have the freedom to run
any command, even ones not defined in `dvc.yaml`. For example:

```dvc
$ python src/featurization.py data/prepared data/features
$ python src/train.py data/features model.pkl
$ python src/evaluate.py model.pkl data/features auc.metric
```

As before, `dvc status` will show which tracked files/dirs have changed, and
when your work is finalized, `dvc commit` will save the outputs the
<abbr>cache</abbr>.

## Example: Updating dependencies

Sometimes we want to clean up a code or configuration file in a way that doesn't
cause a change in its results. We might write in-line documentation with
comments, change indentation, remove some debugging printouts, or any other
change that doesn't produce different output of pipeline stages.

```dvc
$ git status -s
M src/train.py

$ dvc status
train.dvc:
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
