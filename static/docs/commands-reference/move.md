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


### The Reason DVC Move is Required and MV is not Enough
DVC works by creating a stage file (the one ending with .dvc) with enough information to reproduce it and to prevent re-running the command we use a "cache" to store the outputs, if the dependencies haven't change and the command haven't change, we can look up for the cached output and just "check it out" to the working directory.

It only works with datasets.   It's not designed to handle dvc run outputs.

let's imagine the following scenario:
echo "hello" > hello

`dvc add` hello


The add command would create a hello.dvc file with the following content:

```md5: 3a9a9ce3c80ac2a4c5156e1feaa341fb
outs:
- cache: true
  md5: b1946ac92492d2347c6235b4d2611184
  metric: false
  path: hello```


if we move the output "hello" by our own means (`mv hello other`)

The stage file wouldn't know that we changed the "path" of the output to other instead of hello, and also, it would be misleading to have a stage file named hello.dvc that creates a file named other...

So, we introduced dvc move that will rename the stagefile, will adjust its content to the new path; it also prevents "recomputing the checksum" as we know that the file has the same content, just different path & inode


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
