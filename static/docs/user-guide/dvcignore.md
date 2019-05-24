# dvcignore

Mark which files and/or directories should be ignored when traversing
repository.

Sometimes you might want DVC to ignore files while traversing the project
directory. For example, when working on a project with many files in its data
directory, you might encounter extended execution time for operations that are
as simple as `dvc status`. To prevent this, we are implementing `.dvcignore`
files handling. When fully implemented, their implementation is intended to
provide similar functionality as `.gitignore` files provide for `git`.

## How does it work

- You need to create `.dvcignore` file.
- Populate it with [patterns](https://git-scm.com/docs/gitignore) that you would
  like to ignore.
- Each line should contain only one pattern.
- During execution of commands that traverse directories, DVC will ignore
  matching paths.
- Not every operation supports `.dvcignore`. To see current limitations, read
  following paragraph.

## Current limitations

During development, we noticed that there are few potential uses cases that
might be tricky to handle (e.g. what to do when we are `dvc add`-ing directory
containing `.dvcignore` file). Therefore, we decided to enable this feature
gradually in different parts of the project.

Currently `.dvcignore` files will be read and applied in any operation that
collects stage files (e.g. `checkout`, `metrics`, `status`, `run`, `repro`), so
it is advised to use it in cases described in the first paragraph, when amount
of files in tree of repository directory causes performance issues.

## Syntax

The same as for [`.gitignore`](https://git-scm.com/docs/gitignore).

## Example

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

Only second file is displayed because DVC ignores `data1.dvc` and `data1` when
collecting stage files.
