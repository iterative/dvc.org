# Pipeline

This is the biggest DVC's difference from the other version control tools that
can handle large data files, e.g. `git lfs` or `git annex`. By running `dvc run`
multiple times and specifying outputs of a command (stage) as dependencies in
another command (stage) we can, essentially, describe a sequence of commands
that is required to get to the final result:

```dvc
    # first stage - extract data:
    $ dvc run -d data.csv.tgz -o data.csv tar zxf data.csv.tgz

    # second stage - train:
    $ dvc run \
            -d train.py -d data.csv \   # dependencies
            -o model.pkl \              # outputs
            python train.py data.csv    # command
```

This example is oversimplified just to show you an idea of the pipeline, check
[example](/doc/get-started/example) or complete
[tutorial](/doc/tutorial) to see the real-life NLP processing pipeline.
