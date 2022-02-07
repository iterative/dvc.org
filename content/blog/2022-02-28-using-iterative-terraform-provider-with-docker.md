---
title: Using Iterative Terraform Provider with Docker
date: 2022-02-28
description: >
  In this tutorial you'll learn how you can move use an existing Docker image
  with  Iterative Terraform Provider, as well as build your own Docker image.
descriptionLong: >
  In this tutorial you'll learn how you can move use an existing Docker image
  with  Iterative Terraform Provider, as well as build your own Docker image.
picture: 2022-02-28/unsplash-containers.jpg
author: maria_khalusova
#  todo: commentsUrl:
tags:
  - MLOps
  - Iterative Terraform Provider
  - AWS
  - Docker
---

Recently we have
[published a tutorial](2022-01-15-moving-local-experiments-to-the-cloud-with-iterative-terraform-provider.md)
that demonstrated how you can move a machine learning experiment from a local
computer to a more powerful cloud machine with some help from the
[Iterative Terraform Provider](https://registry.terraform.io/providers/iterative/iterative/latest).
We've talked about [Terraform](https://www.terraform.io), Iterative Terraform
Provider and how you can configure the `iterative_task` resource to provision
infrastructure, sync data and run your training script.

To make it easy to get started, we used a pre-configured
[Deep Learning AMI from AWS](https://aws.amazon.com/machine-learning/amis/) to
simplify the environment setup. In most cases, however, instead of using a
pre-configured Deep Learning AMI, you will ship your environment to a remote
machine using [Docker](https://www.docker.com) which has become an essential
tool not only in traditional software development, but also in machine learning.
If you're not sure why it would be a good idea to use Docker for machine
learning development, check out
[this article from AWS](https://aws.amazon.com/blogs/opensource/why-use-docker-containers-for-machine-learning-development/)
that should answer this question for you. As a side note, using Docker to
encapsulate your environment doesn't mean you won't be using AMIs at all. In
fact, AMI (Amazon Machine Image) is actually a required component of setting up
an EC2, and at the minimum you will need an Ubuntu distribution AMI (which is a
configurable default for the `iterative_task`). However, we will use Docker for
the machine learning specific setup: drivers, GPU-specific libraries for
accelerated math, and Python libraries. This separation will not only give you
more control over the versions of the frameworks that you choose to use (or not
use), but also over the cloud provider you provision the resources with. Your
Docker image is cloud provider agnostic.

If you have a DevOps team, they can build a Docker image suited for your needs,
so you'll only need to use it in your `iterative_task` script. We'll show you
how to do this in the first part of this tutorial. But if you need (or want) to
build your own Docker image, we've got you too! The second part of this tutorial
will illustrate some basics required for building and using your own Docker
image. Without further ado, let's get into it!

## Setting up environment for utilizing GPUs with Docker

If you haven't read the
[previous tutorial](2022-01-15-moving-local-experiments-to-the-cloud-with-iterative-terraform-provider.md)
yet and are not familiar with Terraform, I would encourage you to check it out
and learn some basics, i.e. how to let Terraform know that you'll be using the
Iterative Provider, how to initialize the working directory with
`terraform init`, how to use other essential Terraform commands (`plan`,
`apply`, `refresh`, `show`, `destroy`). All these will apply here, we'll only
modify the script part of the `main.tf`.

Let's say we have a DevOps team that has carefully prepared a Docker image
suitable for data science and machine learning. To illustrate this, we can use a
publicly available CML Docker image (`docker://iterativeai/cml`) provided by
Iterative. This image comes loaded with Python, CUDA, git, node and other
essentials for full-stack data science. There are
[several versions of this image](https://cml.dev/doc/self-hosted-runners#docker-images),
but for this example we'll take `docker://iterativeai/cml:0-dvc2-base1-gpu`,
which includes Ubuntu 20.04, Python 3.8 (CUDA 11.0.3, CuDNN 8).

Here's what the script is going to look like:

```hcl
   script = <<-END
   #!/bin/bash
   sudo apt update -qq && sudo apt install -yqq software-properties-common build-essential ubuntu-drivers-common
   sudo ubuntu-drivers autoinstall
   sudo curl -fsSL https://get.docker.com | sudo sh -
   sudo usermod -aG docker ubuntu
   sudo setfacl --modify user:ubuntu:rw /var/run/docker.sock
   curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
   curl -s -L https://nvidia.github.io/nvidia-docker/ubuntu20.04/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
   sudo apt update -qq && sudo apt install -yqq nvidia-docker2
   sudo systemctl restart docker

   nvidia-smi
   docker run --rm --gpus all -v "$PWD:/tpi" -w /tpi iterativeai/cml:0-dvc2-base1-gpu \
       /bin/bash -c "pip install -r requirements.txt; python src/train.py"
   END
```

As you can see, we still need to make sure to install the required drivers
first. Then in order to use a Docker image, we'll need to install Docker itself,
and sort out users, groups and permissions. Next, we'll install the
`nvidia-docker` that will enable us to run GPU-accelerated Docker containers.
Yes, GPUs will make you work for them before you can enjoy the accelerated
training!

Finally, we can use Iterative's image to run our own container with this line:

```
docker run --rm --gpus all -v "$PWD:/tpi" -w /tpi iterativeai/cml:0-dvc2-base1-gpu \
  /bin/bash -c "pip install -r requirements.txt; python src/train.py"
```

Let's unpack this line.

- `docker run`: this command will essentially create a container from the
  specified image, and then let us use it.
- `--rm` flag will make Docker automatically clean up the container and remove
  the file system when the container exits,
- `--gpus all` will allow us to use GPUs of the host machine from the container
- `-v "$PWD:/tpi"`: the Docker container we'll be running is only aware of what
  is included inside of it, and it doesn't have our training script nor the data
  which we synced to the host machine. How do we pass the data and the training
  code into the Docker container? We can do it by mounting a volume. The `-v`
  flag lets you configure a volume, and has the following structure:
  `-v "[path on the host machine to files to be shared with Docker container]:[the path where the directory is mounted in the container]"`
- `iterativeai/cml:0-dvc2-base1-gpu`: full name of the Docker image including
  the tag
- `/bin/bash -c "cd /tpi; pip install -r requirements.txt; python src/train.py"`:
  bash commands to run inside of the container. We'll need to navigate to the
  mounted volume, install the dependencies and launch the training script.

Now if we've initialized the working directory, we can call `terraform apply` to
provision infrastructure, sync data and code to it, set up the environment, and
run the training process. If you’d like to tinker with this example you can
[find it on GitHub](https://github.com/iterative/blog-tpi-bees/blob/docker-examples/main.tf).

## Building your own Docker image

Suppose, we wanted our Docker container to include all the Python libraries
required to run our training pipeline? Well, these would be quite specific to
our project, so we'd have to build our own Docker image. Luckily we don't have
to build one completely from scratch, instead we can use one of the existing
publicly available images as a base to build on top of.

For this example, let's use `nvidia/cuda:11.3.0-cudnn8-runtime-ubuntu20.04` from
NVIDIA. Earlier, we didn't need to install Docker on the local machine because
it was only used on the cloud machine, but if you're going to build your own
image, you'll need to start by
[installing Docker locally](https://docs.docker.com/get-docker/).

To build an image, create a file called `Dockerfile` in your project's root
directory. This is a text-based script of instructions that will be used to
create a container image. In our case it'll be quite simple as most of the
complex setup is taken care of by NVIDIA's image we're using as a base:

```
FROM --platform=linux/amd64 nvidia/cuda:11.3.0-cudnn8-runtime-ubuntu20.04

# Install wget and python
RUN apt-get update && apt-get install -y wget python3-pip

# Add the required packages to the environment
COPY requirements.txt .
RUN pip3 install -r requirements.txt && rm requirements.txt

WORKDIR /tpi
```

Unlike Terraform, where you had a declarative description of the desired
infrastructure in the main.tf, `Dockerfile` is a script, so the order of the
steps matters. The `FROM` instruction sets the base image for subsequent
instructions, and it is a required first instruction. To execute commands in a
new layer on top of the current image and commit the results, we use the `RUN`
instruction. The resulting committed image will be used for the next step in the
`Dockerfile`.

To install the project-specific Python packages, we'll need to copy the
`requirements.txt` to the filesystem of the container, and we can do this with
the `COPY` instruction. Then we'll use `RUN` again to install them.

Finally, with `WORKDIR` we can specify what we want to call the directory inside
the container where we'll run things inside the container.

To build your own image locally use the following command:
`docker build -t bees:latest .`, where `bees` is the name of my Docker image but
you can name yours however you like.

Hooray! We've got our own Docker image, but we're not done just yet. To use this
image from the Terraform config file, we should publish it on
[Docker Hub](https://hub.docker.com/). Your company may already have a business
account for Docker Hub, but if you're learning Docker and want to try it as an
individual, you can create your own free
[personal account here](https://hub.docker.com/).

Once you have ayour account,

1. Log in to the Docker public registry on your local machine from command line
   with `docker login`.
2. Tag your image (aka give it a name):
   `docker tag bees [YOUR_DOCKERHUB_ID]/bees:bees`.
3. Publish the image: `docker push [YOUR_DOCKERHUB_ID]/bees:bees`

Once complete, this bees image becomes publicly available which means we can now
use it in our Terraform config, and it is going to be nearly identical to the
previous example:

```hcl
terraform {
   required_providers { iterative = { source = "iterative/iterative"} }
}
provider "iterative" {}

resource "iterative_task" "tpi-docker-examples" {
   name      = "tpi-docker-examples"
   cloud     = "aws"
   region    = "us-east-2"
   machine   = "m+k80"
   workdir { input = "." }

   script = <<-END
   #!/bin/bash
   sudo apt update -qq && sudo apt install -yqq software-properties-common build-essential ubuntu-drivers-common
   sudo ubuntu-drivers autoinstall
   sudo curl -fsSL https://get.docker.com | sudo sh -
   sudo usermod -aG docker ubuntu
   sudo setfacl --modify user:ubuntu:rw /var/run/docker.sock
   curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
   curl -s -L https://nvidia.github.io/nvidia-docker/ubuntu20.04/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
   sudo apt update -qq && sudo apt install -yqq nvidia-docker2
   sudo systemctl restart docker

   nvidia-smi

   docker run --rm --gpus all -v "$PWD":/tpi [YOUR_DOCKERHUB_ID]/bees:bees python3 src/train.py
   END
}
```

Note how we are mounting the volume to the working directory that we have
specified when creating an image. This is not strictly required, but makes
things neat and tidy. Find this example together with the Dockerfile in this
[GitHub repo](https://github.com/iterative/blog-tpi-bees/tree/own-docker-image).

Now you know the basics of using Docker images together with Iterative Terraform
Provider for provisioning your MLOps infrastructure, and you can start building
your own Docker images too! Hope you found this tutorial useful, now it's time
to build great things!
