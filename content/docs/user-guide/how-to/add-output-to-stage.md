# Add Output to Stage

There are situations where we execute a stage without specifying all the
<abbr>outputs</abbr> in `dvc.yaml` (either via `dvc run` or manually), and then
later want to add more outputs to that stage.

Re-executing a stage using `dvc run -f` to add an output is an expensive step,
as it requires time and resources. Follow the steps below to add an output to
the stage without executing it again.

We start with an example `prepare` stage in `dvc.yaml`, which has a single
output. To add a missing output `data/validate` to this stage, we can edit the
file like this:

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
> The `-f` option overwrites the stage in `dvc.yaml`, and the `--no-exec` option
> updates the stage without executing it.

Finally, we need to run `dvc commit`. It saves the newly specified outputs to
the <abbr>cache</abbr> (and updates their hash values in `dvc.lock`):

```dvc
$ dvc commit
```
