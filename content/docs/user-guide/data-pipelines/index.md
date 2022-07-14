# Data Pipelines

In machine learning, _data pipelines_ start with data inputs, then process them
in one or more [stages](#stages) (producing intermediate artifacts), and finally
output a model, along with its performance metadata.

If you find yourself repeating sequence of actions to get update the results of
your project, then you may already have a pipeline. For example, a typical ML
workflow could involve:

1. Gathering data and for training and validation (once)
2. Extracting useful features from the training dataset
3. (Re)training an ML model
4. Evaluating the results against the validation set
