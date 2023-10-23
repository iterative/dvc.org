# Use models

Whether you need to download your models to use them, or you're looking to set
up some automation in CI/CD to deploy them, DVC Studio provides these
capabilities.

## Download models

If your model file is DVC-tracked, you can download any of its registered
versions with DVC Studio from the web interface or in your code.

Prerequisites:

- The DVC Studio project you like to download your model from needs access to
  your [remote storage credentials].
- Access to your [DVC Studio Access token].

[remote storage credentials]:
  /doc/studio/user-guide/experiments/configure-a-project#data-remotes--cloud-storage-credentials
[DVC Studio Access token]:
  /doc/studio/user-guide/account-management#studio-access-token

### Using DVC Studio API

Using the DVC Studio API will require you to add your remote storage secrets to
respective projects but downloading models can be easier than DVC since you only
need to have the Studio API token. You do not need direct access to your remote
storage, and you do not need to install DVC. Studio APIs rely on signing urls,
which limits the number of remotes they're working with. You can learn more on
[REST API] pages.

[REST API]: /doc/studio/rest-api
[Python API]: /doc/api-reference

### dvc artifacts get

Provides a way to download artifacts tracked in the model registry. Unlike
`dvc get`, `dvc artifacts get` supports downloading an artifact by name, rather
than by path. Likewise, dvc artifacts get supports downloading a registered
artifact version or stage, instead of requiring a specified Git revision.

You can learn more on the command reference page for `dvc artifacts get`.

[dvc get]: /doc/command-reference/get
[dvc artifacts get]: /doc/command-reference/artifacts/get

### Direct download from DVC Studio

You can download the files that make up your model directly from DVC Studio.
Before you start, make sure you have connected the correct credentials to the
project that contains the model you would like to download. Head to the model
details page of the model you would like to download and click `Access Model`.

![Screenshot of access model button on the model details page](/img/mr-access-model.png)

Click on the `Download` tab. If you have not yet created an access token, please
do so on this screen.

![Screenshot of access model button on the model details page](/img/mr-generate-access-token.png)

When you have created the token, you can generate a direct download link for
your model files.

![Screenshot of access model button on the model details page](/img/mr-generate-download-link.png)

After generation, these download links are valid for 1 hour. You can click the
link to directly download the file.

![Screenshot of access model button on the model details page](/img/mr-direct-download.png)

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
