### ℹ️ More information about (Hyper)parameters

It's pretty common for data science projects to include configuration files that
define adjustable parameters to train a model, adjust model architecture, do
pre-processing, etc. DVC provides a mechanism for experiments to depend on the
specific variables from a file.

By default, DVC assumes that a parameters file named `params.yaml` is available
in your project. DVC parses this file and creates dependencies to the variables
found in it: `model.conv_units` and `train.epochs`. Example:

```yaml
train:
  epochs: 10
model:
  conv_units: 16
```
