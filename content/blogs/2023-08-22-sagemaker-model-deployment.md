---
title:
  'Automate model deployment to Amazon SageMaker with the DVC Model Registry'
date: 2023-08-30
description: |
  DVC provides a Git-based mechanism to automate model deployment from an intuitive web UI.
descriptionLong: |
  The DVC Model Registry provides version registration and stage assignment as simple Git-based mechanisms to automate model deployment on any platform including Amazon SageMaker. Deploy real-time or serverless endpoints according to your need.
picture: 2023-08-30/dvc-sagemaker-cover.png
pictureComment: Model deployment to Amazon SageMaker from the DVC Model Registry
authors:
  - tapa_dipti_sitaula
  - diglesia
tags:
  - DVC
  - Studio
  - GTO
  - Sagemaker
  - AWS
  - Model Registry
  - Model Management
  - Model Deployment
  - Tutorial
---

Amazon SageMaker from AWS is a popular platform for deploying Machine Learning
models, showing up in almost all search results for the “best ML deployment
platforms today.” So no doubt we’ve had many users ask us how they can deploy
their models to SageMaker. If you would also like some help with this, you are
in the right place.

With DVC pipelines and live metrics tracking using DVCLive and DVC Studio,
iterating on your Machine Learning experiments is a simple process. And DVC
Model Registry makes logging, tracking and deploying your trained models equally
simple. In this article, we’ll walk you through how you can create a training
pipeline that saves your trained models to AWS S3, and how you can then deploy
the models to different environments in SageMaker automatically!

Interested in the final output right now? [Here’s the code][complete-code].

# Prerequisites

To follow along, you’ll need to provision the following resources in AWS:

- An S3 bucket for saving your models
- Credentials with write access to the above S3 bucket. You’ll need this during
  training to save the models.
- AWS role with `AmazonS3FullAccess` and `AmazonSageMakerFullAccess` for reading
  the model files and deploying them to SageMaker.

# First, why DVC + SageMaker?

DVC provides a unified way to manage your experiments, datasets, models and
code. It works on top of Git, enabling you to apply the best software
engineering and DevOps practices to your Machine Learning projects. It is also
platform agnostic, which means you have full control over the choice of cloud
services. And with a range of options for model deployment, including real-time
and serverless endpoints, SageMaker is a great choice for hosting models of
different sizes and inference frequencies.

# Prequel: `DVC push` to save the models during training

DVC simplifies setting up [reproducible pipelines] that automatically save your
model files during model training. Each stage in a DVC pipeline represents a
distinct step in the training process. For each stage, you can specify
hyperparameters and other dependencies, such as datasets or outputs of previous
stages. You can also specify the outputs of each stage, such as metrics, plots,
models, and other files. Learn more [here][learn dvc push].

## Create a model file

The [`sagemaker` stage] of our pipeline creates a tar file (`model.tar.gz`) of
our trained model. We then mark this tar file as an output of the stage:

```bash
$ dvc stage add -n sagemaker … -o model.tar.gz …
```

Note that it is not essential to create a separate `sagemaker` stage like we
did. You could also create the tar file as part of `train` or any other relevant
stage. In fact, you could even use the approach without a DVC pipeline, by
simply [`dvc add`]ing the model files or logging them with the [DVCLive
`log_artifact()` method]. But we recommend using a DVC pipeline for easy
reproducibility of your ML experiments.

## Configure DVC remote

Additionally, we’ve configured the default [DVC remote] to be our s3 bucket:

```bash
$ dvc remote add -d storage s3://dvc-public/remote/get-started-pools
```

This means that whenever we run [`dvc push`], the updated model tar file is
pushed to the s3 bucket.

## Run the pipeline to save the model in S3

Now, every time we run our training pipeline an updated model tarfile is
generated, and we `dvc push` it to the remote S3 bucket. By storing large files
like the model tar file in remote storages such as s3, DVC makes it possible to
track them in Git, maintaining Git as the single source of truth for your
projects.

# Track and manage model versions in DVC model registry

Our training script [logs our model] using the [DVCLive `log_artifact()`
method], which creates an [artifact entry] of type `model` in a `dvc.yaml` file.

```yaml
artifacts:
  pool-segmentation:
    path: ../../models/model.pkl
    type: model
    ...
```

Because of this, when we add the project to DVC Studio, the model appears in the
[model registry].

Note that there are other ways to register the model in the model registry - you
can add the model from the Studio UI or manually add it to the `dvc.yaml` file.

Once the model is registered in the model registry, you can assign version
numbers every time your ML experiment produces a model version that you like.
Use the Register version option to select the Git commit for the experiment
which produced the desired model version, and assign it a [semantic version].
Every version registration is saved using specially formatted Git tags, which
you can find in the [Git repository].

![Version registration in the DVC Model Registry](../uploads/images/2023-08-30/mr-register-version.gif)_Version
registration in the DVC Model Registry_

# Trigger model deployment with stage assignments

So far, you have saved your model versions in your Git repository (as Git tags)
and the actual model tar files in S3. Suppose you just registered version
`1.0.0` of your model, and would like to deploy it to your `dev` environment so
that you and your team can evaluate its performance. The model registry
simplifies this too, by providing a mechanism to assign stages to model versions
and creating specially formatted Git tags representing this action.

![Stage assignment in the DVC Model Registry](../uploads/images/2023-08-30/mr-assign-stage.gif)_Stage
assignment in the DVC Model Registry_

Since stage assignment also creates Git tags, you can write a [CI/CD action that
runs on Git tag push][github workflow file].

```yaml
on:
  push:
    tags:
      - 'results/train=pool-segmentation#*'
```

This action parses the Git tags to determine the model, version and stage. DVC
model registry internally uses [GTO] to save version registrations and stage
assignments, and the [Iterative GTO action] can be used in your [GitHub actions
workflow] to parse the Git tags:

```yaml
uses: iterative/gto-action@v2
```

This action produces the outputs shown below:

```yaml
outputs:
  event: ${{ steps.gto.outputs.event }} # whether the event is a version registration or a stage assignment
  name: ${{ steps.gto.outputs.name }} # model name
  stage: ${{ steps.gto.outputs.stage }}
  version: ${{ steps.gto.outputs.version }}
```

This action is available only in GitHub though; if you’re using GitLab,
Bitbucket or some other provider, you can use the [`gto check-ref`
command][gto check-ref] to parse the Git tags, which follow [this format].

Now, whenever you `Assign stage` to a model version, your CI/CD action
understands which version of which model was assigned which stage. Then, it can
use the [`dvc get –show-url`] command to determine the S3 path of the tar file
for the model version.

```yaml
MODEL_DATA=$(dvc get --show-url . model.tar.gz)
```

Finally, it can invoke the [deployment script] with appropriate inputs.

```bash
python sagemaker/deploy_model.py \
    --name ${{ needs.parse.outputs.name }} \
    --stage ${{ needs.parse.outputs.stage }} \
    --version ${{ needs.parse.outputs.version }} \
    --model_data $MODEL_DATA \
    --role ${{ secrets.AWS_ROLE_TO_ASSUME }}
```

This automates the model deployment process, which is very helpful if your model
is expected to evolve constantly.

Next, we will explain the [deployment script].

# Deploy the model to SageMaker and run inference

So far, you’ve seen how you can

✅ create and run reproducible pipelines that save the model to S3,

✅ track and manage model versions in a web model registry, and

✅ assign stages to trigger model deployment.

The last step above specifies which model version should be deployed to which
environment. Now let’s see how to actually

🔲 deploy the model, and

🔲 run inference on it.

A deployment in SageMaker is called an endpoint. When you deploy your model, you
create or update an endpoint. And for running inference, you invoke the
endpoint.

[There are a few different ways to do the actual
deployment][AWS SageMaker Developer Guide], including the [SageMaker Python SDK]
and the [boto3 library]. We have chosen to use the SageMaker Python SDK, which
has a two-step process for deployment:

- create the SageMaker model bundle ([click to see the
  code][create model code]), and
- create the endpoint ([click to see the code][create endpoint code]).

Note that if you do not expect your model to be constantly used for inference,
you can create a serverless inference endpoint by specifying a [serverless
inference config] (learn about the [different inference options]).

Once deployed, the endpoint status becomes `InService` in the AWS console.

![InService SageMaker Endpoint](../uploads/images/2023-08-30/aws-sagemaker-endpoints.png)_InService
SageMaker Endpoint in the AWS console_

## Run inference

Now that your SageMaker deployment is ready, you can run inference using the
[SageMaker predictor] (for boto3, use [`invoke_endpoint()`]). [Here is an
inference script][inference script] that pre-processes your input, calls
inference, and applies the result mask to the input image to create the output
image, and saves the result.

Run this script with the following command:

```bash
$ python src/endpoint_prediction.py \
    --img <jpg-file-path> \
    --endpoint_name <endpoint-name> \
    --output_path <output-folder>
```

Here's my input image:
![Input image](../uploads/images/2023-08-30/input-image.jpg)

And the output identifying the swimming pools:
![Output image](../uploads/images/2023-08-30/output-image.png)

# Now, your turn!

Let us know (reach out in [Discord]) if you run into any issues when trying to
deploy your own model to SageMaker. We will be more than happy to help you
figure it out!

[complete-code]: https://github.com/iterative/example-get-started-experiments/
[reproducible pipelines]:
  https://dvc.org/doc/user-guide/pipelines/defining-pipelines
[learn dvc push]: https://dvc.org/doc/command-reference/stage/add
[`sagemaker` stage]:
  https://github.com/iterative/example-get-started-experiments/blob/main/dvc.yaml#L33
[`dvc add`]: https://dvc.org/doc/command-reference/add
[dvc remote]: https://dvc.org/doc/user-guide/data-management/remote-storage
[`dvc push`]: https://dvc.org/doc/command-reference/push#push
[logs our model]:
  https://github.com/iterative/example-get-started-experiments/blob/main/src/train.py#L72
[dvclive `log_artifact()` method]: https://dvc.org/doc/dvclive/live/log_artifact
[artifact entry]:
  https://github.com/iterative/example-get-started-experiments/blob/main/results/train/dvc.yaml#L8
[model registry]: https://studio.datachain.ai/user/~/models
[semantic version]: https://semver.org/
[git repository]:
  https://github.com/iterative/example-get-started-experiments/tags
[gto]: https://mlem.ai/doc/gto
[iterative gto action]: https://github.com/iterative/gto-action
[github actions workflow]:
  https://github.com/iterative/example-get-started-experiments/blob/main/.github/workflows/deploy-model.yml
[gto check-ref]: https://mlem.ai/doc/gto/command-reference/check-ref
[this format]: https://mlem.ai/doc/gto/user-guide#git-tags-format
[github workflow file]:
  https://github.com/iterative/example-get-started-experiments/blob/main/.github/workflows/deploy-model.yml
[`dvc get –show-url`]:
  https://github.com/iterative/example-get-started-experiments/blob/main/.github/workflows/deploy-model.yml#L64
[sagemaker python sdk]: https://sagemaker.readthedocs.io/en/stable/overview.html
[boto3 library]:
  https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/sagemaker.html
[aws sagemaker developer guide]:
  https://docs.aws.amazon.com/sagemaker/latest/dg/realtime-endpoints-deployment.html
[deployment script]:
  https://github.com/iterative/example-get-started-experiments/blob/main/sagemaker/deploy_model.py
[create model code]:
  https://github.com/iterative/example-get-started-experiments/blob/main/sagemaker/deploy_model.py#L38
[create endpoint code]:
  https://github.com/iterative/example-get-started-experiments/blob/main/sagemaker/deploy_model.py#L54
[serverless inference config]:
  https://github.com/iterative/example-get-started-experiments/blob/main/sagemaker/deploy_model.py#L58
[different inference options]:
  https://docs.aws.amazon.com/sagemaker/latest/dg/deploy-model.html#deploy-model-options
[sagemaker predictor]:
  https://github.com/iterative/example-get-started-experiments/blob/main/src/endpoint_prediction.py#L35
[`invoke_endpoint()`]:
  https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_runtime_InvokeEndpoint.html
[inference script]:
  https://github.com/iterative/example-get-started-experiments/blob/main/src/endpoint_prediction.py
[discord]: https://discordapp.com/invite/dvwXA2N

---

📰 [Join our Newsletter](https://share.hsforms.com/1KRL5_dTbQMKfV7nDD6V-8g4sbyq)
to stay up to date with news and contributions from the Community!
