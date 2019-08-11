# install

Install DVC hooks into the Git repository to automate certain common actions.

## Synopsis

```usage
usage: dvc install [-h] [-q | -v]
```

## Description

DVC provides an intelligent data repository on top of a regular SCM repository
like Git to store code and configuration files. With `dvc install`, the two are
more tightly integrated in order to cause certain convenient actions to happen
automatically.

Namely:

**Checkout**: For any given branch or tag, Git checks out the
[DVC-files](/doc/user-guide/dvc-file-format) corresponding to that version. The
DVC-files in turn refer to data files in the DVC cache by checksum. When
switching from one SCM branch or tag to another, the SCM retrieves the
corresponding DVC-files. By default that leaves the <abbr>project</abbr> in a
state where the DVC-files refer to data files other than what is currently in
the <abbr>workspace</abbr>. The user at this point should run `dvc checkout` so
that the data files will match the current DVC-files.

The installed Git hook automates running `dvc checkout`.

**Commit**: When committing a change to the Git repository, that change possibly
requires reproducing the corresponding
[pipeline](/doc/commands-reference/pipeline) (with `dvc repro`) to regenerate
the project results. Or there might be files not yet in the cache, which is a
reminder to run `dvc commit`.

The installed Git hook automates reminding the user to run either `dvc repro` or
`dvc commit`.

**Push**: While publishing changes to the Git remote repository with `git push`,
it easy to forget that `dvc push` command usually needs to be run to save
corresponding changes in data files and directories that are under DVC control
to the DVC remote storage.

The installed Git hook automates executing `dvc push`.

## Installed Git hooks

- A `pre-commit` hook executes `dvc status` before `git commit` to inform the
  user about the differences between <abbr>cache</abbr> and workspace.
- A `post-checkout` hook executes `dvc checkout` after `git checkout` to
  automatically synchronize the data files with the new workspace state.
- A `pre-push` hook executes `dvc push` before `git push` to upload files and
  directories under DVC control to remote.

For more information about git hooks, refer to the
[git-scm documentation](https://git-scm.com/docs/githooks).

## Disable Git hooks

When you run `dvc install`, it creates three files under the `.git/hooks`
directory:

```
.git/hooks
├── post-checkout
├── pre-commit
└── pre-push
```

To disable them, you need to **remove** or **edit** those files (i.e.
`rm .git/hooks/post-checkout`, `vim .git/hooks/pre-commit`).

_If a hook already exists, DVC will try to append the corresponding content, so
if you want to disable the DVC-specific behavior, you'll need to open the script
and edit it._

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Let's employ a simple <abbr>workspace</abbr> with some data, code, ML models,
pipeline stages, such as the <abbr>DVC project</abbr> created in our
[Get Started](/doc/get-started) section. Then we can see what happens with
`dvc install` in different situations.

<details>

### Click and expand to setup the project

Start by cloning our sample repo if you don't already have it:

```dvc
$ git clone https://github.com/iterative/example-get-started
$ cd example-get-started
```

Now let's install the requirements. But before we do that, we **strongly**
recommend creating a virtual environment with a tool such as
[virtualenv](https://virtualenv.pypa.io/en/stable/):

```dvc
$ virtualenv -p python3 .env
$ source .env/bin/activate
$ pip install -r requirements.txt
```

Download the precomputed data using:

```dvc
$ dvc pull --all-branches --all-tags
```

This data will be retrieved from a preconfigured remote cache.

</details>

## Example: Checkout both DVC and Git

Let's start our exploration with the impact of `dvc install` on the
`dvc checkout` command. Remember that switching from one Git version to another
(with `git checkout`) changes the set of DVC-files in the project, which then
also changes the data files that should be placed in the workspace (with
`dvc checkout`).

Let's first list the available tags in the _Get Started_ project:

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
9-bigrams
baseline-experiment
bigrams-experiment
```

These tags are used to mark points in the development of the project, and to
document specific experiments conducted in it. To take a look at one, we
checkout the `6-featurization` tag:

```dvc
$ git checkout 6-featurization
Note: checking out '6-featurization'.

You are in 'detached HEAD' state.  ...

$ dvc status

featurize.dvc:
    changed outs:
        modified:           data/features

$ dvc checkout

[##############################] 100% Checkout finished!

$ dvc status

Data and pipelines are up to date.
```

After running `git checkout` we are also shown a message saying _You are in
'detached HEAD' state_. Returning the workspace to a normal state requires
running `git checkout master`.

We also see that the first `dvc status` tells us about differences between the
project <abbr>cache</abbr> and the data files currently in the workspace. Git
changed the DVC-files in the workspace, which changed references to data files.
What `dvc status` did is inform us the data files in the workspace no longer
matched the checksums in the [DVC-files](/doc/user-guide/dvc-file-format).
Running `dvc checkout` then checks out the corresponding data files, and a
second `dvc status` now tells us the data files match the DVC-files.

```dvc
$ git checkout master
Previous HEAD position was d13ba9a add featurization stage
Switched to branch 'master'
Your branch is up to date with 'origin/master'.

$ dvc checkout
[##############################] 100% Checkout finished!
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
is the `post-checkout` script which runs after `git checkout`.

We can now repeat the command run earlier, to see the difference.

```dvc
$ git checkout 6-featurization
Note: checking out '6-featurization'.

You are in 'detached HEAD' state. ...

HEAD is now at d13ba9a add featurization stage
[##############################] 100% Checkout finished!

$ dvc status

Data and pipelines are up to date.
```

Look carefully at this output and it is clear that the `dvc checkout` command
has indeed been run. As a result the workspace is up to date with the data files
matching what is referenced by the DVC-files.

## Example: Showing DVC status on Git commit

The other hook installed by `dvc install` runs before `git commit` operation. To
see see what that does, start with the same workspace, making sure it is not in
the _detached HEAD_ state from the previous example by first running
`git checkout master`.

If we simply edit one of the code files:

```dvc
$ vi src/featurization.py

$ git commit -a -m "modified featurization"

featurize.dvc:
    changed deps:
        modified:           src/featurization.py
[master 1116ddc] modified featurization
 1 file changed, 1 insertion(+), 1 deletion(-)
```

We see that `dvc status` output has appeared in the `git commit` interaction.
This new behavior corresponds to the Git hook which was installed, and it
helpfully informs us the workspace is out of sync. We should therefore run the
`dvc repro` command.

```dvc
$ dvc repro evaluate.dvc

... much output
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
in sync with the code/config files, but we must now commit the changes to the
Git repository. Looking closely we see that `dvc status` is run again, informing
us that the data files are synchronized with the `Pipelines are up to date.`
message.
