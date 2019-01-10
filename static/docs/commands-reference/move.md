# move

Move a file DVC file, meaning move a file that is under DVC control.

 

## Synopsis

```usage
    usage: dvc move [-h] [-q] [-v] src dst

    positional arguments:
        src                   Source
        dst                   Destination
   
```

## Options

 *  `-h, --help`            show this help message and exit
 *  `-q, --quiet`           quiet
 *  `-v, --verbose`         verbose

## Description
DVC works by creating a **cache** file (ending with .dvc) with enough information to reproduce it on the remote DVC repository. The cache tracks incremental changes. If the dependencies haven't changed and the commands to create it on the remote repository haven't changed, we can look at the cached output and just check it out to the working directory.   

DVC move only works with datasets.   It's not designed to handle dvc run outputs.

Let's imagine the following scenario:

echo `"hello" > hello`

`dvc add hello`

The **add** command would create a **hello.dvc** file with the following content:

```json
md5: 3a9a9ce3c80ac2a4c5156e1feaa341fb
outs:
- cache: true
  md5: b1946ac92492d2347c6235b4d2611184
  metric: false
  path: hello
```

If we move the output **hello** using the regular Linux `mv hello other` the stage file wouldn't know that we changed the **path** of the output to **other** instead of **hello**. Also it would be misleading to have a stage file named **hello.dvc** that would create a file name **other** on the remote repository.

So, we introduced `dvc move` that will rename the stagefile and adjust its content to the new path in the .dvc file. It also prevents recomputing the checksum as we know that the file has the same content with just different path and inode.


## Examples
Here we use `dvc add`to put a file under DVC control.  Then we change the name of it using `dvc move`.

```dvc

  $ dvc add data.csv
     
     Adding 'data.csv' to '.gitignore'.
     Saving 'data.csv' to cache '.dvc/cache'.
     Saving information to 'data.csv.dvc'.

To track the changes with git run:
     git add .gitignore data.csv.dvc
     
   $ dvc move data.csv data.csv.moved
     
     Output 'data.csv.moved' didn't change. Skipping saving.
     Adding 'data.csv.moved' to '.gitignore'.
     Saving information to 'data.csv.dvc'.

To track the changes with git run:

	git add .gitignore .gitignore data.csv.dvc  
```
