# Add Output to Stage

There are situations where we have executed a stage (either by writing
`dvc.yaml` manually and using `dvc repro`, or with `dvc run`), but later notice
that some of the output files or directories it creates, which are already in
the <abbr>workspace</abbr>, are missing from `dvc.yaml` (`outs` field). Follow
the steps below to add existing files or directories as <abbr>outputs</abbr> to
a stage without re-executing it again, which can be expensive/time-consuming,
and is unnecessary.

We start with an example `prepare`, which has a single output. To add a missing
output `data/validate` to this stage, we can edit `dvc.yaml` like this:

```git
 stages:
   prepare:
     cmd: python src/prepare.py
     deps:
     - src/prepare.py
     outs:
     - data/train
+    - data/validate
```

> Note that you can also use `dvc run` with the `-f` and `--no-exec` options to
> add another output to the stage:
>
> ```dvc
> $ dvc run -f --no-exec \
>           -n prepare \
>           -d src/prepare.py \
>           -o data/train \
>           -o data/validate \
>           python src/prepare.py
> ```
>
> `-f` overwrites the stage in `dvc.yaml`, while `--no-exec` updates the stage
> without executing it.

Finally, we need to run `dvc commit` to save the newly specified output(s) to
the <abbr>cache</abbr> (and to update the corresponding hash values in
`dvc.lock`):

```dvc
$ dvc commit
```
