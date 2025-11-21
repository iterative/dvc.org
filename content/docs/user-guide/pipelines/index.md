# Pipelines

If you find yourself repeating sequence of actions to get or update the results
of your project, then you may already have a pipeline. For example, a data
science workflow could involve:

1. Gathering data for training and validation
2. Extracting useful features from the training dataset
3. (Re)training an ML model
4. Evaluating the results against the validation set

DVC helps you [define] these stages in a standard YAML format (`.dvc` and
`dvc.yaml` files), making your <abbr>pipeline</abbr> more manageable and
consistent to reproduce.

See [Get Started: Data Pipelines] for a hands-on introduction to this topic.

[define]: /user-guide/pipelines/defining-pipelines
[get started: data pipelines]: /start/data-pipelines/data-pipelines
