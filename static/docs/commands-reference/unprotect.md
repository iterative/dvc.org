# unprotect

Unprotect a file or a directory. 

Running `dvc unprotect` guarantees that file or directory in the working space
is physically "unlinked" from the cache and can be safely updated. Check the
[Update a Tracked File](/doc/user-guide/update-tracked-file) to learn more.

```usage
    usage: dvc unprotect [-h] [-q | -v] targets [targets ...]
    
    Unprotect data file/directory.
    
    positional arguments:
      targets        Data files/directory.
    
    optional arguments:
      -h, --help     show this help message and exit
      -q, --quiet    Be quiet.
      -v, --verbose  Be verbose.
```

`dvc unprotect` can be an expensive operation (involves copying data), check
first if your task matches one of the cases that are considered safe without
running `dvc unprotect`:

* Adding more files to a directory input data set (say, images or videos).

* Deleting files from a directory data set.

* *Advanced*. If your underlying file system supports _reflinks_ (copy on
write) and DVC [protected mode](/doc/commands-reference/config#cache) is off.

* *Advanced*. If your [cache type](/doc/commands-reference/config#cache) is set
to `copy` and DVC [protected mode](/doc/commands-reference/config#cache) is off. 

## Example

1. Make sure that protected mode is enabled:

```dvc
    $ dvc config cache.protected true
```

2. Put a data file under DVC control:

```dvc
    $ ls -lh
    -rw-r--r--  1 10576022 Nov 27 13:30 Posts.xml.tgz
    
    $ dvc add Posts.xml.tgz
    Adding 'Posts.xml.tgz' to '.gitignore'.
    Saving 'Posts.xml.tgz' to cache '.dvc/cache'.
    Saving information to 'Posts.xml.tgz.dvc'.
    
    To track the changes with git run:
    
    	git add .gitignore Posts.xml.tgz.dvc
```

3. Check that file is a read-only link (@ sign means a link): 
    
```dvc    
    $ ls -lh
    -r--r--r--@ 1 10576022 Apr 25  2017 Posts.xml.tgz
    -rw-r--r--  1      120 Nov 27 13:29 Posts.xml.tgz.dvc
```

4. Unprotect the file:

```dvc
    $ dvc unprotect Posts.xml.tgz
    [##############################] 100% Posts.xml.tgz
```

4. Check that the file is writable now, the cached version is intact, and they
are not linked (the file in the workspace is a copy of the file):

```dvc
   $ ls -lh
   -rw-r--r--  1  120B Nov 27 13:29 Posts.xml.tgz.dvc
   -rw-r--r--  1   10M Nov 27 13:30 Posts.xml.tgz
   
   $ ls -lh ls -lh .dvc/cache/2f/
   -rw-r--r--@ 1 10M Apr 25  2017 412200dc53fb97dcac0353b609d199
``` 
