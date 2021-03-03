# dvclive

[dvclive](/doc/dvclive) is an open-source python library for monitoring
the progress of metrics during training of machine learning models.

dvclive is integrated seamlesly with dvc and logs produced by it can be fed to
`dvc plots` command. Even though, one does not need dvc to visualize dvclive
logs, as they are saved into easily parsable tsv format, feel free to apply
custom visualization methods.

We have created dvclive with two principles in mind:

- **no dependencies** While you can install optional integrations for various
  frameworks, basic dvclive installation does not need anything besides standard
  python libs.
- **integration with DVC** DVC is able to recognize when its being used in
  tandem with dvclive and is able to provide useful features - like producing
  training summary during training.
