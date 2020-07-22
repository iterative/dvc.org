---
title: July '20 Community Gems
date: 2020-07-22
description: |
  A roundup of technical Q&A's from the DVC community. This month, we discuss 
  migrating to DVC 1.0, the new pipeline format, and our Python API.
descriptionLong: |
  A roundup of technical Q&A's from the DVC community. This month, we discuss 
  migrating to DVC 1.0, the new pipeline format, and our Python API.
picture: 2020-06-29/Gems_June_20.png
author: elle_obrien
commentsUrl: https://discuss.dvc.org/t/june-20-community-gems/426
tags:
  - CML
  - Bitbucket
  - GCP
  - global remote
---

Here are some of our top Q&A's from around the community. With the launch of
[CML](https://cml.dev) earlier in the month, we've got some new ground to cover!

## DVC questions

### [Q: Recently, I set up a global DVC remote. Where can I find the config file?](https://discordapp.com/channels/485586884165107732/563406153334128681/717673618217238598)

When you
[create a global DVC remote](https://dvc.org/doc/command-reference/remote/list#options),
a config file will be created in `~/.config/dvc/config` instead of in your
project directory (i.e., `.dvc/config`).

### [Q: I'm working on a collaborative project, and I use `dvc pull` to sync my local workspace with the project repository. Then, I try running `dvc repro`, but get an error: `dvc.yaml does not exist`. No one else on my team is having this issue. Any ideas?](https://discordapp.com/channels/485586884165107732/485596304961962003/731188065078345799)

This error suggests there is no `dvc.yaml` file in your project. Most likely,
this means your teammates are using DVC version 0.94 or earlier, before the
`dvc.yaml` standard was introduced. Meanwhile, it sounds like you're using
version 1.0 or later. You can check by running

```dvc
$ dvc --version
```

The best solution is for your whole team to upgrade to the latest version. If
for some reason this won't work for your team, you can either downgrade to a
previous version, or use a workaround:

```dvc
$ dvc repro <.dvc stage file>
```

substituting the appropriate `.dvc` file for your pipeline. DVC 1.0 is backwards
compatible, so pipelines created with previous versions will still run.

### [Q: Is there a way to setup my DVC remote so I can manually download files from it without going through DVC?](https://discordapp.com/channels/485586884165107732/563406153334128681/717458695709130764)

When DVC adds a file to a remote repository (such as an S3 bucket, or an SSH
file server), there's only one change happening: DVC calculates an md5 for the
file and renames it with that md5. In technical terms, it's storing files in a
"content-addressable way". That means if you know the hash of a file, you can
locate it in your DVC remote and manually download it.

To find the hash for a given file, say `data.csv`, you can look in the
corresponding DVC file:

```dvc
$ cat data.csv.dvc
```

Another approach is using a built-in DVC function:

```dvc
$ dvc get --show-url . data.csv
```

You can read more about `dvc get --show-url` in
[our docs](https://dvc.org/doc/command-reference/get#options). Note that this
functinality is also part of our Python API, so you can locate the path to a
file in your remote within a Python environment.
[Check out our API docs!](https://dvc.org/doc/api-reference/get_url)

## CML questions

### Q: I use Bitbucket. Will CML work for me?

The first release of CML is compatible with GitHub and GitLab. We've seen
[many requests for Bitbucket support](https://github.com/iterative/cml/issues/140),
and we're making it a development priority for an upcoming release. Stay tuned.

### [Q: I have on-premise GPUs. Can CML use them to execute pipelines?](https://discordapp.com/channels/485586884165107732/728693131557732403/730070747388706867)

Yep! You can use on-premise compute resources by configuring them as self-hosted
runners. See
[GitHub](https://docs.github.com/en/actions/hosting-your-own-runners/about-self-hosted-runners)
and [GitLab](https://docs.gitlab.com/runner/)'s official docs for more details
and setup instructions.

### [Q: I'm building a workflow that deploys a GCP Compute Engine instance, but I can only find examples with AWS EC2 in the CML docs. What do I do?](https://discordapp.com/channels/485586884165107732/728693131557732403/730688592787275806)

There is a slight difference in the way CML handles credentials for AWS and GCP,
and that means you'll have to modify your workflow file slightly. We've added
this example to our
[project README](https://github.com/iterative/cml#allocating-cloud-resources-with-cml):

```yaml
deploy-gce:
  runs-on: [ubuntu-latest]
  container: docker://dvcorg/cml-cloud-runner

  steps:
    - name: deploy
      shell: bash
      env:
        repo_token: ${{ secrets.REPO_TOKEN }}
        GOOGLE_APPLICATION_CREDENTIALS_DATA:
          ${{ secrets.GOOGLE_APPLICATION_CREDENTIALS_DATA }}
      run: |

        echo '${{ secrets.GOOGLE_APPLICATION_CREDENTIALS_DATA }}' > gce-credentials.json
        export GOOGLE_APPLICATION_CREDENTIALS='gce-credentials.json'

        RUNNER_LABELS="gce"
        RUNNER_REPO="https://github.com/${GITHUB_REPOSITORY}"
        MACHINE="cml$(date +%s)"

        docker-machine create --driver google \
          --google-machine-type <machine-type> \
          --google-project <project-id> \
          $MACHINE

        eval "$(docker-machine env --shell sh $MACHINE)"

        (
        docker-machine ssh $MACHINE "sudo mkdir -p /docker_machine && sudo chmod 777 /docker_machine" && \
        docker-machine scp -r -q ~/.docker/machine/ $MACHINE:/docker_machine && \
        docker-machine scp -q gce-credentials.json $MACHINE:/docker_machine/gce-credentials.json && \

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
          dvcorg/cml-cloud-runner:latest && \
        sleep 20 && echo "Deployed $MACHINE"
        ) || (docker-machine rm -f $MACHINE && exit 1)
```

We've also added an example for deploying GCP runners with GPUs to our
[cloud compute use case repository docs](https://github.com/iterative/cml_cloud_case#using-a-different-cloud-service).

Note that for Azure, the workflow will be the same as for AWS. You'll only have
to change the arguments to `docker-machine`.

### [Q: I don't see any installation instructions in the CML docs. Am I missing something?](https://discordapp.com/channels/485586884165107732/728693131557732403/733659483758133269)

Nope, there's no installation unless you wish to install CML in your own Docker
image. As long as you are using GitHub Actions or GitLab CI with the CML Docker
images, no other steps are needed.

If you're creating your own Docker image to be used in a GitHub Action or GitLab
CI pipeline, you can add CML to your image via npm:

```bash
$ npm i -g @dvcorg/cml
```
