# Visualize

Now that we have built our pipeline, we need a good way to visualize it to be
able to wrap our heads around it. Luckily, DVC allows us to do that without
leaving the terminal, making the experience distraction-less.

We are using `--ascii` option below to better illustrate this pipeline. Please,
refer to the `dvc pipeline show` documentation to explore other options this
command supports (e.g. `.dot` files that can be used then in other tools).

## Stages

```dvc
$ dvc pipeline show --ascii train.dvc
     +-------------------+
     | data/data.xml.dvc |
     +-------------------+
               *
               *
               *
        +-------------+
        | prepare.dvc |
        +-------------+
               *
               *
               *
       +---------------+
       | featurize.dvc |
       +---------------+
               *
               *
               *
         +-----------+
         | train.dvc |
         +-----------+
```

## Commands

```dvc
$ dvc pipeline show --ascii train.dvc --commands
          +-------------------------------------+
          | python src/prepare.py data/data.xml |
          +-------------------------------------+
                          *
                          *
                          *
   +---------------------------------------------------------+
   | python src/featurization.py data/prepared data/features |
   +---------------------------------------------------------+
                          *
                          *
                          *
          +---------------------------------------------+
          | python src/train.py data/features model.pkl |
          +---------------------------------------------+
```

## Outputs

```dvc
$ dvc pipeline show --ascii train.dvc --outs
          +---------------+
          | data/data.xml |
          +---------------+
                  *
                  *
                  *
          +---------------+
          | data/prepared |
          +---------------+
                  *
                  *
                  *
          +---------------+
          | data/features |
          +---------------+
                  *
                  *
                  *
            +-----------+
            | model.pkl |
            +-----------+
```
