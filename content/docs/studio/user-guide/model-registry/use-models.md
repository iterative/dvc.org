# Use models

Whether you need to download your models to use them, or you're looking to set
up some automation in CI/CD to deploy them, Iterative Studio provides these
capabilities.

## Download models

If your model file is DVC-tracked, you can download any of its registered
versions using `dvc get`.

### Looking up the right command in Studio

The `Get the model file` section of a model's details page contains a `dvc get`
command ready to copy and use.

![](/img/mr-dvc-get.png)

### Constructing the command manually

You can also construct this command manually using this template:

```cli
$ dvc get ${GIT_REPO} ${MODEL_PATH} --rev ${GIT_REV}
```

Let's download the `text-classification` model in the
[example-get-started](https://github.com/iterative/example-get-started)
repository.

To find out the model file path (that is, `model.pkl`) you can check the model's
details page or check the `dvc.yaml` file to which the model annotation was
written.

To find out the Git revision, you can check the
[list of Git tags](https://github.com/iterative/example-get-started/tags) or use
[GTO](https://mlem.ai/doc/gto/command-reference/show/):

```cli
$ gto show text-classification@latest --ref
text-classification@v1.2.0
```

Putting everything together, to download the model file, you can use the
following dvc command:

```cli
$ dvc get https://github.com/iterative/example-get-started \
    model.pkl \
    --rev text-classification@v1.2.0
```

Note that `model.pkl` is the path that was specified in `dvc.yaml`, and not the
physical path of the model file (in the remote storage).

DVC will figure out the right file to download from the remote storage for you.
Note that for running this command, you will need to have remote storage
credentials set up in your environment.

## Deploying and publishing models in CI/CD

A popular deployment option is to use CI/CD pipelines triggered by new Git tags
to publish or deploy a new model version. Since GTO registers versions and
assigns stages by creating Git tags, you can set up a CI/CD pipeline to be
triggered when the tags are pushed to the repository.

To see an actual example, check out
[the workflow in the `example-gto` repository](https://github.com/iterative/example-gto/blob/main/.github/workflows/gto-act-on-tags.yml).
This workflow uses
[the GTO GitHub Action](https://github.com/iterative/gto-action) that interprets
a Git tag to find out the model's version and stage assignment (if any), reads
annotation details such as `path`, `type` and `description`, and downloads the
model binaries if needed.

The `example-gto` repository also includes an
[example workflow that deploys a model](https://github.com/iterative/example-gto/blob/mlem/.github/workflows/deploy-model-with-mlem.yml)
from CI/CD using MLEM.

Finally, you can find examples of building a Docker image with a model and
deploying it to the cloud in the
[GTO user guide](https://mlem.ai/doc/gto/user-guide#acting-on-new-registrations-and-assignments).
