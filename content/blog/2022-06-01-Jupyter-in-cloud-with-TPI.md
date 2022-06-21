---
title: Jupyter Notebooks in any cloud with TPI
date: 2022-06-01
description: >
  Use TPI to quickly and cheaply provision a cloud-hosted Jupyter server to run
  your notebooks on.
descriptionLong: >
  We can use TPI to quickly and cheaply provision cloud instances. This guide
  will explore how to use TPI to launch a Jupyter server on an Amazon Web
  Services EC2 instance at the lowest possible cost. This bring-your-own-cloud
  approach can launch instances on Google Cloud, Microsoft Azure, or Kubernetes
  with minor modifications.
picture: 2022-06-01/tpi-jupyter-cover.jpeg
author: rob_dewit
# commentsUrl: TODO
tags:
  - TPI
  - Jupyter Notebook
  - Cloud
  - AWS
---

<admon type="info">

I based this blog post on
[@casperdcl's guide published over on Hackernoon](https://hackernoon.com/using-jupytertensorboard-in-any-cloud-with-one-command).

</admon>

[Jupyter Notebook](https://jupyter.org/) is one of -- if not the -- most-used
tools in data science. It provides an intuitive and feature-packed developer
experience and, for many people, is an indispensable tool when working on
machine learning projects.

The most straightforward use is on a local machine. We switch to a virtual
environment, type `jupyter notebook` in our terminal, and head over to
http://localhost:8888. We're good to go and ready to start prototyping!

This usage has one major downside, however: we're limited by the specs of our
local machine. While my laptop won't struggle training a classifier for the
[Iris dataset](https://www.kaggle.com/datasets/uciml/iris), it will become a
limiting factor when working on an alternative to
[GPT-3](https://github.com/openai/gpt-3).

The solution to bypassing the limitations of our local machine is to move our
notebooks to the cloud. When running a notebook on provisioned hardware, we can
use as beefy an instance as needed for our project. However, the downside to
cloud-hosted notebooks is that they're more challenging to get up and running.
And any time spent setting up our development environment is time we can't spend
on our actual ML project.

"Now wait a minute," you might say, "hasn't this problem long been solved by
SaaS solutions like
[Google Colab](https://colab.research.google.com/?utm_source=scs-index) and
[Amazon SageMaker Studio](https://aws.amazon.com/sagemaker/studio/)?"

To which I'd reply: "To an extent: yes. But while they certainly have their
merits, these solutions often have their own limitations which can become
problematic."

Here are three of the limitations imposed by SaaS solutions such as Colab and
SageMaker:

- **Cost:** they are expensive to use. You're not only paying for the hardware
  but also for using the platform.
- **Vendor lock-in:** they tend to be baked into the vendor's ecosystem. It's
  difficult and sometimes impossible to use infrastructure components from
  different vendors in conjunction with each other, such as a virtual machine
  from one vendor with a storage bucket from another.
- **Hardware limitations:** they may still limit the hardware available to you.
  Colab, for example, has a maximum of 25GB of memory and caps uptime at 12
  hours.

Iterative provides an alternative to these services in the form of
[TPI (Terraform Provider Iterative)](https://github.com/iterative/terraform-provider-iterative).
This [Terraform](https://www.terraform.io/) plugin lets you quickly provision
cloud instances to run the tasks that exceed the capabilities of your local
hardware. Consider it the cable to plug your laptop into endless cloud
resources. We can use TPI to launch a wide variety of tasks, such as Jupyter
workspaces, without the need to be a cloud expert.

Here are some benefits to using TPI that might pique your interest:

- **Lower cloud costs:** TPI is a free and open application that helps you
  reduce your cloud expenses. It automatically cleans up unused instances and
  allows you to use
  [spot instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html),
  reducing per-hour costs.
- **Modular:** TPI is compatible with a variety of cloud vendors and easily lets
  you switch between them. You aren't locked into one vendor's ecosystem.
- **Limitless hardware:** TPI lets you provision precisely the hardware you
  need. You can get as much memory or as beefy a GPU as you want.
- **Ease of use:** TPI doesn't require you to set up CI/CD to work in the cloud.
  You only need one configuration file and you are good to go.

In the guide below we will explore how to launch a Jupyter server in the cloud
using TPI. While we will be using Amazon Web Services (AWS) in our example, you
can use Microsoft Azure or Google Cloud Platform (GCP) with
[minor modifications](https://github.com/iterative/blog-tpi-jupyter/tree/generic).

# Prerequisites

Before we get started, make sure you take care of the following:

1. [Download the Terraform CLI tool](https://www.terraform.io/downloads)
1. [Set up an AWS Account](https://aws.amazon.com/)
1. [Install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
1. [Configure your AWS authentication credentials with `aws configure`](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
1. [Get a free ngrok account for port forwarding](https://ngrok.com/)
1. [Set your ngrok access token as an environment variable with `export NGROK_TOKEN="..."`](https://www.twilio.com/blog/2017/01/how-to-set-environment-variables.html)
1. [Clone the example repository](https://github.com/iterative/blog-tpi-jupyter)

<admon type="warn">

This guide will result in a Jupyter server running on provisioned AWS hardware.
While TPI helps you do this as cheaply as possible, there are still costs
involved. Make sure you
[understand AWS pricing](https://aws.amazon.com/ec2/pricing/) to avoid unwelcome
charges to your credit card.

</admon>

<admon type="tip">

You can use AWS EC2's `t2.micro` instances with `machine = "s"`. With the
[free tier](https://aws.amazon.com/ec2/?did=ft_card&trk=ft_card) you get 750
hours of these per month during your first year using AWS.

</admon>

# Guide

Once we have cloned the repository and navigated to it in our terminal, we only
need to run three commands. First, we use `terraform init` to initialize our
configuration files. Then, although strictly speaking optional, we use
`export TF_LOG_PROVIDER=INFO` to get better progress logging in our terminal.
After that, we simply run `terraform apply` to launch our Jupyter server. That's
all there is to it. TPI works its magic, and we will have our Jupyter
environment ready within a few minutes.

"But wait, how do we access it?"

That's where ngrok comes in, which will generate URLs we can navigate to in
order to access our environment. Run `terraform refresh` to get these URLs once
TPI has finished provisioning the instance:

```yaml
Outputs:

urls = [
  "Jupyter Lab: https://8c62-54-173-120-3.ngrok.io/lab?token=...",
  "Jupyter Notebook: https://8c62-54-173-120-3.ngrok.io/tree?token=...",
  "TensorBoard: https://6d52-54-173-120-3.ngrok.io",
]
```

<admon type="info">

It may take a little while for TPI to provision the instance. If
`terraform refresh` returns `urls = []` as its output, just wait a few minutes
and rerun it.

</admon>

Once we have accomplished everything we want to do in our notebook, we can
terminate the instance with `terraform destroy`. This ensures that we won't have
idle instances racking up our credit card bill. Terraform will download the
files stored there (updated notebooks, saved model files, etc.) to the shared
directory on our local machine when terminating the instance.

# Under the hood

"Alright, easy enough, but what is actually happening?"

The primary point of interest in the repository is
[`main.tf`](https://github.com/iterative/blog-tpi-jupyter/blob/aws/main.tf).
This file contains the specifications Terraform needs to provision our instance.
Let's take a look at what each part of this configuration does:

```hcl
terraform {
  required_providers { iterative = { source = "iterative/iterative" } }
}
provider "iterative" {}
```

This first part of the configuration simply tells Terraform that we will be
using TPI. We can consider it analogous to a package import in Python.

```hcl
resource "iterative_task" "jupyter_server" {
  spot      = 0        # auto-priced low-cost spot instance
  timeout   = 24*60*60 # force shutdown after 24h
  disk_size = 125      # GB
  machine   = "m+t4"   # m/l/xl (CPU), +k80/t4/v100 (GPU)
  image     = "nvidia" # or "ubuntu"

  # cloud-specific config
  cloud     = "aws"    # see `git checkout generic` branch for: gcp, az, k8s

  # blank means extract from local env vars
  environment = { NGROK_TOKEN = "", TF_CPP_MIN_LOG_LEVEL = "1", QUIET = "1", GITHUB_USER = "username" }
  storage {
    workdir = "shared"
    output  = "."
  }
```

The second part of the configuration is perhaps the most interesting. Here we
provide the specifications for the instance Terraform should provision for us.
In this case, we would like a medium CPU, an
[NVIDIA T4 GPU](https://aws.amazon.com/blogs/aws/now-available-ec2-instances-g4-with-nvidia-t4-tensor-core-gpus/),
and a 125GB disk. Because machine types vary between cloud vendors,
[TPI does some translation](https://registry.terraform.io/providers/iterative/iterative/latest/docs/resources/task#machine-type)
from generic types (e.g., `s`/`m`/`l`/`xl`) to specific cloud machine types.
This allows us to generalize these configurations and quickly switch from AWS to
Azure, for example.

Of particular interest here is the `spot = 0`, which tells TPI to provision
[spot instances](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html)
instead of on-demand ones. These instances use spare capacity from the cloud
provider. While it may take longer for spot instances to become available, their
cost is always lower than on-demand instances.

At the time of writing, the on-demand hourly rate for the specified type of
instance is $0.526. On the other hand, spot instances are only $0.15 per hour.
With little to no effort, TPI allows us to reduce our cloud costs by 70%!

<admon type="tip">

We could also set an upper limit to the hourly price we are willing to pay
(e.g., `spot = 0.12`), and TPI would hold off on provisioning until instances
are available at that price. Disabling spot pricing (`spot = -1`) would make TPI
provision on-demand instances.

</admon>

After specifying the details for the hardware, we configure a few environment
variables for the instance. We also set the local working directory for the
script and the directory to download files from (relative to the working
directory) upon terminating the instance. In this case, both are the `shared`
directory.

```bash
#!/bin/bash
# install dependencies
pip install jupyterlab notebook matplotlib ipywidgets tensorflow tensorboard tensorflow_datasets
apt-get install -yq nodejs
npm i ngrok

# start tunnel
export JUPYTER_TOKEN="$(uuidgen)"
npx ngrok authtoken "$NGROK_TOKEN"
(node <<TUNNEL
const fs = require('fs');
const ngrok = require('ngrok');
(async function() {
  const jupyter = await ngrok.connect(8888);
  const tensorboard = await ngrok.connect(6006);
  const br = '\n*=*=*=*=*=*=*=*=*=*=*=*=*\n';
  fs.writeFileSync("log.md", \`\$${br}URL: Jupyter Lab: \$${jupyter}/lab?token=$${JUPYTER_TOKEN}\$${br}URL: Jupyter Notebook: \$${jupyter}/tree?token=$${JUPYTER_TOKEN}\$${br}URL: TensorBoard: \$${tensorboard}\$${br}\`);
})();
TUNNEL
) &
while test ! -f log.md; do sleep 1; done
cat log.md
popd # dependencies

# start tensorboard in background
env -u JUPYTER_TOKEN -u AWS_ACCESS_KEY_ID -u AWS_SECRET_ACCESS_KEY -u REPO_TOKEN tensorboard --logdir . --host 0.0.0.0 --port 6006 &

# start Jupyter server in foreground
env -u AWS_ACCESS_KEY_ID -u AWS_SECRET_ACCESS_KEY -u REPO_TOKEN jupyter lab --allow-root --ip=0.0.0.0 --no-browser --port=8888 --port-retries=0
```

This part of our `main.tf` is the script to run once the instance has been
provisioned. These are CLI commands as you would run them in your local
terminal. We won't discuss every individual line, but in broad strokes, the
script does the following:

1. Install the dependencies we will be needing
1. Start an ngrok tunnel so that we can easily access the server through our
   browser
1. Launch the Jupyter server

<admon type="info">

This script also launches
[TensorBoard](https://www.tensorflow.org/tensorboard/get_started) to run
alongside Jupyter. It's not the main focus of this blog post, but it might be
helpful!

If you don't want TensorBoard running or want to run some other web service
instead, simply remove or modify
[the relevant line in `main.tf`](https://github.com/iterative/blog-tpi-jupyter/blob/e5fcc8aff74b40e1398ec0904efd73a2c480ff88/main.tf#L78).

</admon>

As you can see, the possibilities for the scripts we can run through TPI are
extensive. Basically everything we can do on our local machine through our
terminal, we can do on our cloud instance with TPI. We could add commands to
clone a Git repository, for example, or we could pull data in from a
[DVC remote](https://dvc.org/doc/command-reference/remote#remote). This
flexibility allows us to tailor our cloud instance precisely to our needs.

```hcl
output "urls" {
  value = flatten(regexall("URL: (.+)", try(join("\n", iterative_task.jupyter_server.logs), "")))
}
```

Lastly, purely for convenience, we specify the outputs of our task. Instead of
reading through the script's output on the terminal, we extract the ngrok tunnel
URLs and inject them into an output value. Terraform will print these outputs
whenever we `refresh`. In this case, we get URLs to access the Jupyter server.

# Conclusions

Great! After going through this guide, we know how to use TPI to launch Jupyter
servers with just a few commands. This means we are no longer limited by the
constraints of our local machine for prototyping machine learning projects.

"So, where do we go from here?"

Now that we know how to use TPI for provisioning Jupyter workspaces, we can use
the same approach to launch any other cloud tasks related to machine learning.
TPI is so powerful because it provides massive configurability without a vast
amount of prerequisite knowledge.

Once we are done with our prototyping, it would be particularly interesting to
transform our notebook into an experiment pipeline
[that we can move to the cloud with TPI](https://dvc.org/blog/local-experiments-to-cloud-with-tpi).
A full-fledged pipeline makes it easier to run successive experiments and find
the best-performing model. Jupyter Notebook is an excellent tool for prototyping
but has its limits when it comes to versioning and reproducibility. Or,
[as Andrey Cheptsov puts it](https://mlopsfluff.dstack.ai/p/notebooks-and-mlops-choose-one?s=r):
"Notebooks and MLOps; choose one."

We've got you covered if you want to learn how to transform your notebook into
an experiment pipeline! The
[Iterative Tools for Data Scientists & Analysts](https://learn.iterative.ai/course/data-scientist-path)
course covers this topic extensively and is entirely free to follow. It's easier
to accomplish than it may seem at first.
