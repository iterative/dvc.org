## Visualize

Having built our pipeline, we need a good way to understand its structure.
Seeing a graph of connected stages would help. DVC lets you do so without
leaving the terminal!

```dvc
$ dvc dag
         +---------+
         | prepare |
         +---------+
              *
              *
              *
        +-----------+
        | featurize |
        +-----------+
              *
              *
              *
          +-------+
          | train |
          +-------+
```

> Refer to `dvc dag` to explore other ways this command can visualize a
> pipeline.
