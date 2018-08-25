# Visualize

Now that we have built our pipeline, we need a good way to visualize it to be
able to wrap our heads around it. Luckily, dvc allows us to do that without
leaving the terminal, making the experience distraction-less.

## Stages

```dvc
    $ dvc pipeline show --ascii model.pkl.dvc
     .--------------.
     | data.xml.dvc |
     `--------------'
             *
             *
             *
     .--------------.
     | data.tsv.dvc |
     `--------------'
             *
             *
             *
    .----------------.
    | matrix.pkl.dvc |
    `----------------'
             *
             *
             *
     .---------------.
     | model.pkl.dvc |
     `---------------'
```

## Commands

```dvc
    $ dvc pipeline show --ascii model.pkl.dvc --commands
             .----------------------------.
             | python prepare.py data.xml |
             `----------------------------'
                            *
                            *
                            *
    .---------------------------------------------.
    | python featurization.py data.tsv matrix.pkl |
    `---------------------------------------------'
                            *
                            *
                            *
        .--------------------------------------.
        | python train.py matrix.pkl model.pkl |
        `--------------------------------------'
```

## Outputs

```dvc
    $ dvc pipeline show --ascii model.pkl.dvc --outs
                 .----------.
                 | data.xml |
                 `----------'
                **           **
              **               **
            **                   **
    .----------.            .---------------.
    | data.tsv |            | data-test.tsv |
    `----------'            `---------------'
                **           **
                  **       **
                    **   **
                .------------.
                | matrix.pkl |
                `------------'
                       *
                       *
                       *
                 .-----------.
                 | model.pkl |
                 `-----------'
```
