# Machine Learning Pipelines

A typical ML workflow could involve:

1. Gathering data and for training and validation
2. Extracting useful features from the training dataset
3. (Re)training an ML model
4. Evaluating the results against the validation set

If you find yourself repeating sequence of actions such as the above to get or
update the results of your project, then you may already have a pipeline. DVC
helps you make it more manageable and consistent by [defining it] in a standard
format (`dvc.yaml`). manageable and consistent.

[defining it]: /doc/user-guide/machine-learning-pipelines/defining-pipelines
