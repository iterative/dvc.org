---
title:
  Moving Local Experiments to the Cloud with Terraform Provider Iterative (TPI)
  and Docker
date: 2022-05-24
description: >
  Tutorial for easily running experiments in the cloud with the help of
  Terraform Provider Iterative (TPI) and Docker.
descriptionLong: >
  In this tutorial, learn how to use Docker images to run experiments in the
  cloud with Terraform Provider Iterative (TPI).
picture: 2022-05-19/tpi-docker-header.png
author: casper_dcl
commentsUrl: https://discuss.dvc.org/t/moving-local-experiments-to-the-cloud-with-terraform-provider-iterative-tpi/1190
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

[bees-part-1]: /blog/local-experiments-to-cloud-with-tpi
[tpi]: https://github.com/iterative/terraform-provider-iterative

<admon type="info">

Using Docker to manage dependencies (e.g. Python packages) does not remove all
other setup requirements. You'll still need Docker itself installed, as well as
GPU runtime drivers if applicable. Happily, TPI sets up all of this by default.

</admon>

When confronted with cloud infrastructure and dependencies, people often think
"oh no, not again" (much
[like the petunias](https://www.youtube.com/watch?v=THSY7-CxKnQ) in the cover
image). To solve this, separating dependencies into Docker images gives more
control over software versions, and also makes it painless to switch between
cloud providers -- currently Amazon Web Services (AWS), Microsoft Azure, Google
Cloud Platform, and Kubernetes. Your Docker image is cloud provider-agnostic.
There are thousands of
[pre-defined Docker images online](https://hub.docker.com/) too.

In this tutorial, we'll use an existing Docker image that comes with most of our
requirements already installed. We'll then add add a few more dependencies on
top and run our training pipeline in the cloud as before!

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

We can now call `terraform init`, `export TF_LOG_PROVIDER=INFO`, and
`terraform apply` to provision infrastructure, upload our data and code, set up
the cloud environment, and run the training process. If you'd like to tinker
with this example you can
[find it on GitHub](https://github.com/iterative/blog-tpi-bees/tree/docker).

<admon type="tip">

Don't forget to `terraform refresh && terraform show` to check the status, and
`terraform destroy` to download results & shut everything down.

</admon>

Now you know the basics of using convenient Docker images together with
[TPI][tpi] for provisioning your MLOps infrastructure!

<admon type="tip">

If you have a lot of custom dependencies that rarely change (e.g. a large
`requirements.txt` that is rarely updated), it's a good idea to build it into
your own custom Docker image. Let us know if you'd like a tutorial on this!

</admon>
