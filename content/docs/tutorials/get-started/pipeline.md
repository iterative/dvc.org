# Pipeline

Support for [pipelines](/doc/command-reference/pipeline) is the biggest
difference between DVC and other version control tools that can handle large
data files (e.g. `git lfs`). By using `dvc run` multiple times, and specifying
outputs of a command (stage) as dependencies in another one, we can describe a
sequence of commands that gets to a desired result. This is what we call a
**data pipeline** or dependency graph.

The support for pipelines is what enables DVC to makes data science projects 
**reproducible** using implicit dependency graphs.

Let's create a second stage (after `prepare.dvc`, created in the previous
chapter) to perform feature extraction:

```dvc
$ dvc run -f featurize.dvc \
          -d src/featurization.py -d data/prepared \
          -o data/features \
          python src/featurization.py \
                 data/prepared data/features
```

And a third stage for training:

```dvc
$ dvc run -f train.dvc \
          -d src/train.py -d data/features \
          -o model.pkl \
          python src/train.py data/features model.pkl
```

Let's commit DVC-files that describe our pipeline so far:

```dvc
$ git add data/.gitignore .gitignore featurize.dvc train.dvc
$ git commit -m "Create featurization and training stages"
$ dvc push
```

This example is simplified just to show you a basic pipeline, see a more
advanced [example](/doc/tutorials/pipelines) or
[complete tutorial](/doc/tutorials/pipelines) to create an
[NLP](https://en.wikipedia.org/wiki/Natural_language_processing) pipeline
end-to-end.

> See also the `dvc pipeline` command.
