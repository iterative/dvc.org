# install

Install Git hooks into the <abbr>DVC repository</abbr> to automate certain
common actions.

## Synopsis

```usage
usage: dvc install [-h] [-q | -v] [--use-pre-commit-tool]
```

## Description

DVC provides an intelligent data repository on top of a regular Git repo to
store code and configuration files. With `dvc install`, the two are more tightly
integrated in order to cause certain convenient actions to happen automatically.

Note that this command requires the <abbr>DVC project</abbr> to be a Git
repository. But **the hooks won't activate** if the current branch (commit, tag,
etc.) doesn't have DVC initialized (no `.dvc/` directory present).

Namely:

**Checkout**: For any commit hash, branch or tag, `git checkout` retrieves the
[DVC-files](/doc/user-guide/dvc-file-format) corresponding to that version. The
project's DVC-files in turn refer to data stored in <abbr>cache</abbr>, but not
necessarily in the <abbr>workspace</abbr>. Normally, it would be necessary to
use `dvc checkout` to synchronize workspace and DVC-files.

This hook automates `dvc checkout` after `git checkout`.

**Commit/Reproduce**: Before committing DVC changes with Git, it may be
necessary using `dvc commit` to store new data files not yet in cache. Or the
changes might require reproducing the corresponding
[pipeline](/doc/command-reference/pipeline) (with `dvc repro`) to regenerate the
project's results (which implicitly commits them to DVC as well).

This hook automates `dvc status` before `git commit` when needed, to remind the
user to employ either `dvc commit` or `dvc repro`.

**Push**: While publishing changes to the Git remote with `git push`, its easy
to forget that the `dvc push` command is necessary to upload new or updated data
files and directories tracked by DVC to
[remote storage](/doc/command-reference/remote).

This hook automates `dvc push` before `git push`.

## Installed Git hooks

- A `post-checkout` hook executes `dvc checkout` after `git checkout` to
  automatically synchronize the data files with the new workspace state.
- A `pre-commit` hook executes `dvc status` before `git commit` to inform the
  user about the differences between cache and workspace.
- A `pre-push` hook executes `dvc push` before `git push` to upload files and
  directories tracked by DVC to remote storage.

If a hook already exists, DVC will raise an exception. In that case, please try
to manually edit the existing file or remove it and retry install.

For more information about git hooks, refer to the
[git-scm documentation](https://git-scm.com/docs/githooks).

## Disable Git hooks

When you use `dvc install`, it creates three files under the `.git/hooks`
directory:

```
.git/hooks
├── post-checkout
├── pre-commit
└── pre-push
```

To disable them, you need to **remove** or **edit** those files (i.e.
`rm .git/hooks/post-checkout`, `vim .git/hooks/pre-commit`).

## Using the Pre-commit tool

DVC provides support to manage Git hooks with
[pre-commit](https://pre-commit.com/). To adjust `.pre-commit-config.yaml`, you
can either use `dvc install --use-pre-commit-tool` or add these entries by hand:

```yaml
repos:
  - hooks:
      - id: dvc-pre-commit
        language_version: python3
        stages:
          - commit
      - id: dvc-pre-push
        language_version: python3
        stages:
          - push
      - always_run: true
        id: dvc-post-checkout
        language_version: python3
        stages:
          - post-checkout
    repo: https://github.com/iterative/dvc
    rev: master
```

## Options

- `--use-pre-commit-tool` - installs pre-commit, pre-push, post-checkout Git
  hooks into the [pre-commit](https://pre-commit.com/) config file
  (`.pre-commit-config.yaml`).

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Let's employ a simple <abbr>workspace</abbr> with some data, code, ML models,
pipeline stages, such as the <abbr>DVC project</abbr> created in our
[Get Started](/doc/tutorials/get-started) section. Then we can see what happens
with `dvc install` in different situations.

<details>

### Click and expand to setup the project

Start by cloning our example repo if you don't already have it:

```dvc
$ git clone https://github.com/iterative/example-get-started
$ cd example-get-started
```

Now let's install the requirements. But before we do that, we **strongly**
recommend creating a
[virtual environment](https://packaging.python.org/tutorials/installing-packages/#creating-virtual-environments):

```dvc
$ virtualenv -p python3 .env
$ source .env/bin/activate
$ pip install -r src/requirements.txt
```

Download the precomputed data using:

```dvc
$ dvc pull --all-branches --all-tags
```

</details>

## Example: Checkout both Git and DVC

Switching from one Git commit to another (with `git checkout`) may change the
set of [DVC-files](/doc/user-guide/dvc-file-format) in the
<abbr>workspace</abbr>. This would mean that the currently present data files
and directories no longer matches project's version (which can be fixed with
`dvc checkout`).

Let's first list the available tags in the _Get Started_ repo:

```dvc
$ git tag
0-empty
1-initialize
2-remote
3-add-file
4-sources
5-preparation
6-featurization
7-train
8-evaluation
9-bigrams-model
10-bigrams-experiment
...
```

These tags are used to mark points in the development of the project, and to
document specific experiments conducted in it. To take a look at one, we
checkout the `6-featurization` tag:

```dvc
$ git checkout 6-featurization
Note: checking out '6-featurization'.

You are in 'detached HEAD' state...

$ dvc status
featurize.dvc:
    changed outs:
        modified:           data/features

$ dvc checkout

$ dvc status
Data and pipelines are up to date.
```

After running `git checkout` we are also shown a message saying _You are in
'detached HEAD' state_. Returning the workspace to a normal state requires
running `git checkout master`.

We also see that the first `dvc status` tells us about differences between the
project's <abbr>cache</abbr> and the data files currently in the workspace. Git
changed the DVC-files in the workspace, which changed references to data files.
`dvc status` first informed us that the data files in the workspace no longer
matched the hash values in the corresponding
[DVC-files](/doc/user-guide/dvc-file-format). Running `dvc checkout` then brings
them up to date, and a second `dvc status` tells us that the data files now do
match the DVC-files.

```dvc
$ git checkout master
Previous HEAD position was d13ba9a add featurization stage
Switched to branch 'master'
Your branch is up to date with 'origin/master'.

$ dvc checkout
```

We've seen the default behavior with there being no Git hooks installed. We want
to see how the behavior changes after installing the Git hooks. We must first
reset the workspace to the `HEAD` commit before installing the hooks.

```dvc
$ dvc install

$ cat .git/hooks/pre-commit
#!/bin/sh
exec dvc status

$ cat .git/hooks/post-checkout
#!/bin/sh
exec dvc checkout
```

The two Git hooks have been installed, and the one of interest for this exercise
is the `post-checkout` script that runs after `git checkout`.

We can now repeat the command run earlier, to see the difference.

```dvc
$ git checkout 6-featurization
Note: checking out '6-featurization'.

You are in 'detached HEAD' state...

HEAD is now at d13ba9a add featurization stage

$ dvc status

Data and pipelines are up to date.
```

Look carefully at this output and it is clear that the `dvc checkout` command
has indeed been run. As a result the workspace is up to date with the data files
matching what is referenced by the DVC-files.

## Example: Showing DVC status when committing with Git

To follow this example, start with the same workspace as before, making sure it
is not in a _detached HEAD_ state by running `git checkout master`.

If we simply edit one of the code files:

```dvc
$ vi src/featurization.py

$ git commit -a -m "Modified featurization"

featurize.dvc:
    changed deps:
        modified:           src/featurization.py
[master 1116ddc] modified featurization
 1 file changed, 1 insertion(+), 1 deletion(-)
```

We see that the output of `dvc status` has appeared in the `git commit`
interaction. This new behavior corresponds to the Git hook installed, and it
informs us that the workspace is out of sync. Therefore, we can conclude that
the `dvc repro` command is needed now:

```dvc
$ dvc repro evaluate.dvc
...
To track the changes with git run:

    git add featurize.dvc train.dvc evaluate.dvc

$ git status -s
 M auc.metric
 M evaluate.dvc
 M featurize.dvc
 M src/featurization.py
 M train.dvc

$ git commit -a -m "updated data after modified featurization"

Data and pipelines are up to date.

[master 78d0c44] modified featurization
 5 files changed, 12 insertions(+), 12 deletions(-)
```

After reproducing this pipeline up to the "evaluate" stage, the data files are
in sync with the code/config files, but we must now commit the changes with Git.
Looking closely we see that `dvc status` is used again, informing us that the
data files are synchronized with the `Data and pipelines are up to date.`
message.
