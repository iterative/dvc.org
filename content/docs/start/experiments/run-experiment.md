Running the experiment with the default project settings requires only the
command:

```dvc
$ dvc exp run
...
Reproduced experiment(s): exp-b28f0
Experiment results have been applied to your workspace.
...
```

This runs the command specified in `dvc.yaml` (`python train.py`), and creates
models, plots, and metrics in the respective directories. The experiment is then
associated with the values found in the parameters file (`params.yaml`) and
other dependencies, as well as the metrics produced.
