# Connect Code and Data

Even in its basic scenarios, commands like `dvc add`, `dvc push`, `dvc pull`
described in the previous sections could be used independently and provide a
basic useful framework to track, save and share models and large data files. To
achieve full reproducibility though, we'll have to connect code and
configuration with the data it processes to produce the result.

If you've followed this get started guide from the beginning, run these commands
to get the sample code:

> On Windows just use your browser to download the archive instead.

```dvc
    $ wget https://dvc.org/s3/get-started/code.zip
    $ unzip code.zip
    $ rm -f code.zip
```

You'll also need to install its dependencies: Python packages like `pandas` and
`scikit-learn` that are required to run this example.

<details>

### Expand to prepare sample code ...

After downloading the sample code, your project structure should look like this:

```dvc
    $ tree
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
    $ echo ".env/" >> .gitignore
    $ source .env/bin/activate
```

Now, we are ready to install dependencies to run the code:

```dvc
    $ pip install -U -r requirements.txt
    $ git add .
    $ git commit -m 'add code'
```

</details>

Having installed the `src/prepare.py` script in your repo, the following DVC
command transforms it into a reproducible **stage** for the ML **pipeline**
(describes in the next chapter).

```dvc
    $ dvc run -f prepare.dvc \
              -d src/prepare.py -d data/data.xml \
              -o data/prepared \
              python src/prepare.py data/data.xml
```

`dvc run` generates the `prepare.dvc` file. It has the same
[format](/doc/user-guide/dvc-file-format) as the file we created in the
[previous section](/doc/get-started/add-files) to track `data.xml`, except in
this case it has additional information about the `data/prepared` output (a
directory that contains two files, `train.tsv` and `test.tsv`), and about the
Python command that is required to build it.

<details>

### Expand to learn more about what has just happened ...

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
generate a [pipeline's](/doc/get-started/pipeline) computational graph, or in
other words, an instruction how to build a certain ML model (data file) from
previous data file(s).

We would recommend to try to read a few next chapters first, before switching to
other documents. Hopefully, `dvc run` and `dvc repro` will make more sense after
finishing up this guide. You can always refer to the `dvc run` and `dvc repro`
documentation to learn the specific details about how they behave and all of
their options. Let's briefly mention what the options used above mean:

`-f prepare.dvc` specifies a name for the pipeline stage file. It's optional but
we highly recommend using it to make your project structure more readable.

`-d src/prepare.py` and `-d data/data.xml` mean that the `prepare.dvc` stage
depends on them to produce the result. When you run `dvc repro` next time (see
next chapter) DVC will automatically check these dependencies and decide whether
this stage is up to date or or whether it requires rebuilding.

`-o data/prepared` specifies the output directory processed data will be put
into. The script creates two files in it: `train.tsv` and `test.tsv` – that will
be used later to generate features, train and evaluate the model.

And, the last line, `python src/prepare.py data/data.xml`, specifies a command
to run. This command is saved to the generated DVC file and required by `dvc
repro`.

</details>

You don't need to run `dvc add` to place output files (`prepared/train.tsv` and
`prepared/test.tsv`) under DVC control. `dvc run` takes care of this. You only
need to run `dvc push` (usually along with `git commit`) to save them to the
remote when you are done.

Let's commit meta-files to save the stage we built:

```dvc
    $ git add data/.gitignore prepare.dvc
    $ git commit -m "add data preparation stage"
    $ dvc push
```
