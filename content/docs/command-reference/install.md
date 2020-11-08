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
[DVC-files](/doc/user-guide/dvc-files-and-directories) corresponding to that
version. The project's DVC-files in turn refer to data stored in
<abbr>cache</abbr>, but not necessarily in the <abbr>workspace</abbr>. Normally,
it would be necessary to use `dvc checkout` to update the workspace accordingly.

This hook automates `dvc checkout` after `git checkout`.

**Commit/Reproduce**: Before committing DVC changes with Git, it may be
necessary using `dvc commit` to store new data files not yet in cache. Or the
changes might require reproducing the corresponding
[pipeline](/doc/command-reference/dag) (with `dvc repro`) to regenerate the
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
  automatically update the workspace with the correct data file versions.
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
        # use s3/gs/etc instead of all to only install specific cloud support
        additional_dependencies: ['.[all]']
        language_version: python3
        stages:
          - push
      - always_run: true
        id: dvc-post-checkout
        language_version: python3
        stages:
          - post-checkout
    repo: https://github.com/iterative/dvc
    # use a specific version (e.g. 1.8.1) instead of master if you don't want
    # to use the upstream version
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

## Example: Checkout both Git and DVC

Switching from one Git commit to another (with `git checkout`) may change the
set of [DVC-files](/doc/user-guide/dvc-files-and-directories) in the
<abbr>workspace</abbr>. This would mean that the currently present data files
and directories no longer matches project's version (which can be fixed with
`dvc checkout`).

Let's first list the available tags in the _Get Started_ repo:

```dvc
$ git tag
0-git-init
1-dvc-init
2-track-data
3-config-remote
4-import-data
5-source-code
6-prepare-stage
7-ml-pipeline
8-evaluation
9-bigrams-model
10-bigrams-experiment
...
```

These tags are used to mark points in the development of the project, and to
document specific experiments conducted in it. To take a look at one, we
checkout the `7-ml-pipeline` tag:

```dvc
$ git checkout 7-ml-pipeline
Note: checking out '7-ml-pipeline'.

You are in 'detached HEAD' state...

$ dvc status
featurize:
	changed outs:
		modified:           data/features
...
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
matched the hash values in the corresponding `.dvc` and `dvc.lock`
[files](/doc/user-guide/dvc-files-and-directories). Running `dvc checkout` then
brings them up to date, and a second `dvc status` tells us that the data files
now do match the DVC files.

```dvc
$ git checkout master
Previous HEAD position was 6666298 Create ML pipeline stages
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
$ git checkout 7-ml-pipeline
HEAD is now at 6666298 Create ML pipeline stages
M       model.pkl
M	data/features/

$ dvc status
Data and pipelines are up to date.
```

Look carefully at this output and it is clear that the `dvc checkout` command
has indeed been run. As a result the workspace is up to date with the data files
matching what is referenced by the DVC files.

## Example: Showing DVC status when committing with Git

To follow this example, start with the same workspace as before, making sure it
is not in a _detached HEAD_ state by running `git checkout master`.

If we simply edit one of the code files:

```dvc
$ vi src/featurization.py

$ git commit -a -m "modified featurization"

featurize:
    changed deps:
        modified:           src/featurization.py
[master 1116ddc] modified featurization
 1 file changed, 1 insertion(+), 1 deletion(-)
```

We see that the output of `dvc status` has appeared in the `git commit`
interaction. This new behavior corresponds to the Git hook installed, and it
informs us that the workspace is out of sync. Therefore, we know that
`dvc repro` command is needed:

```dvc
$ dvc repro
...
To track the changes with git run:

    git add dvc.lock

$ git status -s
M dvc.lock

$ git commit -a -m "updated data after modified featurization"
Data and pipelines are up to date.

[master 78d0c44] modified featurization
 5 files changed, 12 insertions(+), 12 deletions(-)
```

After reproducing the pipeline, the data files should be in sync with the code
and configuration, and we want to commit the changes with Git. In doing so,
`dvc status` is run automatically again, informing us that the data files have
been updated indeed, with the `Data and pipelines are up to date.` message.
