# DVC File Format

When you add a file or a stage to your pipeline, DVC creates a special ```.dvc```
file that contains all the needed information to track your data. The file
itself is in a simple YAML format and could be easily written or altered
(after being created by `dvc run`) by hand.

Here is an example of dvc file:

```
    cmd: python cleanup.py
    deps:
    - md5: da2259ee7c12ace6db43644aef2b754c
      path: common.py
    - md5: e309de87b02312e746ec5a500844ce77
      path: cleanup.py
    - md5: 129a6b44831a9344e493b974cfa1ac9a
      path: ../raw/data
    md5: 521ac615cfc7323604059d81d052ce00
    outs:
    - cache: true
      md5: 70f3c9157e3b92a6d2c93eb51439f822
      metric: false
      path: data
```

## Structure

On the top level, ```.dvc``` file consists of such fields:

* `cmd`: a command that is being run in this stage of the pipeline;
* `deps`: a list of dependencies for this stage;
* `outs`: a list of outputs for this stage;
* `md5`: md5 checksum for this dvc file;

A dependency entry consists of such fields:

* `path`: path to the dependency, relative to the location of dvc file;
* `md5`: md5 checksum for the dependency;

An output entry consists of such fields:

* `path`: path to the output, relative to the location of dvc file;
* `md5`: md5 checksum for the output;
* `cache`: whether or not dvc should cache the output;
* `metric`: whether or not this file is a metric file;
