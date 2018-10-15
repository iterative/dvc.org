# metrics

Add, modify, remove, or show project metrics.

DVC has the ability to tag a specified output file as a file that contains
metrics to track. Metrics are usually any project specific numbers - `AUC`,
`ROC`, etc. DVC itself does not imply any specific meaning for these numbers.
Usually these numbers are produced by the model evaluation script and serve as
a way to compare and pick the best performing experiment variant.

```usage
    usage: dvc metrics [-h] [-q] [-v] {show,add,modify,remove} ...

    positional arguments:
        show                  Show metrics
        add                   Add metrics
        modify                Modify metrics
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
use `TSV`, `CSV`, or `JSON` formats. DVC provides a way (see `show` below), to
parse these formats to get to a specific value if file contains multiple
metrics.

```usage
    usage: dvc metrics add [-h] [-q] [-v] [-t TYPE] [-x XPATH] path

    positional arguments:
      path           Path to metrics file

    optional arguments:
      -h, --help              show this help message and exit
      -q, --quiet             Be quiet.
      -v, --verbose           Be verbose.
      -t TYPE, --type TYPE    Type of metrics(RAW/JSON/TSV/HTSV/CSV/HCSV)
      -x XPATH, --xpath XPATH JSON/TSV/HTSV/CSV/HCSV path
```

**Options:**

* `type` - specify a type of the metric file that will be used to determine how
`dvc metrics show` will handle displaying it. This type will be saved into the
respective `.dvc` file and will be used automatically in `dvc metrics show`.

* `xpath` - specify a path within a metric file. Similar to XPath for XML. This
path will be saved into the respective `.dvc` file and will be used
automatically in `dvc metrics show`.

## show

Find and print project metrics. It will find and print all metric files (default) or a
specified metric file in the current branch (default) or across all branches/tags.

```usage
usage: dvc metrics show [-h] [-q] [-v] [-t TYPE] [-x XPATH]
                        [--json-path JSON_PATH | --tsv-path TSV_PATH | --htsv-path HTSV_PATH | --csv-path CSV_PATH | --hcsv-path HCSV_PATH]
                        [-a, --all-branches]
                        [path]

positional arguments:
  path                  Path to metrics file

optional arguments:
  -h, --help              show this help message and exit
  -q, --quiet             Be quiet.
  -v, --verbose           Be verbose.
  -t TYPE, --type TYPE    Type of metrics(RAW/JSON/TSV/HTSV/CSV/HCSV)
  -x XPATH, --xpath XPATH JSON/TSV/HTSV/CSV/HCSV path
  --json-path JSON_PATH   JSON path
  --tsv-path TSV_PATH     TSV path 'row,column'(e.g. '1,2')
  --htsv-path HTSV_PATH   Headed TSV path 'row,column'(e.g. 'Name,3').
  --csv-path CSV_PATH     CSV path 'row,column'(e.g. '1,2').
  --hcsv-path HCSV_PATH   Headed CSV path 'row,column'(e.g. 'Name,3').
  -a, --all-branches      Show metrics for all branches.
  -T, --all-tags          Show metrics for all tags.
```

**Options:**

* `type` - specify a type of the metric file that will be used to determine
 how to handle `xpath` parameter from down below.

* `*path` - specify a path within a metric file to get a specific metric value.
 Should be used if metric file contains multiple numbers and you need to get a
 only one of them. Only single path is allowed. If multiple metric files exist
 in the project, the same parser and path will be applied to all of them. It may
 fail to produce any results or parse files that are not in a corresponding
 format in this case.

* `all-branches` - get and print metric file contents across all branches. It's
should be used to compare different variants of an experiment.

## modify

Modify information about a specified metrics file.

```usage

usage: dvc metrics modify [-h] [-q] [-v] [-t TYPE] [-x XPATH] path

positional arguments:
  path                  Metrics file

optional arguments:
  -h, --help              show this help message and exit
  -q, --quiet             Be quiet.
  -v, --verbose           Be verbose.
  -t TYPE, --type TYPE    Type of metrics(RAW/JSON/TSV/HTSV/CSV/HCSV)
  -x XPATH, --xpath XPATH JSON/TSV/HTSV/CSV/HCSV path
```

## remove

Keep target as an output, stop tracking as a metric file. It does not remove
or delete file. It changes a flag in the relevant `.dvc` file.

```usage
usage: dvc metrics remove [-h] [-q] [-v] path

positional arguments:
  path           Path to metrics file

optional arguments:
  -h, --help     show this help message and exit
  -q, --quiet    Be quiet.
  -v, --verbose  Be verbose.
```


## Example

First, let's create a simple DVC file:

```dvc
    $ dvc run -d code/evaluate.py -M data/eval.json -f Dvcfile \
          python code/evaluate.py
```

NOTE: `-M|--metrics-no-cache` is telling DVC to mark `data/eval.json`
as a metrics file. Using this option is equivalent to using
`-O|--outs-no-cache` and then using `dvc metrics add data/eval.json`
to explicitly mark `data/eval.json` as a metrics file.

Now let's show metrics that we have in a current project:

```dvc
    $ dvc metrics show -a
   
      master:
          data/eval.json: {"AUC": "0.624652"}
```

Then we can tell DVC an XPATH for the metrics file, so that it can
output only the value of AUC without any garbage:

```dvc
    $ dvc metrics modify data/eval.json --type json --xpath AUC
    $ dvc metrics show

      master:
          data/eval.json: 0.624652
```

And finally let's delete data/eval.txt from metrics for our project:

```dvc
    $ dvc metrics remove data/eval.txt
    $ dvc metrics show
    Failed to show metrics: No metric files in this repository. Use 'dvc metrics add' to add a metric file to track.
```
