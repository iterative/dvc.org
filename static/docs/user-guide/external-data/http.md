# External Data on HTTP/HTTPS

**❗ Note:** HTTP/HTTPS remotes support only download operations.

## Create Remotes

We can create an HTTPS remote like this:

```dvc
$ dvc remote add get-started https://data.dvc.org/get-started

$ dvc remote list
get-started	https://data.dvc.org/get-started

$ cat .dvc/config
['remote "get-started"']
url = https://data.dvc.org/get-started
```

## External Dependencies

Let's take as an example a stage that simply downloads a file:

```dvc
$ dvc run \
      -d https://data.dvc.org/get-started/data.xml \
      -o data.xml \
      'wget https://data.dvc.org/get-started/data.xml -O data.xml'
$ ls
data.xml  data.xml.dvc
```

The content of the file `data.xml.dvc` looks like this:

```yaml
cmd: wget https://data.dvc.org/get-started/data.xml -O data.xml
outs:
  - path: data.xml
    metric: false
    cache: true
    persist: false
    md5: a304afb96060aad90176268345e10355
deps:
  - path: https://data.dvc.org/get-started/data.xml
    etag: '"f432e270cd634c51296ecd2bc2f5e752-5"'
md5: cd48862f6949dff1051e197ddc321ef3
```

Let's do the same thing with the help of a remote:

```dvc
$ dvc remote add get-started https://data.dvc.org/get-started
$ dvc run \
      -d remote://get-started/data.xml \
      -o data.xml \
      'dvc get-url remote://get-started/data.xml'
```

We can also simplify it further with the help of the command `dvc import-url`,
like this:

```dvc
$ dvc remote add get-started https://data.dvc.org/get-started
$ dvc import-url remote://get-started/data.xml
```

The content of `data.xml.dvc` will be like this:

```yaml
outs:
  - path: data.xml
    metric: false
    cache: true
    persist: false
    md5: a304afb96060aad90176268345e10355
locked: true
deps:
  - path: remote://get-started/data.xml
    etag: '"f432e270cd634c51296ecd2bc2f5e752-5"'
md5: 026441128ab206cac3a23b554cc83445
```
