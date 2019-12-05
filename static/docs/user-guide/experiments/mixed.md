# How to Manage Experiments by Several Methods

On complex projects you can use a combination of the methods that we have seen
so far, in order to manage experiments.

<p align="center">
<img src="/static/img/user-guide/experiments/mixed.png" />
</p>

If you want to change different aspects of your ML pipeline, like input
datasets, featurization, learning algorithm, hyper-parameters, etc. you can
manage these changes with different methods. For example let's say that you
create a different branch for each learning algorithm, and a tag for each input
dataset or featurization. Then you can create different experiment directories
for different hyper-parameters.

There is no standard solution that fits all the cases. The way that you might
combine the different experiment management methods depends on the concrete
problem that you are trying to solve and the details of the project.

In order to compare all the experiments, you can use the options
`-a, --all-branches` and `-T, --all-tags`, like this:

```dvc
$ dvc metrics show -aT
```
