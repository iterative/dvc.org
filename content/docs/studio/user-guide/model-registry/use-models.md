# Use models

Whether you need to download your models to use them, or you're looking to set
up some automation in CI/CD to deploy them, Iterative Studio provides these
capabilities.

## Download models

If your model file is DVC-tracked, you can download any of its registered
versions using `dvc get`.

### Looking up right command in Studio

Model details page have a command ready to copy and use under "Get the model
file": ![](/img/mr-dvc-get.png)

### Constructing the command manually

You can also construct this command manually using this template:

```cli
$ dvc get ${GIT_REPO} ${MODEL_PATH} --rev ${GIT_REV}
```

Let's download the model in the
[example-get-started-experiments](https://github.com/iterative/example-get-started-experiments)
is `seg-model`.

To find out the model file path (e.g. `models/model.pkl`) you can see the
Model's details page or check `dvc.yaml` the model annotation was written to.

To find out the Git revision, you can check the
[list of Git tags](https://github.com/iterative/example-get-started-experiments/tags)
or use [GTO](https://mlem.ai/doc/gto/command-reference/show/):

```cli
$ gto show seg-model@latest --ref
seg-model@v0.0.1#1
```

Putting everything together, to download the model file, you can use the
following dvc command:

```cli
$ dvc get https://github.com/iterative/example-get-started-experiments \
    models/model.pkl \
    --rev seg-model@v0.0.1#1
```

Note that `models/model.pkl` is the path that was specified in `dvc.yaml`, and
not the physical path of the model file (in the remote storage).

DVC will figure out the right file to download from the remote storage for you.
Note that for running this command, you will need to have remote storage
credentials set up in your environment.

## Deploying and publishing models in CI/CD

A popular deployment option is to use CI/CD (triggered when Git tags are pushed)
to publish new model version for consumers to use, or deploy it upon stage
assignment.

Since GTO register versions and assign stages by creating Git tags, you can set
up a CI/CD to be triggered once they're pushed to the repo. To see an actual
example, check out
[the workflow](https://github.com/iterative/example-gto/blob/main/.github/workflows/gto-act-on-tags.yml)
in `example-gto` repo. The workflow uses
[the GTO GH Action](https://github.com/iterative/gto-action) that interprets the
Git tag, finds out the model's version, stage assigned if any, and annotations
details such as `path`, `type`, `description` or downloads the model binaries
for you to use them in CI.

That example repo also introduces a workflow
[that deploys a model](https://github.com/iterative/example-gto/blob/mlem/.github/workflows/deploy-model-with-mlem.yml)
from CI/CD using MLEM.

Finally, you can find examples of building a Docker Image with a model and
deploying it to the cloud in
[GTO User Guide](https://mlem.ai/doc/gto/user-guide#acting-on-new-registrations-and-assignments).
