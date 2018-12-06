# Define ML Pipeline

## Get data file

To include a data file into your data science environment, you need to copy the 
file into one of the repository directories. We create a special directory
`data` for the data files and download a 40MB data archive into this directory.

```dvc
    $ mkdir data
    $ wget -P data https://dvc.org/s3/so/100K/Posts.xml.zip
    $ du -sh data/*
     41M data/Posts.xml.zip
```

This `data/Posts.xml.zip` is still just a regular file. Now it is time to move
the file under DVC control using the `dvc add` command. After executing the
command you will see a new file `data/Posts.xml.zip.dvc` and a change in
`data/.gitignore`. Both of these files have to be committed to the repository.

```dvc
    $ dvc add data/Posts.xml.zip
    $ du -sh data/*
     41M data/Posts.xml.zip
    4.0K data/Posts.xml.zip.dvc

    $ git status -s data/
    ?? data/.gitignore
    ?? data/Posts.xml.zip.dvc

    $ git add .
    $ git commit -m 'add source dataset'
```

You have probably already noticed that the actual file was not committed to the
repository. This happened because DVC included the file into `data/.gitignore`
and Git ignores this data file from now on.

> DVC will always exclude large data files from the Git repository by including
them in `.gitignore`.

## Data file internals

If you take a look at the DVC-file, you will see that only outputs are defined
in `outs`. In this file, only one output is defined. The output contains the
data file path in the repository and md5 cache. This md5 cache determines
location of the actual content file in DVC cache directory `.dvc/cache`.

> Output from DVC-files defines the relationship between the data file path in a
repository and the path in a cache directory.

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
files this might not be the best approach, because a *checkout* operation for a
10Gb data file might take many seconds and a 50GB file checkout (think copy)
might take a couple of minutes.

> DVC was designed with large data files in mind. This means gigabytes or even
hundreds of gigabytes in file size. Instead of copying files from cache to
workspace, DVC creates [hardlinks](https://en.wikipedia.org/wiki/Hard_link).

This is pretty similar to what [Git-annex](https://git-annex.branchable.com/)
does. Creating file hardlinks (or reflinks on the modern file systems) is a
quick operation. So, with DVC you can easily checkout a few dozen files of any
size. A hardlink does not require you to have twice as much space in the hard
drive. Even if each of the files contains 41MB of data, the overall size of the
repository is still 41MB. Both of the files correspond to the same `inode`
(actual file content) in a file system. Use `ls -i` to see file system inodes
(if you are using a modern file system with reflinks you might see different
inodes, still the only copy is stored):

```dvc
    $ ls -i data/Posts.xml.zip
    78483929 data/Posts.xml.zip

    $ ls -i .dvc/cache/ec/
    78483929 88519f8465218abb23ce0e0e8b1384

    $ du -sh .
     41M .
```

Note that DVC uses hardlinks in all the supported OSs, including Mac OS, Linux
and Windows. Some implementation details (like inode) might differ, but the
overall DVC behavior is the same.

## Running commands

Once data source files are in the workspace you can start processing the data
and train ML models out of the data files. DVC helps you to define steps of
your ML process and pipe them together into an ML pipeline.

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
transform this file into a data file (think — it will run `dvc add
file.tsv`).

It is important to specify the dependencies and the outputs of the run command
before the list of the command to run.

Let see how a extract command `uzzip` works under DVC:

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
— output data file.

DVC runs the command and does some additional work if the command was
successful:

1. The command extracts data file `data/Posts.xml.zip` to a regular file
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

* `cmd` — the command to run.

* `deps` — dependencies with md5 checksums.

* `outs` — outputs with md5 checksums.

As previously with the `dvc add` command, the `data/.gitignore` file was
modified. Now it includes the unarchived command output file `Posts.xml`.

```dvc
    $ git status -s
     M data/.gitignore
    ?? Posts.xml.dvc

    $ cat data/.gitignore
    Posts.xml.zip
    Posts.xml
```

Note that the output file `Posts.xml` was transformed by DVC into a
data file in accordance with the `-o` option.

You can find the corresponding cache file with the checksum, which starts with
`c1fa36d` as we can see in the DVC-file `Posts.xml.dvc`:

```dvc
    $ ls .dvc/cache/
    2f/ a8/

    $ du -sh .dvc/cache/c1/* .dvc/cache/ec/*
     41M .dvc/cache/ec/1d2935f811b77cc49b031b999cbf17
    145M .dvc/cache/c1/fa36d90caa8489a317eee917d8bf03

    $ du -sh .
    186M .
```

Let’s commit the result of the `unzip` command. This is the first step of our
ML pipeline.

```dvc
    $ git add .
    $ git commit -m 'extract data`
```

## Running in bulk

One single step of our ML pipeline was defined and committed into repository.
It is not necessary to commit steps right after a step's definition. You can
run a few steps and commit them later.

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
created. This type of file should not be tracked by Git. Let’s manually
include this type of file into `.gitignore`.

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
    $ git commit -m 'Process to TSV and separate test and train'
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
a modified .gitignore file. All the changes should be committed into Git.

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

This is probably not the best AUC that you have seen. In this document our
focus is DVC, not ML modeling and we use a relatively small dataset without any
advanced ML techniques.

In the next chapter we will try to improve the metrics by changing our modeling
code and using reproducibility in the pipeline regeneration.
