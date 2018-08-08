# Compare Experiments

DVC makes it easy to experiment with your project using git branches. We've
created additional tools to enable you to conveniently visualize the metrics
for your experiments and compare them. All you need to do is to tell DVC which
files are metrics files in your pipeline. DVC supports a variety of different
file types in order to help you pick the most important parts in your metrics.

Let's take a look at a simple example of experimenting with your model to
achieve better AUC value. In this case our metric file is in JSON format:

```dvc
    # Create a stage in your pipeline that has a metrics file
    $ dvc run \
            -d model.p -d matrix-test.p # dependencies
            -M eval.json                # metrics output
            python evaluate.py          # command
    $ cat eval.json
    {"AUC": "0.521324"}

    # Now DVC knows that 'eval.json' is your metrics file and will print it if
    # you call 'dvc metrics show'
    $ dvc metrics show
        eval.json: {"AUC": "0.521324"}

    # In order to extract the important part lets tell DVC that your file is
    # in json format and the important value is located in AUC field.
    $ dvc metrics modify eval.json --type json --xpath AUC
    $ dvc metrics show
        eval.json: 0.521324

    # Create git branches to experiment with your models
    $ git checkout -b experiment
    $ vim code.py
    $ dvc repro
    $ cat eval.json
    {"AUC": "0.624652"}
    ...

    # Compare your experiments
    $ dvc metrics show --all-branches
    master:
        eval.json: 0.521324
    experiment:
        eval.json: 0.624652
```
