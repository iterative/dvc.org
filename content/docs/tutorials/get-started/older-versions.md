# Get Older Data Version

Now that we have multiple experiments, models, processed datasets, the question
is how do we revert back to an older version of a model file? Or how can we get
the previous version of the dataset if it was changed at some point?

The answer is the `dvc checkout` command, and we already touched briefly the
process of switching between different data versions in the
[Experiments](/doc/tutorials/get-started/experiments) chapter of this _Get
Started_ section.

Let's say we want to get the previous `model.pkl` file. The short answer is:

```dvc
$ git checkout baseline-experiment train.dvc
$ dvc checkout train.dvc
```

These two commands will bring the previous model file to its place in the
<abbr>workspace</abbr>.

<details>

### Expand to learn about DVC internals

DVC uses special [`.dvc` files](/doc/user-guide/dvc-file-format) to track data
files, directories, end results. In this case, `train.dvc` among other things
describes the `model.pkl` file this way:

```yaml
outs:
md5: a66489653d1b6a8ba989799367b32c43
path: model.pkl
```

`a664...2c43` is the "address" of the file in the local or remote DVC storage.

It means that if we want to get to the previous version, we need to restore the
`.dvc` file first with the `git checkout` command. Only after that can DVC
restore the model file using the new "address" from the `.dvc` file.

</details>

To fully restore the previous experiment we just run `git checkout` and
`dvc checkout` without specifying a target:

```dvc
$ git checkout baseline-experiment
$ dvc checkout
```

Read the `dvc checkout` command reference and a dedicated data versioning
[example](/doc/tutorials/versioning) for more information.
