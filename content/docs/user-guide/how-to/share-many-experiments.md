# How to Share Many Experiments

`dvc exp push` and `dvc exp push` allow us to [share experiments] between
repositories via existing DVC and Git remotes. These however work on individual
experiments.

Here's a simple shell loop to push or pull all experiments (Linux):

```dvc
$ dvc exp list --all --names-only | while read -r expname ; do \
    dvc exp pull origin ${expname} \
done
```

> 📖 See [Listing Experiments] for more info on `dvc exp list`.

[share experiments]: /doc/user-guide/experiment-management/sharing-experiments
[listing experiments]:
  /doc/user-guide/experiment-management/comparing-experiments#list-experiments-in-the-project
