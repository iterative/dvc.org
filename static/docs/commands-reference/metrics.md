# metrics

Manage metrics.

```sh
    usage: dvc metrics [-h] [-q] [-v] {show,add,remove} ...

    positional arguments:
        show                  Show metrics
        add                   Add metrics
        remove                Remove metrics

    optional arguments:
        -h, --help            show this help message and exit
        -q, --quiet           Be quiet.
        -v, --verbose         Be verbose.
```

## Example
```sh
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
