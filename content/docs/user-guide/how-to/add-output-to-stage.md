# Add Output to Stage

There are situations where we run a stage without specifying all the
<abbr>outputs</abbr>, and then later want to add more outputs to that stage. If
we use `dvc run` to add outputs, it will re-run the stage.

Running a stage is an expensive step, as it requires time and resources to
execute the command. Follow the steps below to add an output to the stage
without running it again.

We have an example stage `prepare` defined in `dvc.yaml`. To add another output
`data/test` to this stage, we can edit `dvc.yaml`. This is how it looks after
the change:

```dvc
$ cat dvc.yaml
stages:
  prepare:
    cmd: python src/prepare.py
    deps:
    - src/prepare.py
    outs:
    - data/train
+   - data/test
```

That's it, the new output has been added to the `prepare` stage.

> Note that you can also use `dvc run` with the `-f` and `--no-exec` options to
> add another output to the stage:
>
> ```dvc
> $ dvc run -f --no-exec \
>           -n prepare \
>           -d src/prepare.py \
>           -o data/train \
>           -o data/test \
>           python src/prepare.py
> ```
>
> The `-f` option is used to overwrite an existing stage in the `dvc.yaml`, and
> the `--no-exec` option is used to create or update a stage without executing
> the command.

Finally, we need to run `dvc commit`. It saves the newly specified outputs to
the <abbr>cache</abbr> and updates their hash values in `dvc.lock`:

```dvc
$ dvc commit
```
