# Connect Code and Data

Even in its basic scenarios, commands like `dvc add`, `dvc push`, `dvc pull`
described in the previous sections could be used independently and provide a
basic useful framework to track, save and share models and large data files.

<details><summary><strong>Expand to prepare sample code</strong></summary>
<p>
If you have been following along the get started from the very beginning,
run these commands to get the sample code and install dependencies. It will
install packages like <code>panda</code> and  <code>scikit-learn</code>,
that are required to run this example, consider using <code>virtualenv</code>
to isolate your environment:
</br>
<pre>
    $ wget -q -O - https://dvc.org/s3/get-started/code.tgz | tar zx
    $ pip install -U -r requirements.txt
    $ git add .
    $ git commit -m 'add code'
</pre>
</p>
</details>
</br>
To achieve full reproducibility though you have to connect your code and
configuration with the data it processes to produce the result:

```dvc
    $ dvc run \
        -d prepare.py -d data.xml \
        -o data.tsv -o data-test.tsv \
        python prepare.py data.xml
```

`dvc run` command creates a `data.tsv.dvc` file which has the same
[format](/doc/user-guide/dvc-file-format) as the file we created in the
[previous section](/doc/get-started/add-files) to track `data.tsv`, except in
this case it has additional information that `data.tsv` depends on `prepare.py`
and `data.xml`, and the command `prepare.py data.xml data.tsv` is required to
build it. Test data set `data-test.tsv` is generated to run evaluation script at
the last steps of this guide.

You don't need to run `dvc add` to take output files - `data.tsv` and
`data-test.tsv` under control. `dvc run` takes care of this. You only need to
run `dvc push`, usually along with git commit.

Let's commit metafiles to save the stage we built:

```dvc
    $ git add .gitignore data.tsv.dvc
    $ git commit -m "add data preparation stage"
    $ dvc push
```
