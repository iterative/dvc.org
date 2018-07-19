# Multiple Data Scientists On A Single Machine

It's pretty common to see that teams prefer using one single shared machine to
run their experiments. This allows you to have a better resource utilization
such as ability to use multiple GPUs, store all your data in one place, etc.
With DVC, you can easilly setup a shared data storage on the server that will
allow your team to share and store data for your projects as effectivelly as
possible and have a workspace restoration/switching speed as instant as` git
checkout` for your code. In order to make it work on a shared server, you need
to setup a shared cache location for your project, so that every team member
is using the same cache storage.

## Preparation

Create a directory that we want to store our shared cache in:

```dvc
    $ mkdir -p /dvc-cache
```

You will have to make sure that the directory has proper permissions setup, so
that every colleague of yours can read and write to it and can access cache
files written by others. The most streightforward way to do that is to make
sure that you and your colleagues are members of the same group(e.g. 'users')
and that your shared cache dir is owned by that group and has has respective
permissions.

## (Optional) Transfer Local Cache To External Cache Directory

This step is optional. You can skip it if you are setting up a new DVC
repository and don't have your local cache stored in `.dvc/cache`. If you did
work on your project with DVC previosly and you wish to transfer your cache
to the external cache directory, you will need to simply move it from an old
cache location to the new one:

```dvc
    $ mv .dvc/cache/* /dvc-cache
```

## Tell DVC To Use External Cache Directory

Tell DVC to use the directory we've set up as an external cache location by
running:

```dvc
    $ dvc config cache.dir /dvc-cache
```

Commit changes to `.dvc/config` and push them to your git remote:

```dvc
    $ git add .dvc/config
    $ git commit -m "dvc: setup external cache dir"
```

## Use DVC With External Cache Directory

You and your colleagues can work in your own workspaces as usual and dvc will
handle all your data in the most effective way possible. Let's say you are
cleaning up the data:

```dvc
    $ dvc add raw
    $ dvc run -d raw -o clean ./cleanup.py raw clean
    $ git add raw.dvc clean.dvc
    $ git commit -m 'cleanup raw data'
    $ git push
```

Your colleague can pull the code and have both `raw` and `clean` instantly
appear in his workspace without copying. After this he decides to continue
building the pipeline and process the cleaned up data:

```dvc
    $ git pull
    $ dvc checkout
    $ dvc run -d clean -o processed ./process.py clean process
    $ git add processed.dvc
    $ git commit -m 'process clean data'
    $ git push
```

And now you can just as easilly get his work appear in your workspace by:

```dvc
    $ git pull
    $ dvc checkout
```
