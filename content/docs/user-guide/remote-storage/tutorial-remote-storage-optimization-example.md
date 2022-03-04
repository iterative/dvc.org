# Remote storage optimisation example

This illustrates aspects the remote storage structure. If you are not familiar
at all with how DVC remote storages are structured this document will be useful
to you.

> While you can use any of the supported external storages, we will focus on
> Amazon S3 in this document. You can still follow the tutorial with a different
> cloud service provider and a different OS, but you may need to make
> adjustments to the commands. It is assumed that
>
> - you have an [Amazon AWS account](https://aws.amazon.com) and have set up the
>   [AWS CLI](https://aws.amazon.com/cli/) on your local PC, giving you the
>   `aws` command
> - that you have set up an [S3 bucket](https://s3.console.aws.amazon.com) to be
>   the remote storage
> - you have downloaded an AWSAccessKeyId and a AWSSecretKey from
>   [AWS IAM](https://aws.amazon.com/iam/)
> - and you have configured your local PC with these keys using `aws configure`.
> - you have `git` installed and available at the command line.
> - we will use an OS X/Linux terminal, so commands may differ if you are using
>   Windows

## Set up a simple project

To get started, we will set up a basic project tracked by both `git` and `dvc`.
The project will contain only data files and no pipelines, code or other
anything else; the aim is to keep everything as simple as possible so remote
storage concepts can be clearly illustrated.

Let's make a folder called `project` and initialise it:

```dvc
$ mkdir project
$ cd project
$ git init
$ dvc init
```

Next, add some data to the project. In machine learning pipelines, data files
can be quite large (e.g. hundreds of GB in size), but for our purposes they will
be small text files so commands finish quickly. Additionally, let's make all the
data files contain the same content initially. We can use `echo` to achieve
this:

```dvc
$ echo data > data1
$ echo data > data2
$ echo data > data3
$ echo data > data4
```

Now let's tell DVC about these new data files and ask for them to be
specifically tracked:

```dvc
$ dvc add data1
$ dvc add data2
$ dvc add data3
$ dvc add data4
```

Once that is done, you will notice that a `.dvc` file is created for each of the
original data files:

```dvc
$ ls
data1 data2 data3 data4
data1.dvc data2.dvc data3.dvc data4.dvc
```

The `dvc add` command should also have put all data files inside `.gitignore`,
which is a good idea because we don't want git to track these potentially large
files even though in reality, they are not that large).

Let's doublecheck `.gitignore` then:

```dvc
% cat .gitignore
/data1
/data2
/data3
/data4
```

The data files are all there!

Now we can do an initial commit of everything using `git`, but first, let's set
up the connection between `dvc` and our remote S3 storage.

When the remote storage is added, the file `.dvc/cache` will be updated with the
remote storage details, so we will need to add these to git as well:

```dvc
$ dvc remote add s3remote s3://path/to/your/storage/
$ git add .dvc/config
```

Finally we can do the initial commit:

```dvc
$ git commit -m "initial"
```

## Pushing the DVC-tracked files to the remote storage

Now come's the interesting part!

> To fully appreciate how remote storages work, it's useful to understand the
> idea of [indirection](https://en.wikipedia.org/wiki/Indirection). Indirection
> is the naming of things using references. For example, my name is "Mike", an
> indirect way of referring to the person that is me. Another reference to me
> could be "Employee #25531" if that is how my company refers to me. Two
> references, same person or thing.

Back to the project. Let's now push our four data files to the remote storage:

```dvc
$ dvc push -r s3remote
1 file pushed
```

Notice the output of this command: `1 file pushed`. From the previous section,
you should know that _four_ data files were created. You can double check this
and confirm the existance of four files:

```dvc
% ls
data1		data2		data3		data4
data1.dvc	data2.dvc	data3.dvc	data4.dvc
```

So why was only _one_ data file pushed?

If you have the `aws` command line tool set up (or whatever your equivalent is
if you are not using AWS), you ccan further check the remote storage contents.
Here's what the S3 remote storage looked like to me:

```dvc
$ aws s3 ls s3://path/to/your/storage/
                           PRE 61/
2022-02-20 13:16:49          0
```

One folder `61/` has been created, and if you look inside this, the folder
contains only a single file with an obfuscated (hexademical) name.

So what's going on?

The answer (if you hadn't guessed already) is that the four data files were
identical. Therefore DVC concluded that only one copy of the files really needed
to be uploaded. The name `61/` is an internal name for the object and is used to
implement an indirection. So the file `data1` on my local computer references
`61/` on the remote storage, the file `data2` on my local computer also
references `61/`, and so on. For all intents and purposes, there are still four
separate files, it's just that indirection is being used to reduce the amount of
space being used by the remote storage by not storing duplicate data.

You can imagine how useful this could be if, for example, you had two large
100GB image datasets, but they they both shared 50GB of image files. Your cloud
storage charges could be significantly reduced!

How does DVC determine which files are identical? This is achieved by comparing
their [MD5 hashes](https://en.wikipedia.org/wiki/MD5). You can confirm this by
looking at the `.dvc` files for the four data files yourself:

```dvc
$ cat *.dvc
outs:
- md5: 6137cde4893c59f76f005a8123d8e8e6
  size: 5
  path: data1
outs:
- md5: 6137cde4893c59f76f005a8123d8e8e6
  size: 5
  path: data2
outs:
- md5: 6137cde4893c59f76f005a8123d8e8e6
  size: 5
  path: data3
outs:
- md5: 6137cde4893c59f76f005a8123d8e8e6
  size: 5
  path: data4
```

The MD5 hashes are the same in each case. If the files were different (and
again, you can check this by making one of the files different) then the MD5
hash for the different file would change.

Graphically, at this point, the project folder and the remote storage have this
structure:

![Data in project and remote storage](/img/project_remote_1.png)

## Adding new data and how the remote storage changes

Let's add two more data files to our project, but this time make them different
from the first four data files. We should also make sure DVC tracks the new
files and have git track the corresponding `.dvc` files that is used to store
the metadata about the files:

```dvc
$ echo data3636363 > data5
$ echo blahblahblah > data6
$ dvc add data5
$ dvc add data6
$ git add data5.dvc
$ git add data6.dvc
$ git add .gitignore
$ git commit -m "added more data"
```

So... to summarise... at this point we have four identical data files namely
`data1`...`data4` and two new data files, `data5` and `data6`. Based on what
happened the last time we pushed data to the remote storage, we can predict that
since the two new data files are different to the others and each other, they
will both need to be pushed to the remote storage. This, in fact, is exactly
what happens:

```dvc
$ dvc push -r s3remote
2 files pushed
```

The remote storage will now have three different items, which you can see using
`aws` or whatever method you are using:

```dvc
$ aws s3 ls s3://path/to/your/storage/
                           PRE 61/
                           PRE 8c/
                           PRE e1/
2022-02-20 13:16:49          0
```

Graphically speaking, the remote storage has been updated to look like this:

![Data in project and remote storage after adding more data](/img/project_remote_2.png)

## Modifying existing data

Finally, let's change one of the data files that used to be a duplicate and push
the changes to the remote storage:

```dvc
$ echo shshshshs > data1
$ dvc add data1
$ dvc push -r s3remote
1 file pushed
$ aws s3 ls s3://path/to/your/storage/
                           PRE 3d/
                           PRE 61/
                           PRE 8c/
                           PRE e1/
2022-02-20 13:16:49          0
```

As expected, the modified file is pushed to the remote storage and name `data1`
would now be updated to reference this new object in storage. There are now four
different objects in the remote storage.

We can finish off by telling git about the updated `.dvc` file for the modified
data file:

```dvc
$ git add data1.dvc
$ git commit -m "modified data"
```

The final configuration of the remote storage will be this:

![Data in project and remote storage](/img/project_remote_3.png)

Hopefully, this has cleared up some aspects of how DVC's remote storages work.
