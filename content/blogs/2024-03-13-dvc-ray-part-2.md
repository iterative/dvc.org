---
title:
  'Tutorial: Scalable and Distributed ML Workflows with DVC and Ray on AWS (Part
  2)'
date: 2024-03-13
description: >
  Need to setup DVC to work with Ray Cluster on AWS? This tutorial  has you
  covered!
descriptionLong: >
  In part 2 of the tutorial on DVC with Ray.io, you will learn how to set up a
  Ray Cluster on AWS to run cloud-based distributed computing with focus on
  managing increased complexity and leveraging cloud infrastructure to maximize
  the efficiency and performance of your ML experiments.

picture: 2024-03-13/1-cover-dvc-ray-part2.png
pictureComment:
  Ray + DVC integration [example](https://github.com/iterative/ray-dvc)
authors:
  - mikhail_rozhkov
  - dave_berenbaum
tags:
  - Open Source
  - Distributed Computing
  - Machine Learning
  - Automation
  - MLOps
  - Amazon Web Services
  - Ray.io
  - DVC
  - Tutorial
---

In [Part 1](/blog/dvc-ray) of the tutorial, we explored the basics of setting up
and integrating DVC with Ray for distributed machine learning workflows. By
leveraging Ray's distributed computing capabilities and DVC's data version
control, we establish a robust framework for managing complex ML experiments.
This combination allows for enhanced scalability, reproducibility, and
collaboration in ML projects.

In Part 2, we extend the solution to a Ray Cluster on AWS, demonstrating how to
adapt the setup for cloud-based distributed computing. This part involves
configuring AWS resources, deploying Ray clusters in the cloud, and running
DVC-managed pipelines at scale.

> We would like to express our gratitude to
> [Andreas Schuh](https://www.linkedin.com/in/schuh/) from
> [HeartFlow](https://www.heartflow.com/) for his contribution to this solution
> and for providing ideas and feedback for the blog posts. 🤝

<details>
<summary>Table of Contents</summary>

- [🛠️ Design Scalable ML Experiments with DVC and Ray](#️design-scalable-ml-experiments-with-dvc-and-ray)
  - [1 - Technical challenges of running DVC in a distributed Ray Cluster](#1---technical-challenges-of-running-dvc-in-a-distributed-ray-cluster)
  - [2 - Overview of the Solution Design](#2---overview-of-the-solution-design)
  - [3 - Discuss the solution design](#3---discuss-the-solution-design)
    - [☝️ Use a modified DVCLive logger to upload metrics to the S3](#️use-a-modified-dvclive-logger-to-upload-metrics-to-the-s3)
    - [☝️ Download DVCLive metrics to the DVC repository after the training is complete](#️download-dvclive-metrics-to-the-dvc-repository-after-the-training-is-complete)
- [🚀 Set Up and Run DVC in Distributed Ray Cluster](#set-up-and-run-dvc-in-distributed-ray-cluster)
  - [1 - Prepare **AWS and DVC Studio credentials**](#1---prepare-aws-and-dvc-studio-credentials)
  - [2 - Configure Ray Cluster in `cluster.yaml`](#2---configure-ray-cluster-in-clusteryaml)
    - [Set the cluster name and auto-scaling config](#set-the-cluster-name-and-auto-scaling-config)
    - [Set up the Docker image for the head and worker nodes](#set-up-the-docker-image-for-the-head-and-worker-nodes)
    - [Cloud-provider configuration](#cloud-provider-configuration)
    - [Files or directories to copy to the head and worker nodes](#files-or-directories-to-copy-to-the-head-and-worker-nodes)
    - [Additional commands to set up nodes](#additional-commands-to-set-up-nodes)
  - [3 - Start a Ray Cluster on AWS](#3---start-a-ray-cluster-on-aws)
  - [4 - Connect to the Head Node and Set Up Credentials](#4---connect-to-the-head-node-and-set-up-credentials)
    - [Connecting to the Cluster](#connecting-to-the-cluster)
    - [Setting Up Git Credentials](#setting-up-git-credentials)
    - [Run tests to check the correct setup](#run-tests-to-check-the-correct-setup)
  - [5 - Run DVC Pipelines on the remote Ray Cluster](#5---run-dvc-pipelines-on-the-remote-ray-cluster)
  - [6 - Commit \& push experiments](#6---commit--push-experiments)
  - [7 - Stop Cluster](#7---stop-cluster)
- [🎨 Summing Up: DVC + Ray Integration](#-summing-up-dvc--ray-integration)
- [References](#references)

</details>

## 🛠️ Design Scalable ML Experiments with DVC and Ray

Moving from a local setup to deploying a multi-node Ray Cluster on AWS marks a
significant shift, bringing forth a range of challenges that necessitate careful
consideration. This section dives deep into these intricacies, shedding light on
the hurdles encountered when scaling ML workflows to the cloud. We aim to
provide a comprehensive analysis of these challenges and introduce refined
solutions for a smooth integration of DVC and Ray in distributed environments.
Through this exploration, we lay the groundwork for enhancing scalability,
efficiency, and seamless operation of ML pipelines on a larger scale.

**Goals for this section:**

- Identify and address the technical challenges of running DVC in a distributed
  Ray cluster.
- Design an efficient and scalable integration of DVC and Ray in a distributed
  environment.
- Propose solutions and best practices for overcoming these challenges.

### 1 - Technical challenges of running DVC in a distributed Ray Cluster

Let’s outline the scope of the target solution for the following discussion:

- A Ray Cluster can add more worker nodes (auto-scaling) on AWS EC2.
- All jobs are executed only on worker nodes (not on the head node) in Docker
  containers.
- The user runs DVC pipelines and commits results on the head node (connected by
  SSH).
- During the training, the user should be able to track metrics updated in live
  mode.
- Data and models are stored in AWS S3.
- Code and metadata are versioned with Git.

![Challenges](../uploads/images/2024-03-13/2-challenges.png '=600') _Challenges
of running DVC in a distributed Ray Cluster_

Let's review each challenge and its proposed solution:

1. **Auto-Scaling Worker Nodes**:
   - Challenge: Ensuring seamless integration with Ray's auto-scaling feature to
     add or remove worker nodes based on workload demand dynamically.
   - Solution: Utilize Ray's built-in auto-scaling functionality, which allows
     for the dynamic addition and removal of worker nodes as needed.
2. **Execution on Worker Nodes Only**:
   - Challenge: Ensuring that all jobs, including DVC pipelines and Ray tasks,
     are executed exclusively on worker nodes to optimize resource utilization.
     A specific part is a requirement to propagate DVC environment variables to
     all worker nodes.
   - Solution: Configure the Ray cluster to execute all tasks and jobs
     exclusively on worker nodes. Monitor the head node's load and use Ray's
     capabilities to distribute tasks evenly across the worker nodes.
3. **Live Metrics Tracking During Training**
   - Challenge: Tracking real-time metrics during model training on distributed
     worker nodes with [DVCLive](https://dvc.org/doc/dvclive).
   - Solution: Use DVCLive, a lightweight library compatible with DVC, to track
     real-time metrics during training sessions. Set up the pipeline to use
     DVCLive on the rank 0 worker only (as discussed above). Ensure that
     DVCLive, running on the rank 0 worker, has access to the
     [DVC environment variables](https://dvc.org/doc/user-guide/env), including
     `DVC_STUDIO_TOKEN`, to log metrics to DVC Studio.
4. **Synchronize DVC pipeline artifacts with the head node.**
   - Challenge: Ensuring that artifacts generated by DVC pipelines on worker
     nodes are consistently and efficiently synchronized back to the head node,
     where they can be versioned and committed to Git and DVC remote storage.
   - Solution: Setup
     - **From Worker to S3**: Set up Ray to use an AWS S3 bucket as a persistent
       storage to sync artifacts and checkpoints.
     - **From S3 to Head Node**: After the distributed pipeline is complete,
       pull the required artifacts and a model from the persistent storage on S3
       to the project repository on the head node.

### 2 - Overview of the Solution Design

Here is a diagram that depicts the proposed solution:

![Solution Design for DVC with Ray in Clouds](../uploads/images/2024-03-13/3-solution-design-2.png '=600')
_Solution Design for DVC with Ray in Clouds_

The diagram on the slide illustrates the integration of DVC (Data Version
Control) and Ray in a cloud-based environment, specifically using AWS EC2
instances. Let's break down the key components and steps outlined in the
diagram.

1. Package project & Provision Ray Cluster: Provision of the Ray cluster on AWS
   EC2 instances before running experiments. There are a few ways to do this:
   - Set up `cluster.yaml` to copy files and directories from the local machine
     to the head and worker nodes.
   - Pull the code and dependencies from the Git repository or S3 bucket.
2. Run `dvc exp run`: In a Ray cluster, the head node coordinates tasks and
   manages resources. It initiates the execution of parallel tasks on worker
   nodes. Connect to Ray cluster (head node), navigate to the project directory,
   and run `dvc exp run`.
3. Publish Live Metrics to Studio:
   - During the execution of `train.py`, DVCLive handles logging metrics and
     parameters at Worker(rank=0) to avoid duplication.
   - DataChain Studio visualizes metrics updates in live mode.
4. Push DVCLive logs from a Worker Node to S3: The current version of the
   DVCLive logs metrics and artifacts to the filesystem on the rank 0 worker. To
   make them available in the project repository on the head node after the
   experiment is complete, a few modifications were made:
   - Use `DVCLiveRayLogger` as [Live](https://dvc.org/doc/dvclive/live) -
     extended with functionality to store metrics in s3
   - Modified Live.next_step() is responsible for uploading `/results/dvclive`
     dir to s3 bucket: `s3://cse-cloud-version/tutorial-mnist-dvc-ray/` every
     epoch.
5. Pull DVCLive logs from S3 to the Head Node after completing the experiment.
6. Commit & Push the DVC experiment artifacts and metadata updates.

### 3 - Discuss the solution design

Let’s summarise changes made in scripts to run in a distributed Ray cluster in
the cloud:

- Use a modified DVCLive logger to upload metrics to the S3 bucket every epoch.
- Download DVCLive metrics to the DVC repository after the training is complete.

#### ☝️ Use a modified DVCLive logger to upload metrics to the S3

A modified `DVCLiveRayLogger` inherits from `Live` and introduces the ability to
push DVCLive metrics directly to an S3 bucket. This is necessary because the
code is executed on remote workers, and DVCLive can’t log metrics and artifacts
directly to the DVC repository.

```python
class DVCLiveRayLogger(Live):
    def __init__(self, bucket_name, s3_directory, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.bucket_name = bucket_name
        self.s3_directory = s3_directory

    def next_step(self, *args, **kwargs):
        super().next_step(*args, **kwargs)

        print("\nDVCLiveLogger: Push DVCLive metrics to S3")
        upload_to_s3(self.dir, self.bucket_name, self.s3_directory,)
```

- By pushing DVCLive directory to S3, teams can easily share, access, and
  analyze training progress from anywhere without relying on local file systems.

#### ☝️ Download DVCLive metrics to the DVC repository after the training is complete

Live object instance created from `DVCLiveRayLogger` behaves the same way as the
original DVCLive. There are a few changes in the configuration:

- Set `dir="results/dvclive"` to ensure that after the training DVC will
  correctly resolve paths of logged metrics and artifacts.
- Set `bucket_name` and `s3_directory` to save live metrics and artifacts in S3.

```python
def train_func_per_worker(config: Dict):
    ...

    # [3] Set up Live object for DVCLive
    live = None
    if worker_rank == 0:

        # Initialize DVC Live
        from src.live import DVCLiveRayLogger as Live
        live = Live(
            dir="results/dvclive",
            save_dvc_exp=True,
            bucket_name = "cse-cloud-version",
            s3_directory = "tutorial-mnist-dvc-ray/dvclive",
        )

def train(params: dict) -> None:
    ...

    # Pull DVCLive logs from S3
    s3_directory = "tutorial-mnist-dvc-ray/dvclive"
    download_from_s3(bucket_name, s3_directory, 'results/dvclive/')

if __name__ == "__main__":
    ...
    train(params)
```

- At every training epoch, `live.next_step()` pushes the `results/dvclive`
  directory to the S3 bucket.
- After the training, use `download_from_s3()` to download DVCLive metrics to
  the `results/dvclive/` in the DVC repository.

## 🚀 Set Up and Run DVC in Distributed Ray Cluster

> 💡 Note: Navigate to the `cloud` branch in the repository

This section of the tutorial provides a step-by-step guide on how to set up and
run a DVC pipeline on a Ray cluster hosted on AWS. The integration of DVC with
Ray on AWS allows for scaling machine learning workflows, leveraging cloud
resources for distributed processing.

**Goals for this section:**

- Guide you through the steps to set up and run the example on a Ray cluster
  hosted on AWS.
- Explain specific solutions and best practices.

### 1 - Prepare **AWS and DVC Studio credentials**

This example uses a simple AWS access configuration. Prepare AWS credentials for
use with Ray (or any other application that requires AWS access) and store them
in a specific file (`~/.aws/ray-credentials`) on a local machine. In the next
step, you’ll configure Ray to use this file.

For example, use the following CLI script to store AWS secrets to
`~/.aws/ray-credentials`:

```bash
echo "[default]
aws_access_key_id = ASIAU7...
aws_secret_access_key = Fdpgl...
aws_session_token = IQoJb3JpZ...
" > ~/.aws/ray-credentials
```

To track metrics with DVC Studio, Save your DVC Studio client access token to a
`.dvc/config.local` file. Git or DVC does not track this file. In the next step,
you’ll configure Ray to use this file to provision the head and worker nodes.

```bash
dvc config --local studio.token isat_2BlrAu0aileSH...
```

### 2 - Configure Ray Cluster in `cluster.yaml`

To initiate a Ray cluster on AWS, you will use a configuration file named
`cluster.yaml`, which outlines the specifications of your AWS setup, including
instance types, the number of nodes, and other settings. The `cluster.yaml` is
big and has a lot of comments. Let’s highlight only parts specific to the
current solution design.

#### Set the cluster name and auto-scaling config

```yaml
cluster_name: tutorial-mnist-dvc-ray
max_workers: 2
upscaling_speed: 1.0
```

- In the Ray cluster configuration for the `tutorial-mnist-dvc-ray` cluster, the
  `cluster_name` specifies a unique identifier for the cluster, distinguishing
  it from other clusters you might be running. This name is used in managing and
  tracking the cluster's resources.

- The `max_workers` setting defines the maximum number of worker nodes the
  cluster can scale up to in addition to the head node. It's set to `2` here,
  meaning the cluster can run up to two worker nodes concurrently to process
  tasks.

- The `upscaling_speed` parameter controls how quickly the cluster can scale up
  by adding more worker nodes when there's an increase in load or tasks. Set at
  `1.0`, the autoscaler can increase the cluster size by up to 100% of the
  currently running nodes at each scaling operation.

#### Set up the Docker image for the head and worker nodes

Using Docker enables you to run your distributed applications in a consistent
and controlled environment, leveraging Docker's containerization to manage
dependencies and system settings across all nodes seamlessly.

```yaml
docker:
  image: 'rayproject/ray-ml@sha256:fa8c69ae055b92bf2f97e22c6a96ea835be60afa69c224d6e1275c3040833d0a'
  container_name: 'ray_container'
  pull_before_run: True
  run_options:
    - --ulimit nofile=65536:65536
```

This Ray cluster configuration segment specifies Docker settings for running
tasks across all nodes:

- `image` The Docker image used for containers on all nodes, identified by its
  SHA256 digest for consistency.
- `container_name` The name for Docker containers, set as `ray_container`.

#### Cloud-provider configuration

This Ray cluster configuration outlines the setup for running distributed
applications on AWS, specifying both cloud provider settings and instance
configurations, including a unique approach for the head node.

```yaml
provider:
  type: aws
  region: us-west-2
  availability_zone: us-west-2a,us-west-2b
  cache_stopped_nodes: True

available_node_types:
  ray.head.default:
    resources: { 'CPU': 0 }
    node_config:
      InstanceType: m5.2xlarge
      BlockDeviceMappings:
        - DeviceName: /dev/sda1
          Ebs:
            VolumeSize: 160
            VolumeType: gp3

  ray.worker.default:
    min_workers: 1
    max_workers: 2
    resources: {}
    node_config:
      InstanceType: m5.2xlarge
      InstanceMarketOptions:
        MarketType: spot
      BlockDeviceMappings:
        - DeviceName: /dev/sda1
          Ebs:
            VolumeSize: 160
            VolumeType: gp3
```

This configuration establishes a robust and cost-efficient Ray cluster on AWS,
leveraging both on-demand and spot instances for worker nodes to optimize costs
and performance:

- **Head Node** (`ray.head.default`): Configured to use `m5.2xlar` instances,
  with a custom block device mapping for increased EBS volume size (160 GB, gp3
  type). Interestingly, the `resources` for the head node are set to `{"C": 0}`,
  indicating it should not be used for computation-intensive tasks, focusing
  instead on cluster management and coordination.
- **Worker Nodes** (`ray.worker.default`): Also set to use `m5.2xlar` instances
  with similar storage configurations as a default. Worker nodes can run on spot
  instances to reduce costs, and their CPU and GPU resources are auto-detected,
  allowing them to be allocated for computational tasks. The configuration
  supports scaling between 1 and 2 worker nodes dynamically.
- Setting `{CPU: 0}` for the head node is a strategic choice to ensure it does
  not run compute-intensive tasks. The head node manages the cluster's
  operations, including task scheduling and resource allocation.

#### Files or directories to copy to the head and worker nodes

The `file_mounts` configuration facilitates the replication of a consistent
working environment across the cluster by ensuring all nodes have the necessary
code, configurations, and credentials. This setup supports seamless distributed
execution of tasks, including data processing, training machine learning models,
and interacting with cloud services.

```yaml
file_mounts:
  {
    '/home/ray/tutorial-mnist-dvc-ray': '.',
    '/home/ray/tutorial-mnist-dvc-ray/.dvc/config.local': './.dvc/config.local',
    '/home/ray/.aws/credentials': '~/.aws/ray-credentials'
  }

rsync_filter:
  - '.gitignore'
```

- `/home/ray/tutorial-mnist-dvc-ray`: This entry maps the current local
  directory (denoted by `"."`) the remote directory
  `/home/ray/tutorial-mnist-dvc-ray` on both the head and worker nodes. It's
  useful for transferring the entire project (including `.git` directory), which
  includes code, scripts, and potentially small data files or configuration
  files that are necessary for the execution of the pipeline.
- `/home/ray/tutorial-mnist-dvc-ray/.dvc/config.local`: This entry indicates
  that the local DVC configuration file, `.dvc/conf.local`, should be explicitly
  copied to the corresponding path on the remote nodes. This file includes an
  access token for DVC Studio and is thus excluded from Git tracking as a
  security measure. Given that the `rsync_filter` patterns employed in the
  configuration are designed to omit all Git-ignored files — encompassing both
  data files and the DVC cache — it becomes necessary to list the `config.loc`
  file explicitly. This step ensures the file is transferred despite the filter,
  thereby maintaining access to DVC Studio across all nodes in the cluster.
- `/home/ray/.aws/credentials`: This maps a custom AWS credentials file from the
  local machine (`~/.aws/ray-credentials`) to the standard AWS credentials path
  (`/home/ray/.aws/credentials`) on the remote nodes. This setup is essential
  for enabling AWS SDKs and CLI tools running on the remote nodes to
  authenticate with AWS services using the provided credentials.

> 💡 Note: This example uses the simplified approach to configure access to AWS
> resources and DVC Studio. For the production setup, it's crucial to:
>
> - Ensure that sensitive information, especially credentials, is handled
>   securely. Use IAM roles for EC2 instances where possible to avoid copying
>   AWS credentials.
> - Minimize the size of transferred directories to speed up the cluster
>   initialization process. Consider excluding large datasets or output
>   directories if they're not needed on every node or can be accessed from a
>   shared storage service like Amazon S3.

#### Additional commands to set up nodes

The `setup_commands` section in the Ray cluster configuration outlines a series
of shell commands executed on all nodes (both head and worker nodes) during
their initialization phase. These commands are crucial for preparing the nodes
with your application's necessary software and libraries.

```yaml
setup_commands:
  - pip install -U ray[default]
  - pip install dvc[s3]==3.43.1 dvclive==3.41.1
  - pip install -U pyOpenSSL==24.0.0
```

Here’s a breakdown:

- `pip insta dvc[s3]==3.43.1 dvclive==3.41.1`\*\*: Installs specific versions of
  DVC (Data Version Control) with S3 support and DVCLive. Specifying versions
  ensures consistency in running the tutorial example.
- `pip insta -U pyOpenSSL==24.0.0`: Updates the pyOpenSSL library to a specific
  version after the DVC installation. This is a specific requirement for this
  example to ensure the consistency of the Python dependencies.

### 3 - Start a Ray Cluster on AWS

Run the following command to start your Ray cluster as defined in your
`cluster.yaml` file:

```bash
ray up cluster.yaml
```

You can access the Ray dashboard once your Ray cluster is running. This
dashboard provides a real-time view of your cluster's status, including resource
utilization, task progress, and logs.

To open the Ray dashboard, use:

```bash
ray dashboard cluster.yaml
```

![Ray Dashboard](../uploads/images/2024-03-13/4-dashboard.png '=600') _Ray
Dashboard_

### 4 - Connect to the Head Node and Set Up Credentials

Once your Ray cluster is provisioned and all nodes are correctly set up with the
necessary software, the next step involves connecting to the head node to
configure access credentials for GitHub, Amazon S3, and other services like DVC
Studio. These credentials are essential for version control, data storage, and
continuous integration and deployment (CI/CD) processes.

#### Connecting to the Cluster

To initiate a secure connection to the head node of your Ray cluster, use the
following command. This command utilizes the cluster configuration defined in
`cluster.yaml`, providing you with a terminal session on the head node:

```bash
# Connect to cluster
ray attach cluster.yaml
```

#### Setting Up Git Credentials

Once connected to the head node, configure Git with your username and email to
enable commits to your repositories. Additionally, an access token can be set up
for GitHub to securely push and pull without using a password. Replace
`<your_username>` with your GitHub username and `<your_email>` with your email
associated with GitHub, and `<your_github_pat>` with your GitHub Personal Access
Token (PAT).

```bash
git config --global user.name "<your_username>"
git config --global user.email "<your_email>"
export GITHUB_ACCESS_TOKEN=<your_github_pat>
```

Use the access token to update the repository's remote URL for authentication.
This step assumes you have cloned the repository and are inside the repository
directory.

```bash
git remote set-url origin https://your_username:${GITHUB_ACCESS_TOKEN}@github.com/your_username/tutorial-mnist-dvc-ray.git
```

#### Run tests to check the correct setup

Run a few test scripts to ensure AWS credentials are correctly set up on the
cluster for accessing S3 services.

```bash
export PYTHONPATH=$PWD
python src/test_scripts/test_s3.py
```

> The example scripts are inside the `~/tutorial-mnist-dvc-ray` directory

### 5 - Run DVC Pipelines on the remote Ray Cluster

Navigate to the `tutorial-mnist-dvc-ray` directory and run a new experiment

```bash
export PYTHONPATH=$PWD
dvc exp run -f
```

This will start the pipeline, running the `tune` and `train` stages as defined
in your `dvc.yaml` file, utilizing distributed computation with Ray.

You may see live updates of metrics and plots in
[DVC Studio](https://studio.datachain.ai/).

![Live Metrics Tracking with DVC Studio](../uploads/images/2024-03-13/5-dvc-studio.png '=600')
_Live Metrics Tracking with DVC Studio_

This setup with DVC and DVCLive offers a structured approach to monitoring model
performance through metrics tracking and visualization. It aids in understanding
the model's behavior over training, facilitating decisions on model adjustments
or improvements. Moreover, after the experiment is complete, you may change the
plot template, add new plots, or customize the existing ones to suit your
specific requirements if needed.

### 6 - Commit & push experiments

Once you've completed an experiment and are ready to share or preserve the
results, DVC provides a seamless workflow to list, select, and commit the
outcomes of your experiments. Here’s how to manage and share your experiment
results using DVC and Git.

Use `dvc exp show` to get an overview of all experiments, including their
metrics and parameters.

```bash
(base) ray@ip-172-31-41-217:~/tutorial-mnist-dvc-ray$ dvc exp show
 ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────>
  Experiment                 Created       loss   accuracy   step   tune.run_tune   tune.epoch_size   tune.test_size   tune.results_dir>
 ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────>
  workspace                  -          0.38723     0.8602      4   True            512               256              results/tune    >
  cloud-remote               02:17 PM    0.3951     0.8542      4   True            512               256              results/tune    >
  ├── dbcdc38 [broad-teas]   06:22 AM   0.38723     0.8602      4   True            512               256              results/tune    >
  └── 11e273e [metal-sick]   06:21 AM    0.3951     0.8542      4   True            512               256              results/tune    >
 ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────>
(END)
```

After identifying the successful experiment (e.g., `broad-teas`), you can use
DVC to create a new branch for this experiment, facilitating version control and
collaboration.

```bash
dvc exp branch broad-tea
```

Next, push the newly created branch to your remote Git repository and upload
artifacts to the DVC remote storage.

```bash
git checkout broad-teas-branch
git push origin broad-teas-branch
dvc push
```

### 7 - Stop Cluster

Turn off the remote cluster when not in use to save money and reduce
environmental impact!

```bash
ray down cluster.yaml
```

## 🎨 Summing Up: DVC + Ray Integration

The DVC + Ray integration presents a comprehensive solution to the challenges of
running machine learning experiments at scale. By addressing specific issues
related to auto-scaling, execution optimization, live metrics tracking, and data
synchronization, this setup ensures that machine learning teams can focus on
innovation and experimentation backed by a robust, scalable, and efficient
infrastructure.

Integrating DVC with Ray combines the best data management and distributed
computing for machine learning projects. Here's a simplified overview of what we
covered:

1. **Setup Ray Cluster**: Configured a Ray cluster to run on AWS, utilizing
   Docker for consistent environments and specifying node types for resource
   optimization.
2. **Node Provisioning**: Automated the setup of head and worker nodes for a
   scalable ML experiment environment.
3. **Artifact Sync**: Ensured DVC pipeline artifacts were synchronized across
   the cluster, keeping data and models consistent.
4. **Manage Experiments with DVC Studio**: Demonstrated how to use DVC, DVCLive,
   and DVC Studio for metrics tracking, artifacts versioning, and experiment
   management.
5. **Commit and Share Results**: Highlighted the process of committing
   experiment results and pushing them to a repository for collaboration and
   reproducibility.

**Key Takeaways**:

- **Scalability**: Ray and AWS offer a flexible and scalable setup for ML
  experiments.
- **Reproducibility**: DVC adds data version control, enhancing experiment
  reproducibility.
- **Automation**: The integration shows how to automate the ML workflow, from
  setup to experiment tracking.
- **Collaboration**: Using Git and DVC supports effective team collaboration on
  ML projects.

> 💡 Did you find this tutorial interesting? Please leave your comments and
> share your experience with DVC and Ray! Join us on
> [Discord](https://discord.com/invite/dvwXA2N) 🙌

## References

- [Ray docs: Getting Started](https://docs.ray.io/en/latest/ray-overview/getting-started.html)
- [How Ray solves common production challenges for Generative AI infrastructure](https://www.anyscale.com/blog/ray-common-production-challenges-for-generative-ai-infrastructure)
- [Building a Modern Machine Learning Platform with Ray](https://medium.com/samsara-engineering/building-a-modern-machine-learning-platform-with-ray-eb0271f9cbcf)

---

📰 [Join our Newsletter](https://share.hsforms.com/1KRL5_dTbQMKfV7nDD6V-8g4sbyq)
to stay up to date with news and contributions from the Community!
