# Machine Learning Pipelines

Machine learning _pipelines_ start with one or more data inputs. These are then
processed in one or more [stages](#stages) (producing intermediate artifacts).
They finally output a dataset or an ML model, usually along with its performance
metadata.

For example, a typical ML workflow could involve:

1. Gathering data and for training and validation (once)
2. Extracting useful features from the training dataset
3. (Re)training an ML model
4. Evaluating the results against the validation set

If you find yourself repeating sequence of actions such as the above to get or
update the results of your project, then you may already have a pipeline. DVC
helps you make it more manageable and consistent by [defining it] in a standard
format (`dvc.yaml`). manageable and consistent.

[defining it]: /doc/user-guide/machine-learning-pipelines/defining-pipelines
