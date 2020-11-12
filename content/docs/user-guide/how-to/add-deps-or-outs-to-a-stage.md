# Add Dependencies or Outputs to a Stage

There are situations where we have executed a stage (either by writing
`dvc.yaml` manually and using `dvc repro`, or with `dvc run`), but later notice
that some of its data requirements are missing from `dvc.yaml`. Namely, one of:

- Files or directories in the <abbr>workspace</abbr> that are dependencies of
  the stage are missing from `deps`.

- Output files or directories that the stage creates, which are already in the
  workspace are missing from `outs`.

Follow the steps below to add existing files/directories as
<abbr>dependencies</abbr> or <abbr>outputs</abbr> to a stage without executing
it again, which can be expensive/time-consuming, and is unnecessary.

We start with an example stage `prepare`, which has a single dependency and
output. To add a missing dependency `data/raw.csv` and output `data/validate` to
this stage, we can edit `dvc.yaml` like this:

```git
 stages:
   prepare:
     cmd: python src/prepare.py
     deps:
+    - data/raw.csv
     - src/prepare.py
     outs:
     - data/train
+    - data/validate
```

> Note that you can also use `dvc run` with the `-f` and `--no-exec` options to
> add another dependency/output to the stage:
>
> ```dvc
> $ dvc run -f --no-exec \
>           -n prepare \
>           -d data/raw.csv \
>           -d src/prepare.py \
>           -o data/train \
>           -o data/validate \
>           python src/prepare.py
> ```
>
> `-f` overwrites the stage in `dvc.yaml`, while `--no-exec` updates the stage
> without executing it.

Finally, we need to run `dvc commit` to save the newly specified output(s) to
the <abbr>cache</abbr> (and to update the hash values of `deps` and `outs` in
`dvc.lock`):

```dvc
$ dvc commit
```
