# Huge Data On An External Local Drive

Sometimes the data may be huge and they are stored on an external local drive.
By "huge" we mean that they won't fit on our home directory, and even if they
did, it would certainly take a long time to copy them back an forth from the
external drive to our home directory. For example let's say that the data are
stored on an external HDD drive of size 16TB, which is mounted on `/mnt/data/`,
while the disk of our home directory has a size of only 320GB.

In this case we would like to process the data where they are (on the external
drive), to save the results there, and certainly to store the cached files on
the external drive too.

The most easy way to do this would be to locate the <abbr>workspace</abbr> on
the external drive as well, which could be done like this:

```dvc
$ sudo su
# cd /mnt/data/
# git init
# dvc init
```

But in case this is not possible (or is not preferable), we can easily setup the
<abbr>workspace</abbr> on our home directory, while all the data files and their
caches keep staying on the external drive. DVC will still be able to track them
properly.

### Make the data directory accessible

For this to work, first you have to make sure that you can read and write the
data directory `/mnt/data/`. The most straightforward way to do this is by
setting proper ownership and permissions to it, like this:

```dvc
$ sudo chown <username>: -R /mnt/data/
$ chmod u+rw -R /mnt/data/
```

### Start a DVC project and setup a local external cache

An _external_ <abbr>cache</abbr> is called so because it resides outside of your
<abbr>workspace</abbr> directory. We also call it _local_ because it is located
within our filesystem (as opposed to being located somewhere on the internet, in
which case it is called _remote_). Let's create a directory for it:

```dvc
$ mkdir -p /mnt/data/dvc-cache
```

Now you can initialize a project on your home directory and configure it to use
the external cache directory:

```dvc
$ cd ~/project/
$ git init
$ dvc init

$ dvc config cache.dir /mnt/data/dvc-cache
$ rm -rf .dvc/cache/

$ git add .dvc/config
$ git commit -m 'DVC with external cache dir'
```

If you check the config file you will see something like this:

```dvc
$ cat .dvc/config
[cache]
dir = /mnt/data/dvc-cache
```

### Example of tracking external dependencies and outputs

Now, when you refer to the data files and directories, you have to use their
absolute path. The DVC-files will be created on the <abbr>project</abbr>
directory, and you can track their modifications with `git` as usual.

For example let's say that the raw data are on `/mnt/data/raw/` you are cleaning
them up. You could do it like this:

```dvc
$ dvc add /mnt/data/raw

$ dvc run -f clean.dvc \
          -d /mnt/data/raw \
          -o /mnt/data/clean \
          ./cleanup.py /mnt/data/raw /mnt/data/clean
```

If you check the contents of the files `raw.dvc` and `clean.dvc` you will notice
that their `path:` field refers to the external directories:

```dvc
$ cat raw.dvc
md5: 9cbbacd47133debf91dcb41891c64730
wdir: .
outs:
- md5: 0ee0a6bc0a1f1be0610f7a3f67f1cb54.dir
  path: /mnt/data/raw
  cache: true
  metric: false
  persist: false

$ cat clean.dvc
md5: 2b842ed58b1792dde6df27e3d0f73430
cmd: cp -a /mnt/data/raw /mnt/data/clean
wdir: .
deps:
- md5: 0ee0a6bc0a1f1be0610f7a3f67f1cb54.dir
  path: /mnt/data/raw
outs:
- md5: 0ee0a6bc0a1f1be0610f7a3f67f1cb54.dir
  path: /mnt/data/clean
  cache: true
  metric: false
  persist: false
```

You can also check and verify that indeed all the data and cache files are
stored on the external drive:

```dvc
$ ls /mnt/data/
clean  dvc-cache  raw

$ ls /mnt/data/dvc-cache
. . .

```

Now you can add and commit the DVC-files to git:

```dvc
$ git add raw.dvc clean.dvc
$ git commit -m "cleanup raw data"
```
