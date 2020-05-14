# metrics remove

Remove metric mark on a DVC-tracked file: Keeps file located at `path` as an
<abbr>output</abbr>, but removes its mark as a
[project metric](/doc/command-reference/metrics) in the DVC-file.

## Synopsis

```usage
usage: dvc metrics remove [-h] [-q | -v] path

positional arguments:
  path           Path to a metric file.

```

## Description

This command finds a corresponding [DVC-file](/doc/user-guide/dvc-file-format)
for the provided metric file (`path` is defined among the <abbr>outputs</abbr>
of the DVC-file), and resets the `metric` field for the file.

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
$ dvc run -M metrics.json \
        'echo {\"AUC\": 0.9643, \"TP\": 527} > metrics.json'
$ cat metrics.json
{"AUC":0.9671, "TP":531}
```

To extract the AUC value out of `metrics.json`, we can use the `-t` and `-x`
options that `dvc metrics show` command supports:

```dvc
$ dvc metrics show -t json -x AUC metrics.json
        metrics.json: {'AUC': 0.9671}
```

If you check the `metrics.json.dvc` file, you should see that `metric: true` is
set:

```yaml
md5: 1443725f6d0bd5b77aa8d5fc36e886ef
cmd: echo {\"AUC\":0.9643, \"TP\":527} > metrics.json
outs:
  - md5: 0f0e67dc927aa69cd3fc37435ee1304f
    path: metrics.json
    cache: false
    metric: true
    persist: false
```

Now, let's reset the `metric` field with the `dvc metrics remove` command:

```dvc
$ dvc metrics remove metrics.json
```

Let's check the outputs field (`outs`) of same
[DVC-file](/doc/user-guide/dvc-file-format) again:

```yaml
outs:
  - md5: 0f0e67dc927aa69cd3fc37435ee1304f
    path: metrics.json
    cache: false
    metric:
    persist: false
```

As shown above, nothing has changed, except the `metric` field. And both files
are still here:

```dvc
$ ls metrics.json metrics.json.dvc
metrics.json     metrics.json.dvc
```
