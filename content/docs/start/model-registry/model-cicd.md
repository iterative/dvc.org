---
title: 'Get Started: Using and deploying models'
description:
  'Easily download your models from the model registry. Set up your CICD
  pipelines to be trigger by model registry actions (such as assigning model
  stages) and deploy models directly form the model registry.'
---

# Get Started: Using and Deploying Models

In the previous two chapters we registered the model in the model registry and
assigned it to some lifecycle stages. In this chapter, we will learn how to
access and use models and how to use the model registry to trigger automated
CICD model workflows.

If you are using the example repository, the models are already versioned on a
publicly readable DVC remote so you can access the model from there and use it.
If you are instead using your own repository you need to set up your own DVC
remote and push the data (including models) there. Have a look at
[configuring a remote](/doc/start#configuring-a-remote) to see how this is done.

## Downloading models

It is useful to download model artifacts for example for local testing or for
use in CICD workflows. With models versioned by DVC this can be done easily by
using the DVC Studio UI.

Go to the detailed view of your model, select the desired model version under
the "Version info" and then click on the "Access model" button.

DVC Studio will present you with several ways of downloading models - with the
CLI, in Python code and directly from your web browser. You can see all the
steps to download the model from the web browser here:

![Studio download model](https://static.iterative.ai/img/mr-studio-download-model.gif)

And here's how to do it with the CLI:

First, configure the
[DVC Studio Access Token](https://dvc.org/doc/studio/user-guide/account-management#studio-access-token)
(this only needs to be done once):

```cli
$ dvc config --global studio.token <your Studio token>
```

Now you can use the following command to download the model:

```cli
$ dvc artifacts get https://github.com/<user>/example-get-started-experiments pool-segmentation
```

Here you just need to replace `<user>` with your GitHub user (on GitLab the URL
is analogous). This will download the latest version of the `pool-segmentation`
model from the DVC remote associated with the Git repository in the URL. You can
also specify a different artifact version or a model registry stage. See the
`dvc artifacts get` documentation for all options.
[Later in this guide](#deploy-the-model) we will see how to use this same
command as a part of your CICD.

If you don't have a DVC Studio account at all, you can still use
`dvc artifacts get` to download models, but you will need to provide the correct
Git and DVC remote credentials manually. You can see more details in the
[documentation](/doc/command-reference/artifacts/get#description).

## Connecting model registry actions to your CICD

As we noted in the
[model management chapter](/doc/start/model-registry/manage-models), all DVC
model registry actions are captured in your Git repository as Git tags with a
specific format.

This also means that we can create CICD actions in our Git repository which will
be triggered whenever versions are registered or stages are assigned.

In the following, we will have a look at an example CICD workflow on GitHub and
GitLab which runs whenever we assign a version of our model to the "prod" stage
in the model registry. The workflow simulates model deployment without the need
to actually set up a deployment environment (so that you can test it easier) but
it does include all the ingredients needed in an actual deployment job or any
other CICD action.

You can simply re-use the CICD template below and copy it into your projects.
Then all you need to do is to save the
[DVC Studio token](https://dvc.org/doc/studio/user-guide/account-management#studio-access-token)
as a
[GitHub secret](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
(or a [GitLab CI variable](https://docs.gitlab.com/ee/ci/variables/)) to manage
authentication with the
[DVC remote storage](https://dvc.org/doc/user-guide/data-management/remote-storage#remote-storage).
This way we only need to keep the
[DVC Studio token](https://dvc.org/doc/studio/user-guide/account-management#studio-access-token)
saved on GitHub/GitLab and let DVC Studio manage the specific storage
credentials for us.

In your own use-cases you might want to modify a few things about the workflow
and you can find a more detailed explanation of the CICD templates in the
[next section](#detailed-explanation-of-the-cicd-templates). There you can also
read about how you can set up these CICD jobs without DVC Studio.

<toggle>

<tab title="GitHub">

```yaml
name: Deploy Model (Template)

on:
  # the workflow is triggered whenever a tag is pushed to the repository
  push:
    tags:
      - '*'
jobs:
  # This job parses the git tag with the GTO GitHub Action to identify model registry actions. You can most likely copy this job and what precedes it verbatim into your own workflow
  parse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: 'Parse GTO tag'
        id: gto
        uses: iterative/gto-action@v2
    outputs:
      event: ${{ steps.gto.outputs.event }}
      name: ${{ steps.gto.outputs.name }}
      stage: ${{ steps.gto.outputs.stage }}
      version: ${{ steps.gto.outputs.version }}

  deploy-model:
    needs: parse
    # using the outputs from the "parse" job, we run this job only for actions
    # in the model registry and only when the model was assigned to a stage called "prod"
    # You can replace the conditions with your own
    if:
      ${{ needs.parse.outputs.event == 'assignment' && needs.parse.outputs.stage
      == 'prod' }}
    runs-on: ubuntu-latest
    steps:
      - uses: iterative/setup-dvc@v1
      # this step uses DVC to download the model from the remote repository and deploys the model
      # Model deployment is mocked here as it is specific to each deployment environment
      # The DVC Studio token is used to avoid having to store specific remote storage credentials on GitHub
      - name: Get Model For Deployment
        run: |
          dvc config --global studio.token ${{ secrets.DVC_STUDIO_TOKEN }}
          dvc artifacts get  ${{ github.server_url }}/${{ github.repository }} ${{ needs.parse.outputs.name }} --rev ${{ needs.parse.outputs.version }}
          echo "The right model is available and you can use the rest of this command to deploy it. Good job!"
```

</tab>

<tab title="GitLab">

```yaml
# Deploy Model (Template)

workflow:
  rules:
    # Run the pipeline whenever a tag is pushed to the repository
    - if: $CI_COMMIT_TAG

parse:
  # This job parses the model tag to identify model registry actions
  # You can most likely copy this job and what precedes it verbatim into your own workflow
  image: python:3.11-slim
  script:
    # Install GTO to parse model tags
    - pip install gto
    # This job parses the model tags to identify model registry actions
    - echo "CI_COMMIT_TAG - ${CI_COMMIT_TAG}"
    - echo MODEL_NAME="$(gto check-ref ${CI_COMMIT_TAG} --name)" >> parse.env
    - echo MODEL_VERSION="$(gto check-ref ${CI_COMMIT_TAG} --version)" >>
      parse.env
    - echo MODEL_EVENT="$(gto check-ref ${CI_COMMIT_TAG} --event)" >> parse.env
    - echo MODEL_STAGE="$(gto check-ref ${CI_COMMIT_TAG} --stage)" >> parse.env
    # Print variables saved to parse.env
    - cat parse.env
  artifacts:
    reports:
      dotenv: parse.env

deploy-model:
  needs:
    - job: parse
      artifacts: true
  image: python:3.11-slim
  script:
    # Check if the model is assigned to prod (variables from parse.env are only available in the 'script' section)
    # You can replace the conditions with your own
    - if [[ $MODEL_EVENT == 'assignment' && $MODEL_STAGE == 'prod' ]]; then echo
      "Deploy model"; else exit 1; fi
    # Install DVC
    - pip install dvc
    # Build commands to download and deploy the model
    - dvc config --global studio.token ${DVC_STUDIO_TOKEN}
    - dvc artifacts get  ${CI_REPOSITORY_URL} ${MODEL_NAME} --rev
      ${MODEL_VERSION}
    - echo "The right model is available and you can use the rest of this
      command to deploy it. Good job!"
```

</tab>
</toggle>

<admon type="tip">

To see a real-world model deployment example you can check out a
[similar workflow in our example repository](https://github.com/iterative/example-get-started-experiments/blob/main/.github/workflows/deploy-model-sagemaker.yml)
which deploys a specific version of the model to an Amazon Sagemaker endpoint
for inference whenever it is assigned to a stage.

</admon>

## Detailed explanation of the CICD templates

### Setup the workflow

In this subsection, we will set up a trigger for our CICD workflow and parse the
information from model registry actions. This is also mostly boilerplate code
which you can simply copy and paste verbatim into your own workflows.

Go to the `.github/workflows/deploy-model-template.yml`. This is the file that
GitHub uses to run our CICD workflow. You can see
[runs of this workflow](https://github.com/iterative/example-get-started-experiments/actions/workflows/deploy-model-template.yml)
in our example repository.

At the beginning of the workflow file you will see this code

<toggle>

<tab title="GitHub">

```yaml
on:
  # the workflow is triggered whenever a tag is pushed to the repository
  push:
    tags:
      - '*'
```

</tab>

<tab title="GitLab">

```yaml
workflow:
  rules:
    # the workflow is triggered whenever a tag is pushed to the repository
    - if: $CI_COMMIT_TAG
```

</tab>
</toggle>

The code tells GitHub/GitLab to run the workflow every time a tag is pushed to
the repository. This means that the workflow will be triggered whenever we run
model registry actions.

Next, we want our workflow to understand the model registry event so that we can
use that information to modify its behaviour. This is where our GTO GitHub
action comes into play - in the "parse" job of our workflow it parses all tags
and if they are GTO tags, it gives us the name of the model, its version, stage
(if any) and the event in the model registry.

In GitLab CI we cannot use the GitHub action. However, we can still use GTO
directly with the
[gto check-ref](https://mlem.ai/doc/gto/command-reference/check-ref) command to
achieve the same result.

<toggle>

<tab title="GitHub">

```yaml
# This job parses the git tag with the GTO GitHub Action to identify model registry actions
parse:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    - name: 'Parse GTO tag'
      id: gto
      uses: iterative/gto-action@v2
  outputs:
    event: ${{ steps.gto.outputs.event }}
    name: ${{ steps.gto.outputs.name }}
    stage: ${{ steps.gto.outputs.stage }}
    version: ${{ steps.gto.outputs.version }}
```

</tab>
<tab title="GitLab">

```yaml
parse:
  # This job parses the model tag to identify model registry actions
  image: python:3.11-slim
  script:
    # Install GTO to parse model tags
    - pip install gto
    # This job parses the model tags to identify model registry actions
    - echo "CI_COMMIT_TAG - ${CI_COMMIT_TAG}"
    - echo MODEL_NAME="$(gto check-ref ${CI_COMMIT_TAG} --name)" >> parse.env
    - echo MODEL_VERSION="$(gto check-ref ${CI_COMMIT_TAG} --version)" >>
      parse.env
    - echo MODEL_EVENT="$(gto check-ref ${CI_COMMIT_TAG} --event)" >> parse.env
    - echo MODEL_STAGE="$(gto check-ref ${CI_COMMIT_TAG} --stage)" >> parse.env
    # Print variables saved to parse.env
    - cat parse.env
  artifacts:
    reports:
      dotenv: parse.env
```

</tab>
</toggle>

### Deploy the model

The next job called "deploy-model" actually performs the action. First, it uses
the outputs of the "parse" job we defined in the previous subsection and checks
whether the action should be performed. If the tag was produced by the model
registry and if the corresponding action was assignment to the "prod" stage, it
proceeds with the rest of the workflow. You can change these conditions to match
your specific workflow.

<toggle>

<tab title="GitHub">

```yaml
deploy-model:
  needs: parse
  # using the outputs from the "parse" job, we run this job only for actions
  # in the model registry and only when the model was assigned to a stage called "prod"
  # You can replace the conditions with your own
  if:
    ${{ needs.parse.outputs.event == 'assignment' && needs.parse.outputs.stage
    == 'prod' }}
```

</tab>

<tab title="GitLab">

```yaml
deploy-model:
  needs:
    - job: parse
      artifacts: true
  image: python:3.11-slim
  script:
    # Check if the model is assigned to prod (variables from parse.env are only available in the 'script' section)
    # You can replace the conditions with your own
    - if [[ $MODEL_EVENT == 'assignment' && $MODEL_STAGE == 'prod' ]]; then echo
      "Deploy model"; else exit 1; fi
```

</tab>
</toggle>

The next step of the workflow sets up DVC (using a GitHub Action, but this can
also be done manually as in the GitLab example below). This allows us to run the
same `dvc artifacts get` we used
[at the start of this chapter](#downloading-models) to download models.

Finally, in the last step of the workflow, we use `dvc artifacts get` to
download the correct version of the model which can then be deployed or
otherwise used in our CICD.

<toggle>

<tab title="GitHub">

```yaml
steps:
  - uses: iterative/setup-dvc@v1
  - name: Get Model For Deployment
    run: |
      dvc config --global studio.token ${{ secrets.DVC_STUDIO_TOKEN }}
      dvc artifacts get  ${{ github.server_url }}/${{ github.repository }} ${{ needs.parse.outputs.name }} --rev ${{ needs.parse.outputs.version }}
      echo "The right model is available and you can use the rest of this command to deploy it. Good job!"
```

</tab>

<tab title="GitLab">

```yaml
  script:

  ...

  # Install DVC
  - pip install dvc
  # Build commands to download and deploy the model
  - dvc config --global studio.token ${DVC_STUDIO_TOKEN}
  - dvc artifacts get  ${CI_REPOSITORY_URL} ${MODEL_NAME} --rev ${MODEL_VERSION}
  - echo "The right model is available and you can use the rest of this command to deploy it. Good job!"
```

</tab>
</toggle>

Here, we are using the outputs of the `parse` job to specify the correct model
version. We are then setting up the DVC Studio token which we stored in our
repository as a
[GitHub secret](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
(or a [GitLab CI variable](https://docs.gitlab.com/ee/ci/variables/)) to manage
authentication with the
[DVC remote storage](https://dvc.org/doc/user-guide/data-management/remote-storage#remote-storage).
This way we only need to keep the DVC Studio token saved on GitHub/GitLab and
let Studio manage the specific storage credentials for us.

Finally, `github.server_url` and `github.repository` are
[default environmental variables in GitHub](https://docs.github.com/en/actions/learn-github-actions/contexts#github-context)
which together form the URL of our repository on GitHub. On GitLab,
`CI_REPOSITORY_URL` serves the same purpose. We could of course also specify the
URL manually.

If you don't use DVC Studio, you can still use `dvc artifacts get` but you will
need to keep your remote storage credentials on GitHub/GitLab and use them to
configure DVC in the CICD workflow. You will also need to checkout the
repository in the workflow. You can see more details in the
[documentation](/doc/command-reference/artifacts/get#description).
