# Connect Code and Data

Even in its basic scenarios, commands like `dvc add`, `dvc push`, `dvc pull`
described in the previous sections could be used independently and provide a
basic useful framework to track, save and share models and large data files.

To achieve full reproducibility though you have to connect your code and
configuration with the data it processes to produce the result:

```dvc
    $ dvc run \
        -d prepare.py -d data.xml \           # dependencies
        -o data.tsv \                         # outputs
        python prepare.py data.xml data.tsv   # command
```

To be able to actually try this, execute first these commands to get the code
and install dependencies. It will install packages like `pandas` and 
`scikit-learn`, that are required to run this example, consider using `virtualenv`
to isolate your environment:

```dvc
    $ wget -q -O - https://dvc.org/s3/get-started/code.tgz | tar zx
    $ pip install -U -r requirements.txt
    $ git add .
    $ git commit -m 'add code'
```

`dvc run` command creates a `.dvc` file which has the same
[format](/doc/user-guide/dvc-file-format) as the file we created in the
[previous section](/doc/get-started/add-files) to track `data.csv`, except in
this case it has additional information that `model.pkl` depends on `train.py`
and `data.csv`, and the command `python train.py data.csv` is required to build
it.
