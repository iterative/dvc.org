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

It is useful to download model artifacts for example for local use/testing or in
an automated CICD jobs. With models versioned by DVC this can be done easily by
using the `dvc get` CLI command as follows

```bash
dvc get https://<path-to-my-git-forge-account>/example-get-started-experiments models/model.pth --rev v1.0.0
```

where you just need to replace `<path-to-my-git-forge-account>` with your
GitHub/GitLab/Bitbucket account path. This will download the model version
v1.0.0 to the location from where you are calling the `dvc get` command.

If you're using Studio this is even easier. Go to the Models dashboard, click on
the three dots next to the name of your model and select "Download model file".
Then you can select the model version you're interested in and Studio will
generate the correct call of the `dvc get` command for you. You then just need
to copy it and run it where you want the model to be downloaded. You can see all
the steps here:

![Downloading models](/img/mr-download-model.gif)

## Connecting model registry action to your CICD

As we [noted](/docs/start/model-management/model-registry#GTO-tip) in the model
registry chapter, all DVC model registry actions are captured in your git
repository as git tags with a specific format.

This also means that we can create CICD actions in our git repository which will
be triggered whenever.

In the following, we will have a look at an example CICD workflow on GitHub
which runs whenever we assign a version of our model to the "test" stage in the
model registry. The workflow will check whether the model artifact size is less
than 50 MB and fail if it isn't. To motivate the example, we can imagine that we
are deploying models to edge devices where storage comes at a premium.

Go to the `.github/workflows/test-model-artifact.yml`. This is the file that
GitHub uses to run our CICD workflow.

At the beginning of the file you will see this code

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
      uses: iterative/gto-action@14723404a00bb0c1e759c02ffcd24279df5815c2
  outputs:
    event: ${{ steps.gto.outputs.event }}
    name: ${{ steps.gto.outputs.name }}
    stage: ${{ steps.gto.outputs.stage }}
    version: ${{ steps.gto.outputs.version }}
```

The next job called "test-model-artifact" actually performs the action. First,
it uses the outputs of the parse job and checks whether the action should be
performed. If the tag was produced by the model registry and if the
corresponding action was assignment to the "test" stage, it proceeds with the
rest of the workflow.

```yaml
test-model-artifact:
  needs: parse
  if:
    "${{ needs.parse.outputs.event == 'assignment' }} && ${{
    needs.parse.outputs.stage == 'test' }}"
  runs-on: ubuntu-latest
```

After the next steps which set up Python and instal necessary requirements, the
job adds our project's DVC remote so that the workflow can download the model
without having an explicit URL

```yaml
- name: Add DVC Remote
      run:  dvc remote add -d --local storage s3://dvc-public/remote/get-started-pools
```

Then in the last step of the job, we use `dvc get` to download the model
similarly to how we did it
[above](/docs/start/model-management/model-cicd#downloading-models), except now
we don't need to add an explicit URL (this way, the workflow will keep working
even if we rename our git repository).

Finally, the job just checks the model size and fails if the size is too large.

You can use the following template to create your own CICD actions on GitHub!

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
      uses: iterative/gto-action@14723404a00bb0c1e759c02ffcd24279df5815c2
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

<admon type="tip" id="sagemaker-and-gitlab">

The same ingredients we will use to set up this workflow are be usable for any
other CICD action. You can check out a
[similar workflow in our example repository](https://github.com/iterative/example-get-started-experiments/blob/main/.github/workflows/deploy-model.yml)
which deploys a specific version of the model to an Amazon Sagemaker endpoint
for inference whenever it is assigned to a stage.

With other git servers such as GitLab you can use the same logic (you will only
have to adapt the syntax and use the GTO library manually to parse tags with the
[`gto check-ref`](https://mlem.ai/doc/gto/command-reference/check-ref) command).

</admon>
