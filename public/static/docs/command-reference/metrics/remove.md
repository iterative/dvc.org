# metrics remove

Stop tracking a [project metric](/doc/command-reference/metrics): Keeps file
located at `path` an <abbr>output</abbr>, but removes its metric mark.

## Synopsis

```usage
usage: dvc metrics remove [-h] [-q | -v] path

positional arguments:
  path           Path to a metric file.

```

## Description

This command finds a corresponding [DVC-file](/doc/user-guide/dvc-file-format)
for the provided metric file `path` – the one that defines `path` among its
<abbr>outputs</abbr>, see `dvc metrics add` or the `-m` and `-M` options of
`dvc run` – and resets the `metric` field for the provided output.

This does not remove or delete the file in question. It only unmarks it as a
metric file. It also keeps the file as an output of the corresponding DVC-file.

If `path` isn't tracked by DVC (described in one of the <abbr>workspace</abbr>
DVC-files), the following error will be raised:

```dvc
ERROR: failed to remove metric file '<path>' -
       unable to find DVC-file with output '<path>'
```

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Let's first create a dummy non-cached metric <abbr>output</abbr> with the `-M`
option of `dvc run`:

```dvc
$ dvc run -M metrics.tsv \
          "echo -e 'time\tauc\n2019-02-13\t0.9643' > metrics.tsv"
...
Saving information to 'metrics.tsv.dvc'.
$ cat metrics.tsv
time	auc
2019-02-13	0.9643
```

To extract the AUC value out of `metrics.tsv`, we can use the `-t` and `-x`
options that `dvc metrics show` command supports:

```dvc
$ dvc metrics show -t htsv -x 0,auc metrics.tsv
	metrics.tsv: ['0.9643']
```

If you check the `metrics.tsv.dvc` file, you should see that `metric: true` is
set:

```yaml
md5: 6f910c9000bb03492d1e66035ba8faf6
cmd: echo -e 'time\tauc\n2019-02-13\t0.9643' > metrics.tsv
wdir: .
outs:
  - md5: 7ce0bc12da7f88c1493763cdd4c3f684
    path: metrics.tsv
    cache: false
    metric: true
    persist: false
```

Now, let's reset the `metric` field with the `dvc metrics remove` command:

```dvc
$ dvc metrics remove metrics.tsv
Saving information to 'metrics.tsv.dvc'.
```

Let's check the outputs section (`outs`) of same
[DVC-file](/doc/user-guide/dvc-file-format) again:

```yaml
outs:
  - md5: 7ce0bc12da7f88c1493763cdd4c3f684
    path: metrics.tsv
    cache: false
    metric:
    persist: false
```

As you can see, nothing has changed, except the `metric` field. And both files
are still here:

```dvc
$ tree
.
├── metrics.tsv
└── metrics.tsv.dvc

0 directories, 2 files
```
