# dvclive

[dvclive](/doc/dvclive) is an open-source python library for monitoring
the progress of metrics during training of machine learning models.

Dvclive integrates seamlessly with [DVC](https://dvc.org/) and the logs it
produces can be fed as `dvc plots`. However, `dvc` is not needed to work with
`dvclive` logs, and since they're saved as easily parsable TSV files, you can
use your preferred visualization method.

We have created dvclive with two principles in mind:

- **no dependencies** While you can install optional integrations for various
  frameworks, basic dvclive installation does not need anything besides standard
  python libs.
- **integration with DVC** DVC is able to recognize when its being used in
  tandem with dvclive and is able to provide useful features - like producing
  training summary during training.
