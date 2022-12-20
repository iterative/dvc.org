---
title: 'How to Add Dependencies or Outputs to a Stage'
description: "It's possible to add files or directories to existing stages,
with or without executing them."
---

# How to Add Dependencies or Outputs

To add <abbr>dependencies</abbr> or <abbr>outputs</abbr> to a
[stage](/doc/command-reference/run), edit the `dvc.yaml` file (by hand or using
`dvc stage add` with the `-f` flag). `dvc repro` will execute it and
<abbr>cache</abbr> the output files when ready.

If the stage has already been executed it and the desired outputs are present in
the <abbr>workspace</abbr>, you can avoid `dvc repro` (which can be expensive
and is unnecessary) and use `dvc commit` instead.

> Note that both alternatives update `dvc.lock` too.

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

> We could also use `dvc stage add` with `-f` to add another dependency/output
> to the stage:
>
> ```cli
> $ dvc stage add -n prepare \
>           -f \
>           -d src/prepare.py \
>           -d data/raw.csv \
>           -o data/train \
>           -o data/validate \
>           python src/prepare.py data/raw.csv
> ```
>
> `-f` overwrites the stage in `dvc.yaml`.

If the `data/raw.csv` or `data/validate` files already exist, we can use
`dvc commit` to cache the newly specified outputs (and to update the `deps` and
`outs` file hashes in `dvc.lock`):

```cli
$ dvc commit
```
