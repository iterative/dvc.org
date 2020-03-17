# Visualize

Now that we have built our pipeline, we need a good way to visualize it to be
able to wrap our heads around it. Luckily, DVC allows us to do that without
leaving the terminal, making the experience distraction-less.

We are using the `--ascii` option below to better illustrate this pipeline.
Please, refer to `dvc pipeline show` to explore other options this command
supports (e.g. `.dot` files that can be used then in other tools).

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
                              +----------------+             +---------------+
                              | src/prepare.py |             | data/data.xml |
                              +----------------+             +---------------+
                                              ***            ***
                                                 **        **
                                                   **    **
         +----------------------+             +---------------+
         | src/featurization.py |             | data/prepared |
         +----------------------+             +---------------+
                             **              **
                               ***        ***
                                  **    **
+--------------+             +---------------+
| src/train.py |             | data/features |
+--------------+             +---------------+
              ***            ***
                 **        **
                   **    **
                +-----------+
                | model.pkl |
                +-----------+
```
