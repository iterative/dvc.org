# Data Pipelines

If you find yourself repeating sequence of actions to get or update the results
of your project, then you may already have a pipeline. DVC helps you make it
more manageable and consistent by [defining it] in a standard format
(`dvc.yaml`).

A typical data science workflow could involve:

1. Gathering data for training and validation
2. Extracting useful features from the training dataset
3. (Re)training an ML model
4. Evaluating the results against the validation set

See [Get Started: Data Pipelines](/doc/start/data-management/pipelines) for a
hands-on introduction to this topic.

[defining it]: /doc/user-guide/data-pipelines/defining-pipelines
