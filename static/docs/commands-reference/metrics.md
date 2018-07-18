# metrics

Add, remove or show project metrics.

DVC has the ability to tag a specified output file as a file that contains
metrics to track. Typically people use this functionality to find the best
performing experiment across multiple branches (experiments).

DVC expects a metric file to be a text in `TSV`, `CSV` or `JSON` format. Each
metric could be any project specific number - `AUC`, `ROC`, etc. DVC itself
does not imply any specific meaning for these numbers. Usually these numbers are
produced by the model evaluation script and serve as a way to compare and pick
the best performing variation.


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

## Options

* `add` - makes target a metrics file to be tracked. Sets a special flag
(see [/doc/user-guide/dvc-file-format]('DVC File Format')) in `.dvc` file to
identify a specified output as a metric file. Alternatively, metrics file could
be specified via`-m` parameter of the `dvc run` command.

* `show` - show project metrics across all branches. Find the same metric file
in all branches and list values. This is useful to pick the best performing
variant of the experiment.

* `remove` - keep target as an output, stop tracking as a metrics file.


## Example
```dvc
    $ dvc run -d data/model.p -d data/matrix-test.p \
              -d code/evaluate.py -d code/conf.py -O data/eval.txt \
              -f Dvcfile \
              python code/evaluate.py

    $ dvc metrics add data/eval.txt
    $ dvc metrics show

      master:
          data/eval.txt: AUC: 0.624652

    $ dvc metrics remove data/eval.txt
    $ dvc metrics show
```
