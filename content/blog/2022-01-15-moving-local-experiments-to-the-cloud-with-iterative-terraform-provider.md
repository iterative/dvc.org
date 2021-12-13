---
title: Moving Local Experiments to the Cloud with Iterative Terraform Provider
date: 2022-01-15
description: >
  In this tutorial you'll learn how you can move a locally run machine learning
  experiment to a remote machine on AWS with the help of Iterative Terraform
  Provider.
descriptionLong: >
  In this tutorial you'll learn how you can move a locally run machine learning
  experiment to a remote machine on AWS with the help of Iterative Terraform
  Provider.
picture: 2022-01-15/massimiliano-latella-6ufBhNungOk-unsplash.jpg
author: maria_khalusova
#  todo: commentsUrl:
tags:
  - MLOps
  - Iterative Terraform Provider
  - AWS
---

There's a number of good reasons one might want to train a machine learning
model locally. It's quick and easy to set up a new project on a local machine,
you don't have to worry about how much money you'll spend while using this
compute resource, your data may be small or you start with a sample, you may
want to start with simple models initially, etc. On top of that, a local machine
is just deeply familiar, as opposed to the multitude of available cloud services
which can be intimidating unless you have a decent background in DevOps.

Once you set up everything locally, and iterate through your code and
experiments enough times, you may come to a point where you have a need for a
more powerful compute resource to train a larger model, use more data, or both.
In other words, you may need to switch from training a model locally to training
it in a cloud environment. If you find yourself in this situation, I hope this
tutorial will help you by showing how to provision cloud infrastructure with
Terraform and run your existing training script on it.

## Getting Started

For this tutorial I have picked
[The BeeImage Dataset: Annotated Honey Bee Images](https://www.kaggle.com/jenny18/honey-bee-annotated-images)
that contains 5,100+ bee images annotated with location, date, time, subspecies,
health condition, caste, and pollen. I've downloaded the images, created a
project and trained a simple CNN model locally to classify different subspecies.
If you want to follow along, you can use your own data and training code, or
clone [my repo from GitHub](https://github.com/MKhalusova/bees).

Let's pretend that the model I trained is good enough so that I would like to
continue iterating on it in the cloud. Run more epochs? Change some
hyperparameters? Add more layers? The first question that we should ask
ourselves when we plan The Big Move is what exactly are we going to need to
train this model in a cloud environment?

Some of the important puzzle pieces you already have locally. These are:

- Your training code. It is likely that you have a whole pipeline with multiple
  stages but for the sake of simplicity, mine is just a `train.py` script.
- Data
- Python environment with all required libraries.

In addition to that you will need an account with your cloud provider of choice.
In this tutorial I'll be provisioning infrastructure on AWS. You can create an
AWS account yourself, or ask your DevOps team to provide you with one. Make sure
to
[store your authentication credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)
(`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`) in your system's environment
variables. Once you do, we can start the move with the help of Terraform and the
Iterative Terraform Provider.

## What is Terraform?

[Terraform](https://www.terraform.io) is an open-source infrastructure as code
tool that you'll need to download and install with [homebrew](https://brew.sh/)
for this tutorial: `brew install terraform`. With Terraform, you can create a
configuration file in which you declaratively describe what infrastructure you’d
like to have. This means that you do not need to write the instructions on what
exact steps need to be taken and in which order. Instead, you describe what your
infrastructure should ultimately look like. Behind the scenes, Terraform will
figure out what needs to be done to achieve that. If you've cloned the repo,
you'll find the `main.tf`file in the root of the project - that's where we will
be configuring Terraform.

## Iterative Terraform Provider

Terraform can orchestrate a plethora of various resources for you, but for the
majority of projects you only need a few. That's why instead of shipping all the
integrations in one bundle, you install a barebones Terraform distribution and
then plug in support for whatever resources you need with so-called providers.
For this tutorial we will only need one provider -
[Iterative Terraform Provider](https://registry.terraform.io/providers/iterative/iterative/latest).
It enables full lifecycle management of computing resources for machine learning
pipelines from AWS, as well as Azure, Google Cloud Platform, and more. The
Iterative Provider has a couple of advantages for machine learning pipelines.
Namely,

- The configuration for various cloud compute providers with Iterative Provider
  will be nearly identical, so you can easily migrate from one cloud provider to
  another, if you want to.
- It is designed not only to provision infrastructure but to execute your
  scripts on it too, all via a single configuration.
- It helps to share data between your local machine and a remote one.
- Once your training is complete, the remote resources will be terminated
  preventing the situation when an unused machine is left to ramp up the costs.

To start using the Iterative Provider we need to let Terraform know about it by
adding the following in our `main.tf`:

```
terraform {
    required_providers {
        iterative = {
            source = "iterative/iterative",
        }
    }
}

provider "iterative" {}
```

Once you describe what providers you'll be using in your `main.tf`, run the
`terraform init` command. If you have cloned the example repo, you should to run
this command before doing anything else. This will initialize your working
directory containing Terraform configuration file, and download the required
provider.

## Configuring `iterative_task`

The Iterative Provider offers a single resource called `iterative_task` that
we'll need to configure. This resource will:

1. Create cloud resources (storage, machines) for the task.
2. If specified, upload a directory to the cloud storage.
3. Run the given script until completion or timeout in the cloud.
4. Automatically terminate compute resources upon task completion.

This is exactly what we need to run a model training process! Let's see how we
can configure the iterative_task. First, I'll show you what my configuration
file looks like, and then we'll unpack what's going on here:

```
terraform {
    required_providers {
        iterative = {
            source = "iterative/iterative",
        }
    }
}

provider "iterative" {}

resource "iterative_task" "tpi-examples-basic" {
    name      = "tpi-examples-basic "
    cloud     = "aws"
    region    = "us-east-2"
    machine   = "l+k80"
    directory = "."

    script = <<-END
    #!/bin/bash
    sudo apt update
    sudo apt-get install -y software-properties-common build-essential python3-pip
    pip3 install -r requirements.txt
    python3 src/train.py
    END
}
```

Every terraform resource needs a name, and mine is called `tpi-examples-basic`
here. This name is only used within the configuration file and it can be
whatever you want. Inside of the resource block, we specify the resource
arguments:

- _name_ (**required**): this is a name that will be used to set up the cloud
  resources, and it does not have to be the same as the iterative_task name.
  However, try to make it unique, it shouldn’t be in conflict with names of
  existing cloud resources.
- _cloud_ (**required**): cloud provider to run the task on. This can be aws,
  gcp, az, or k8s.
- _region_: you can choose the region where the compute resources should be
  allocated.
- _machine_: if you know the exact kind of machine that you'd like to use, you
  can specify it here. Alternatively, the Iterative Provider offers some common
  machine types which are roughly the same for all supported clouds. For
  example,
  [l+k80](https://registry.terraform.io/providers/iterative/iterative/latest/docs/resources/task#l+k80)
  stands for a "Large, with (at least) 12 CPU cores, 112 GB of RAM and 2 GPU
  devices".
- _directory_: Specify a directory on your local machine relative to your
  project folder which you would like to sync with the remote machine. This way
  you can share your whole project or parts of it with a remote machine. In my
  example, I am sharing the whole project.
- _script_ (**required)**: This is where the Iterative Provider's magic happens,
  i.e. this is where we define a script that should be run on a provisioned
  machine.

Tke a look at the script. In the simplest scenario, all we need to do on a new
machine to run the training script is to set up the Python environment with
required libraries, and run the script. And that's exactly what the script here
does (granted you have a `requirements.txt` file). If you simply want to train
your model on a machine with more memory, this may be enough. However, if you
want your training code to leverage GPUs, the script will look a bit more
complex.

## Training with GPU

Setting up the environment to leverage GPU devices is a bit involved as you need
to make sure you have the required drivers, NVIDIA-docker, and CUDA.

```
resource "iterative_task" "tpi-examples-gpu" {
    name      = "tpi-examples-gpu"
    cloud     = "aws"
    region    = "us-east-2"
    machine   = "l+k80"
    directory = "."

    script = <<-END
    #!/bin/bash
    sudo apt update
    sudo apt-get install -y software-properties-common build-essential ubuntu-drivers-common
    sudo ubuntu-drivers autoinstall

    sudo curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh &&
    sudo usermod -aG docker ubuntu
    sudo setfacl --modify user:ubuntu:rw /var/run/docker.sock
    curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
    curl -s -L https://nvidia.github.io/nvidia-docker/ubuntu20.04/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
    sudo apt update && sudo apt install -y nvidia-docker2
    sudo systemctl restart docker
    rm get-docker.sh

    nvidia-smi
    docker run --rm --gpus all -v "$PWD:/tpi" iterativeai/cml:0-dvc2-base1-gpu \
        /bin/bash -c "cd /tpi; pip install -r requirements.txt; python src/train.py"
    END
}
```

Here, to run my training code I am passing my project's directory as a volume to
a Docker image provided by Iterative (`iterativeai/cml:0-dvc2-base1-gpu`) which
takes care of CUDA.

## Ready… Set… Apply!

Whether you want to go with the basic example, or the GPU-enabled training, you
can run `terraform plan` to review what steps Terraform is going to take to make
your desired infrastructure materialize. Don't worry, nothing is actually done
at this point, but it's a good way to check for potential issues in the
configuration.

If there are no issues, run `terraform apply` to execute the actions proposed in
the Terraform plan. You'll need to type `yes` to confirm that you indeed would
like the plan to be executed.

At this point you can get a cup of your favourite beverage, and let the
Iterative Provider work its magic together with Terraform. They will allocate a
remote machine for you, set up Docker, pull required images, install missing
drivers, and finally run your `train.py`. Once the script finishes, the machine
will be terminated.

You can monitor what's going on by running
`terraform refresh && terraform show`. Once you see that the task has
successfully finished, go ahead and run `terraform destroy` to destroy all
remote objects managed by your configuration and sync back your shared files. If
you write metrics to a file, then you'll get the new metrics synced back to your
local machine.

Now if you want to try another experiment, you can change your code, run
`terraform apply` again, and when the training is finished, commit your code
together with the updated metrics.json. This can help you move from prototyping
locally to leveraging more powerful cloud machines without the hassle of full
MLOps setup. At the same time, once you're ready to start working on your
production pipelines and CI/CD, this should also make the transition smoother.

In this tutorial we have covered the simplest example with no GPU or Docker, and
one that involves leveraging GPUs with the help of `nvidia-docker` and
`iterativeai/cml:0-dvc2-base1-gpu`. In many cases, the next step in
productionizing your workflows would be creating your own Docker image that you
could use both for prototyping and for CI/CD workflows. If you'd like to learn
how to create your own Docker images and use them with the Iterative Terraform
provider, let us know and we'll write another tutorial about that!
