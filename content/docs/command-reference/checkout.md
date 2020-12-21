# checkout

Update DVC-tracked files and directories in the <abbr>workspace</abbr> based on
current `dvc.lock` and `.dvc` files.

## Synopsis

```usage
usage: dvc checkout [-h] [-q | -v] [--summary] [-d] [-R] [-f]
                    [--relink]
                    [targets [targets ...]]

positional arguments:
  targets       Limit command scope to these tracked files/directories,
                .dvc files, or stage names.
```

## Description

This command is usually needed after `git checkout`, `git clone`, or any other
operation that changes the current `dvc.lock` or `.dvc` files. It restores the
corresponding versions of the DVC-tracked files and directories from the
<abbr>cache</abbr> to the workspace.

The `targets` given to this command (if any) limit what to checkout. It accepts
paths to tracked files or directories (including paths inside tracked
directories), `.dvc` files, and stage names (found in `dvc.yaml`).

The execution of `dvc checkout` does the following:

- Checks `dvc.lock` and `.dvc` files to compare the hash values of their
  <abbr>outputs</abbr> against the actual files or directories in the
  <abbr>workspace</abbr> (similar to `dvc status`).

  > Stage outputs must be defined in `dvc.yaml`. If found there but not in
  > `dvc.lock`, they'll be skipped with a warning.

- Missing data files or directories are restored from the cache. Those that
  don't match with `dvc.lock` or `.dvc` files are removed. See options `--force`
  and `--relink`. A list of the changes done is printed.

💡 For convenience, a Git hook is available to automate running `dvc checkout`
after `git checkout`. See the
[Automating example](#example-automating-dvc-checkout) below or `dvc install`
for more details.

By default, this command tries not make copies of cached files in the workspace,
using reflinks instead when supported by the file system (refer to
[File link types](/doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache)).
The next linking strategy default value is `copy` though, so unless other file
link types are manually configured in `cache.type` (using `dvc config`), files
will be copied. Keep in mind that having file copies doesn't present much of a
negative impact unless the project uses very large data (several GBs or more).
But leveraging file links is crucial with large files, for example when checking
out a 50Gb file by copying might take a few minutes whereas, with links,
restoring any file size will be almost instantaneous.

> When linking files takes longer than expected (10 seconds for any one file)
> and `cache.type` is not set, a warning will be displayed reminding users about
> the faster link types available. These warnings can be turned off setting the
> `cache.slow_link_warning` config option to `false` with `dvc config cache`.

This command will fail to checkout files that are missing from the cache. In
such a case, `dvc checkout` prints a warning message. It also lists the partial
progress made by the checkout.

There are two methods to restore a file missing from the cache, depending on the
situation. In some cases the cache can be pulled from
[remote storage](/doc/command-reference/remote) using `dvc pull`. In other cases
the pipeline must be reproduced (using `dvc repro`) to regenerate its outputs.

## Options

- `--summary` - display a short summary of the changes done by this command in
  the workspace, instead of a full list of changes.

- `-R`, `--recursive` - determines the files to checkout by searching each
  target directory and its subdirectories for DVC-files to inspect. If there are
  no directories among the `targets`, this option is ignored.

- `-d`, `--with-deps` - determines files to update by tracking dependencies to
  the target DVC-files (stages). If no `targets` are provided, this option is
  ignored. By traversing all stage dependencies, DVC searches backward from the
  target stages in the corresponding pipelines. This means DVC will not checkout
  files referenced in later stages than the `targets`.

- `-f`, `--force` - does not prompt when removing workspace files. Changing the
  current set of DVC-files with `git checkout` can result in the need for DVC to
  remove files that don't match those DVC-file references or are missing from
  cache. (They are not "committed", in DVC terms.)

- `--relink` - ensures the file linking strategy (`reflink`, `hardlink`,
  `symlink`, or `copy`) for all data in the workspace is consistent with the
  project's [`cache.type`](/doc/command-reference/config#cache). This is
  achieved by restoring **all data files or a directories** referenced in
  current DVC-files (regardless of whether they match a current DVC-file).

- `-h`, `--help` - shows the help message and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information from executing the
  `dvc pull` command.

## Examples

Let's employ a simple <abbr>workspace</abbr> with some data, code, ML models,
pipeline stages, such as the <abbr>DVC project</abbr> created for the
[Get Started](/doc/tutorials/get-started). Then we can see what happens with
`git checkout` and `dvc checkout` as we switch from tag to tag.

<details>

### Click and expand to setup the project

Start by cloning our example repo if you don't already have it:

```dvc
$ git clone https://github.com/iterative/example-get-started
$ cd example-get-started
$ dvc fetch -aT
```

We run `dvc fetch` with the `-aT` flags to get the DVC-tracked data from all Git
branches and tags from [remote storage](/doc/command-reference/remote) to the
<abbr>cache</abbr>. This way it's all available for the `checkout` examples
below.

</details>

The workspace looks like this:

```dvc
.
├── data
│   └── data.xml.dvc
├── dvc.lock
├── dvc.yaml
├── params.yaml
├── prc.json
├── scores.json
└── src
    └── <code files here>
```

Note that this repository includes the following tags, that represent different
variants of the resulting model:

```dvc
$ git tag
...
baseline-experiment     <- First simple version of the model
bigrams-experiment      <- Uses bigrams to improve the model
```

We can now run `dvc checkout` to update the most recent `model.pkl`, `data.xml`,
and any other files tracked by DVC. The model file hash (`ab349c2...`) is saved
in `dvc.lock`, and it can be confirmed with:

```dvc
$ dvc checkout

$ md5 model.pkl
MD5 (data.xml) = ab349c2b5fa2a0f66d6f33f94424aebe
```

## Example: Switch versions

What if we want to "rewind history", so to speak? The `git checkout` command
lets us restore any commit in the repository history (including tags). It
automatically adjusts the repo files, by replacing, adding, or deleting them as
necessary.

```dvc
$ git checkout baseline-experiment  # Git commit where model was created
```

Let's check the hash value of `model.pkl` in `dvc.lock` now:

```yaml
outs:
  - path: model.pkl
    md5: 98af33933679a75c2a51b953d3ab50aa
```

But if you check the MD5 of `model.pkl`, the file hash is still the same
(`ab349c2...`). This is because `git checkout` changed `dvc.lock` and other DVC
files, but it did nothing with `model.pkl`, or any other DVC-tracked files/dirs.
Since Git doesn't track them, to get them we can do this:

```dvc
$ dvc checkout
M       model.pkl
M       data\features\

$ md5 model.pkl
MD5 (model.pkl) = 98af33933679a75c2a51b953d3ab50aa
```

DVC went through the stages (in `dvc.yaml`) and adjusted the current set of
<abbr>outputs</abbr> to match the `outs` in the corresponding `dvc.lock`.

## Example: Specific files or directories

`dvc checkout` only affects the tracked data corresponding to any given
`targets`:

```dvc
$ git checkout master
$ dvc checkout            # Start with latest version of everything.

$ git checkout baseline-experiment -- dvc.lock
$ dvc checkout model.pkl  # Get previous model file only.
```

Note that you can checkout data within directories tracked. For example, the
`featurize` stage has the entire `data/features` directory as output, but we can
just get this:

```dvc
$ dvc checkout data/features/test.pkl
```

## Example: Automating DVC checkout

We want the data files or directories (managed by DVC) to match with the other
files (managed by Git e.g. source code). This requires us to remember running
`dvc checkout` when needed after a `git checkout`, and we may not always
remember to do so. Wouldn't it be nice to automate this?

```dvc
$ dvc install
```

`dvc install` installs Git hooks to automate common operations, including
running `dvc checkout` when needed.

(Having followed the previous example) we can then checkout the master branch
again:

```dvc
$ git checkout bigrams-experiment  # Has the latest model version

$ md5 model.pkl
MD5 (model.pkl) = ab349c2b5fa2a0f66d6f33f94424aebe
```

Previously this took two commands, `git checkout` followed by `dvc checkout`. We
can now skip the second one, which is automatically run for us. The workspace
files are automatically updated accordingly.
