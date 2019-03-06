# Connect Code and Data

Even in its basic scenarios, commands like `dvc add`, `dvc push`, `dvc pull`
described in the previous sections could be used independently and provide a
basic useful framework to track, save and share models and large data files.

To achieve full reproducibility though you have to connect your code and
configuration with the data it processes to produce the result:

<details>

### Click to prepare sample code ...
If you have been following along the get started from the very beginning, run
these commands to get the sample code and install dependencies. It will install
packages like `pandas` and `scikit-learn`, that are required to run this example,
consider using `virtualenv` to isolate your environment:

```dvc
    $ wget https://dvc.org/s3/get-started/code.zip
    $ unzip code.zip
    $ rm -f code.zip
    $ pip install -U -r requirements.txt
    $ git add .
    $ git commit -m 'add code'
```

</details>

```dvc
    # Click the "Click to prepare sample code" above to download
    # `prepare.py` if you want to run it.
    $ dvc run \
        -d prepare.py -d data.xml \
        -o data.tsv -o data-test.tsv \
        python prepare.py data.xml
```

`dvc run` generates a `data.tsv.dvc` file. It has the same
[format](/doc/user-guide/dvc-file-format) as the file we created in the
[previous section](/doc/get-started/add-files) to track `data.xml`, except in
this case it has additional information about `data.tsv` dependencies and
command that is required to build it.

You don't need to run `dvc add` to take output files - `data.tsv` and
`data-test.tsv` - under control. `dvc run` takes care of this. You only need to
run `dvc push`, usually along with git commit to saving them to the remote when
you have done.

> We don't do it here and in the next chapters to keep commands as simple as
possible, but it's recommended to use `-f` optional argument that `dvc run`
provides to specify a meaningful stage name.

Let's commit metafiles to save the stage we built:

```dvc
    $ git add .gitignore data.tsv.dvc
    $ git commit -m "add data preparation stage"
    $ dvc push
```
