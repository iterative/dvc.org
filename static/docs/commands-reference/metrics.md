# metrics

Add, remove, or show project metrics.

DVC has the ability to tag a specified output file as a file that contains
metrics to track. Metrics are usually any project specific numbers - `AUC`,
`ROC`, etc. DVC itself does not imply any specific meaning for these numbers.
Usually these numbers are produced by the model evaluation script and serve as
a way to compare and pick the best performing experiment variant.


```usage
    usage: dvc metrics [-h] [-q] [-v] {show,add,remove} [target]

    positional arguments:
        show                  Show metrics
        add                   Add metrics
        remove                Remove metrics

    optional arguments:
        -h, --help            show this help message and exit
        -q, --quiet           Be quiet.
        -v, --verbose         Be verbose.
```


## add

Tag the file located at `path` as a metric file. Sets a special flag
(see [DVC File Format](/doc/user-guide/dvc-file-format)) in the relevant `.dvc`
file to identify a specified output as a metric file. Alternatively, an output
file could be made a metric via`-m` parameter of the `dvc run` command.

While any text file could be used as a metric file to track, it's recommended to
use `TSV`, `CSV` or `JSON` formats, DVC provides a way (see `show` below), to
parse these formats to get to a specific number of file contains multiple
metrics.

```usage
    usage: dvc metrics add [-h] [-q] [-v] path

    positional arguments:
      path           Path to metrics file

    optional arguments:
      -h, --help     show this help message and exit
      -q, --quiet    Be quiet.
      -v, --verbose  Be verbose.
```


## show

Find and print project metrics. It will finds and prints all (default) or a
specified metric file in the current branch (default) or across all branches.

```usage
usage: dvc metrics show [-h] [-q] [-v]
                        [--json-path JSON_PATH | --tsv-path TSV_PATH | --htsv-path HTSV_PATH | --csv-path CSV_PATH | --hcsv-path HCSV_PATH]
                        [-a, --all-branches]
                        [path]

positional arguments:
  path                  Path to metrics file

optional arguments:
  -h, --help            show this help message and exit
  -q, --quiet           Be quiet.
  -v, --verbose         Be verbose.
  --json-path JSON_PATH
                        JSON path
  --tsv-path TSV_PATH   TSV path 'row,column'(e.g. '1,2')
  --htsv-path HTSV_PATH
                        Headed TSV path 'row,column'(e.g. 'Name,3'
  --csv-path CSV_PATH   CSV path 'row,column'(e.g. '1,2')
  --hcsv-path HCSV_PATH
                        Headed CSV path 'row,column'(e.g. 'Name,3'
  -a, --all-branches    Show metrics for all branches
```

**Options:**

* `*-path` - specify a path within a metric file to get a specific metric value.
 Should be used if metric file contains multiple numbers and you need to get a
 only one of them. Only single path is allowed. If multiple metric files exist
 in the project, the same parser and path will be applied to all of them. It may
 fail to produce any results or parse files that are not in a corresponding
 format in this case.

* `all-branches` - get and print metric file contents across all branches. It's
should be used to compare different variants of an experiment.


## remove

Keep target as an output, stop tracking as a metric file. It does not remove
or delete file. It changes a flag in the relevant `.dvc` file.


## Example
```dvc
    $ dvc run -d code/evaluate.py -O data/eval.txt -f Dvcfile \
          python code/evaluate.py

    $ dvc metrics add data/eval.txt
    $ dvc metrics show

      master:
          data/eval.txt: AUC: 0.624652

    $ dvc metrics remove data/eval.txt
    $ dvc metrics show
```
