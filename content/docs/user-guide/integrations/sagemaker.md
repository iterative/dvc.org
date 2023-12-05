# Amazon SageMaker

## Development

## Setup

Many DVC features rely on Git. To work with DVC in Amazon SageMaker, first setup
your Git repo:

1. [Clone] a repository.

   ![Git clone](/img/sagemaker-git-clone.gif)

2. Launch a terminal or notebook and configure the Git user name and email:

   ```bash
   git config --global user.name ...
   git config --global user.email ...
   ```

3. Don't forget to install DVC and any other requirements in your environment!

   ```bash
   pip install dvc dvclive
   ```

## Notebooks

After completing the setup, you can work with DVC in SageMaker notebooks like
you would in any other environment. Take a look at DVC [experiments] for how to
get started with DVC in notebooks (if you have setup [code-server] on SageMaker,
you can also install the [DVC extension for VS Code]).

If you would like to see live experiment updates in [DVC Studio], get your
[token] and save it in your [dvc config] or `DVC_STUDIO_TOKEN` environment
variable. For example, to set it globally for all of a user's projects:

```cli
$ dvc config --global studio.token ***
```

While the experiment runs, you will see live updates like this in DVC Studio:

![Notebook](/img/sagemaker-notebook.gif)

## Pipelines

You can run SageMaker jobs in DVC [pipelines] or convert existing SageMaker
pipelines into DVC pipelines. This combines the benefits of SageMaker jobs, like
running each stage on its own EC2 instance and enabling other data
[input modes](https://docs.aws.amazon.com/sagemaker/latest/dg/model-access-training-data.html),
with the benefits of DVC pipelines, like skipping unchanged stages and tracking
the inputs and outputs of each run. SageMaker expects all inputs and outputs to
be stored in S3, so the easiest way to integrate with DVC is to use S3 storage,
and utilize [external dependencies and outputs].

### Example: XGBoost pipeline

For an example, see https://github.com/iterative/sagemaker-pipeline, which
adapts an existing SageMaker tutorial from a notebook into a DVC pipeline. The
first stage (`prepare`) downloads the data and tracks the output so that it
doesn't have to be re-downloaded on each run. We parametrize the `bucket` and
`prefix` of the destination into a separate `params.yaml` file so they can be
modified easily. The DVC pipeline stage is defined in `dvc.yaml` like this:

```yaml
prepare:
  cmd:
    - wget
      https://sagemaker-sample-data-us-west-2.s3-us-west-2.amazonaws.com/autopilot/direct_marketing/bank-additional.zip
      -O bank-additional.zip
    - python sm_prepare.py --bucket ${bucket} --prefix ${prefix}
  deps:
    - sm_prepare.py
    - https://sagemaker-sample-data-us-west-2.s3-us-west-2.amazonaws.com/autopilot/direct_marketing/bank-additional.zip
  outs:
    - s3://${bucket}/${prefix}/input_data:
        cache: false
```

The [preprocessing script] takes `bucket` and `prefix` as arguments and
otherwise is copied directly from the original notebook code, which uses a
SageMaker Processing job. The DVC pipeline stage tracks the command, scripts,
input paths, and outputs paths, so that this stage will only be run again if any
of those change:

```yaml
preprocessing:
  cmd: python sm_preprocessing.py --bucket ${bucket} --prefix ${prefix}
  deps:
    - sm_preprocessing.py
    - preprocessing.py
    - s3://${bucket}/${prefix}/input_data
  outs:
    - s3://${bucket}/${prefix}/train:
        cache: false
    - s3://${bucket}/${prefix}/validation:
        cache: false
    - s3://${bucket}/${prefix}/test:
        cache: false
```

Finally, the [training script] uses the SageMaker Estimator for XGBoost to train
a model. We add all the model hyperparameters as arguments to make it easy to
tune hyperparameters and track what changed. Hyperparameters are added under the
`train` key in `params.yaml`. The DVC pipeline stage `cmd` includes `${train}`
to
[unpack and pass](https://dvc.org/doc/user-guide/project-structure/dvcyaml-files#dictionary-unpacking)
all those arguments and track them as parameters, in addition to tracking the
other inputs and outputs:

```yaml
training:
  cmd: python sm_training.py --bucket ${bucket} --prefix ${prefix}  ${train}
  deps:
    - sm_training.py
    - s3://${bucket}/${prefix}/train
    - s3://${bucket}/${prefix}/validation
  outs:
    - s3://${bucket}/${prefix}/output:
        cache: false
```

The end result of running the pipeline looks like this:

![Pipeline](/img/sagemaker-pipeline.png)

## Deployment

Use the <abbr>model registry</abbr> to automate deployment with SageMaker in
your CI/CD workflow. To start with the model registry, see how to:

- [start using the model registry]
- [deploy models with CI/CD]

For a full example of how to deploy with SageMaker, see our [blog post].

[experiments]: /doc/start/experiments
[clone]: https://docs.aws.amazon.com/sagemaker/latest/dg/studio-tasks-git.html
[code-server]:
  https://aws.amazon.com/blogs/machine-learning/host-code-server-on-amazon-sagemaker/
[dvc extension for vs code]: /doc/vs-code-extension
[dvc studio]: https://studio.iterative.ai
[token]: https://studio.iterative.ai/user/_/profile?section=accessToken
[dvc config]: /doc/user-guide/project-structure/configuration#studio
[pipelines]: /doc/user-guide/pipelines
[external dependencies and outputs]:
  /doc/user-guide/pipelines/external-dependencies-and-outputs
[preprocessing script]:
  https://github.com/iterative/sagemaker-pipeline/blob/main/sm_preprocessing.py
[training script]:
  https://github.com/iterative/sagemaker-pipeline/blob/main/sm_training.py
[start using the model registry]: /doc/start/model-management/model-registry
[deploy models with ci/cd]: /doc/start/model-management/model-cicd
[triggering sagemaker deployment]:
  https://github.com/iterative/example-get-started-experiments/blob/main/.github/workflows/deploy-model-sagemaker.yml
[deploying sagemaker endpoints]:
  https://github.com/iterative/example-get-started-experiments/blob/main/sagemaker/deploy_model.py
[blog post]: https://iterative.ai/blog/sagemaker-model-deployment
