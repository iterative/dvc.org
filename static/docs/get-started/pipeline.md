# Pipeline

This is the biggest difference between DVC and other version control tools that
can handle large data files, e.g. `git lfs`. By running `dvc run` multiple times
and specifying outputs of a command (stage) as dependencies in another command
(stage) we can, essentially, describe a sequence of commands that is required to
get to the final result:

The second stage (after the `prepare.dvc` that we created during the previous
step), feature extraction:

```dvc
$ dvc run -f featurize.dvc \
          -d src/featurization.py -d data/prepared \
          -o data/features \
          python src/featurization.py \
                 data/prepared data/features
```

The third stage, training:

```dvc
$ dvc run -f train.dvc \
          -d src/train.py -d data/features \
          -o model.pkl \
          python src/train.py data/features model.pkl
```

Let's commit DVC-files that describe our pipeline so far:

```dvc
$ git add data/.gitignore .gitignore featurize.dvc train.dvc
$ git commit -m "add featurization and train steps to the pipeline"
$ dvc push
```

This example is simplified just to show you an idea of the pipeline, check
[example](/doc/get-started/example-pipeline) or complete
[tutorial](/doc/tutorial) to see the NLP processing pipeline end-to-end.

> See also the `dvc pipeline` command.
