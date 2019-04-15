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
packages like `pandas` and `scikit-learn`, that are required to run this
example (on Windows just use your browser to download the archive):

```dvc
    $ wget https://dvc.org/s3/get-started/code.zip
    $ unzip code.zip
    $ rm -f code.zip
```
After running this, your project structure should look like:

```dvc
    .
    ├── data
    │   ├── data.xml
    │   └── data.xml.dvc
    ├── requirements.txt
    └── src
        ├── evaluate.py
        ├── featurization.py
        ├── prepare.py
        └── train.py
```

We **strongly** recommend using `virtualenv` or a similar tool to isolate your
environment:

```dvc
    $ virtualenv .env
    $ source .env/bin/activate
    $ echo ".env/" >> .gitignore
```

Now, we are ready to install dependencies to run the code:

```dvc
    $ pip install -U -r requirements.txt
    $ git add .
    $ git commit -m 'add code'
```

</details>

```dvc
    # Click the "Click to prepare sample code" above to download
    # `prepare.py` if you'd like to run it.
    $ dvc run -f prepare.dvc \
              -d src/prepare.py -d data/data.xml \
              -o data/prepared \
              python src/prepare.py data/data.xml
```

`dvc run` generates the `prepare.dvc` file. It has the same
[format](/doc/user-guide/dvc-file-format) as the file we created in the
[previous section](/doc/get-started/add-files) to track `data.xml`, except in
this case it has additional information about `data/prepared` output (a
directory that contains two files - `train.tsv` and `test.tsv`), and command
that is required to build it.

<details>

### Click to learn more about what has just happened ...

This is how the result should look like now:

```diff
    .
    ├── data
    │   ├── data.xml
    │   ├── data.xml.dvc
+   │   └── prepared
+   │       ├── test.tsv
+   │       └── train.tsv
+   ├── prepare.dvc
    ├── requirements.txt
    └── src
        ├── evaluate.py
        ├── featurization.py
        ├── prepare.py
        └── train.py
```

This is how `prepare.dvc` looks like internally:

```yaml
    cmd: python src/prepare.py data/data.xml
    deps:
    - md5: b4801c88a83f3bf5024c19a942993a48
    path: src/prepare.py
    - md5: a304afb96060aad90176268345e10355
    path: data/data.xml
    md5: c3a73109be6c186b9d72e714bcedaddb
    outs:
    - cache: true
    md5: 6836f797f3924fb46fcfd6b9f6aa6416.dir
    metric: false
    path: data/prepared
    wdir: .
```

> `dvc run` is just the first part of the DVC commands that are required to
generate the computational graph, or in other words, an instruction how to build
a certain ML model (data file) from another data file (or a directory). We would
recommend to try to read a few next chapters first, before switching to other
documents. Hopefully, `dvc run` and `dvc repro` will make more sense after
finishing up this guide.

You can always refer to the `dvc run` and `dvc repro` documentation to learn
very specific details about certain options and how do they behave. Let's here
briefly mention what each of the options that were used in this example mean:

`-f prepare.dvc` specifies a name for the stage file. It's optional but we
highly recommend using it to make your project structure more readable.

`-d src/prepare.py` and `-d data/data.xml` mean that the `prepare.dvc`
stage depends on them to produce the result. When you run next time `dvc repro`
(see the next chapter) DVC will automatically check these dependencies and
decide if this stage is up to date or not and requires rebuilding.

`-o data/prepared` specifies the output directory processed data will be put
into. Script creates two files `train.tsv` and `test.tsv` - that will be used
then to generate features, train and evaluate the model.

And, the last `python src/prepare.py data/data.xml`, specifies a command to run.
This command is saved to the generated DVC file. Next time you run `dvc repro`
it will be extracted from the file and used to produce the `-o data/prepared`
directory from the `-d data/data.xml` file.

</details>

You don't need to run `dvc add` to take output files - `prepared/train.tsv` and
`prepared/test.tsv` - under DVC control. `dvc run` takes care of this. You only
need to run `dvc push`, usually along with `git commit` to save them to the
remote when you are done.

Let's commit meta-files to save the stage we built:

```dvc
    $ git add data/.gitignore prepare.dvc
    $ git commit -m "add data preparation stage"
    $ dvc push
```
