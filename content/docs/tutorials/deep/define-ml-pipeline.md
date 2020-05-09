# Define ML Pipeline

## Get data file

To include a data file into your data science environment, you need to copy the
file into the repository. We'll create a `data/` directory for the data files
and download a 40MB data archive into this directory.

```dvc
$ mkdir data
$ wget -P data https://data.dvc.org/tutorial/nlp/100K/Posts.xml.zip
$ du -sh data/*
 41M data/Posts.xml.zip
```

<details>

### Expand to learn how to download on Windows

Windows doesn't include the `wget` utility by default, but you can use the
browser to download `data.xml`. (Right-click
[this link](https://data.dvc.org/tutorial/ver/data.zip) and select
`Save Link As...` (Chrome). Save it into the `data/` subdirectory.

> Please also review
> [Running DVC on Windows](/doc/user-guide/running-dvc-on-windows) for important
> tips to improve your experience using DVC on Windows.

</details>

At this time, `data/Posts.xml.zip` is a regular (untracked) file. We can track
it with DVC using `dvc add` (see below). After executing the command you will
see a new file `data/Posts.xml.zip.dvc` and a change in `data/.gitignore`. Both
of these files have to be committed to the repository.

```dvc
$ dvc add data/Posts.xml.zip
$ du -sh data/*
 41M data/Posts.xml.zip
4.0K data/Posts.xml.zip.dvc

$ git status -s data/
?? data/.gitignore
?? data/Posts.xml.zip.dvc

$ git add .
$ git commit -m "add raw dataset"
```

You may have noticed that the actual data file was not committed to the Git
repo. The reason is that DVC included it in `data/.gitignore`, so that Git
ignores this data file from now on.

> DVC will always exclude data files from the Git repository by listing them in
> `.gitignore`.

Refer to
[Versioning Data and Model Files](/doc/use-cases/versioning-data-and-model-files),
`dvc add`, and `dvc run` for more information on storing and versioning data
files with DVC.

Note that to modify or replace a data file tracked by DVC, you may need to run
`dvc unprotect` or `dvc remove` first (see the
[Update Tracked File](/doc/user-guide/updating-tracked-files) guide). To rename
or move it, you can use `dvc move`.

## Data file internals

If you take a look at the [DVC-file](/doc/user-guide/dvc-file-format) created by
`dvc add`, you will see that <abbr>outputs</abbr> are tracked in the `outs`
field. In this file, only one output is specified. The output contains the data
file path in the repository and its MD5 hash. This hash value determines the
location of the actual content file in the
[cache directory](/doc/user-guide/dvc-files-and-directories#structure-of-cache-directory),
`.dvc/cache`.

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

> Outputs from DVC-files define the relationship between the data file path in a
> repository and the path in the cache directory.

Keeping actual file contents in the <abbr>cache</abbr>, and a copy of the cached
file in the <abbr>workspace</abbr> during `$ git checkout` is a regular trick
that [Git-LFS](https://git-lfs.github.com/) (Git for Large File Storage) uses.
This trick works fine for tracking small files with source code. For large data
files, this might not be the best approach, because of _checkout_ operation for
a 10Gb data file might take several seconds and a 50GB file checkout (think
copy) might take a few minutes.

DVC was designed with large data files in mind. This means gigabytes or even
hundreds of gigabytes in file size. Instead of copying files from cache to
workspace, DVC can create reflinks or other file link types.

> When reflinks are not supported by the file system, DVC defaults to copying
> files, which doesn't optimize file storage. However, it's easy to enable other
> file link types on most systems. See
> [File link types](/doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache)
> for more information.

Creating file links is a quick file system operation. So, with DVC you can
easily checkout a few dozen files of any size. A file link prevents you from
using twice as much space in the hard drive. Even if each of the files contains
41MB of data, the overall size of the repository is still 41MB. Both of the
files correspond to the same `inode` (a file metadata record) in the file
system. Refer to
[Large Dataset Optimization](/doc/user-guide/large-dataset-optimization) for
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

Note that `ls -i` prints the index number(78483929) of each file and inode for
`data/Posts.xml.zip` and `.dvc/cache/ec/88519f8465218abb23ce0e0e8b1384` remained
same.

## Running commands

Once the data files are in the workspace, you can start processing the data and
train ML models out of the data files. DVC helps you to define
[stages](/doc/command-reference/run) of your ML process and easily connect them
into a ML [pipeline](/doc/command-reference/pipeline).

`dvc run` executes any command that you pass it as a list of parameters.
However, the command to run alone is not as interesting as its role within a
larger data pipeline, so we'll need to specify its <abbr>dependencies</abbr> and
<abbr>outputs</abbr>. We call all this a pipeline _stage_. Dependencies may
include input files or directories, and the actual command to run. Outputs are
files written to by the command, if any.

- Option `-d in.tsv` specifies a dependency file or directory. The dependency
  can be a regular file from a repository or a data file.

- `-o out.dat` (lower case o) specifies an output data file. DVC will track this
  data file by creating a corresponding
  [DVC-file](/doc/user-guide/dvc-file-format) (as if running `dvc add out.dat`
  after `dvc run` instead).

- `-O tmp.dat` (upper case O) specifies a simple output file (not to be added to
  DVC).

It's important to specify dependencies and outputs before the command to run
itself.

Let's see how an extraction command `unzip` works under DVC, for example:

```dvc
$ dvc run -d data/Posts.xml.zip -o data/Posts.xml \
        unzip data/Posts.xml.zip -d data/

Running command:
  unzip data/Posts.xml.zip -d data/
Archive:  data/Posts.xml.zip
    inflating: data/Posts.xml
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
`data/Posts.xml`. It knows nothing about data files or DVC. DVC executes the
command and does some additional work if the command was successful:

1. DVC transforms all the outputs (`-o` option) into tracked data files (similar
   to using `dvc add` for each of them). As a result, all the actual data
   contents go to the <abbr>cache</abbr> directory `.dvc/cache`, and each of the
   file names will be added to `.gitignore`.

2. For reproducibility purposes, `dvc run` creates the `Posts.xml.dvc` stage
   file in the <abbr>project</abbr> with information about this pipeline stage.
   (See [DVC-File Format](/doc/user-guide/dvc-file-format)). Note that the name
   of this file could be specified by using the `-f` option, for example
   `-f extract.dvc`.

Let's take a look at the resulting stage file created by `dvc run` above:

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

Parent fields in the file above include:

- `cmd`: The command to run
- `deps`: Dependencies with MD5 hashes
- `outs`: Outputs with MD5 hashes

And (as with the `dvc add` command) the `data/.gitignore` file was modified. Now
it includes the command output file, `Posts.xml`.

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
the hash value, as a path starting in `c1/fa36d`:

```dvc
$ ls .dvc/cache/
2f/ a8/

$ du -sh .dvc/cache/c1/* .dvc/cache/ec/*
 41M .dvc/cache/ec/1d2935f811b77cc49b031b999cbf17
145M .dvc/cache/c1/fa36d90caa8489a317eee917d8bf03

$ du -sh .
186M .
```

Let's commit the result of the `unzip` command. This will be the first stage of
our ML pipeline.

```dvc
$ git add .
$ git commit -m "extract data"
```

## Running in bulk

A single [stage](/doc/command-reference/run) of our ML pipeline was created and
committed into repository. It isn't necessary to commit stages right after their
creation. You can create a few and commit them with Git together later.

Let's create the following stages: converting an XML file to TSV, and then
separating training and testing datasets:

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

The result of the commands above are two
[stage files](/doc/command-reference/run) corresponding to each of the commands,
`Posts-test.tsv.dvc` and `Posts.tsv.dvc`. Also, a `code/conf.pyc` file was
created by the command itself. There's no need track this output file with Git.
Let's manually include this type of file into `.gitignore`.

```dvc
$ git status -s
 M data/.gitignore
?? Posts-test.tsv.dvc
?? Posts.tsv.dvc
?? code/conf.pyc

$ echo "*.pyc" >> .gitignore
```

As mentioned before, both of stage files can be committed to the repository
together:

```dvc
$ git add .
$ git commit -m "Process to TSV and separate test and train"
```

Let's run and save the following commands for our pipeline. First, define the
feature extraction stage, that takes `train` and `test` TSV files and generates
corresponding matrix files:

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

> Note that using `-f Dvcfile` with `dvc run` above isn't necessary as the
> default stage file name is `Dvcfile` when there are no outputs (option `-o`).

The model evaluation stage is the last one for this tutorial. To help in the
pipeline's reproducibility, we use stage file name `Dvcfile`. (This will be
discussed in more detail in the next chapter.)

Note that the <abbr>output</abbr> file `data/eval.txt` was transformed by DVC
into a [metric](/doc/command-reference/metrics) file in accordance with the `-M`
option.

The result of the last three `dvc run` commands execution is three stage files
and a modified .gitignore file. Let's commit all the changes with Git:

```dvc
$ git status -s
 M data/.gitignore
?? Dvcfile
?? data/eval.txt
?? matrix-train.p.dvc
?? model.p.dvc

$ git add .
$ git commit -m Evaluate
```

The output of the evaluation stage contains the target value in a simple text
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

> We get that this is probably not the best AUC that you have seen! In this
> document, our focus is DVC, not ML modeling, so we use a relatively small
> dataset without any advanced ML techniques.

In the next chapter we will try to improve the metrics by changing our modeling
code and using reproducibility in our pipeline.
