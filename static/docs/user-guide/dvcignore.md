# .dvcignore File

Marks which files and/or directories should be ignored when traversing
repository.

Sometimes you might want DVC to ignore some files while working with the
project. For example, when working on a project with many files in its data
directory, you might encounter extended execution time for operations that are
as simple as `dvc status`. In other case you might want to omit files or folders
unrelated to the project (like `.DS_Store` on Mac). To address these
requirements we are implementing `.dvcignore` files handling. `.dvcignore` by
design works similar way as `.gitignore` does.

## How does it work?

- You need to create `.dvcignore` file.
- Populate it with [patterns](https://git-scm.com/docs/gitignore) that you would
  like to ignore.
- Each line should contain only one pattern.
- During execution of commands that traverse directories, DVC will ignore
  matching paths.

## Remarks

- Ignored files will not be saved in cache, they will be non-existent for DVC.
  It's worth to remember that, especially when ignoring files inside DVC-handled
  directories. **It is crucial to understand, that DVC might remove ignored
  files upon `dvc run` or `dvc repro`. If they are not produced by a
  [pipeline](/doc/get-started/pipeline) step, they can be deleted permanently.**
- Keep in mind, that when you add to .dvcignore entries that affect one of the
  existing <abbr>outputs</abbr>, its status will change and DVC will behave as
  if that affected files were deleted.
- If DVC stumbles upon `.dvcignore` file inside a dependency or an
  <abbr>output</abbr> directory, it raises an error. Ignoring files inside such
  directory should be handled from `.dvcignore` file from upper levels of
  project tree.

## Syntax

The same as for [`.gitignore`](https://git-scm.com/docs/gitignore).

## Examples: Modification of ignored data

Lets see if what happens when we modify ignored file.

```dvc
$ mkdir data
$ echo data1 >> data/data1
$ echo data2 >> data/data2
$ tree .

.
└── data
    ├── data1
    └── data2
```

We created the `data` directory. Lets ignore part of the `data` and add it under
DVC control.

```dvc
$ echo data/data1 >> .dvcignore
$ cat .dvcignore

data/data1

$ dvc add data
$ tree .dvc/cache

.dvc/cache
├── 54
│   └── 40cb5e4c57ab54af68127492334a23.dir
└── ed
    └── c3d3797971f12c7f5e1d106dd5cee2
```

As we can see, `data1` has been ignored. Cache contains only one file entry (for
`data2`) and one dir entry (`data`).

Now, lets modify `data1` and see if it affects `dvc status`.

```dvc
$ dvc status

Pipelines are up to date. Nothing to reproduce.

$ echo "123" >> data/data1
$ dvc status

Pipelines are up to date. Nothing to reproduce.
```

Same modification applied to not ignored file will make `dvc status` inform
about change.

```dvc
$ echo "123" >> data/data2
$ dvc status

data.dvc:
	changed outs:
		modified:           data
```

## Examples: Moving ignored data

```dvc
$ mkdir data
$ echo data1 >> data/data1
$ echo data2 >> data/data2
$ tree .

.
└── data
    ├── data1
    └── data2

$ echo data/data1 >> .dvcignore
$ cat .dvcignore

data/data1

$ dvc add data
```

If we move not ignored data, DVC will behave as if we modified data directory by
adding new file.

```dvc
$ dvc status

Pipelines are up to date. Nothing to reproduce.

$ mv data/data1 data/data3
$ dvc status

data.dvc:
	changed outs:
		modified:           data
```

## Examples: Ignore dvc controlled file

Lets analyze an example project:

```dvc
$ mkdir dir1 dir2
$ echo data1 >> dir1/data1
$ echo data2 >> dir2/data2
$ dvc add dir1/data1 dir2/data2
$ tree .
.
├── dir1
│   ├── data1
│   └── data1.dvc
└── dir2
    ├── data2
    └── data2.dvc
```

Modify data files:

```dvc
$ echo mod > dir1/data1
$ echo mod > dir2/data2
```

Check status:

```dvc
$ dvc status
dir1/data1.dvc:
	changed outs:
		modified:           dir1/data1
dir2/data2.dvc:
	changed outs:
		modified:           dir2/data2
```

Note that both data files are displayed as modified. Create a `.dvcignore` file
and insert pattern matching one of the files:

```dvc
$ echo dir1/* >> .dvcignore
```

Check status again:

```dvc
$ dvc status
dir2/data2.dvc:
	changed outs:
		modified:           dir2/data2
```

Only the second file is displayed because DVC ignores `data1.dvc` and `data1`
when collecting DVC-files.
