---
title: Machine Learning Workloads with Iterative Provider for Terraform
date: 2022-04-27
description: >
  Today we introduce painless resource orchestration for your machine learning
  projects in conjunction with HashiCorp Terraform.
descriptionLong: >
  Catapult your machine learning projects into any coud and reduce cost with
  spot instance auto-recovery, while aligning your Data Science  and DevOps
  teams with a simple config file.
picture: 2022-04-27/terraform-provider-iterative.png
pictureComment: Machine Learning Workloads with Iterative Provider for Terraform
author: maria_khalusova
commentsUrl: https://discuss.dvc.org/t/collaborative-experiments/1002
tags:
  - MLOps
  - Terraform
  - Git
  - Resource orchestation
  - Spot Instance management
---

The requirements for Machine Learning (ML) infrastructure are becoming
increasingly complex. Training large models often requires specialized hardware
(GPUs, TPUs) which involves moving the whole training process onto cloud
machines, setting up environments and synchronizing data. For teams that want to
leverage spot instances, the setup becomes even more complex - they need to make
sure the training progress is not lost during spot instance recovery. This is
time-consuming, and requires expertise in both DevOps and Machine Learning. On
top of that, the costs of training in a cloud environment can be high due to not
only the need for specific hardware, but also individual responsibility to shut
down instances when training is complete.

To address the specific needs of machine learning teams, we have built the
Iterative Provider (TPI). TPI is an open-source tool extending the functionality
of Terraform, the world's most widely used multi-cloud provisioning product. The
Iterative Provider enables full lifecycle management of computing resources and
is designed specifically for machine learning pipelines.

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
  required_providers {
    iterative = {
      source = "iterative/iterative"
    }
  }
}

provider "iterative" {}

resource "iterative_task" "example" {
  cloud   = "aws"
  region  = "us-east-2"
  machine = "l+k80"

  script = <<-END
    #!/bin/bash
    sudo apt update
    sudo apt install -y python3-pip
    pip3 install -r requirements.txt
    python3 src/train.py
  END

  storage {
    workdir = "."
    output  = "results"
  }
}
```

Once the training is complete, the Iterative Provider terminates the resource,
so users don't have to worry about spiraling costs from unused machines.

## Configure Once, Bring Everywhere

Once you configure infrastructure and a script that executes your training
pipeline in a Terraform configuration file, you can bring that pipeline anywhere
you want. You can use such a config for ad-hoc training at any stage of your
prototyping process or use it as a job in your preferred CI/CD tool. It will
also store your infrastructure configuration files in a version control system
together with the rest of your project for easier control.

## One Provider to Rule Them All

Whether you prefer Amazon Web Services (AWS), Microsoft Azure, Google Cloud
Platform (GCP), or Kubernetes, the Iterative Provider has you covered. You can
configure compute resources from these with a single provider, using
[common machine types](https://registry.terraform.io/providers/iterative/iterative/latest/docs/resources/task#machine-type).
These are going to be roughly similar between different cloud vendors. Not only
does this significantly simplify infrastructure configuration, it also makes it
easy to migrate from one cloud to another with only minor adjustments.

## Costs Optimization

The Iterative Provider helps with cloud compute cost optimization in two major
ways. First, upon completion of your script, the instance is automatically
terminated. This helps to avoid accumulating costs due to abandoned resources.
Second, you can leverage the cost-saving power of spot instances to train your
models without losing any progress!

## DevOps-Friendly

Last, but not least, the Iterative Provider aims to bridge the gap between
DevOps and Data Science teams. We build on top of Terraform, a tool universally
familiar to DevOps teams, but extend it to suit ML needs.

If you’d like to try the Iterative Provider in your project, check out the
documentation on the provider’s page in the Terraform registry, and if you have
any questions or suggestions, we welcome them in our
[GitHub repository.](https://github.com/iterative/terraform-provider-iterative)
