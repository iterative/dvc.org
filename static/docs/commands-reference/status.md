# status

Show changed stages in the pipeline and mismatches either between the local cache and local files, or between the local cache and remote cache.

## Synopsis

```usage
    usage: dvc status [-h] [-q | -v] [-j JOBS] [--show-checksums]
                      [-c] [-r REMOTE] [-a] [-T] [-d]
                      [targets [targets ...]]

Show the project status.

positional arguments:
  targets               DVC files.

optional arguments:
  -h, --help            show this help message and exit
  -q, --quiet           Be quiet.
  -v, --verbose         Be verbose.
  -j JOBS, --jobs JOBS  Number of jobs to run simultaneously.
  --show-checksums      Show checksums instead of file names.
  -c, --cloud           Show status of a local cache compared to a remote
                        repository.
  -r REMOTE, --remote REMOTE
                        Remote repository to compare local cache to.
  -a, --all-branches    Show status of a local cache compared to a remote
                        repository for all branches.
  -T, --all-tags        Show status of a local cache compared to a remote
                        repository for all tags.
  -d, --with-deps       Show status for all dependencies of the specified
                        target.

```

## Description

`dvc status` allows the user to inspect changes in the pipeline, checking which stages have changed hence requiring reproduction (meaning - `dvc repro`).  Stages go out of date when the dependencies, code or data files, have changed from what is in the DVC cache.  The output indicates what will be updated when `dvc repro` is executed.

If nothing differs between the current files and the cache, `dvc status` prints this message:

> Pipeline is up to date. Nothing to reproduce.

Remember that the pipeline is calculated from the dependencies (`deps`) and outputs (`outs`) listed in the `.dvc` files and the `Dvcfile` (the stages).  The message above therefore means that since these dependency and output files match the cached files the `dvc repro` command would do nothing.

If instead differences have been detected, `dvc status` lists those changes.  For each stage, that is for each `.dvc` file, or `Dvcfile`, it lists any changed dependency or output.

## Options

* `-d`, `--with-deps` ... Applies whether or not `--cloud` is specified.

* `-c`, `--cloud` enables comparison against a remote cache.

* `-a`, `--all-branches` shows the corresponding git branches.  Applies only if `--cloud` is specified.

* `-T`, `--all-tags`  shows the corresponding git tags.  Applies only if `--cloud` is specified.

* `--show-checksums`  shows the DVC checksum for the file, rather than the file name.  Applies only if `--cloud` is specified.

* `-r REMOTE`, `--remote REMOTE` specifies which remote (see `dvc remote list`) to compare against.    Applies only if `--cloud` is specified.

* `-j JOBS`, `--jobs JOBS` specifies the number of jobs DVC can use to retrieve information from remote servers.  This only applies when the `--cloud` option is used.

* `-v`, `--verbose` displays detailed tracing information from executing the `dvc status` command.

* `-q`, `--quiet` suppresses all output.

* `targets` names zero or more `.dvc` files

## Examples

```dvc
$ dvc status

  bar.dvc
          outs
                  changed:  bar
          deps
                  changed:  foo
  foo.dvc
          outs
                  changed:  foo
```

This shows that for `bar.dvc` the dependency, `foo`, has changed, and the output, `bar` has changed.  Likewise for `foo.dvc` the dependency `foo` has changed, but no output has changed.

If one then runs `dvc repro` to reproduce the workspace, this is output:

```dvc
$ dvc status
Pipeline is up to date. Nothing to reproduce.
```

This message explains that the workspace is in sync and no recalculations are needed.

While setting up an experiment in a DVC workspace, one creates a git branch for that experiment then make some modifications:

```dvc
$ git checkout -b bigram
Switched to a new branch 'bigram'
$ vi code/featurization.py
$ dvc status
matrix-train.p.dvc
	deps
		changed:  code/featurization.py
```

The status output indicates that in the `matrix-train.p.dvc` stage the dependency `code/featurization.py` has changed.  That is because that script was edited.  This is a comparison between the local files and the local cache, and running `dvc repro` will rerun corresponding portions of the pipeline to update the local cache.

Having run `dvc repro`, the `dvc status` command will again say the pipeline is up to date.  If there is a remote cache one may want to push the new data to that remote cache.

```dvc
$ dvc status --cloud --remote rcache
Preparing to collect status from /Volumes/Extra/dvc/classify/rcache
[##############################] 100% Collecting information
	new:      data/model.p
	new:      data/eval.txt
	new:      data/matrix-train.p
	new:      data/matrix-test.p
```

We see that the local cache is different from the remote cache.

```dvc
$ dvc status --cloud --remote rcache --show-checksums
Preparing to collect status from /Volumes/Extra/dvc/classify/rcache
[##############################] 100% Collecting information
	new:      f0a6e3eed7c7c1a1c707da2c1673ca72
	new:      d6b228f7904bd200d4eb643fe0e8efd8
	new:      f506aa14271f793ffd7eca113f5920cd
	new:      9c0b1f5c3560b6a2838b3fbcd7d72665
```

If desired, we can see the cache objects by their checksum instead of file name.

```dvc
$ dvc status --cloud --remote rcache --all-branches
Preparing to collect status from /Volumes/Extra/dvc/classify/rcache
[##############################] 100% Collecting information
	new:      data/matrix-train.p(master)
	new:      data/matrix-test.p(master)
	new:      data/model.p(master)
	new:      data/eval.txt(master)
```

In this case the word `new` means the local cache has files that do not exist in the remote cache.

The `--all-branches` option shows the corresponding git brach for each file.

```dvc
$ dvc status -c --remote rcache --all-tags
Preparing to collect status from /Volumes/Extra/dvc/classify/rcache
[##############################] 100% Collecting information
	new:      data/eval.txt(master) data/eval.txt(train-model-more-trees)
	new:      data/model.p(master) data/model.p(train-model-more-trees)
```

The `--all-tags` option shows the corresponding git tags.

```dvc
$ dvc status --cloud --remote rcache matrix-train.p.dvc 
Preparing to collect status from /Volumes/Extra/dvc/classify/rcache
[##############################] 100% Collecting information
	new:      data/matrix-test.p
	new:      data/matrix-train.p
```

Specifying a target correspondingly limits the output.

One can detect when a remote cache is updated:

```dvc
$ dvc status -c --remote rcache
Preparing to collect status from /Volumes/Extra/dvc/classify/rcache
[##############################] 100% Collecting information
	deleted:  data/matrix-test.p
	deleted:  data/eval.txt
	deleted:  data/matrix-train.p
	deleted:  data/model.p
```

In this case work was performed in another work area, updated code was pushed to the git repository, and updated data to the shared remote cache.  In this case the word `deleted` means the local cache does not have some of the files present in the remote cache.

After performing a `git pull` to retrieve the updated code, the data can be updated:

```dvc
$ dvc pull --remote rcache
Preparing to download data from '/Volumes/Extra/dvc/classify/rcache'
Preparing to collect status from /Volumes/Extra/dvc/classify/rcache
[##############################] 100% Collecting information
[##############################] 100% Analysing status.
(1/4): [##############################] 100% data/eval.txt
(2/4): [##############################] 100% data/model.p
(3/4): [##############################] 100% data/matrix-test.p
(4/4): [##############################] 100% data/matrix-train.p
Checking out '{'scheme': 'local', 'path': '/Volumes/Extra/dvc/classify/demo/data/eval.txt'}' with cache '9c0b1f5c3560b6a2838b3fbcd7d72665'.
Data '{'scheme': 'local', 'path': '/Volumes/Extra/dvc/classify/demo/data/Posts.tsv'}' didn't change.
Checking out '{'scheme': 'local', 'path': '/Volumes/Extra/dvc/classify/demo/data/matrix-train.p'}' with cache '931f4dc236a7a9525bdf87d1253bc000'.
Checking out '{'scheme': 'local', 'path': '/Volumes/Extra/dvc/classify/demo/data/matrix-test.p'}' with cache 'ff9bd3717e0548fb36dfdf54bcf4ac69'.
Data '{'scheme': 'local', 'path': '/Volumes/Extra/dvc/classify/demo/data/Posts.xml'}' didn't change.
Checking out '{'scheme': 'local', 'path': '/Volumes/Extra/dvc/classify/demo/data/model.p'}' with cache '938a00b8585ddd5453bd0b37be7f2abe'.
Data '{'scheme': 'local', 'path': '/Volumes/Extra/dvc/classify/demo/data/Posts-test.tsv'}' didn't change.
Data '{'scheme': 'local', 'path': '/Volumes/Extra/dvc/classify/demo/data/Posts-train.tsv'}' didn't change.
Data '{'scheme': 'local', 'path': '/Volumes/Extra/dvc/classify/demo/data/Posts.xml.zip'}' didn't change.
$ dvc status -c --remote rcache
Preparing to collect status from /Volumes/Extra/dvc/classify/rcache
[##############################] 100% Collecting information
Pipeline is up to date. Nothing to reproduce.
```


