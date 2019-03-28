# Get Older Data Version

Now that we have multiple experiments, models, processed data sets, the question
is how do revert back to an older version of a model file? Or how can we get the
previous version of the data set if we changed it at some point?

The answer is the `dvc checkout` command, and we already touched briefly the
process of switching between different data versions in the
[Experiments]('/doc/get-started/experiments') step of this get started guide.

Let's say we want to get the previous `model.pkl` file. The short answer is:

```dvc
    $ git checkout baseline-experiment train.dvc
    $ dvc checkout train.dvc
```

These two commands will bring the previous model file to its place in the
working tree.

<details>

### Expand to learn more about DVC internals

DVC is using special meta-files (`.dvc` files) to track data files, directories,
end results that are under DVC control. In this case, `train.dvc` among other
things describes the `model.pkl` file this way:

```yaml
    outs:
        md5: a66489653d1b6a8ba989799367b32c43
        path: model.pkl
```

`a664...2c43` is the "address" of the file in the local or remote DVC storage.

It means that if we want to get to the previous version, we need to restore the
DVC file first to with the `git checkout` command. Only after that DVC can
restore the model file using the new "address" from the `.dvc` file.

</details>

To fully restore the previous experiment we just run `git checkout` and
`dvc checkout` without specifying a target:

```dvc
    $ git checkout baseline-experiment
    $ dvc checkout
```

Read `dvc checkout` command reference and a dedicated data versioning
[example](/doc/get-started/example-versioning) to get more information.
