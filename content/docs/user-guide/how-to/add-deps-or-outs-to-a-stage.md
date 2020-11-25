# Add Dependencies or Outputs to a Stage

To add files/directories as <abbr>dependencies</abbr> or <abbr>outputs</abbr> to
a stage without executing it (which can be expensive/time-consuming, and is
unnecessary) you can either edit the `dvc.yaml` file directly, or use `dvc run`
with the `-f` and `--no-exec` options to the same end.

After updating `dvc.yaml`, use `dvc commit` to save any output file(s) that
already exist in the <abbr>workspace</abbr> to the <abbr>cache</abbr> (and to
update `dvc.lock`).

> This could be a need for example after executing a stage, but later noticing
> that some of the files/directories it uses as dependencies or creates as
> outputs are missing from `dvc.yaml`.

## Example

We start with an example `prepare` stage, which has a single dependency and
output. To add a missing dependency (`data/raw.csv`) as well as a missing output
(`data/validate`), we can edit `dvc.yaml` like this:

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

> We could also use `dvc run` with `-f` and `--no-exec` to add another
> dependency/output to the stage:
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

If the `data/raw.csv` or `data/validate` files exist, we also need to use
`dvc commit` to save the newly specified deps and outs to the <abbr>cache</abbr>
(and to update the hash values of `deps` and `outs` in `dvc.lock`):

```dvc
$ dvc commit
```
