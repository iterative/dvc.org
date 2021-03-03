# dvclive

[dvclive](/doc/dvclive) is an open-source python library for monitoring the
progress of metrics during training of machine learning models.

Dvclive integrates seamlessly with [DVC](https://dvc.org/) and the logs it
produces can be fed as `dvc plots`. However, `dvc` is not needed to work with
`dvclive` logs, and since they're saved as easily parsable TSV files, you can
use your preferred visualization method.

We have created Dvclive with two principles in mind:

- **No dependencies.** While you can install optional integrations for various
  frameworks, the basic `dvclive` installation doesn't have requirements besides
  [Python](https://www.python.org/).
- **DVC integration.** `dvc` recognizes when its being used along with
  `dvclive`. This enables useful features automatically, like producing model
  training summaries, among others.
