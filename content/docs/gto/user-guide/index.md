# User Guide

GTO lets you build an Artifact Registry or [Model Registry] out of your Git
repository by creating annotated
[Git tags](https://git-scm.com/book/en/v2/Git-Basics-Tagging) with a
[special format](#git-tags-format). To read more about building a Model
Registry, read this [Studio User Guide].

[Model Registry]: http://dvc.org/doc/use-cases/model-registry
[Studio User Guide]:
  https://dvc.org/doc/studio/user-guide/model-registry/what-is-a-model-registry

## Finding the right artifact version

You may need to get a specific artifact version to a certain environment, most
likely the latest one or the one currently assigned to the stage. Use `gto show`
to find the [Git reference] (tag) you need.

[git reference]: https://git-scm.com/book/en/v2/Git-Internals-Git-References

Get the git tag for the latest version:

```cli
$ gto show churn@latest --ref
churn@v3.1.1
```

Get the git tag for the version in `prod` stage:

```cli
$ gto show churn#prod --ref
churn@v3.0.0
```

GTO doesn't provide a way to deliver the artifacts, but you can use DVC or any
method to retrieve files from the repo. With DVC, you can use [`dvc get`]:

```cli
$ dvc get $REPO $ARTIFACT_PATH --rev $REVISION -o $OUTPUT_PATH
```

<admon type="tip">

You can also use DVC with GTO to:

- [Store large artifacts] (models and data) and track pointers to them in your
  repo.
- [Keep artifact metadata] like the path or type (`model` or `dataset`). To see
  an example, check out the [`example-gto` repo].

</admon>

[`dvc get`]: https://dvc.org/doc/command-reference/get
[store large artifacts]:
  https://dvc.org/doc/start/data-management/data-versioning
[keep artifact metadata]:
  https://dvc.org/doc/user-guide/project-structure/dvcyaml-files#artifacts
[`example-gto` repo]:
  https://github.com/iterative/example-gto/blob/main/dvc.yaml

## Acting on new registrations and assignments

A popular option to act on Git tags pushed in your repo is to set up CI/CD. To
see an example, check out
[the workflow in `example-gto` repo](https://github.com/iterative/example-gto/blob/main/.github/workflows/gto-act-on-tags.yml).
The workflow uses [the GTO GH Action](https://github.com/iterative/gto-action)
that fetches all Git tags (to correctly interpret the Registry), finds out the
`version` of the artifact that was registered, the `stage` that was assigned,
and annotations details such as `path`, `type`, `description`, etc, so you could
use them in the next steps of the CI. Note that it finds these annotation
details by
[reading `dvc.yaml` managed by DVC](/doc/gto/user-guide/#using-dvc-to-annotate-artifacts).

If you're working with GitLab or BitBucket, feel free to create an issue asking
for a similar action, or submit yours for us to add to documentation.

[env var in github actions]:
  https://docs.github.com/en/actions/learn-github-actions/environment-variables

<details>

### Other approaches: webhooks and polling Git forge API

Besides using CI/CD, the other option is to
[configure webhooks](https://docs.github.com/en/rest/webhooks) that will send
HTTP requests to your server upon pushing Git tags to the remote.

Besides, you can configure your server to query your Git provider via something
like REST API to check if changes happened. As an example, check out
[Github REST API](https://docs.github.com/en/rest).

</details>

### CI/CD workflow examples

We use MLEM in these examples, but you can use any other tool to build, publish
or deploy your models, or do any other action with your artifacts.

<toggle>
<tab title="GitHub: build a Docker image">

This workflow will build a docker image out of the model and push it to a
DockerHub.

```yaml
# .github/workflows/build.yaml
on:
  push:
    tags:
      - '*'

jobs:
  act:
    name: Build a Docker image for new model versions
    runs-on: ubuntu-latest
    steps:
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        # set credentials to login to DockerHub
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      - uses: actions/checkout@v3
      - id: gto
        uses: iterative/gto-action@v2
      - uses: actions/setup-python@v2
      - name: Install dependencies
        run: |
          pip install --upgrade pip setuptools wheel
          pip install -r requirements.txt
      - if: steps.gto.outputs.event == 'registration'
        run: |
          mlem build docker \
              --model '${{ steps.gto.outputs.path }}' \
              --image.name ${{ steps.gto.outputs.name }} \
              --image.tag '${{ steps.gto.outputs.version }}' \
              --image.registry docker_io
```

[Learn more](/doc/user-guide/building) about building Docker images, Python
packages or preparing `docker build`-ready folders from your models with MLEM.

</tab>
<tab title="GitHub: deploy a model">

This workflow will deploy a model to Heroku upon stage assignment:

```yaml
# .github/workflows/deploy.yaml
on:
  push:
    tags:
      - '*'

# set credentials to run deployment and save its state to s3
env:
  HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
  AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
  AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

jobs:
  act:
    name: Deploy a model upon stage assignment
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - id: gto
        uses: iterative/gto-action@v2
      - uses: actions/setup-python@v2
      - name: Install dependencies
        run: |
          pip install --upgrade pip setuptools wheel
          pip install -r requirements.txt
      - if: steps.gto.outputs.event == 'assignment'
        run: |
          # TODO: check this works
          mlem deployment run \
            --load deploy/${{ steps.gto.outputs.stage }} \
            --model ${{ steps.gto.outputs.path }}
```

This relies on having [deployment declarations](/doc/user-guide/deploying) in
the `deploy/` directory, such as:

```yaml
# deploy/dev.yaml
object_type: deployment
type: heroku
app_name: mlem-dev
```

This declaration is read by MLEM in CI and the model promoted to `dev` is
deployed to https://mlem-dev.herokuapp.com.

Note, that you need to provide environment variables to deploy to Heroku and
update the [deployment state](/doc/user-guide/deploying). The location for the
state should be
[configured](/doc/user-guide/deploying#setting-up-remote-state-manager) in MLEM
config file:

```yaml
# .mlem.yaml
core:
  state:
    uri: s3://bucket/path
```

Check out [another example](https://github.com/iterative/example-gto/tree/mlem)
of MLEM model deployment in the `main` branch of the `example-gto` repo.

</tab>
</toggle>

## Configuring GTO

To configure GTO, use file `.gto` in the root of your repo:

```yaml
# .gto config file
stages: [dev, stage, prod] # list of allowed Stages
```

When allowed Stages are specified, GTO will check commands you run and error out
if you provided a value that doesn't exist in the config. Note, that GTO applies
the config from the workspace, so if want to apply the config from `main`
branch, you need to check it out first with `git checkout main`.

Alternatively, you can use environment variables (note the `GTO_` prefix)

```cli
$ GTO_EMOJIS=false gto show
```

## Git tags format

<admon type="tip">

You can work with GTO without knowing these conventions, since
[`gto` commands](/doc/command-reference) take care of everything for you.

</admon>

All events have the standard formats of Git tags:

- `{artifact_name}@{version_number}#{e}` for version registration.
- `{artifact_name}@{version_number}!#{e}` for version deregistration.
- `{artifact_name}#{stage}#{e}` for stage assignment.
- `{artifact_name}#{stage}!#{e}` for stage unassignment.
- `{artifact_name}@deprecated#{e}` for artifact deprecation.

All of them share two parts:

1. `{artifact_name}` prefix part.
2. `#{e}` counter at the end that can be omitted (in "simple" Git tag format).

Generally, `#{e}` counter is used, because Git doesn't allow to create two Git
tags with the same name. If you want to have two Git tags that assign `dev`
stage to `model` artifact without the counter (`model#dev`), that will require
deleting the old Git tag first. Consequently, that doesn't allow you to preserve
history of events that happened.

By default, `#{e}` sometimes is omitted, sometimes not. We are setting defaults
to omit using `#{e}` when it's rarely necessary, e.g. for version registrations
and artifact deprecations.
