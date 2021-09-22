# Persisting Experiments

When you run an experiment with `dvc exp run`, it produces temporary objects in
the Git repository. These are listed with `dvc exp list` and `dvc exp show`.

Although the experiments as the temporary, they can be shared with
`dvc exp push` and retrieved from other Git repositories with `dvc exp pull`. In
this section we'll see how to bring them to the standard Git workflow with
`dvc exp apply` and `dvc exp branch`.

## Bring Experiment results to your workspace

If it's not run with `--temp` or `--queue` flags, `dvc exp run` leaves the final
artifacts in your workspace. This is for convenience. However if there are more
than one experiment you have run, like

```dvc
$ dvc exp run -S my_param=1
$ dvc exp run -S my_param=2
$ dvc exp run -S my_param=3
```

only the final experiment's results are found in the workspace. In this case,
you may need to bring the previous experiments' results with `dvc exp apply`.

```dvc
$ dvc exp show --include-params=my_param
```

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━┓
┃ Experiment            ┃ Created      ┃     auc ┃ my_param   ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━┩
│ workspace             │ -            │ 0.61314 │ 3          │
│ experiments-tag       │ Oct 19, 2020 │ 0.61314 │ 3          │
│ ├── exp-e6c97         │ Oct 20, 2020 │ 0.69830 │ 2          │
│ └── exp-1df77         │ Oct 22, 2020 │ 0.51676 │ 1          │
└───────────────────────┴──────────────┴─────────┴────────────┘
```

Here, the results found in the workspace in the respective row. When you want to
bring another experiment from the listed experiments, you can do so with:

```dvc
$ dvc exp apply exp-e6c97
Changes for experiment 'exp-e6c97' have been applied...
```

Now, if you list the experiments again with `dvc exp show`, you'll see that the
workspace contains the experiment with `my_param=2` and its `auc` metric.

You can use standard Git commands to add, commit and push to a Git repository.
DVC will take care of the artifacts added to DVC cache, and the rest (params,
code, text files) will be pushed the Git repository.

## Create a Git branch for your experiment

You may desire to keep the experiments in their separate Git branches. You can
use `dvc exp branch` to create a new branch from the experiment and keep all
code and artifacts in a new branch.

```dvc
$ dvc exp show --include-params=my_param
```

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━┓
┃ Experiment            ┃ Created      ┃     auc ┃ my_param   ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━┩
│ workspace             │ -            │ 0.61314 │ 3          │
│ experiments-tag       │ Oct 19, 2020 │ 0.61314 │ 3          │
│ ├── exp-e6c97         │ Oct 20, 2020 │ 0.69830 │ 2          │
│ └── exp-1df77         │ Oct 22, 2020 │ 0.51676 │ 1          │
└───────────────────────┴──────────────┴─────────┴────────────┘
```

Suppose you want to continue to work on `exp-e6c97` in a separate branch. You
give a new name to this branch and create a new branch with it.

```dvc
$ dvc exp branch exp-e6c97 my-successful-experiment
Git branch 'my-successful-experiment' has been created from experiment 'exp-e6c97'.
To switch to the new branch run:
        git checkout my-successful-experiment
```

Note that DVC doesn't checkout the new branch. You can create as many branches
from the experiments, and checkout them manually by:

```dvc
$ git checkout my-successful-experiment
```

Your workspace now contains the files from the experiment. To update the DVC
tracked files, you may need to checkout from the cache.

```dvc
$ dvc checkout
```
