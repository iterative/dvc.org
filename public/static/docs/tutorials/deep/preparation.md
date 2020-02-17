# Preparation

In this document, we will be building an ML model to classify
[StackOverflow](https://stackoverflow.com) questions by two classes: with
`python` tag and without `python` tag. For training purposes, a small subset of
data will be used — only 180Mb xml files.

Most of the code to solve this problem is ready to be downloaded. We will be
modifying some of the code during this tutorial to improve the model.

> We have tested our tutorials and examples with Python 3. We don't recommend
> using earlier versions.

You'll need [Git](https://git-scm.com) to run the commands in this tutorial.
Also, if DVC is not installed, please follow these [instructions](/doc/install)
to do so.

> If you're using Windows, please review
> [Running DVC on Windows](/doc/user-guide/running-dvc-on-windows) for important
> tips to improve your experience.

## Getting the example code

Take the following steps to initialize a new Git repository and get the example
code into it:

<details>

### Expand to learn how to download on Windows

Windows doesn't include the `wget` utility by default, but you can use the
browser to download `code.zip`. (Right-click
[this link](https://code.dvc.org/tutorial/nlp/code.zip) and select
`Save Link As...` (Chrome). Save it into the project directory.

</details>

```dvc
$ mkdir classify
$ cd classify
$ git init
$ wget https://code.dvc.org/tutorial/nlp/code.zip
$ unzip code.zip -d code && rm -f code.zip
$ git add code
$ git commit -m "download code"
```

Now let's install the requirements. But before we do that, we **strongly**
recommend creating a
[virtual environment](https://packaging.python.org/tutorials/installing-packages/#creating-virtual-environments):

```dvc
$ virtualenv -p python3 .env
$ source .env/bin/activate
$ echo ".env/" >> .gitignore
$ pip install -r code/requirements.txt
```

## Initialize

DVC works on top of Git repositories. You run DVC initialization in a repository
directory to create DVC meta files and directories.

After DVC initialization, a new directory `.dvc/` will be created with the
`config` and `.gitignore` files. These and other files and directories are
hidden from user, as typically there's no need to interact with them directly.
See [DVC Files and Directories](/doc/user-guide/dvc-files-and-directories) to
learn more. However, we describe some DVC internals below for a better
understanding of how it works.

```dvc
$ dvc init
...

$ ls -a .dvc
.          ..         .gitignore config     tmp

$ git status -s
A  .dvc/.gitignore
A  .dvc/config
?? .gitignore

$ cat .dvc/.gitignore
/config.local
/updater
/state-journal
/state-wal
/state
/lock
/tmp
/updater.lock
/cache

$ git commit -am "init DVC"
```

The `.dvc/cache` directory is one of the most important parts of any <abbr>DVC
project</abbr>. It will contain all the content of data files. (This is
explained in more detail in the next chapter.) Note that the <abbr>cache</abbr>
directory is contained in `.dvc/.gitignore`, which means that it won't be
tracked by Git — It's a local-only directory, and you cannot push it to any Git
remote.

For more information refer to
[DVC Files and Directories](/doc/user-guide/dvc-files-and-directories).
