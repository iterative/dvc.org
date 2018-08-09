# Pipeline

This is the biggest DVC's difference from the other version control tools that
can handle large data files, e.g. `git lfs` or `git annex`. By running `dvc run`
multiple times and specifying outputs of a command (stage) as dependencies in
another command (stage) we can, essentially, describe a sequence of commands
that is required to get to the final result:

```dvc
    # first stage - extract features:
    $ dvc run -d featurization.py -d data.tsv \
              -o matrix.pkl \
              python featurization.py data.tsv matrix.pkl

    # second stage - train (20170426 is a seed):
    $ dvc run -d train.py -d matrix.pkl \
              -o model.pkl \
              python train.py matrix.pkl 20170426 model.pkl
```

This example is simplified just to show you an idea of the pipeline, check
[example](/doc/get-started/example) or complete
[tutorial](/doc/tutorial) to see the NLP processing pipeline end-to-end.
