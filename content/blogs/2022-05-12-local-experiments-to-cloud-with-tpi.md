---
title:
  Moving Local Experiments to the Cloud with Terraform Provider Iterative (TPI)
date: 2022-05-12
description: >
  Tutorial for easily moving a local ML experiment to a remote cloud machine
  with the help of Terraform Provider Iterative (TPI).
descriptionLong: >
  In this tutorial, learn how to move a local machine learning experiment to a
  remote cloud machine on AWS with the help of Terraform Provider Iterative
  (TPI).
picture: 2022-05-12/header-bees.png
author: maria_khalusova
commentsUrl: https://discuss.dvc.org/t/moving-local-experiments-to-the-cloud-with-terraform-provider-iterative-tpi/1190
tags:
  - MLOps
  - TPI
  - AWS
  - Terraform
  - Git
  - Python
  - Tutorial
  - Cloud orchestration
  - Spot instance management
---

There are many reasons you might train a machine learning model locally. Mainly,
it's quick & easy to set up a new project on a local machine. This is sufficient
for simple experiments (with reduced data subsets or small models) without
paying to rent heavy cloud compute resources. A local machine is also deeply
familiar -- as opposed to the multitude of available cloud services, which can
be intimidating even with a decent background in DevOps.

Once you locally set up and iterate over your data & code enough, you may reach
a point where more powerful compute resources are needed to train a larger model
and/or use bigger datasets. In other words, you might have to switch from
experimenting locally to a cloud environment. If you find yourself in this
situation, this tutorial will help you easily provision cloud infrastructure
with Terraform and run your existing training script on it.

## Getting Started

This tutorial uses the
[BeeImage Dataset](https://www.kaggle.com/jenny18/honey-bee-annotated-images)
which contains over 5,100 bee images annotated with location, date, time,
subspecies, health condition, caste, and pollen. Let's assume we've downloaded
the images, created a project, and trained a
[convolutional neural network](https://en.wikipedia.org/wiki/Convolutional_neural_network)
model locally to classify different subspecies. If you want to follow along, you
can use your own data and training code, or clone [the example
repository][tpi-bees].

[tpi-bees]: https://github.com/iterative/blog-tpi-bees

How do we continue iterating on our model in the cloud? Can we run more epochs
overnight? Change some hyperparameters? Add more layers? The first question when
planning _The Big Move_ is "what dependencies are needed to train this model in
a cloud environment?"

Some of the important puzzle pieces you already have locally:

- Your training code. It is likely that you have a
  [whole pipeline](https://dvc.org/doc/start/data-pipelines) with multiple
  stages but for the sake of simplicity, this tutorial uses a single `train.py`
  script.
- Data.
- Python environment with all required libraries.

You will also need an account with your cloud provider of choice. In this
tutorial we'll be provisioning infrastructure on
[Amazon Web Services (AWS)](https://aws.amazon.com/). You can create an AWS
account yourself, or ask your DevOps team to provide you with one.

<admon type="info">

Make sure to insert
[authentication credentials](https://registry.terraform.io/providers/iterative/iterative/latest/docs/guides/authentication#amazon-web-services)
into your system's environment variables (`AWS_ACCESS_KEY_ID` and
`AWS_SECRET_ACCESS_KEY`).

</admon>

We can now start the move with the help of [Terraform Provider Iterative
(TPI)][tpi].

[tpi]: https://github.com/iterative/terraform-provider-iterative

## What is Terraform?

<admon type="info">

[Terraform](https://www.terraform.io) is an open-source infrastructure-as-code
tool that you should [download and install](https://www.terraform.io/downloads)
for this tutorial.

</admon>

Terraform requires us to create a configuration file containing a declarative
description of the infrastructure we need. There's no need to read lots of cloud
documentation nor write lots of commands. Instead, you describe what your
infrastructure should ultimately look like. Behind the scenes, Terraform will
figure out what needs to be done. If you've cloned the [repository][tpi-bees],
the `main.tf` configuration file is in the project's root. We'll explain its
contents below.

## Terraform Provider Iterative (TPI)

Terraform can orchestrate a plethora of various resources for you, but for the
majority of projects you only need a few. Instead of shipping plugins
(providers) for all these resources in one bundle, Terraform downloads
[_providers_](https://www.terraform.io/docs/extend/how-terraform-works.html)
whenever required.

For this tutorial we will only need [TPI][tpi]. It enables full lifecycle
management of computing resources from AWS, Microsoft Azure, Google Cloud
Platform, and Kubernetes. TPI provisions infrastructure, sync data, and also
executes your scripts -- all via a single configuration file. It has a several
super neat features:

- The configuration for different cloud compute providers is nearly identical,
  so you can easily migrate from one cloud provider to another.
- It syncs data to and from the remote cloud and your local machine.
- It allows you to use low-cost spot instances, and even automatically respawns
  interrupted instances, restoring working directories/data and resuming running
  tasks in the cloud even if you are offline.
- Once your training is complete, the remote resources will be terminated,
  avoiding unused machines quietly ramping up costs.

To start using TPI we need to let Terraform know about it by writing this in our
`main.tf`:

```hcl
terraform {
  required_providers { iterative = { source = "iterative/iterative" } }
}
provider "iterative" {}
```

Once we describe what providers we need, run

```dvc
$ terraform init
```

<admon type="info">

If you have cloned the example repository, you should run this command before
doing anything else. This will initialize your working directory and download
the required provider(s).

</admon>

<admon type="tip">

It's probably also a good idea to set the logging level to see helpful info on
progress:

```dvc
$ export TF_LOG_PROVIDER=INFO
```

</admon>

## Configuring `iterative_task`

TPI offers a single resource called `iterative_task` that we'll need to
configure. This resource will:

1. Create cloud resources (storage, machines) for the task.
2. If specified, upload a local working directory to the cloud storage.
3. Run the given script in the cloud until completion, error, or timeout.
4. If specified, download output results.
5. Automatically terminate compute resources upon task completion.

This is exactly what we need to run a model training process! Let's see the
`iterative_task` in the `main.tf` file before delving into the details:

```hcl
terraform {
  required_providers { iterative = { source = "iterative/iterative" } }
}
provider "iterative" {}

resource "iterative_task" "example-basic" {
  cloud   = "aws"    # or any of: gcp, az, k8s
  machine = "m"      # medium. Or any of: l, xl, m+k80, xl+v100, ...
  spot    = 0        # auto-price. Default -1 to disable, or >0 for hourly USD limit
  timeout = 24*60*60 # 24h
  image   = "ubuntu"

  storage {
    workdir = "src"
    output  = "results-basic"
  }
  environment = { TF_CPP_MIN_LOG_LEVEL = "1" }
  script = <<-END
    #!/bin/bash
    sudo apt-get update -q
    sudo apt-get install -yq python3-pip
    pip3 install -r requirements.txt tensorflow-cpu==2.8.0
    python3 train.py --output results-basic/metrics.json
  END
}
```

Every Terraform resource needs a name; here it's `example-basic`. This name is
only used within the configuration file and it can be whatever you want. Inside
of the resource block, we specify some arguments:

- _cloud_ (**required**): cloud provider to run the task on. This can be `aws`,
  `gcp`, `az`, or `k8s`.
- _machine_: if you know the exact kind of machine that you'd like to use, you
  can specify it here. Alternatively,
  [TPI offers some common machine types](https://registry.terraform.io/providers/iterative/iterative/latest/docs/resources/task#machine-type)
  which are roughly the same for all supported clouds. For example, `m+t4` means
  "Medium, with (at least) 4 CPU cores, 16 GB RAM, and 1 NVIDIA Tesla T4 GPU
  device".
- _spot_: set the
  [spot instance price](https://aws.amazon.com/ec2/spot/pricing/). Here we use
  `0` for automatic pricing, which should keep costs down. Alternatively you can
  specify a positive number to set a maximum bidding price in USD per hour, or
  `-1` to use on-demand pricing.
- _timeout_: maximum time to run before the instance is force-terminated. This
  prevents forgotten long-running instances draining your budget.
- _image_: the container to use (in our case, Ubuntu LTS 20.04).
- _workdir_: a directory on your local machine relative to your project folder
  which you would like to upload with the remote machine. This way you can share
  your whole project or parts of it with a remote machine.
- _output_: a directory **relative to `workdir`** to download after the task in
  complete.
- _script_ (**required**): this is where TPI's magic happens, i.e. what commands
  to run in `workdir` on the provisioned cloud instance.

<admon type="tip">

See the
[resource arguments documentation](https://registry.terraform.io/providers/iterative/iterative/latest/docs/resources/task#argument-reference)
for a full list.

</admon>

<admon type="warn">

Keep in mind the
[the running costs of AWS EC2 instances](https://aws.amazon.com/ec2/pricing/).
The `machine` used in the example above is not included in the free tier and
will incur charges. Using TPI's `spot` pricing will keep costs to a minimum
(roughly $0.15/hour for `m+t4` on AWS), but not eliminate them entirely.

</admon>

In the simplest scenario, all we need to do on a new machine to run the training
`script` is to set up the Python environment with required libraries. If you
simply want to train your model on a machine with more memory, this may be
enough. However, if you want your training code to leverage GPUs, we can make a
few small tweaks:

## Training with GPU

There are several ways you can leverage GPU devices on a remote machine. You can
install all the required drivers and dependencies "manually" via a script, you
can use an existing Docker image, build your own, or just use the convenient
`nvidia` image pre-packaged with CUDA 11.3 GPU drivers.

```hcl
terraform {
  required_providers { iterative = { source = "iterative/iterative" } }
}
provider "iterative" {}

resource "iterative_task" "example-gpu" {
  cloud   = "aws"
  machine = "m+t4"   # 4 CPUs and an NVIDIA Tesla T4 GPU
  spot    = 0
  timeout = 24*60*60
  image   = "nvidia" # has CUDA GPU drivers

  storage {
    workdir = "src"
    output  = "results-gpu"
  }
  environment = { TF_CPP_MIN_LOG_LEVEL = "1" }
  script = <<-END
    #!/bin/bash
    sudo apt-get update -q
    sudo apt-get install -yq python3-pip
    pip3 install -r requirements.txt tensorflow==2.8.0
    python3 train.py --output results-gpu/metrics.json
  END
}
```

## Ready… Set… Apply!

Whether you want to go with the basic example, or the GPU-enabled training, you
can run:

```dvc
$ terraform apply
```

to review what steps Terraform is going to take to provision your desired
infrastructure. Don't worry, nothing is actually done at this point, but it's a
good way to check for potential issues in the configuration. You'll need to type
`yes` to confirm.

At this point you can go offline, get a cup of your preferred beverage, and let
TPI work its magic together with Terraform. They will allocate a remote machine
for you, upload you data and script, and run your code. Once the script
finishes, the machine will be terminated.

You can monitor what's going on at any point by running:

```dvc
$ terraform refresh
$ terraform show
```

This will print the logs and script's output. Once you see that the task has
successfully finished, run:

```dvc
$ terraform destroy
```

to sync back your shared files and tear down all remote objects managed by your
configuration. If you output results (e.g. `results-gpu/metrics.json`), they'll
be synced back to your local machine.

Now if you want to try another experiment, you can change your code, run
`terraform apply` again, and when the training is finished, commit your code
together with the updated results. This can help you move from prototyping
locally to leveraging more powerful cloud instances without the hassle of full
MLOps setup. At the same time, once you're ready to start working on your
[production pipelines and CI/CD](https://dvc.org/doc/use-cases/ci-cd-for-machine-learning),
this `main.tf` codification should also make the transition smoother.

In this tutorial we covered the simplest example with no GPU, and one with GPUs.
In many cases, deploying your pipelines would be easier with your own Docker
image (both for prototyping and for production) and CI/CD workflows. If you'd
like to learn how to create your own Docker images and use them with TPI, see
[part 2](/blog/local-experiments-to-cloud-with-tpi-docker) of this blog post!

---

📰 [Join our Newsletter](https://share.hsforms.com/1KRL5_dTbQMKfV7nDD6V-8g4sbyq)
to stay up to date with news and contributions from the Community!
