# remote

[Add](/doc/commands-reference/remote:add), 
[list](/doc/commands-reference/remote:list), 
[modify](/doc/commands-reference/remote:modify), 
and [remove](/doc/commands-reference/remote:remove) available
commands to set up and manage data remotes.

## Synopsis

```usage
    usage: dvc remote [-h] [-q] [-v] {add,remove,modify,list} ...

    positional arguments:
        add                   Add remote
        remove                Remove remote
        modify                Modify remote
        list                  List remotes
```

## Description

What is data remote?

The same way as Github serves as a master storage for Git-based projects, DVC
data remotes provide a central place to keep and share data and model files.
With a remote data storage, you can pull models and data files which were
created by your team members without spending time and resources to re-build
models and re-process data files. It also saves space on your local environment -
DVC can [fetch](/doc/commands-reference/fetch) into the local cache only the
data you need for a specific branch/commit.

Using DVC with a remote data storage is optional. By default, DVC is
configured to use a local data storage only (usually `.dvc/cache` directory
inside your repository), which enables basic DVC usage scenarios out of the box.

[Add](/doc/commands-reference/remote:add), 
[list](/doc/commands-reference/remote:list), 
[modify](/doc/commands-reference/remote:modify), 
and [remove](/doc/commands-reference/remote:remove) commands
read or modify DVC [config files](/doc/user-guide/dvc-files-and-directories).
Alternatively, `dvc config` can be used or these files could be edited manually.

For the typical process to share the project via remote, see 
[Share Data And Model Files](/doc/use-cases/share-data-and-model-files).

## Examples

1. Let's for simplicity add a default local remote:

```dvc
    $ dvc remote add -d myremote /path/to/remote
    $ dvc remote list

    myremote        /path/to/remote
```

DVC config file would look like:

```ini
   ['remote "myremote"']
   url = /path/to/remote
   [core]
   remote = myremote
```

2. Add AWS S3 remote and modify its region:

```dvc
    $ dvc remote add myremote s3://mybucket/myproject
    $ dvc remote modify myremote region us-east-2
```

3. Remove remote:

```dvc
    $ dvc remote remove myremote
```
