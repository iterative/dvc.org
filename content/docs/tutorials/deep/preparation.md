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

DVC works best inside Git repositories like the one we're in. Initialize DVC
with:

At DVC initialization, a new `.dvc/` directory is created for internal
configuration and <abbr>cache</abbr>
[files and directories](/doc/user-guide/dvc-files-and-directories), that are
hidden from the user. This directory is automatically staged with `git add`, so
it can be easily committed with Git:

```dvc
$ dvc init
...

$ ls -a .dvc
.          ..         .gitignore config     tmp

$ git status -s
A  .dvc/.gitignore
A  .dvc/config
?? .gitignore

$ git commit -am "init DVC"
```

The <abbr>cache directory</abbr>, one of the most important parts of any
<abbr>DVC project</abbr>, will store the content of all data files. (This is
explained in more detail in the next chapter.) Note that it won't be tracked by
Git — It's a local-only directory, and you cannot push it to a Git remote.

For more information refer to
[DVC Files and Directories](/doc/user-guide/dvc-files-and-directories).
