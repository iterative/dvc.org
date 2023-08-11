# Amazon SageMaker

## Setup

Many DVC features rely on Git. To work with DVC in Amazon SageMaker, first setup
your Git repo:

1. [Clone] a repository.

   ![Git clone](/img/sagemaker-git-clone.gif)

2. Launch a terminal or notebook and configure the user name and email:

   ```bash
   git config --global user.name ...
   git config --global user.email ...
   ```

Don't forget to install DVC and any other requirements in your environment!

## Notebooks

After completing the setup, you can work with DVC in SageMaker notebooks like
you would in any other environment. Take a look at DVC [experiments] for how to
get started with DVC in notebooks. If you would like to see live experiment
updates in [DVC Studio], set your [token].

![Notebook](/img/sagemaker-notebook.gif)

## Pipelines

You can run SageMaker jobs in DVC [pipelines] or convert existing SageMaker
pipelines into DVC pipelines. This combines the benefits of SageMaker jobs, like
running each stage on its own EC2 instance and enabling other data
[input modes](https://docs.aws.amazon.com/sagemaker/latest/dg/model-access-training-data.html),
with the benefits of DVC pipelines, like skipping unchanged stages and tracking
the inputs and outputs of each run. SageMaker expects all inputs and outputs to
be stored in S3, so the easiest way to integrate with DVC is to use [external
dependencies and outputs]. For an example, see
https://github.com/iterative/sagemaker-pipeline.

![Pipeline](/img/sagemaker-pipeline.png)

[experiments]: /doc/start/experiments
[clone]: https://docs.aws.amazon.com/sagemaker/latest/dg/studio-tasks-git.html
[dvc studio]: https://studio.iterative.ai
[token]: /doc/studio/user-guide/projects-and-experiments/live-metrics-and-plots
[pipelines]: /doc/user-guide/pipelines
[external dependencies and outputs]:
  /doc/user-guide/pipelines/external-dependencies-and-outputs
