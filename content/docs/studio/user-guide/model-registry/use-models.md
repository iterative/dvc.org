# Use models

Whether you need to download your models to use them, or you're looking to set
up some automation in CI/CD to deploy them, DVC Studio provides these
capabilities.

## Download models

If your model file is DVC-tracked, you can download any of its registered
versions with the DVC Studio API from the web interface or in your code.

Prerequisites:

- Model stored with DVC with S3, Azure, http or https [remote].
- The DVC Studio project you like to download your model from needs access to
  your [remote storage credentials].
- Access to your [DVC Studio Access token].

Without these prerequisites, you can still [download a model artifact with DVC].
However, it can be easier to use the DVC Studio API since you only need to have
the Studio access token. You do not need direct access to your remote storage or
Git repository, and you do not need to install DVC.

[remote]: /doc/user-guide/data-management/remote-storage
[remote storage credentials]:
  /doc/studio/user-guide/experiments/configure-a-project#data-remotes--cloud-storage-credentials
[DVC Studio Access token]:
  /doc/studio/user-guide/account-management#studio-access-token
[download a model artifact with DVC]: /doc/command-reference/artifacts/get

You can download the files that make up your model directly from DVC Studio.
Head to the model details page of the model you would like to download and click
`Access Model`. Here, you find 4 different ways to download your model.

<toggle>

<tab title="CLI (DVC)">

Use the [dvc artifacts get] command to download an artifact by name. Learn more
on the command reference page for `dvc artifacts get`.

[dvc artifacts get]: /doc/command-reference/artifacts/get

</tab>

<tab title="cURL / Python">

Directly call the Studio [REST API](/doc/studio/rest-api) from your terminal using `cURL` or in your
`Python` code.

</tab>

<tab title="Direct Download">

Here you can generate download links for your model files. After generation,
these download links are valid for 1 hour. You can click the link to directly
download the file.

![Screenshot of access model button on the model details page](/img/mr-direct-download.png)

</tab>

</toggle>

## Deploying and publishing models in CI/CD

A popular deployment option is to **use CI/CD pipelines triggered by new Git
tags to publish or deploy a new model version**. Since GTO registers versions
and assigns stages by creating Git tags, you can set up a CI/CD pipeline to be
triggered when the tags are pushed to the repository.

**To see an example**, check out
[the workflow in the `example-gto` repository](https://github.com/iterative/example-gto/blob/main/.github/workflows/gto-act-on-tags.yml).
This workflow uses
[the GTO GitHub Action](https://github.com/iterative/gto-action) that interprets
a Git tag to find out the model's version and stage assignment (if any), reads
annotation details such as `path`, `type` and `description`, and downloads the
model binaries if needed.

For help **building an end-to-flow from model training to deployment using the
DVC model registry**, refer the
[tutorial on automating model deployment to Sagemaker](https://iterative.ai/blog/sagemaker-model-deployment).
[Here](https://github.com/iterative/example-get-started-experiments/blob/main/.github/workflows/deploy-model.yml)
is the complete workflow script.

Finally, you can find examples of **building a Docker image with a model and
deploying it to the cloud** in the
[GTO user guide](/doc/gto/user-guide#acting-on-new-registrations-and-assignments).
