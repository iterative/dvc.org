---
title: Machine Learning Workloads with Terraform Provider Iterative
date: 2022-04-27
description: >
  Today we introduce painless resource orchestration for your machine learning
  projects in conjunction with HashiCorp Terraform.
descriptionLong: >
  Catapult your machine learning projects into any cloud and reduce cost with
  spot instance auto-recovery, while aligning your Data Science and DevOps teams
  with a simple config file.
picture: 2022-04-27/terraform-provider-iterative.png
pictureComment: Machine Learning Workloads with Terraform Provider Iterative
author: maria_khalusova
commentsUrl: https://discuss.dvc.org/t/terraform-iterative-provider-release-blog-post/1171
tags:
  - MLOps
  - Terraform
  - Git
  - Cloud orchestration
  - Spot instance management
  - TPI
  - Terraform Provider Iterative
  - Release
---

The requirements for Machine Learning (ML) infrastructure are becoming
increasingly complex. Training large models often requires specialized hardware
(GPUs, TPUs) which involves moving the whole training process onto cloud
machines, setting up environments and synchronizing data. For teams that want to
leverage spot instances, the setup becomes even more complex -- they need to
make sure the training progress is not lost during spot instance recovery. This
is time-consuming, and requires expertise in both DevOps and Machine Learning.
Additionally, training in a cloud environment can incur high costs due to the
need for expensive hardware, as well as users forgetting to shutdown instances
when training is complete.

To address the specific needs of machine learning teams, we have built
[Terraform Provider Iterative (TPI)](https://github.com/iterative/terraform-provider-iterative).
TPI is an open-source tool extending the functionality of Terraform, the world's
most widely used multi-cloud provisioning product. The Iterative Provider
enables full lifecycle management of computing resources and is designed
specifically for machine learning pipelines.

## Tailored to Machine Learning Workflows

The Iterative Provider offers a single resource called `iterative_task` which
you can use to configure:

- Your cloud infrastructure
- The steps to perform on the cloud resource, i.e. setting up the environment,
  running the training pipeline, logging metrics, etc.
- The data to be synced back once the training is complete (e.g. a file with
  metrics, a model, plots)

Here’s a “hello world” example of a `main.tf` Terraform configuration file using
the `iterative_task` resource:

```hcl
terraform {
  required_providers { iterative = { source = "iterative/iterative" } }
}
provider "iterative" {}

resource "iterative_task" "example" {
  cloud       = "aws"     # or any of: gcp, az, k8s
  machine     = "m"       # medium. Or any of: l, xl, m+k80, xl+v100, ...
  image       = "ubuntu"  # or "nvidia", ...
  region      = "us-west" # or us-west, eu-east, ...
  disk_size   = 30        # GB
  spot        = 0         # auto-price. Default -1 to disable or >0 for hourly USD limit
  timeout     = 24*60*60  # max 24h before forced termination

  storage {
    workdir = "."
    output  = "results"
  }
  script = <<-END
    #!/bin/bash
    sudo apt update
    sudo apt install -y python3-pip
    pip3 install --user -r requirements.txt
    python3 train.py
  END
}
```

Once the training is complete, the Iterative Provider terminates the resource,
so users don't have to worry about spiraling costs from unused machines.

## Configure Once, Bring Everywhere

Once you configure infrastructure and a script that executes your training
pipeline in a Terraform configuration file, you can bring that pipeline anywhere
you want. You can use such a config for ad-hoc training at any stage of your
prototyping process or use it as a job in your preferred CI/CD tool. You can
also store your infrastructure configuration files in a version control system
together with the rest of your project for easier control.

## One Provider to Rule Them All

Whether you prefer Amazon Web Services (AWS), Microsoft Azure, Google Cloud
Platform (GCP), or Kubernetes (K8s), the Iterative Provider has you covered. You
can configure compute resources from these with a unified API, using
[common machine types](https://registry.terraform.io/providers/iterative/iterative/latest/docs/resources/task#machine-type)
that are the same across all cloud vendors. This significantly simplifies
infrastructure configuration and makes it easy to migrate from one cloud to
another by changing just one line of code.

## Costs Optimization

The Iterative Provider helps with cloud compute cost optimization in two major
ways. First, upon completion of your script, the instance is automatically
terminated. This helps to avoid accumulating costs due to abandoned resources.
Second, you can leverage the cost-saving power of spot instances to train your
models without losing any progress! TPI recovers the working directory and
respawns interrupted/preempted instances for you.

## DevOps-Friendly

Last, but not least, the Iterative Provider aims to bridge the gap between
DevOps and Data Science teams. We build on top of Terraform, a tool universally
familiar to DevOps teams, but extend it to suit ML needs.

If you’d like to try the Iterative Provider in your project, check out the
documentation on the provider’s page in the Terraform registry, and if you have
any questions or suggestions, we welcome them in our
[GitHub repository.](https://github.com/iterative/terraform-provider-iterative)
