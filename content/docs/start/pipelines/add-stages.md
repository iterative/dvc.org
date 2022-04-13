## Pipeline stages

Use `dvc stage add` to create _stages_. These represent processes (source code
tracked with Git) which form the steps of a _pipeline_. Stages also connect code
to its corresponding data _input_ and _output_. Let's transform a Python script
into a [stage](/doc/command-reference/stage):

<details>

### ⚙️ Expand to download example code.

Get the sample code like this:

```dvc
$ wget https://code.dvc.org/get-started/code.zip
$ unzip code.zip
$ rm -f code.zip
$ tree
.
├── params.yaml
└── src
    ├── evaluate.py
    ├── featurization.py
    ├── prepare.py
    ├── requirements.txt
    └── train.py
```

Now let's install the requirements:

> We **strongly** recommend creating a
> [virtual environment](https://python.readthedocs.io/en/stable/library/venv.html)
> first.

```dvc
$ pip install -r src/requirements.txt
```

Please also add or commit the source code directory with Git at this point.

</details>

```dvc
$ dvc stage add -n prepare \
                -p prepare.seed,prepare.split \
                -d src/prepare.py -d data/data.xml \
                -o data/prepared \
                python src/prepare.py data/data.xml
```

A `dvc.yaml` file is generated. It includes information about the command we
want to run (`python src/prepare.py data/data.xml`), its
<abbr>dependencies</abbr>, and <abbr>outputs</abbr>.

DVC uses these metafiles to track the data used and produced by the stage, so
there's no need to use `dvc add` on `data/prepared`
[manually](/doc/start/data-and-model-versioning).

<details id="stage-expand-to-see-what-happens-under-the-hood">

### 💡 Expand to see what happens under the hood.

The command options used above mean the following:

- `-n prepare` specifies a name for the stage. If you open the `dvc.yaml` file
  you will see a section named `prepare`.

- `-p prepare.seed,prepare.split` defines special types of dependencies —
  [parameters](/doc/command-reference/params). We'll get to them later in the
  [Metrics, Parameters, and Plots](/doc/start/metrics-parameters-plots) page,
  but the idea is that the stage can depend on field values from a parameters
  file (`params.yaml` by default):

```yaml
prepare:
  split: 0.20
  seed: 20170428
```

- `-d src/prepare.py` and `-d data/data.xml` mean that the stage depends on
  these files to work. Notice that the source code itself is marked as a
  dependency. If any of these files change later, DVC will know that this stage
  needs to be [reproduced](#reproduce).

- `-o data/prepared` specifies an output directory for this script, which writes
  two files in it. This is how the <abbr>workspace</abbr> should look like after
  the run:

  ```git
   .
   ├── data
   │   ├── data.xml
   │   ├── data.xml.dvc
  +│   └── prepared
  +│       ├── test.tsv
  +│       └── train.tsv
  +├── dvc.yaml
  +├── dvc.lock
   ├── params.yaml
   └── src
       ├── ...
  ```

- The last line, `python src/prepare.py data/data.xml` is the command to run in
  this stage, and it's saved to `dvc.yaml`, as shown below.

The resulting `prepare` stage contains all of the information above:

```yaml
stages:
  prepare:
    cmd: python src/prepare.py data/data.xml
    deps:
      - src/prepare.py
      - data/data.xml
    params:
      - prepare.seed
      - prepare.split
    outs:
      - data/prepared
```

</details>
