# Define ML Pipeline

## Get data file

To include a data file into your data science environment you need to copy the 
file in on of the repository directories. We create a special directory `data`
for the data files and download 40MB source data file into this directory.

```sh
    $ mkdir data
    $ wget -P data $S3_DIR/100K/Posts.xml.tgz
    $ du -sh data/*
     40M data/Posts.xml.tgz
```

This `data/Posts.xml.tgz` is still just a regular file. Now it is time to move
the file under DVC control by `dvc add` command. After the command execution
you will see a new file `data/Posts.xml.tgz.dvc` and there is a change in
`data/.gitignore`. Both of these files have to be committed into the repository.

```sh
    $ dvc add data/Posts.xml.tgz
    $ du -sh data/*
     40M data/Posts.xml.tgz
    4.0K data/Posts.xml.tgz.dvc

    $ git status -s data/
    ?? data/.gitignore
    ?? data/Posts.xml.tgz.dvc

    $ git add .
    $ git commit -m 'Add source dataset'
```

You have probably already noticed that the actual file was not committed to the
repository. This happened because DVC included the file into `data/.gitignore`
and Git ignores this data file from now.

> Excluding large data files from the Git repository by including them to
`.gitignore` is a general DVC behavior.

## Data file internals

If you take a look at the DVC-file you will see that only outputs are defined in
`outs`. In this file only one output is defined. The output contains the data
file path in the repository and md5 cache. This md5 cache determines location
of the actual content file in DVC cache directory `.dvc/cache`.

> Output from DVC-file defines the relationship between the data file path in a
repository and the path in a cache directory.

```sh
    $ cat data/Posts.xml.tgz.dvc
    cmd: null
    deps: []
    outs:
    - cache: true
      md5: 5988519f8465218abb23ce0e0e8b1384
      path: Posts.xml.tgz

    $ du -sh .dvc/cache/59/*
     40M .dvc/cache/59/88519f8465218abb23ce0e0e8b1384
```

Keeping actual file content in a cache directory and a copy of the caches in
user workspace during `$ git checkout` is a regular trick that Git uses and
[Git-LFS](https://git-lfs.github.com/) (Git for Large File Storage). This trick
works fine for tracking small files with source code. For large data files this
might not be the best approach. Because* checkout *operation for a 10Gb data
file might take many seconds and 50GB file checkout (think copy) might take
couple minutes.

> DVC was designed with large data files in mind. This means gigabytes or even
hundreds of gigabytes in file size. Instead of copying files from cache to
workspace DVC created [hardlinks](https://en.wikipedia.org/wiki/Hard_link).

This is pretty similar to what [Git-annex](https://git-annex.branchable.com/)
does. Creating file hardlinks is a quick operation. So, with DVC you can easily
checkout a few dozens of files with any size. And hardlink does not require you
to have twice as much space in the hard drive. Even if each of the files
contains 40MB of data the overall size of the repository is still 40MB. And both
of the files are corresponded to the same `inode` (actual file content) in a
file system. Use `ls -l` to see file system inodes:

```sh
    $ ls -i data/Posts.xml.tgz
    78483929 data/Posts.xml.tgz

    $ ls -i .dvc/cache/59/
    78483929 88519f8465218abb23ce0e0e8b1384

    $ du -sh .
     41M .
```

Note, DVC uses hardlinks in all the supported OS including Mac OS, Linux and
Windows. Some details (like inode) might differ where the overall DVC behavior
is the same.

## Running commands

Once data source files are in the workspace you can start processing the data
and train ML models out of the data files. DVC helps you to define steps of your
ML process and pipe them together into an ML pipeline.

Command `dvc run` executes any command that you pass into it as a list of
parameters. However, the command alone is not as interesting as a command in a
pipeline. The command can be piped by it’s dependencies and output files.
Dependencies and outputs include input files, input directories and source code
files or directories.

1. Option `-d file.tsv` should be used to specify a dependency file or
directory. The dependency can be a regular file from a repository or a data
file.

2. `-O file.tsv` (big O) specifies regular output file.

3. `-o file.tsv` (small o) specifies output data file which means DVC will
transforms this file into a data file (think — it will run `$ dvc add
file.tsv`).

It is important to specify the dependencies and the outputs of the run command
before the list of the command to run.

Let see how a unarchiving command `tar` works under DVC:


```sh
    $ dvc run -d data/Posts.xml.tgz -o data/Posts.xml \
            tar zxf data/Posts.xml.tgz -C data/
    Using 'Posts.xml.dvc' as a stage file
    Reproducing 'Posts.xml.dvc':
            tar zxf data/Posts.xml.tgz -C data/

    $ du -sh data/*
    145M data/Posts.xml
     40M data/Posts.xml.tgz
    4.0K data/Posts.xml.tgz.dvc
```

In these commands, option `-C` specifies an output directory for the tar
command. `-d data/Posts.xml.tgz` defines the input file and `-o data/Posts.xml`
— output data file.

DVC runs the command and does some additional work if the command was
successful:

1. The command unarchive data file `data/Posts.xml.tgz` to a regular file
`data/Posts.xml`. The command knows nothing about data files and DVC.

2. DVC transforms all the outputs `-o` files into data files. It is like
applying `dvc add file1` for each of the outputs. As a result, all the actual
data files content goes to the cache directory `.dvc/cache` and each of the
filenames will be added to `.gitignore`.

3. For reproducibility purposes, DVC creates the DVC-file `Posts.xml.dvc ` —
the file with meta-information about the command. DVC assigns a name to the
DVC-file based on the first output file name by adding the `.dvc` suffix at the
end (can be changed by `-f` option).

Let's take a look at the DVC-file example:

```sh
    $ cat Posts.xml.dvc
    cmd: tar zxf data/Posts.xml.tgz -C data/
    deps:
    - md5: 5988519f8465218abb23ce0e0e8b1384
      path: data/Posts.xml.tgz
    outs:
    - cache: true
      md5: cfdaa4bba57fa07d81ff96685a9aab2c
      path: data/Posts.xml
```

Sections of the file above include:

* `cmd` — the command to run.

* `deps` — dependencies with md5 checksums.

* `outs` — outputs with md5 checksums.

As previously with `dvc add` command `data/.gitignore` file was modified. Now it
includes the unarchive command output file `Posts.xml`.

```sh
    $ git status -s
     M data/.gitignore
    ?? Posts.xml.dvc

    $ cat data/.gitignore
    Posts.xml.tgz
    Posts.xml
```

It is important than output `Posts.xml` file was transformed by the DVC into a
data file in accordance with the `-o` option.

You can find the corresponded cache file by the checksum which starts from
`cfdaa4b` according to the DVC-file `Posts.xml.dvc`:

```sh
    $ ls .dvc/cache/
    2f/ a8/

    $ du -sh .dvc/cache/2f/* .dvc/cache/a8/*
     40M .dvc/cache/59/88519f8465218abb23ce0e0e8b1384
    145M .dvc/cache/cf/daa4bba57fa07d81ff96685a9aab2c

    $ du -sh .
    186M .
```

Let’s commit the result of the unarchived command. This is the first step of our
ML pipeline.

```sh
    $ git add .
    $ git commit -m Unarchive
```

## Running in a bulk

One single step of our ML pipeline was defined and committed into repository.
It is not necessary to commit steps right after steps definition. You can run a
few steps and commit later.

Let’s run the next step of converting a XML file to TSV and the following step
of separating training and testing datasets one by one:

```sh
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
created. These type of files should not be tracked by Git. Let’s manually
include this type of file into `.gitignore`.

```sh
    $ git status -s
     M data/.gitignore
    ?? Posts-test.tsv.dvc
    ?? Posts.tsv.dvc
    ?? code/conf.pyc

    $ echo "*.pyc" >> .gitignore
```

Both of the steps can be committed to the repository together.

```sh
    $ git add .
    $ git commit -m 'Process to TSV and separate test and train'
```

Let’s run and commit the following steps of the pipeline. Define the feature
extraction step which takes train and test TSVs and generates corresponding
matrix files:

```sh
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

Train model out of the train matrix file:

```sh
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

And evaluate the result by the trained model and the test feature matrix:

```sh
    $ dvc run -d data/model.p -d data/matrix-test.p \
            -d code/evaluate.py -d code/conf.py -o data/eval.txt \
            -f Dvcfile \
            python code/evaluate.py
    Reproducing 'Dvcfile':
        python code/evaluate.py
```

The model evaluation step is the last one. To make it a reproducibility goal by
default we specify DVC-file as `Dvcfile`. This will be discussed in the next
chapter in more details.

The result of the last three run commands execution is three DVC-files and
modified .gitignore file. All the changes should be committed into Git.

```sh
    $ git status -s
     M data/.gitignore
    ?? Dvcfile
    ?? matrix-train.p.dvc
    ?? model.p.dvc

    $ git add .
    $ git commit -m Evaluate
```

The evaluation step output contains the target metrics value in a simple text form:

```sh
    $ cat data/eval.txt
    AUC: 0.624652
```

This is probably not the best AUC that you have seen. In this document our focus
is DVC, not ML modeling and we use a relatively small dataset without any
advanced ML technics.

In the next chapter we will try to improve the metrics by changing our modeling
code and using reproducibility in the pipeline regeneration.
