---
title: Syncing Data to GCP Storage Buckets
date: 2022-06-07
description: >
  We're going to set up an GCP storage bucket remote in a DVC project.
descriptionLong: >
  Setting up a remote to make data versioning easier with DVC is a common need
  so we're going to go through a tutorial for doing this with GCP.
picture: 2022-06-07/gcp-in-dvc.png
pictureComment: Using GCP Remotes in DVC
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/preventing-stale-models-in-production/1137
tags:
  - MLOps
  - DVC
  - Git
  - DVC Remotes
  - Collaboration
---

When you’re working on a data science project that has huge datasets, it’s
common to store them in cloud storage. You’ll also be working with different
versions of the same datasets to train a model, so it’s crucial to have a tool
that enables you to do this quickly and easily. That’s why we’re going to do a
quick walkthrough of how to set up a remote in a GCP storage bucket and handle
data versioning with [DVC](https://dvc.org/doc).

We’ll start by creating a new storage bucket in our GCP account, then we’ll show
how you can add DVC to your project, and finally, we’ll make updates to the
dataset with DVC commands. We’ll be working with
[this repo](https://github.com/iterative/stale-model-example) if you want an
example to play with. By the time you finish, you should be able to create this
setup for any ML project using an GCP remote.

## Set up a GCP storage bucket

Make sure that you already have a
[GCP account](https://console.cloud.google.com). You’ll need a valid credit card
to create a new account. Once you’re logged into your account, you should see a
screen like this with some of the services GCP offers.

![gcp_project.png](/uploads/images/2022-06-07/gcp_project.png)

From here, you need to go to `Cloud Storage` to create a bucket to store the
data. When you get to the Cloud Storage page, you should see something similar
to this and you’ll click the `Create Bucket` button.

![create_gcp_bucket.png](/uploads/images/2022-06-07/create_gcp_bucket.png)

The Bucket page will have a lot of configurations you can set, but you can leave
the settings in the default state if there’s nothing you need to customize. We
have named this example bucket `updatedbikedata` as you can see below.

![gcp_bucket_options.png](/uploads/images/2022-06-07/gcp_bucket_options.png)

Now you can save your changes and you’ll be redirected to the `Bucket Details`
page and you’ll see the bucket you just created.

![created_gcp_bucket.png](/uploads/images/2022-06-07/created_gcp_bucket.png)

### Get your credentials

Since you have the bucket created, we need to get the credentials to connect the
GCP remote to the project. Go to the `IAM & Admin` service and go to
`Service Accounts` in the left sidebar. You’ll see your project and you’ll be
able to click on `Actions` and go to where you `Manage keys` for your project.

![gcp_service_account.png](/uploads/images/2022-06-07/gcp_service_account.png)

Once you’ve been redirected, click the `Add Key` button and this will bring up
the credentials you need to authenticate your GCP account with your project. Go
ahead and download the credentials file and store it somewhere safe.

![gcp_key.png](/uploads/images/2022-06-07/gcp_key.png)

That’s it for setting up your storage bucket and getting the credentials you
need! Now let’s add DVC to our demo repo and set up the remote.

## Set up a DVC project

First, add DVC as a requirement to your project with the following installation
command:

`$ pip install 'dvc[gs]'`

Then you can initialize DVC in your own project with the following command:

`$ dvc init`

This will add all of the DVC internals needed to start versioning your data and
tracking experiments. Now we need to set up the remote to connect our project
data stored in GCP to the DVC repo.

### Create a default remote

Now we can make the GCP storage the default remote for the project with the
following command:

`$ dvc remote add -d bikes gs://updatedbikedata`

This creates a default remote called `bikes` that connects to the
`updatedbikedata` bucket we made earlier which is where the any data for the
model will be stored.

### Add GCP credentials

In order for DVC to be able to push and pull data from the remote, you need to
have valid AWS credentials.

If you are using the GCP CLI already, you should be able to run
`gcloud auth application-default login`. You can also authenticate with
`GOOGLE_APPLICATION_CREDENTIALS` which we have from the service account earlier.
You can check out more about authentication
[here in the GCP docs](https://cloud.google.com/sdk/docs/authorizing).

If you run into issues with the credentials, you can manually add them with the
following commands:

`$ dvc remote modify bikes credentialpath '../tonal-history-154018-e62a79baf90f.json'`

### Push and pull data with DVC

Now you can push data from your local machine to the GCP remote! First, add the
data you want DVC to track with the following command:

`$ dvc add data`

This will allow DVC to track the entire `data` directory so it will note when
any changes are made. Then you can push that data to your GCP remote with this
command:

`$ dvc push`

Then if you move to a different machine or someone else needs to use that data,
it can be accessed by connecting to the remote and running:

`$ dvc pull`

That’s it! Now you can connect any DVC project to a GCP storage bucket. If you
run into any issues, makes sure to check that your credentials are valid, check
if your user has MFA enabled, and check that the user has the right level of
permissions.
