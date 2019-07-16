# metrics remove

Keep file as an output, remove metric flag and stop tracking as a metric file.

## Synopsis

```usage
usage: dvc metrics remove [-h] [-q | -v] path

positional arguments:
  path           Path to a metric file.

```

## Description

This command searches for the corresponding DVC-file for the metric file `path`
provided (i.e. a DVC-file that specifies one of its outputs is the file path in
question – see `dvc metrics add` or `dvc run` with `-m` and `-M` options) and
resets the metric flag for the provided output.

It does not remove or delete the file provided. It only changes a flag in the
corresponding [DVC-file](/doc/user-guide/dvc-file-format). It also keeps the
file as an output of the [stage](/doc/commands-reference/run) in question.

## Examples

Let's first create an output that is not a metric file:

```dvc
$ dvc run -M metrics.tsv \
          "echo -e 'time/tauc/n2019-02-13/t0.9643' > metrics.tsv"
```

This command produces the following metrics file:

```dvc
$ cat metrics.tsv

time	auc
2019-02-13	0.9643

```

To extract the AUC value out of it, we can use the `-t` and `-x` options that
`dvc metrics show` command supports (alternatively, see `dvc metrics modify`
command to learn how to apply `-t` and `-x` permanently):

```dvc
$ dvc metrics show -t htsv -x 0,auc metrics.tsv

metrics.tsv: ['0.9643']
```

If you check the `metrics.tsv.dvc` file, you should see that `metric: true` is
set:

```yaml
md5: 7eca44a876f57f7a1614bea457876db2
cmd: echo -e 'time/tauc/n2019-02-13/t0.9643' > metrics.tsv
outs:
  - md5: 9c012f709cfca85103d2680acfa5f628
    path: metrics.tsv
    cache: false
    metric: true
```

Now, let's reset the flag with the `dvc metrics remove` command:

```dvc
$ dvc metrics remove metrics.tsv

Saving information to 'metrics.tsv.dvc'.
```

Let's check the same DVC-file now:

```yaml
md5: 7eca44a876f57f7a1614bea457876db2
cmd: echo -e 'time/tauc/n2019-02-13/t0.9643' > metrics.tsv
outs:
  - md5: 9c012f709cfca85103d2680acfa5f628
    path: metrics.tsv
    metric:
```

As you can see, nothing has changed at all, except the flag `metric: true`. And
both files are still here:

```dvc
$ tree .

.
├── metrics.tsv
└── metrics.tsv.dvc

0 directories, 2 files
```
