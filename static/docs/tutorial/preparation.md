## 1. Preparation

### 1.1. What we are going to do?

In this document we will be building an ML classification model which classify stackoverflow questions by two classes: with “python” tag and without “python” tag. For training purposes a small subset of data will be used — only 180Mb xml files.

Most of the code for the problem is ready and will be downloaded in the first steps. Later we will be modifying the code a bit to improve the model.

### 1.2. Getting the sample code

Take the following steps to initialize a new Git repository and get the sample code into it:

    $ **mkdir classify**
    $ **cd classify**
    $ **git init**

    $ **mkdir code**
    $ **S3_DIR=[https://s3-us-west-2.amazonaws.com/dvc-share/so](https://s3-us-west-2.amazonaws.com/dvc-share/so)**
    $ **wget -nv -P code/ \
            $S3_DIR/code/featurization.py \
            $S3_DIR/code/evaluate.py \
            $S3_DIR/code/train_model.py \
            $S3_DIR/code/split_train_test.py \
            $S3_DIR/code/xml_to_tsv.py \
            $S3_DIR/code/conf.py \
            $S3_DIR/code/requirements.txt**

    $ **git add code/**
    $ **git commit -m 'Download code'**

Install the code requirements:

    $ **pip install -r code/requirements.txt**

### 1. 3. Install DVC

Now DVC software should be installed. The best way to install DVC is a system dependent package. DVC supports all common operation systems: Max OS X, Linux and Windows. You can find the latest version of the package on the DVC website: dataversioncontrol.com

Alternatively, you can install DVC by Python package manager — PIP if you use Python:

    $ **pip install dvc**

### 1.4. Initialize

DVC works on top of Git repositories. You run DVC initialization in a repository directory to create DVC metafiles and directories.

After DVC initialization, a new directory ***.dvc*** will be created with ***config*** and ***.gitignore*** files and ***cache*** directory. These files and directories are hidden from the user in general and the user does not interact with these files directly. However, we describe DVC internals a bit for better understanding on how it works.

    $ **dvc init**
    $ **ls -a .dvc**
    ./      ../     .gitignore  cache/  config

    $ **git status -s**
    A  .dvc/.gitignore
    A  .dvc/config

    $ **cat .dvc/.gitignore**
    cache
    state
    lock

    $ **git commit -m 'Init DVC'**

**.dvc/cache** directory is one of the most important parts of any DVC repositories. The directory contains all content of data files and will be described in the next chapter with more detail. The most important part about this directory is that ***.dvc/.gitignore*** file is containing this directory which means that the cache directory is not under Git control — this is your local directory and you cannot push it to any Git remote.
