# .dvcignore File

Marks which files and/or directories should be excluded when traversing a
<abbr>DVC project</abbr>.

Sometimes you might want DVC to ignore some files while working with the
project. For example, when working in a <abbr>workspace</abbr> directory with a
large number of data files, you might encounter extended execution time for
operations as simple as `dvc status`. In other case you might want to omit files
or folders unrelated to the project (like `.DS_Store` on MacOS). To address
these scenarios, DVC supports optional `.dvcignore` files. `.dvcignore` works
similar to `.gitignore` in Git.

## How does it work?

- You need to create the `.dvcignore` file. It can be placed in the root of the
  project or inside any subdirectory (see also [remarks](#Remarks) below).
- Populate it with [patterns](https://git-scm.com/docs/gitignore) that you would
  like to ignore.
- Each line should contain only one pattern.
- During execution of commands that traverse directories, DVC will ignore
  matching paths.

## Remarks

Ignored files will not be saved in <abbr>cache</abbr>, they will be non-existent
for DVC. It's worth to remember that, especially when ignoring files inside
DVC-handled directories.

**It is crucial to understand, that DVC might remove ignored files upon
`dvc run` or `dvc repro`. If they are not produced by a
[pipeline](/doc/command-reference/pipeline) [stage](/doc/command-reference/run),
they can be deleted permanently.**

Keep in mind, that when you add to `.dvcignore` entries that affect one of the
existing <abbr>outputs</abbr>, its status will change and DVC will behave as if
that affected files were deleted.

If DVC finds a `.dvcignore` file inside a dependency or output directory, it
raises an error. Ignoring files inside such directories should be handled from a
`.dvcignore` in higher levels of the project tree.

## Syntax

The same as for [`.gitignore`](https://git-scm.com/docs/gitignore).

## Examples

Let's see what happens when we add a file to `.dvcignore`.

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

We created the `data/` directory with two files. Let's ignore one of them, and
track the directory with DVC.

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

Only the checksums of a directory (`data/`) and one files have been
<abbr>cached</abbr>. This means that `dvc add` ignored one of the files
(`data1`).

> Refer to
> [Structure of cache directory](/doc/user-guide/dvc-files-and-directories#structure-of-cache-directory)
> for more info.

Now, let's modify file `data1` and see if it affects `dvc status`.

```dvc
$ dvc status

Data and pipelines are up to date.

$ echo "123" >> data/data1
$ dvc status

Data and pipelines are up to date.
```

`dvc status` also ignores `data1`. The same modification on a tracked file will
produce a different output:

```dvc
$ echo "123" >> data/data2
$ dvc status

data.dvc:
	changed outs:
		modified:           data
```

## Example: Moving ignored data

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
adding new file:

```dvc
$ dvc status

Data and pipelines are up to date.

$ mv data/data1 data/data3
$ dvc status

data.dvc:
	changed outs:
		modified:           data
```

## Example: Ignore DVC tracked file

Let's analyze an example <abbr>workspace</abbr>:

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
