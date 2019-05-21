# Preparation

In this document, we will be building an ML model to classify
[StackOverflow](https://stackoverflow.com) questions by two classes: with
`python` tag and without `python` tag. For training purposes, a small subset of
data will be used — only 180Mb xml files.

Most of the code for the problem is ready and will be downloaded in the first
steps. Later we will be modifying the code a bit to improve the model.

## Getting the sample code

Take the following steps to initialize a new Git repository and get the sample
code into it:

<details>

### Expand to learn how to download on Windows

Windows does not ship `wget` utility by default, so you'll need to use browser
to download `code.zip`.

</details>

```dvc
$ mkdir classify
$ cd classify
$ git init
$ wget https://dvc.org/s3/so/code.zip
$ unzip code.zip -d code && rm -f code.zip
$ git add code/
$ git commit -m "download code"
```

(Optional) It's highly recommended to initialize a virtual environment to keep
your global packages clean and untouched:

```dvc
$ virtualenv .env
$ source .env/bin/activate
$ echo ".env/" >> .git/info/exclude
```

Install the code requirements:

```dvc
$ pip install -r code/requirements.txt
```

## Install DVC

Now DVC software should be installed. The easiest way to install DVC is a system
dependent package. DVC supports all common operating systems: Mac OS X, Linux
and Windows. You can find the latest version of the package on the
[home page](https://dvc.org).

Alternatively, you can install DVC by Python package manager — PIP if you use
Python:

```dvc
$ pip install dvc
```

## Initialize

DVC works on top of Git repositories. You run DVC initialization in a repository
directory to create DVC metafiles and directories.

After DVC initialization, a new directory `.dvc/` will be created with `config`
and `.gitignore` files and `cache` directory. These files and directories are
hidden from the user generally and are not meant to be manipulated directly.
However, we describe some DVC internals below for a better understanding of how
it works.

```dvc
$ dvc init
...

$ ls -a .dvc
./      ../     .gitignore  cache/  config

$ git status -s
A  .dvc/.gitignore
A  .dvc/config

$ cat .dvc/.gitignore
/state
/lock
/config.local
/updater
/updater.lock
/state-journal
/state-wal
/cache

$ git commit -m "init DVC"
```

The `.dvc/cache` directory is one of the most important parts of any DVC
repository. The directory contains all the content of data files and will be
described in the next chapter in more detail. The most important part about this
directory is that it is contained in the `.dvc/.gitignore` file, which means
that the cache directory is not under Git control — this is your local directory
and you cannot push it to any Git remote.

For more information refer to
[DVC Files and Directories](https://dvc.org/doc/user-guide/dvc-files-and-directories).
