---
title:
  Moving Local Experiments to the Cloud with Terraform Provider Iterative (TPI)
date: 2022-04-26
description: >
  Tutorial for easily moving a local ML experiment to a remote cloud machine
  with the help of Terraform Provider Iterative.
descriptionLong: >
  In this tutorial, learn how to move a local machine learning experiment to a
  remote cloud machine on AWS with the help of Terraform Provider Iterative.
picture: 2022-04-26/massimiliano-latella-6ufBhNungOk-unsplash.jpg
author: maria_khalusova
#  todo: commentsUrl:
tags:
  - MLOps
  - TPI
  - AWS
---

There's a number of good reasons why one might want to train a machine learning
model locally. It's quick and easy to set up a new project on a local machine.
This is also sufficient for simple experiments (with reduced data subsets or
small models) without paying to rent heavy cloud compute resources. A local
machine is also deeply familiar -- as opposed to the multitude of available
cloud services, which can be intimidating even with a decent background in
DevOps.

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
the images, created a project, and trained a CNN model locally to classify
different subspecies. If you want to follow along, you can use your own data and
training code, or clone [the example repository][tpi-bees].

[tpi-bees]: https://github.com/iterative/blog-tpi-bees

Let's say that we would like to continue iterating on our model in the cloud.
Run more epochs overnight? Change some hyperparameters? Add more layers? The
first question when planning _The Big Move_ is "what dependencies are needed to
train this model in a cloud environment?"

Some of the important puzzle pieces you already have locally. These are:

- Your training code. It is likely that you have a
  [whole pipeline](https://dvc.org/doc/start/data-pipelines) with multiple
  stages but for the sake of simplicity, this tutorial uses a single `train.py`
  script.
- Data.
- Python environment with all required libraries.

You will also need an account with your cloud provider of choice. In this
tutorial we'll be provisioning infrastructure on Amazon Web Services (AWS). You
can create an AWS account yourself, or ask your DevOps team to provide you with
one.

☞ Make sure to insert
[authentication credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)
into your system's environment variables (`AWS_ACCESS_KEY_ID` and
`AWS_SECRET_ACCESS_KEY`).

We can now start the move with the help of Terraform and the Iterative Provider.

## What is Terraform?

[Terraform](https://www.terraform.io) is an open-source infrastructure-as-code
tool that you should [download and install](https://www.terraform.io/downloads).
Terraform requires you to create a configuration file containing a declarative
description of the infrastructure you need. There's no need to read lots of
cloud documentation nor write lots of commands. Instead, you describe what your
infrastructure should ultimately look like. Behind the scenes, Terraform will
figure out what needs to be done. If you've cloned the [repository][tpi-bees],
the `main.tf` configuration file is in the project's root.

## Terraform Provider Iterative

Terraform can orchestrate a plethora of various resources for you, but for the
majority of projects you only need a few. Instead of shipping plugins
(providers) for all these resources in one bundle, Terraform downloads
[_providers_](https://www.terraform.io/docs/extend/how-terraform-works.html)
whenever required. For this tutorial we will only need the
[TPI](https://registry.terraform.io/providers/iterative/iterative/latest). It
enables full lifecycle management of computing resources from AWS, Microsoft
Azure, Google Cloud Platform, and more.

The Iterative Provider has a several super neat features:

- The configuration for different cloud compute providers is nearly identical,
  so you can easily migrate from one cloud provider to another.
- It provisions infrastructure and also executes your scripts on it -- all via a
  single configuration file.
- It helps to sync data between your local machine and a remote one.
- Once your training is complete, the remote resources will be terminated,
  avoiding unused machines quietly ramping up costs.

To start using the Iterative Provider we need to let Terraform know about it by
adding the following in our `main.tf`:

```hcl
terraform {
  required_providers {
    iterative = { source = "iterative/iterative", version = ">= 0.9.9" }
  }
}
provider "iterative" {}
```

Once you describe what providers you'll be using in your `main.tf`, run the

```
terraform init
```

command. If you have cloned the example repository, you should run this command
before doing anything else. This will initialize your working directory and
download the required provider.

## Configuring `iterative_task`

The Iterative Provider offers a single resource called `iterative_task` that
we'll need to configure. This resource will:

1. Create cloud resources (storage, machines) for the task.
2. If specified, upload a directory to the cloud storage.
3. Run the given script until completion or timeout in the cloud.
4. Download results.
5. Automatically terminate compute resources upon task completion.

This is exactly what we need to run a model training process! Let's see how we
can configure the `iterative_task` in the same `main.tf` file. First, I'll show
you what my configuration file looks like, and then we'll unpack what's going on
here:

```hcl
terraform {
  required_providers {
    iterative = { source = "iterative/iterative", version = ">= 0.9.9" }
  }
}
provider "iterative" {}

resource "iterative_task" "example-basic" {
  cloud     = "aws"
  region    = "us-west"
  machine   = "l+k80"
  spot      = 0

  storage {
     workdir = "."
     output  = "shared"
  }
  script = <<-END
    #!/bin/bash
    sudo apt update
    sudo apt install -y python3-pip
    pip3 install -r requirements.txt
    python3 src/train.py
  END
}
```

Every Terraform resource needs a name, and mine is called `example-basic` here.
This name is only used within the configuration file and it can be whatever you
want. Inside of the resource block, we specify some arguments:

- _name_ (**required**): this is a name that will be used to set up the cloud
  resources, and it does not have to be the same as the `iterative_task` name.
  However, try to make it unique, it shouldn’t be in conflict with names of
  existing cloud resources.
- _cloud_ (**required**): cloud provider to run the task on. This can be `aws`,
  `gcp`, `az`, or `k8s`.
- _region_: you can choose the region where the compute resources should be
  allocated.
- _machine_: if you know the exact kind of machine that you'd like to use, you
  can specify it here. Alternatively, Terraform Provider Iterative offers some
  common machine types which are roughly the same for all supported clouds. For
  example,
  [l+k80](https://registry.terraform.io/providers/iterative/iterative/latest/docs/resources/task#l+k80)
  stands for a "Large, with (at least) 12 CPU cores, 112 GB of RAM and 2 NVIDIA
  Tesla K80 GPU devices".
- _spot_: set the
  [spot instance price](https://aws.amazon.com/ec2/spot/pricing/). Here I set it
  to `0` to use TPI's automatic price, which should keep costs down.
  Alternatively you can specify a positive number to set a maximum bidding price
  in USD per hour, or `-1` to use on-demand pricing.
- _workdir_: specify a directory on your local machine relative to your project
  folder which you would like to sync with the remote machine. This way you can
  share your whole project or parts of it with a remote machine. In my example,
  I am sharing the whole project.
- _script_ (**required)**: this is where the Iterative Provider's magic happens,
  i.e. this is where we define a script that should be run on a provisioned
  machine.

See the
[resource arguments documentation](https://registry.terraform.io/providers/iterative/iterative/latest/docs/resources/task#argument-reference)
for a full list.

<admon type="warn">

Be aware of
[the costs associated with AWS EC2 instances](https://aws.amazon.com/ec2/pricing/).
The machine used in the example above is not included in the free tier and will
incur charges. Using TPI's spot pricing will keep costs to a minimum, but not
eliminate them entirely.

</admon>

In the simplest scenario, all we need to do on a new machine to run the training
`script` is to set up the Python environment with required libraries. If you
simply want to train your model on a machine with more memory, this may be
enough. However, if you want your training code to leverage GPUs, the script
will look a bit different.

## Training with GPU

There are several ways you can leverage GPU devices on a remote machine. You can
install all the required drivers and dependencies "manually" via a script, you
can use an existing Docker image or build your own, or, in the case of AWS, you
can take advantage of an
[existing pre-configured Deep Learning AMI](https://docs.aws.amazon.com/dlami/latest/devguide/options.html).
In this tutorial, we'll use an AMI, as it is the quickest way to start using
GPUs on an AWS EC2 machine. An AMI can be selected using the `image` argument
using the format `{user}@{owner}:{architecture}:{name}`. See the official
[AMI documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html)
to learn more.

```hcl
...
resource "iterative_task" "example-gpu" {
  cloud     = "aws"
  region    = "us-east-2"
  machine   = "l+k80"
  spot      = 0
  disk_size = 130
  # see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html for images
  image     = "ubuntu@898082745236:x86_64:Deep Learning AMI (Ubuntu 18.04) Version 54.0"

  storage {
        workdir = "."
        output = "shared"
  }

  script = <<-END
    #!/bin/bash
    pip3 install -r requirements.txt
    python3 src/train.py
  END
}
```

The Deep Learning image that you choose may require larger disk size than the
provided default, so you may need to increase it. The image I picked expects a
volume of at least 130 GB, and I can configure this in the `disk_size` argument.

You may also notice that my script got a bit shorter. This is because I no
longer need to install Python, and only need to make sure to have my
requirements met.

## Ready… Set… Apply!

Whether you want to go with the basic example, or the GPU-enabled training, you
can run

```
terraform plan
```

to review what steps Terraform is going to take to make your desired
infrastructure materialize. Don't worry, nothing is actually done at this point,
but it's a good way to check for potential issues in the configuration.

If there are no issues, run

```
terraform apply
```

to execute the actions proposed in the Terraform plan. You'll need to type `yes`
to confirm that you indeed would like the plan to be executed.

At this point you can get a cup of your favourite beverage, and let the
Iterative Provider work its magic together with Terraform. They will allocate a
remote machine for you, set up the environment and run your `train.py`. Once the
script finishes, the machine will be terminated.

You can monitor what's going on by running

```
terraform refresh && terraform show
```

Once you see that the task has successfully finished, go ahead and run

```
terraform destroy
```

to destroy all remote objects managed by your configuration and sync back your
shared files. If you write metrics to a file (e.g. `metrics.json`), then you'll
get the new metrics synced back to your local machine.

Now if you want to try another experiment, you can change your code, run
`terraform apply` again, and when the training is finished, commit your code
together with the updated `metrics.json`. This can help you move from
prototyping locally to leveraging more powerful cloud machines without the
hassle of full MLOps setup. At the same time, once you're ready to start working
on your
[production pipelines and CI/CD](https://dvc.org/doc/use-cases/ci-cd-for-machine-learning),
this should also make the transition smoother.

In this tutorial we have covered the simplest example with no GPU, and one that
involves leveraging GPUs with the help of a pre-configured Deep Learning AMI. In
many cases, productionizing your workflows would require creating your own
Docker image that you could use both for prototyping and for CI/CD workflows. If
you'd like to learn how to create your own Docker images and use them with the
Iterative Terraform provider, let us know and we'll write another tutorial about
that!
