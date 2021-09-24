# Persisting Experiments

When you run an experiment with `dvc exp run`, it produces temporary objects in
the Git repository. These are listed with `dvc exp list` and `dvc exp show`.

Although the experiments as the temporary, they can be shared with
`dvc exp push` and retrieved from other Git repositories with `dvc exp pull`. In
this section we'll see how to bring them to the standard Git workflow with
`dvc exp apply` and `dvc exp branch`.

## Bring Experiment results to your workspace

Typically, `dvc exp run` leaves the experiment results in your workspace for
convenience. However, you may have run multiple experiments and wish to go back
to a specific one. In this case, you can restore a previous experiment's results
with `dvc exp apply`. Let's see an example:

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

The results found in the workspace can be found in the respective row. When you want to
bring another experiment to the workspace, you can refer to it using it's name or ID, e.g.:

```dvc
$ dvc exp apply exp-e6c97
Changes for experiment 'exp-e6c97' have been applied...
```

Now, if you list the experiments again with `dvc exp show`, you'll see that the
workspace contains the experiment with `my_param` of `2` and corresponding `auc`
value.

You can now use standard Git commands (e.g. `git add/commit/push`) to version
this experiment directly in the <abbr>repository</abbr>. DVC-tracked data and
artifacts are already in the DVC cache, and the rest (params, code and config
files, etc.) can be stored in Git.

## Create a Git branch for your experiment

You may desire to keep the experiments in their separate Git branches. You can
use `dvc exp branch` to create a new branch from the experiment and keep all
code and artifacts separate from your current one.

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
can create a new Git branch by specifying the experiment and giving a new name for it:

```dvc
$ dvc exp branch exp-e6c97 my-successful-experiment
Git branch 'my-successful-experiment' has been created from experiment 'exp-e6c97'.
To switch to the new branch run:
        git checkout my-successful-experiment
```

Note that DVC doesn't checkout the new branch. You can one or more branches
from existing experiments, and switch into any one manually like this:

```dvc
$ git checkout my-successful-experiment
$ dvc checkout
```

Your workspace now contains all the files from the experiment.
