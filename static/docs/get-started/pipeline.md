# Pipeline

This is the biggest DVC's difference from the other version control tools that
can handle large data files, e.g. `git lfs` or `git annex`. By running `dvc run`
multiple times and specifying outputs of a command (stage) as dependencies in
another command (stage) we can, essentially, describe a sequence of commands
that is required to get to the final result:

The first stage, feature extraction:

```dvc
    $ dvc run -d featurization.py -d data.tsv \
              -o matrix.pkl \
              python featurization.py data.tsv matrix.pkl
```

The second stage, training:

```dvc
    $ dvc run -d train.py -d matrix.pkl \
              -o model.pkl \
              python train.py matrix.pkl model.pkl
```

Let's commit meta-files that describe our pipeline:

```dvc
    $ git add .gitignore matrix.pkl.dvc model.pkl.dvc
    $ git commit -m "add featurization and train steps to the pipeline"
    $ dvc push
```

This example is simplified just to show you an idea of the pipeline, check
[example](/doc/get-started/example-pipeline) or complete
[tutorial](/doc/tutorial) to see the NLP processing pipeline end-to-end.
