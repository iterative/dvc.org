# Self-hosted Runners

GitHub Actions and GitLab CI are run on GitHub- and GitLab- hosted runners by
default. However, there are many great reasons to use your own runners: to take
advantage of GPUs; to orchestrate your team's shared computing resources, or to
train in the cloud.

☝️ **Tip!** Check out the official documentation from
[GitHub](https://help.github.com/en/actions/hosting-your-own-runners/about-self-hosted-runners)
and [GitLab](https://docs.gitlab.com/runner/) to get started setting up your
self-hosted runner.

## Allocating cloud resources with CML

When a workflow requires computational resources (such as GPUs) CML can
automatically allocate cloud instances using `cml-runner`. You can spin up
instances on your AWS or Azure account (GCP support is forthcoming!).

For example, the following workflow deploys a `t2.micro` instance on AWS EC2 and
trains a model on the instance. After the job runs, the instance automatically
shuts down. You might notice that this workflow is quite similar to the
[basic use case](#usage) highlighted in the beginning of the docs- that's
because it is! What's new is that we've added `cml-runner`, plus a few
environmental variables for passing your cloud service credentials to the
workflow.

```yaml
name: "Train-in-the-cloud"
on: [push]

jobs:
  deploy-runner:
    runs-on: [ubuntu-latest]
    steps:
      - uses: iterative/setup-cml@v1
      - uses: actions/checkout@v2
      - name: "Deploy runner on EC2"
        shell: bash
        env:
          repo_token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          cml-runner \
          --cloud aws \
          --cloud-region us-west \
          --cloud-type=t2.micro \
          --labels=cml-runner
  name: model-training
    needs: deploy-runner
    runs-on: [self-hosted,cml-runner]
    container: docker://dvcorg/cml-py3:latest
    steps:
    - uses: actions/checkout@v2
    - name: "Train my model"
      env:
        repo_token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
      run: |
        pip install -r requirements.txt
        python train.py

        # Publish report with CML
        cat metrics.txt > report.md
        cml-send-comment report.md
```

In the above workflow, the step `deploy-runner` launches an EC2 `t2-micro`
instance in the `us-west` region. The next step, `model-training`, runs on the
newly launched instance.

**Note that you can use any container with this workflow!** While you must have
CML and its dependencies setup to use CML functions like `cml-send-comment` from
your instance, you can create your favorite training environment in the cloud by
pulling the Docker container of your choice.

We like the
[CML container](https://github.com/iterative/cml/blob/master/docker/Dockerfile)
(`docker://dvcorg/cml-py3`) because it comes loaded with Python, CUDA, `git`,
`node` and other essentials for full-stack data science. But we don't mind if
you do it your way :)

## Arguments

The function `cml-runner` accepts the following arguments:

| Argument              | Description                                                                                                   | Values                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `--version`           | Show version number                                                                                           | Boolean                                                                                                        |
| `--labels`            | Comma delimited runner labels                                                                                 | Default: `cml`                                                                                                 |
| `--idle-timeout `     | Time in seconds for the runner to be waiting for jobs before shutting down. 0 waits forever.                  | Default: `300`                                                                                                 |
| `--name`              | Name displayed in the repo once registered                                                                    | Default: `cml-` followed by a unique identifier, i.e. `cml-cfwj9rrari`                                         |
| `--driver`            | If not specified, driver is inferred from environmental variables                                             | Choices: `github`,`gitlab`                                                                                     |
| `--repo`              | Specifies the Git repository to be used. If not specified, repo is inferred from the environmental variables. | Example: `https://github.com/iterative/cml`                                                                    |
| `--token`             | Personal access token to be used. If not specified, it will be inferred from the environment.                 | `token` should be a string                                                                                     |
| ` --cloud`            | Cloud provider to deploy the runner                                                                           | Choices: `aws`,`azure`                                                                                         |
| `--cloud-region`      | Region where the instance is deployed.                                                                        | choices: `us-east`,`us-west`, `eu-west`, `eu-north`. Also accepts native cloud regions. Defaults to `us-west`. |
| `--cloud-type`        | Instance type.                                                                                                | Choices: `m`, `l`, `xl`. Also supports native types like i.e. `t2.micro`                                       |
| `--cloud-gpu`         | GPU type.                                                                                                     | Choices: `nogpu`,`k80`,`tesla`                                                                                 |
| `--cloud-hdd-size`    | HDD size in GB.                                                                                               | Accepts integer values                                                                                         |
| `--cloud-ssh-private` | Your private RSA SSH key. If not provided will be generated by the Terraform-provider-Iterative.              | Accepts string                                                                                                 |
| `--cloud-spot`        | Request a spot instance                                                                                       | Boolean                                                                                                        |
| `--cloud-spot-price`  | Spot max price. If not specified it takes current spot bidding pricing.                                       | default: `-1`                                                                                                  |
| `-h`                  | Show help                                                                                                     | Boolean                                                                                                        |

## Environmental variables

You will need to
[create a personal access token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line)
with repository read/write access and workflow privileges. In the example
workflow, this token is stored as `PERSONAL_ACCESS_TOKEN`.

Note that you will also need to provide access credentials for your cloud
compute resources as secrets. In the above example, `AWS_ACCESS_KEY_ID` and
`AWS_SECRET_ACCESS_KEY` are required to deploy EC2 instances.

Click below to see credentials needed for supported cloud service providers.

<details>

### AWS

```yaml
env:
  AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
  AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
  AWS_SESSION_TOKEN: ${{ secrets.AWS_SESSION_TOKEN }}
```

Note that `AWS_SESSION_TOKEN` is optional.

</details>

<details>

### Azure

```yaml
env:
  AZURE_STORAGE_CONNECTION_STRING:
    ${{ secrets.AZURE_STORAGE_CONNECTION_STRING }}
  AZURE_STORAGE_CONTAINER_NAME: ${{ secrets.AZURE_STORAGE_CONTAINER_NAME }}
```

</details>

### Using on-premise machines as self-hosted runners

You can also use the new `cml-runner` function to set up a local self-hosted
runner. On your local machine or on-premise GPU cluster, you'll install CML as a
package and then run:

```yaml
cml-runner \ --repo $your_project_repository_url \
--token=$personal_access_token \ --labels tf \ --idle-timeout 180
```

Now your machine will be listening for workflows from your project repository.
