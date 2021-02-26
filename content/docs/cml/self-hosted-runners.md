# Self-hosted Runners

GitHub Actions are run on GitHub-hosted runners by default. However, there are
many great reasons to use your own runners: to take advantage of GPUs; to
orchestrate your team's shared computing resources, or to train in the cloud.

☝️ **Tip!** Check out the
[official GitHub documentation](https://help.github.com/en/actions/hosting-your-own-runners/about-self-hosted-runners)
to get started setting up your self-hosted runner.

### Allocating cloud resources with CML

When a workflow requires computational resources (such as GPUs) CML can
automatically allocate cloud instances. For example, the following workflow
deploys a `t2.micro` instance on AWS EC2 and trains a model on the instance.
After the instance is idle for 120 seconds, it automatically shuts down.

```yaml
name: train-my-model
on: [push]
jobs:
  deploy-cloud-runner:
    runs-on: [ubuntu-latest]
    container: docker://dvcorg/cml:latest
    steps:
      - name: deploy
        env:
          repo_token: ${{ secrets.REPO_TOKEN }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          echo "Deploying..."

          MACHINE="cml$(date +%s)"
          docker-machine create \
              --driver amazonec2 \
              --amazonec2-instance-type t2.micro \
              --amazonec2-region us-east-1 \
              --amazonec2-zone f \
              --amazonec2-vpc-id vpc-06bc773d85a0a04f7 \
              --amazonec2-ssh-user ubuntu \
              $MACHINE

          eval "$(docker-machine env --shell sh $MACHINE)"

          (
          docker-machine ssh \
            $MACHINE "sudo mkdir -p /docker_machine && \
            sudo chmod 777 /docker_machine" && \
          docker-machine scp -r -q ~/.docker/machine \ 
            $MACHINE:/docker_machine && \

          docker run --name runner -d \
            -v /docker_machine/machine:/root/.docker/machine \
            -e RUNNER_IDLE_TIMEOUT=120 \
            -e DOCKER_MACHINE=${MACHINE} \
            -e RUNNER_LABELS=cml \
            -e repo_token=$repo_token \
            -e RUNNER_REPO="https://github.com/${GITHUB_REPOSITORY}" \
           dvcorg/cml-py3 && \

          sleep 20 && echo "Deployed $MACHINE"
          ) || (echo y | docker-machine rm $MACHINE && exit 1)
  train:
    needs: deploy-cloud-runner
    runs-on: [self-hosted, cml]

    steps:
      - uses: actions/checkout@v2
      - name: cml_run
        env:
          repo_token: ${{ secrets.GITHUB_TOKEN }}
        run: |
          pip install -r requirements.txt
          python train.py

          cat metrics.txt >> report.md
          cml-publish confusion_matrix.png --md >> report.md
          cml-send-comment report.md
```

Please note that for GCP's Compute Engine, deploying the cloud runner involves
different steps:

```yaml
deploy-gce:
  runs-on: [ubuntu-latest]
  container: docker://dvcorg/cml:latest

  steps:
    - name: deploy
      shell: bash
      env:
        repo_token: ${{ secrets.REPO_TOKEN }}
        GOOGLE_APPLICATION_CREDENTIALS_DATA:
          ${{ secrets.GOOGLE_APPLICATION_CREDENTIALS_DATA }}
      run: |
        echo "Deploying..."

        echo '${{ secrets.GOOGLE_APPLICATION_CREDENTIALS_DATA }}' \
          > gce-credentials.json
        export GOOGLE_APPLICATION_CREDENTIALS='gce-credentials.json'

        RUNNER_LABELS="gce"
        RUNNER_REPO="https://github.com/${GITHUB_REPOSITORY}"
        MACHINE="cml$(date +%s)"

        docker-machine create --driver google \
          --google-machine-type "n1-standard-4" \
          --google-project "cml-project-279709" \
          $MACHINE

        eval "$(docker-machine env --shell sh $MACHINE)"

        (
        docker-machine ssh \
          $MACHINE "sudo mkdir -p /docker_machine && \
          sudo chmod 777 /docker_machine" && \
        docker-machine scp -r -q ~/.docker/machine/ \   
          $MACHINE:/docker_machine && \
        docker-machine scp -q gce-credentials.json \
          $MACHINE:/docker_machine/gce-credentials.json && \

        eval "$(docker-machine env --shell sh $MACHINE)" && \
        docker run --name runner -d \
          -v /docker_machine/gce-credentials.json:/gce-credentials.json \
          -e GOOGLE_APPLICATION_CREDENTIALS='/gce-credentials.json' \
          -v /docker_machine/machine:/root/.docker/machine \
          -e DOCKER_MACHINE=$MACHINE \
          -e repo_token=$repo_token \
          -e RUNNER_LABELS=$RUNNER_LABELS \
          -e RUNNER_REPO=$RUNNER_REPO \
          -e RUNNER_IDLE_TIMEOUT=120 \
          dvcorg/cml-py3 && \
        sleep 20 && echo "Deployed $MACHINE"
        ) || (docker-machine rm -f $MACHINE && exit 1)
```

### Inputs

You will need to
[create a new personal access token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line),
`REPO_TOKEN`, with repository read/write access. `REPO_TOKEN` must be added as a
secret in your project repository.

Note that you will also need to provide access credentials for your cloud
compute resources as secrets. In the above example, `AWS_ACCESS_KEY_ID` and
`AWS_SECRET_ACCESS_KEY` are required to deploy EC2 instances.

### Provisioning cloud compute

In the above example, we use
[Docker Machine](https://docs.docker.com/machine/concepts/) to provision
instances. Please see their documentation for further details.

Note several CML-specific arguments to `docker run`:

- `repo_token` should be set to your repository's personal access token
- `RUNNER_REPO` should be set to the URL of your project repository
- The docker container should be given as `dvcorg/cml`, `dvcorg/cml-py3`,
  `dvc/org/cml-gpu`, or `dvcorg/cml-gpu-py3`
