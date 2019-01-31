# status

Show changed stages in the pipeline and mismatches either between the local cache and local files, or between the local cache and remote cache.

## Synopsis

```usage
    usage: dvc status [-h] [-q | -v] [-j JOBS] [--show-checksums]
                      [-c] [-r REMOTE] [-a] [-T] [-d]
                      [targets [targets ...]]
```

## Description

`dvc status` searches for changes in the pipeline, showing which stages have changed and must be reproduced (`dvc repro`).  Changes are detected through the `md5` hash of every file listed in every stage file in the pipeline against the corresponding file in the filesystem.  The output indicates the detected changes, indicating what will be updated when `dvc repro` is executed.

If no differences are detected, `dvc status` prints this message:

> Pipeline is up to date. Nothing to reproduce.

The says that no differences were detected, and therefore that no stages would be rerun if `dvc repro` were executed.

If instead differences have been detected, `dvc status` lists those changes.  For each stage with differences, the _dependencies_ and/or _outputs_ that differ are listed.

DVC stage files list both files managed in the git repository, and in the DVC cache.  The pipeline therefore comprises both sets of file, and `dvc status` will detect any changes in either set of files.

The `dvc status` command runs in one of two modes, _local_ and _cloud_ (triggered by using the `--cloud` option).  In local mode comparison are made between data files in the workspace and corresponding files in the local cache (`.dvc/cache`).  In cloud mode comparisons are made between the local cache, and a cache stored elsewhere.  Remote caches are defined using the `dvc remote` command.

The command can be limited to one or more stages by listing the stage file(s) as `targets`.  When combined with the `--with-deps` option, a search is made for changes in other stages that affect the target stage. 

## Options

* `-d`, `--with-deps` shows finds changes by tracking dependencies to the named target stage.  This option only has effect when one or more target stages are named.  By traversing the dependencies, DVC searches backward through the pipeline from the named target(s).  This means DVC will not show changes occurring later in the pipeline than the named target(s).  Applies whether or not `--cloud` is specified.

* `-v`, `--verbose` displays detailed tracing information from executing the `dvc status` command.

* `-q`, `--quiet` do not write anything to standard output. Exit with 0 if pipeline is up to date, otherwise 1.

* `-c`, `--cloud` enables comparison against a remote cache.  If no `--remote` option has been given, DVC will compare against the default remote cache.  Otherwise the comparison will be against the remote specified in the `--remote` option.  Using `--cloud` enables the remaining options.

* `-r REMOTE`, `--remote REMOTE` specifies which remote cache (see `dvc remote list`) to compare against.  The argument, `REMOTE`, is the name given for a remote defined using the `dvc remote` command.   Applies only if `--cloud` is specified.

* `-a`, `--all-branches` compares cache content against all git branches.  It should be used to compare different variants of an experiment.  The corresponding branches are shown in the status output.  Applies only if `--cloud` is specified.

* `-T`, `--all-tags`  compares cache content against all git tags.  It
should be used to compare different variants of an experiment if tags are used
for checkpoints.  The corresponding tags are shown in the status output.  Applies only if `--cloud` is specified.

* `--show-checksums`  shows the DVC checksum for the file, rather than the file name.  Applies only if `--cloud` is specified.

* `-j JOBS`, `--jobs JOBS` specifies the number of jobs DVC can use to retrieve information from remote servers.  This only applies when the `--cloud` option is used.

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

```dvc
$ vi code/featurization.py
... edit the code
$ dvc status
matrix-train.p.dvc
	deps
		changed:  code/featurization.py

$ dvc status model.p.dvc 
Pipeline is up to date. Nothing to reproduce.
$ dvc status model.p.dvc --with-deps
matrix-train.p.dvc
	deps
		changed:  code/featurization.py
```

Editing a file, such as the dependency `code/featurization.py`, causes the corresponding stage to be marked as changed.  If the `dvc status` command is limited to a target that had no changes, result shows no changes.  By adding `--with-deps` the change will be found, so long as the change is in a preceding stage.

```dvc
$ dvc remote list
rcache	/Volumes/Extra/dvc/classify/rcache
$ dvc status --cloud --remote rcache
Preparing to collect status from /Volumes/Extra/dvc/classify/rcache
[##############################] 100% Collecting information
	new:      data/model.p
	new:      data/eval.txt
	new:      data/matrix-train.p
	new:      data/matrix-test.p
$ dvc status --cloud --remote rcache --show-checksums
Preparing to collect status from /Volumes/Extra/dvc/classify/rcache
[##############################] 100% Collecting information
	new:      f0a6e3eed7c7c1a1c707da2c1673ca72
	new:      d6b228f7904bd200d4eb643fe0e8efd8
	new:      f506aa14271f793ffd7eca113f5920cd
	new:      9c0b1f5c3560b6a2838b3fbcd7d72665
$ dvc status --cloud --remote rcache --all-branches
Preparing to collect status from /Volumes/Extra/dvc/classify/rcache
[##############################] 100% Collecting information
	new:      data/matrix-train.p(master)
	new:      data/matrix-test.p(master)
	new:      data/model.p(master)
	new:      data/eval.txt(master)
$ dvc status -c --remote rcache --all-tags
Preparing to collect status from /Volumes/Extra/dvc/classify/rcache
[##############################] 100% Collecting information
	new:      data/eval.txt(master) data/eval.txt(train-model-more-trees)
	new:      data/model.p(master) data/model.p(train-model-more-trees)
```

The output shows where the location of the remote cache as well as any differences between the local cache and remote cache.  The word `new` means the local cache has files that do not exist in the remote cache.

```dvc
$ dvc status --cloud --remote rcache
Preparing to collect status from /Volumes/Extra/dvc/classify/rcache
[##############################] 100% Collecting information
	deleted:  data/matrix-test.p
	deleted:  data/eval.txt
	deleted:  data/matrix-train.p
	deleted:  data/model.p
```

The word `deleted` means the local cache does not have some of the files present in the remote cache.  The remote cache may have been updated from elsewhere and therefore have additional files.  For the typical process to update workspaces, see [Share Data And Model Files](/doc/use-cases/share-data-and-model-files)
