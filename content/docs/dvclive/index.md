# dvclive

[dvclive](https://cml.dev) is an open-source python library for monitoring
metrics in machine learning projects. Use it to log metrics during training.

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
  training summary during training. When used in DVC project user does not have
  to call `dvclive.init` method.
