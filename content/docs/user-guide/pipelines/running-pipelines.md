# Running pipelines

To run a pipeline, you can use `dvc exp run`. This will run the pipeline and
save the results as an [experiment](/doc/user-guide/experiment-management):

```cli
$ dvc exp run
'data/data.xml.dvc' didn't change, skipping
Running stage 'prepare':
> python src/prepare.py data/data.xml
Updating lock file 'dvc.lock'

Running stage 'featurize':
> python src/featurization.py data/prepared data/features
Updating lock file 'dvc.lock'

Running stage 'train':
> python src/train.py data/features model.pkl
Updating lock file 'dvc.lock'

Running stage 'evaluate':
> python src/evaluate.py model.pkl data/features
Updating lock file 'dvc.lock'

Ran experiment(s): barer-acts
Experiment results have been applied to your workspace.
```

<admon type="tip">

If you do not want to save the results as an experiment, you can use
`dvc repro`, which is similar but does not save an experiment or have the other
experiment-related features of `dvc exp run`.

</admon>
