# DVC Commands Cheat Sheet

Below is the quick summary of the most important commands

```usage
usage: dvc [-h] [-q] [-v] [-V] ...

positional arguments:
                        Use dvc CMD --help for command-specific help
    init                Initialize dvc over a directory
                        (should already be a git dir)
    add                 Add files/directories to dvc
    destroy             Remove DVC cache and files
    import              Import files from URL
    checkout            Checkout data files from cache
    run                 Generate a stage file from a given command
                        and execute the command
    pipeline            Manage pipeline
    pull                Pull data files from the remote storage
    push                Push data files to the remote storage
    fetch               Fetch data files from the remote storage
    status              Show the project status
    repro               Reproduce DVC file. Default file name -
                        'Dvcfile'
    remove              Remove outputs of DVC file.
    move                Move output of DVC file.
    gc                  Collect garbage
    config              Get or set config options
    remote              Manage set of tracked repositories
    metrics             Get metrics from all branches
    install             Install dvc hooks into the repository
    root                Relative path to project's directory
    lock                Lock DVC file
    unlock              Unlock DVC file

optional arguments:
  -h, --help            show this help message and exit
  -q, --quiet           Be quiet.
  -v, --verbose         Be verbose.
  -V, --version         Show program's version

```
