# Connect Code and Data

Even in its basic scenarios, commands like `dvc add`, `dvc push`, `dvc pull`
described in the previous sections could be used independently and provide a
basic useful framework to track, save and share models and large data files.

To achieve full reproducibility though you have to connect your code and
configuration with the data it processes to produce the result:

```dvc
    $ dvc run \
        -d train.py -d data.csv \   # dependencies
        -o model.pkl \              # outputs
        python train.py data.csv    # command
```

`dvc run` command creates a `.dvc` file which has the same
[format](/doc/user-guide/dvc-file-format) as the file we created in the
[previous section](/doc/get-started/add-files) to track `data.csv`, except in
this case it has additional information that `model.pkl` depends on `train.py`
and `data.csv`, and `python train.py data.csv` is required to build it.
