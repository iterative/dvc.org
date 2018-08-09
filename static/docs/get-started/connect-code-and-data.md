# Connect Code and Data

If you have been following along the get started from the very beginning, 
run these commands to get the sample code and install dependencies. It will
install packages like `pandas` and  `scikit-learn`, that are required to run this
example, consider using `virtualenv` to isolate your environment:

```dvc
    $ wget -q -O - https://dvc.org/s3/get-started/code.tgz | tar zx
    $ pip install -U -r requirements.txt
    $ git add .
    $ git commit -m 'add code'
```

Even in its basic scenarios, commands like `dvc add`, `dvc push`, `dvc pull`
described in the previous sections could be used independently and provide a
basic useful framework to track, save and share models and large data files.

To achieve full reproducibility though you have to connect your code and
configuration with the data it processes to produce the result:

```dvc
    $ dvc run \
        -d prepare.py -d data.xml \
        -o data.tsv \
        python prepare.py data.xml data.tsv
```

`dvc run` command creates a `data.tsv.dvc` file which has the same
[format](/doc/user-guide/dvc-file-format) as the file we created in the
[previous section](/doc/get-started/add-files) to track `data.csv`, except in
this case it has additional information that `data.tsv` depends on `prepare.py`
and `data.xml`, and the command `prepare.py data.xml data.tsv` is required to build
it.
