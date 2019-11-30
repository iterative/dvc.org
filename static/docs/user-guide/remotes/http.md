# HTTP/HTTPS

We can create an HTTPS remote with `dvc remote add`:

```dvc
$ dvc remote add get-started https://data.dvc.org/get-started
```

The configuration file `.dvc/config` should have a content like this:

```ini
['remote "get-started"']
url = https://data.dvc.org/get-started
```

> **❗ Note:** HTTP/HTTPS remotes support only download operations.
