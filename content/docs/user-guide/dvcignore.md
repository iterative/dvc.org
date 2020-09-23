# `.dvcignore` File

Marks which files and/or directories should be excluded when traversing a
<abbr>DVC project</abbr>.

Sometimes you might want DVC to ignore some files while working with the
project. For example, when working in a <abbr>workspace</abbr> directory with a
large number of data files, you might encounter extended execution time for
operations as simple as `dvc status`. In other case you might want to omit files
or folders unrelated to the project (like `.DS_Store` on MacOS). To address
these scenarios, DVC supports optional `.dvcignore` files.

`.dvcignore` is similar to `.gitignore` in Git, and can be tested with our
helper command `dvc check-ignore`.

## How does it work?

- You need to create a `.dvcignore` file. These can be placed in the root of the
  project, or in any subdirectory (see the [remarks](#Remarks) below).
- Populate it with [.gitignore patterns](https://git-scm.com/docs/gitignore).
  You can find useful templates [here](https://github.com/github/gitignore).
- Each line should contain only one pattern.
- During execution of commands that traverse directories, DVC will ignore
  matching paths.

## Remarks

Ignored files will not be saved in <abbr>cache</abbr>, they will be non-existent
for DVC. It's worth to remember that, especially when ignoring files inside
DVC-handled directories.

⚠️ Important! Note that `dvc run` and `dvc repro` might remove ignored files. If
they are not produced by a pipeline [stage](/doc/command-reference/run), they
can be lost permanently.

Keep in mind that when you add `.dvcignore` patterns that affect an existing
<abbr>output</abbr>, its status will change and DVC will behave as if that
affected files were deleted.

💡 Note that you can use the `dvc check-ignore` command to check whether given
files or directories are ignored by the patterns in a `.dvcignore` file.

If DVC finds a `.dvcignore` file inside a dependency or output directory, it
raises an error. Ignoring files inside such directories should be handled from a
`.dvcignore` in higher levels of the project tree.

## Examples

Let's see what happens when we add a file to `.dvcignore`:

```dvc
$ mkdir data
$ echo 1 > data/data1
$ echo 2 > data/data2
$ tree
.
└── data
    ├── data1
    └── data2
```

We created the `data/` directory with two data files. Let's ignore one of them,
and double check that it's being ignored by DVC:

```dvc
$ echo data/data1 >> .dvcignore
$ cat .dvcignore
data/data1
$ dvc check-ignore data/*
data/data1
```

> Refer to `dvc check-ignore` for more details on that command.

## Example: Skip specific files when adding directories

Let's now track the directory with `dvc add`, and see what happens in the
<abbr>cache</abbr>:

```dvc
$ dvc add data
...
$ tree .dvc/cache
.dvc/cache
├── 26
│   └── ab0db90d72e28ad0ba1e22ee510510
└── ad
    └── 8b0ddcf133a6e5833002ce28f97c5a.dir
$ md5 data/*
b026324c6904b2a9cb4b88d6d61c81d1  data/data1
26ab0db90d72e28ad0ba1e22ee510510  data/data2
```

Only the cache entries of the `data/` directory itself and one file have been
stored. Checking the hash value of the data files manually, we can see that
`data2` was cached. This means that `dvc add` did ignore `data1`.

> Refer to
> [Structure of cache directory](/doc/user-guide/dvc-files-and-directories#structure-of-the-cache-directory)
> for more info.

## Example: Ignore file state changes

Now, let's modify file `data1` and see if it affects `dvc status`.

```dvc
$ dvc status
Data and pipelines are up to date.

$ echo "2345" >> data/data1
$ dvc status
Data and pipelines are up to date.
```

`dvc status` ignores `data1`. Modifications on a tracked file produce a
different output:

```dvc
$ echo "345" >> data/data2
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
$ echo 'dir1/*' >> .dvcignore
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
