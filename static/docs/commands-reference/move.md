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
DVC keeps track of incremental changes to a file via the DVC cache.  Moving a file is the same as changing its name.  So `dvc move` changes the file's name in the DVC cache.

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
