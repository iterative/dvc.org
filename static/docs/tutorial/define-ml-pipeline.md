# Define ML Pipeline

## Get data file

To include a data file into your data science environment, you need to copy the
file into the repository. We'll create a special `data` directory for the data
files and download a 40MB data archive into this directory.

<details>

### Expand to learn how to download on Windows

Windows does not ship `wget` utility by default, so you'll need to use a browser
to download `data.xml`and save it into the `data` subdirectory.

</details>

```dvc
$ mkdir data
$ wget -P data https://dvc.org/s3/so/100K/Posts.xml.zip
$ du -sh data/*
 41M data/Posts.xml.zip
```

At this time, `data/Posts.xml.zip` is an untracked regular file. We can place it
under DVC control using `dvc add` (see below). After executing the command you
will see a new file `data/Posts.xml.zip.dvc` and a change in `data/.gitignore`.
Both of these files have to be committed to the repository.

```dvc
$ dvc add data/Posts.xml.zip
$ du -sh data/*
 41M data/Posts.xml.zip
4.0K data/Posts.xml.zip.dvc

$ git status -s data/
?? data/.gitignore
?? data/Posts.xml.zip.dvc

$ git add .
$ git commit -m "add source dataset"
```

You have probably already noticed that the actual data file was not committed to
the repository. The reason is that DVC included the file into `data/.gitignore`,
so Git ignores this data file from now on.

> DVC will always exclude data files from the Git repository by listing them in
> `.gitignore`.

Refer to
[Data and Model Files Versioning](/doc/use-cases/data-and-model-files-versioning),
`dvc add`, and `dvc run` for more information on storing and versioning data
files with DVC.

Note that to modify or replace a data file that is under DVC control you may
need to run `dvc unprotect` or `dvc remove` first (check the
[Update Tracked File](/doc/user-guide/update-tracked-file) guide). Use
`dvc move` to rename or move a data file that is under DVC control.

## Data file internals

If you take a look at the DVC-file, you will see that only outputs are defined
in `outs`. In this file, only one output is defined. The output contains the
data file path in the repository and md5 cache. This md5 cache determines a
location of the actual content file in DVC cache directory `.dvc/cache`.

> Output from DVC-files defines the relationship between the data file path in a
> repository and the path in a cache directory. See also
> [DVC File Format](/doc/user-guide/dvc-file-format)

```dvc
$ cat data/Posts.xml.zip.dvc
md5: 7559eb45beb7e90f192e836be8032a64
outs:
- cache: true
  md5: ec1d2935f811b77cc49b031b999cbf17
  path: Posts.xml.zip

$ du -sh .dvc/cache/ec/*
 41M .dvc/cache/ec/1d2935f811b77cc49b031b999cbf17
```

Keeping actual file content in a cache directory and a copy of the caches in
user workspace during `$ git checkout` is a regular trick that
[Git-LFS](https://git-lfs.github.com/) (Git for Large File Storage) uses. This
trick works fine for tracking small files with source code. For large data
files, this might not be the best approach, because of _checkout_ operation for
a 10Gb data file might take several seconds and a 50GB file checkout (think
copy) might take a few minutes.

DVC was designed with large data files in mind. This means gigabytes or even
hundreds of gigabytes in file size. Instead of copying files from cache to
workspace, DVC can create reflinks or other file link types. (See
[File link types](/docs/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache)
.)

Creating file links is a quick file system operation. So, with DVC you can
easily checkout a few dozen files of any size. A file link does not require you
to have twice as much space in the hard drive. Even if each of the files
contains 41MB of data, the overall size of the repository is still 41MB. Both of
the files correspond to the same `inode` (a file metadata record) in the file
system. Refer to
[Large Dataset Optimization](/docs/user-guide/large-dataset-optimization) for
more details.

> Note that in systems supporting reflinks, use the `df` command to confirm that
> free space on the drive didn't decline by the file size that we are adding, so
> no duplication takes place. `du` may be inaccurate with reflinks.

```dvc
$ ls -i data/Posts.xml.zip
78483929 data/Posts.xml.zip

$ ls -i .dvc/cache/ec/
78483929 88519f8465218abb23ce0e0e8b1384

$ du -sh .
 41M .
```

## Running commands

Once data source files are in the workspace you can start processing the data
and train ML models out of the data files. DVC helps you to define steps of your
ML process and pipe them together into an ML **pipeline**.

`dvc run` executes any command that you pass into it as a list of parameters.
However, the command to run alone is not as interesting as its role within a
pipeline, so we'll need to specify its dependencies and output files. We call
this a pipeline **stage**. Dependencies may include input files and directories,
and the actual source script to run. Outputs are files written to by the
command, if any.

1. Option `-d file.tsv` should be used to specify a dependency file or
   directory. The dependency can be a regular file from a repository or a data
   file.

2. `-o file.tsv` (lower case o) specifies output data file which means DVC will
   transform this file into a data file (think — it will run
   `dvc add file.tsv`).

3. `-O file.tsv` (upper case O) specifies a regular output file (not to be added
   to DVC).

It is important to specify the dependencies and the outputs of the run command
before the command to run itself.

Let's see how an extract command `unzip` works under DVC:

```dvc
$ dvc run -d data/Posts.xml.zip -o data/Posts.xml \
        unzip data/Posts.xml.zip -d data/

Running command:
  unzip data/Posts.xml.zip -d data/
Archive:  data/Posts.xml.zip
    inflating: data/Posts.xml
Adding 'data/Posts.xml' to 'data/.gitignore'.
Saving 'data/Posts.xml' to cache '.dvc/cache'.
Saving information to 'Posts.xml.dvc'.

To track the changes with git run:

  git add data/.gitignore Posts.xml.dvc

$ du -sh data/*

145M data/Posts.xml
41M data/Posts.xml.zip
4.0K data/Posts.xml.zip.dvc
```

In these commands, option `-d` specifies an output directory for the tar
command. `-d data/Posts.xml.zip` defines the input file and `-o data/Posts.xml`
the resulting extracted data file.

The `unzip` command extracts data file `data/Posts.xml.zip` to a regular file
`data/Posts.xml`. It knows nothing about data files or DVC. DVC runs the command
and does some additional work if the command was successful:

1. DVC transforms all the outputs `-o` files into data files. It is like
   applying `dvc add` for each of the outputs. As a result, all the actual data
   files content goes to the cache directory `.dvc/cache` and each of the
   filenames will be added to `.gitignore`.

2. For reproducibility purposes, DVC creates the `Posts.xml.dvc` DVC-file in the
   workspace — the file with meta-information about the pipeline stage, see
   [DVC File Format](/doc/user-guide/dvc-file-format). By default, DVC assigns a
   name to the DVC-file based on the first output file name, by adding the
   `.dvc` file extension. This name can be changed by using the `-f` option, for
   example by specifying `-f extract.dvc`.

Let's take a look at the resulting DVC-file from the above example:

```dvc
$ cat Posts.xml.dvc

cmd: ' unzip data/Posts.xml.zip -d data/'
deps:
- md5: ec1d2935f811b77cc49b031b999cbf17
  path: data/Posts.xml.zip
md5: 16129387a89cb5a329eb6a2aa985415e
outs:
- cache: true
  md5: c1fa36d90caa8489a317eee917d8bf03
  path: data/Posts.xml
```

Sections of the file above include:

- `cmd` — the command to run.

- `deps` — dependencies with md5 checksums.

- `outs` — outputs with md5 checksums.

And (as with the `dvc add` command) the `data/.gitignore` file was modified. Now
it includes the unarchived command output file `Posts.xml`.

```dvc
$ git status -s
 M data/.gitignore
?? Posts.xml.dvc

$ cat data/.gitignore
Posts.xml.zip
Posts.xml
```

The output file `Posts.xml` was transformed by DVC into a data file in
accordance with the `-o` option. You can find the corresponding cache file with
the checksum, which starts with `c1fa36d` as we can see in the DVC-file
`Posts.xml.dvc`:

```dvc
$ ls .dvc/cache/
2f/ a8/

$ du -sh .dvc/cache/c1/* .dvc/cache/ec/*
 41M .dvc/cache/ec/1d2935f811b77cc49b031b999cbf17
145M .dvc/cache/c1/fa36d90caa8489a317eee917d8bf03

$ du -sh .
186M .
```

Let’s commit the result of the `unzip` command. This will be the first stage of
our ML pipeline.

```dvc
$ git add .
$ git commit -m "extract data"
```

## Running in bulk

One single step of our ML pipeline was defined and committed into repository. It
is not necessary to commit steps right after a step's definition. You can run a
few steps and commit them later.

Let’s run the next step of converting an XML file to TSV and the following step
of separating training and testing datasets one by one:

```dvc
$ dvc run -d data/Posts.xml -d code/xml_to_tsv.py -d code/conf.py \
        -o data/Posts.tsv \
        python code/xml_to_tsv.py
Using 'Posts.tsv.dvc' as a stage file
Reproducing 'Posts.tsv.dvc':
        python code/xml_to_tsv.py

$ dvc run -d data/Posts.tsv -d code/split_train_test.py \
        -d code/conf.py \
        -o data/Posts-test.tsv -o data/Posts-train.tsv \
        python code/split_train_test.py 0.33 20180319
Using 'Posts-test.tsv.dvc' as a stage file
Reproducing 'Posts-test.tsv.dvc':
        python code/split_train_test.py 0.33 20180319
Positive size 2049, negative size 97951
```

The result of the steps are two DVC-files corresponding to each of the commands
`Posts-test.tsv.dvc` and `Posts.tsv.dvc`. Also, a `code/conf.pyc` file was
created. This type of file should not be tracked by Git. Let’s manually include
this type of file into `.gitignore`.

```dvc
$ git status -s
 M data/.gitignore
?? Posts-test.tsv.dvc
?? Posts.tsv.dvc
?? code/conf.pyc

$ echo "*.pyc" >> .gitignore
```

Both of the steps can be committed to the repository together.

```dvc
$ git add .
$ git commit -m "Process to TSV and separate test and train"
```

Let’s run and commit the following steps of the pipeline. Define the feature
extraction step which takes train and test TSVs and generates corresponding
matrix files:

```dvc
$ dvc run -d code/featurization.py -d code/conf.py \
        -d data/Posts-train.tsv -d data/Posts-test.tsv \
        -o data/matrix-train.p -o data/matrix-test.p \
        python code/featurization.py
Using 'matrix-train.p.dvc' as a stage file
Reproducing 'matrix-train.p.dvc':
    python code/featurization.py
The input data frame data/Posts-train.tsv size is (66999, 3)
The output matrix data/matrix-train.p size is (66999, 5002) and data type is float64
The input data frame data/Posts-test.tsv size is (33001, 3)
The output matrix data/matrix-test.p size is (33001, 5002) and data type is float64
```

Train a model using the train matrix file:

```dvc
$ dvc run -d data/matrix-train.p -d code/train_model.py \
        -d code/conf.py -o data/model.p \
        python code/train_model.py 20180319
Using 'model.p.dvc' as a stage file
Reproducing 'model.p.dvc':
    python code/train_model.py 20180319
Input matrix size (66999, 5002)
X matrix size (66999, 5000)
Y matrix size (66999,)
```

And evaluate the result of the trained model using the test feature matrix:

```dvc
$ dvc run -d data/model.p -d data/matrix-test.p \
        -d code/evaluate.py -d code/conf.py -M data/eval.txt \
        -f Dvcfile \
        python code/evaluate.py
Reproducing 'Dvcfile':
    python code/evaluate.py
```

The model evaluation step is the last one. To make it a reproducibility goal by
default we specify a DVC-file named `Dvcfile`. This will be discussed in the
next chapter in more details.

Note that the output file `data/eval.txt` was transformed by DVC into a metric
file in accordance with the `-M` option.

The result of the last three run commands execution is three DVC-files and a
modified .gitignore file. All the changes should be committed into Git.

```dvc
$ git status -s
 M data/.gitignore
?? Dvcfile
?? matrix-train.p.dvc
?? model.p.dvc

$ git add .
$ git commit -m Evaluate
```

The evaluation step output contains the target metrics value in a simple text
form:

```dvc
$ cat data/eval.txt
AUC: 0.624652
```

You can also show the metrics using the `DVC metrics` command:

```dvc
$ dvc metrics show
data/eval.txt:AUC: 0.624652
```

This is probably not the best AUC that you have seen. In this document, our
focus is DVC, not ML modeling and we use a relatively small dataset without any
advanced ML techniques.

In the next chapter we will try to improve the metrics by changing our modeling
code and using reproducibility in the pipeline regeneration.
