# Add Dependencies or Outputs to a Stage

To add files/directories as <abbr>dependencies</abbr> or <abbr>outputs</abbr> to
a stage without executing it, either edit the `dvc.yaml` file or use `dvc run`
with the `--no-exec` option.

There are situations where we have executed a stage, but later notice that some
of the existing files/directories used by the stage as dependencies or created
as outputs are missing from `dvc.yaml`. We can add the existing
files/directories to a stage, and then use `dvc commit` to save the output(s) to
the <abbr>cache</abbr> (and update `dvc.lock`).

## Example

We start with an example `prepare` stage, which has a single dependency and
output. To add a missing dependency (`data/raw.csv`) as well as a missing output
(`data/validate`) to this stage, we can edit `dvc.yaml` like this:

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
the cache (and to update the hash values of `deps` and `outs` in `dvc.lock`):

```dvc
$ dvc commit
```
