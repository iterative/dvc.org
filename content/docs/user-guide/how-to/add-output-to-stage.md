# Add Output to Stage

There are situations where you might have forgotten to specify one of the
<abbr>outputs</abbr> for a stage while creating it, and then later want to add
an output to that stage.

Running a stage to specify additional output is an expensive step as, it
requires time and resources to execute the command. Follow the steps listed
below to add an output to the stage without running it again.

Let's first create a stage for the example <abbr>project</abbr>:

```dvc
$ dvc run -n prepare \
          -d src/prepare.py \
          -o data/train \
          python src/prepare.py
```

You can check stage entry in `dvc.yaml`:

```dvc
$ cat dvc.yaml
stages:
  prepare:
    cmd: python src/prepare.py
    deps:
    - src/prepare.py
    outs:
    - data/train
```

Now to add an output to the `prepare` stage, you need to use `dvc run` with the
`-f` and `--no-exec` options:

```dvc
$ dvc run -f --no-exec \
          -n prepare
          -d src/prepare.py \
          -o data/train \
          -o data/test \
          python src/prepare.py
```

The `-f` option is used to overwrite an existing stage in the `dvc.yaml`, and
the `--no-exec` option is used to create or update a stage without executing the
command defined in it.

Let's check `dvc.yaml` again:

```dvc
$ cat dvc.yaml
stages:
  prepare:
    ...
    outs:
    - data/test
    - data/train
```

As you can see, the new output has been added to the `train` stage in
`dvc.yaml`. Now you need to run `dvc commit` to update `dvc.lock` and save data
to the <abbr>cache</abbr>:

```dvc
$ dvc commit
```

Finally, the output has been added to the stage without running it again.
