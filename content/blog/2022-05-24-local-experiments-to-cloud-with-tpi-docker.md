---
title:
  Moving Local Experiments to the Cloud with Terraform Provider Iterative (TPI)
  and Docker
date: 2022-02-28
description: >
  Tutorial for easily running experiments in the cloud with the help of
  Terraform Provider Iterative (TPI) and Docker.
descriptionLong: >
  In this tutorial, learn how to build a Docker image and use it to run
  experiments in the cloud with Terraform Provider Iterative (TPI).
picture: 2022-02-28/unsplash-containers.jpg
author: maria_khalusova
#  todo: commentsUrl:
tags:
  - MLOps
  - TPI
  - AWS
  - Docker
  - Terraform
  - Git
  - Python
  - Tutorial
  - Cloud orchestration
  - Spot instance management
---

We recently [published a tutorial][bees-part-1] on using [Terraform Provider
Iterative (TPI)][tpi] to move a machine learning experiment from your local
computer to a more powerful cloud machine. We've covered how you can use
[Terraform](https://www.terraform.io) & TPI to provision infrastructure, sync
data, and run training scripts. To simplify the setup, we used a pre-configured
[Ubuntu/NVIDIA image](https://registry.terraform.io/providers/iterative/iterative/latest/docs/resources/task#machine-image).
However, instead of using a pre-configured image, we can use custom
[Docker](https://www.docker.com) images. These are often
[recommended in machine learning](https://aws.amazon.com/blogs/opensource/why-use-docker-containers-for-machine-learning-development/)
as well as in traditional software development.

[bees-part-1]: /blog/local-experiments-to-the-cloud-with-tpi
[tpi]: https://github.com/iterative/terraform-provider-iterative

<admon type="info">

Using Docker to manage dependencies (e.g. Python packages) does not remove all
other setup requirements. You'll still need docker itself installed, as well as
GPU runtime drivers if applicable. Happily, TPI sets these up by default.

</admon>

Separation of dependencies into Docker images will give you more control over
the software versions, and also makes it trivial to switch between cloud
providers -- currently Amazon Web Services (AWS), Microsoft Azure, Google Cloud
Platform, and Kubernetes. Your Docker image is cloud provider-agnostic. There
are thousands of [pre-defined Docker images online](https://hub.docker.com/)
too.

In the first part of this tutorial, we'll use an existing Docker image. The
second part of this tutorial will then cover some basics for building and using
your own Docker images.

## Run GPU-enabled Docker containers

<admon type="warn">

If you haven't read the [previous tutorial][bees-part-1], you should check out
the basics there first. This includes how to let Terraform know about TPI, and
essential commands (`init`, `apply`, `refresh`, `show`, and `destroy`).

</admon>

The only modification from the [previous tutorial][bees-part-1] is the script
part of the `main.tf` config file.

Let's say we've found a carefully prepared a Docker image suitable for data
science and machine learning -- in this case,
[`iterativeai/cml:0-dvc2-base1-gpu`](https://cml.dev/doc/self-hosted-runners#docker-images).
This image comes loaded with Ubuntu 20.04, Python 3.8, NodeJS, CUDA 11.0.3,
CuDNN 8, Git, [CML](https://cml.dev), [DVC](https://dvc.org), and other
essentials for full-stack data science.

Our `script` block is now:

```hcl
script = <<-END
  #!/bin/bash
  docker run --gpus all -v "$PWD:/tpi" -w /tpi -e TF_CPP_MIN_LOG_LEVEL \
    iterativeai/cml:0-dvc2-base1-gpu /bin/bash -c "
  pip install -r requirements.txt tensorflow==2.8.0
  python train.py --output results-gpu/metrics.json
  "
END
```

Yes, it's quite long for a one-liner. Let's looks at the components:

- `docker run`: Download the specified image, create a container from the image,
  and run it.
- `--gpus all`: Expose GPUs to the container.
- `-v "$PWD:/tpi"`: Expose our current working directory (`$PWD`) within the
  container (as path `/tpi`).
- `-w /tpi`: Set the working directory of the container (to be `/tpi`).
- `-e TF_CPP_MIN_LOG_LEVEL`: Expose the environment variable
  `TF_CPP_MIN_LOG_LEVEL` to the container (in this case to control TensorFlow's
  verbosity).
- `iterativeai/cml:0-dvc2-base1-gpu`: The image we want to download & run a
  container from.
- `/bin/bash -c "pip install -r requirements.txt ... python train.py ..."`:
  Commands to run within the container's working directory. In this case,
  install the dependencies and run the training script.

We can now call `terraform init` and `terraform apply` to provision
infrastructure, sync data and code to it, set up the environment, and run the
training process. If you'd like to tinker with this example you can
[find it on GitHub](https://github.com/iterative/blog-tpi-bees/tree/docker).

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
