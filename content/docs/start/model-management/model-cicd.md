---
title: 'Get Started: Using and deploying models'
description:
  'Easily download your models from the model registry. Set up your CICD
  pipelines to be trigger by model registry actions (such as assigning model
  stages) and deploy models directly form the model registry.'
---

# Get Started: Using and Deploying Models

In the [model registry chapter](/doc/start/model-management/model-registry) we
registered the model in the model registry and assigned it to some lifecycle
stages. In this chapter, we will learn how to access and use models and how to
use the model registry to trigger automated CICD model workflows.

If you are using the example repository, the models are already versioned on a
publicly readable DVC remote so you can access the model from there and use it.
If you are instead using your own repository you need to set up your own DVC
remote and push the data (including models) there. Have a look at our [Data
management
guide](/doc/start/data-management/data-versioning#configuring-a-remote) to see
how this is done.

## Downloading models

It is useful to download model artifacts for example for local testing or for
use in CICD workflows. With models versioned by DVC this can be done easily by
using the Studio UI.

Go to the detailed view of your model, select the desired model version under
the "Version info" and then click on the "Access model" button.

Studio will present you with several ways of downloading models. You can see all the steps here:

![Download model](/img/mr-studio-download-model.gif)

Alternatively, you can also download the model with the following CLI command:

```bash
dvc artifacts get https://github.com/<user>/example-get-started-experiments.git pool-segmentation
```

where you just need to replace `<user>` with your GitHub user. This will
download the latest version of the `pool-segmentation` model from the DVC Remote
associated with the Git repository in the URL. You can also specify a different
artifact version or a model registry stage. See the `dvc artifacts get`
documentation for all options.

## Connecting model registry actions to your CICD

As we [noted](/docs/start/model-management/model-registry#GTO-tip) in the model
registry chapter, all DVC model registry actions are captured in your Git
repository as Git tags with a specific format.

This also means that we can create CICD actions in our Git repository which will
be triggered whenever versions are registered or stages are assigned.

In the following, we will have a look at an example CICD workflow on GitHub
which runs whenever we assign a version of our model to the "prod" stage in the
model registry. The workflow simulates model deployment without the need to
actually set up a deployment environment (so that you can test it easier) but it
does include all the ingredients needed in an actual deployment job or any other
CICD action.

<admon type="tip">

To see a real-world model deployment example you can check out a
[similar workflow in our example repository](https://github.com/iterative/example-get-started-experiments/blob/main/.github/workflows/deploy-model.yml)
which deploys a specific version of the model to an Amazon Sagemaker endpoint
for inference whenever it is assigned to a stage.

</admon>

Go to the `.github/workflows/deploy-model-template.yml`. This is the file that
GitHub uses to run our CICD workflow. You can see
[runs of this workflow](https://github.com/iterative/example-get-started-experiments/actions/workflows/deploy-model-template.yml)
in our example repository.

At the beginning of the workflow file you will see this code

```yaml
on:
  # the workflow is triggered whenever a tag is pushed to the repository
  push:
    tags:
      - '*'
```

The code tells GitHub to run the workflow every time a tag is pushed to the
repository.

This means that the workflow will run whenever we run model registry actions,
but we also want it to limit to specific ones for our specific workflow. That's
where our GTO GitHub action comes into play - in the "parse" job of our workflow
it parses all tags and if they are GTO tags, it gives us the name of the model,
its version, stage (if any) and the event in the model registry.

This is captured in the "parse" job which you can simply copy and paste into
most CICD jobs of your own.

```yaml
# This job parses the git tag with the GTO GitHub Action to identify model registry actions
parse:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
      with:
        fetch-depth: 0
    - name: 'Parse GTO tag'
      id: gto
      uses: iterative/gto-action@v2
  outputs:
    event: ${{ steps.gto.outputs.event }}
    name: ${{ steps.gto.outputs.name }}
    stage: ${{ steps.gto.outputs.stage }}
    version: ${{ steps.gto.outputs.version }}
```

<admon type="tip">

If you cannot or don't want to use the GTO GitHub Action you can also use GTO
directly with the [gto check-ref](/doc/gto/command-reference/check-ref) command.

</admon>

The next job called "deploy-model" actually performs the action. First, it uses
the outputs of the parse job and checks whether the action should be performed.
If the tag was produced by the model registry and if the corresponding action
was assignment to the "prod" stage, it proceeds with the rest of the workflow.

```yaml
deploy-model:
  needs: parse
  if:
    "${{ needs.parse.outputs.event == 'assignment' }} && ${{
    needs.parse.outputs.stage == 'prod' }}"
```

The next two steps step of the workflow checkout the Git repository and set up
DVC (using a GitHub Action, but this can also be done manually, for example with
pip).

This allows us to run `dvc artifacts get` in the last step of the workflow to
download the correct version of the model which can then be deployed or
otherwise used in our CICD.

```yaml
- name: Get Model For Deployment
  run: |
    dvc artifacts get ${{ github.repositoryUrl }} ${{ needs.parse.outputs.name }} --rev ${{ needs.parse.outputs.version }}
```

Here, we are using the outputs of the `parse` job to specify the correct model
version. Finally,
[`github.repositoryUrl`](https://docs.github.com/en/actions/learn-github-actions/contexts#github-context)
is a default environmental variable in GitHub which contains the URL of the
current repository.

You can use the following template to create your own Model Registry CICD
actions on GitHub!

```yaml
name: Template CICD Action for DVC Model Registry

on:
  # the workflow is triggered whenever a tag is pushed to the repository
  push:
    tags:
      - "*"

jobs:

  # This job parses the git tag with the GTO GitHub Action to identify model registry actions
  parse:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
      with:
        fetch-depth: 0
    - name: "Parse GTO tag"
      id: gto
      uses: iterative/gto-action@v2
    outputs:
      event: ${{ steps.gto.outputs.event }}
      name: ${{ steps.gto.outputs.name }}
      stage: ${{ steps.gto.outputs.stage }}
      version: ${{ steps.gto.outputs.version }}

  perform-action:
    needs: parse
    if: # here paste the model registry event condition you want to trigger your action
    steps:

    ...

```
