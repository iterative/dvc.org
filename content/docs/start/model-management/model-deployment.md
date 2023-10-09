---
title: 'Get Started: Using and deploying models'
description:
  'Easily download your models from the model registry. Set up your CICD
  pipelines to be trigger by model registry actions (such as assigning model
  stages) and deploy models directly form the model registry.'
---

# Get Started: Using and Deploying Models

In this chapter, we will learn how to download and use models and use the model
registry to trigger automated CICD model workflows.

## Downloading models

It is useful to download model artifacts for example for local use/testing or in an automated model deployment job. With models versioned by DVC this can be done easily by using the `dvc get` CLI command as follows

```bash
dvc get https://<path-to-my-git-forge-account>/example-get-started-experiments models/model.pth --rev v1.0.0
```
where you just need to replace `<path-to-my-git-forge-account>` with your GitHub/GitLab/Bitbucket account path. This will download the model version v1.0.0 to the location from where you are calling the `dvc get` command.

If you're using Studio this is even easier. Go to the Models dashboard, click on the three dots next to the name of your model and select "Download model file". Then you can select the model version you're interested in and Studio will generate the correct call of the `dvc get` command for you. You then just need to copy it and run it where you want the model to be downloaded. You can see all the steps here:

![Downloading models](/img/placeholder-cat.gif)



## Connecting model registry action to your CICD 

As we [noted](/docs/start/model-management/model-registry#under-the-hood-model-registry) in the model registry chapter, all DVC model registry actions are captured in your git repository as git tags with a specific format.

This also means that we can create CICD actions in our git repository which will be triggered whenever 

In the following, we will have a look at an example CD workflow on GitHub which deploys a model to an Amazon Sagemaker Endpoint whenever the model is assigned to the `prod` stage in the model registry.

For more information on how to connect your CICD with the DVC model registry, have a look at the corresponding user guide. 
### Example deployment to Sagemaker

To be able to deploy a model to Amazon Sagemaker you will need the following pre-requisites:
1. An AWS account anda GitHub account
1. An AWS IAM role with necessary S3 and Sagemaker permissions. For example you can use [this one](add link to policy JSON).
1. An AWS access key with access to the above IAM role. You will need to add the access key ID and the secret access key to the secrets in your GitHub repository.

TODO: Fill in the rest...maybe this would be better as a separate guide and the getting started would just hint to it...