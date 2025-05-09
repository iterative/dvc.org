---
title: Syncing Data to GCP Storage Buckets
date: 2022-07-06
description: >
  We're going to set up a GCP storage bucket remote in a DVC project.
descriptionLong: >
  Setting up a remote to make data versioning easier with DVC is a common need
  so we're going to go through a tutorial for doing this with GCP.
picture: 2022-07-06/dvc-gcp.png
pictureComment: Using GCP Remotes in DVC
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/syncing-data-to-gcp-storage/1237
tags:
  - MLOps
  - DVC
  - Git
  - DVC Remotes
  - Collaboration
  - Tutorial
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
setup for any machine learning project using a GCP remote.

## Set up a GCP storage bucket

Make sure that you already have a
[GCP account](https://console.cloud.google.com). You’ll need a valid credit card
to create a new account. Once you’re logged into your account, you should see a
screen like this with some of the services GCP offers.

_Note:_ Remember, GCP does have a
[free tier](https://cloud.google.com/free/docs/gcp-free-tier) if you just want
to try it out.

![GCP initial page](../uploads/images/2022-07-06/gcp_initial_page.png)

From here, you'll need to create a new project. Search for "create a project"
and click the "IAM & Admin" option. You'll enter the name of the project, which
is `Bicycle Project`, and choose the organization and location and click the
`Create` button. This will take you to your project dashboard and show you all
of the stats and settings you have available.

![create a new GCP project](../uploads/images/2022-07-06/gcp_new_project.png)

Then you need to go to `Cloud Storage` in the left sidebar to create a bucket to
store the data. When you get to the Cloud Storage page, you should see something
similar to this and you’ll click the `Create Bucket` button.

![create_gcp_bucket.png](../uploads/images/2022-07-06/create_gcp_bucket.png)

The Bucket page will have a lot of configurations you can set, but you can leave
the settings in the default state if there’s nothing you need to customize. We
have named this example bucket `updatedbikedata` as you can see below.

![gcp_bucket_options.png](../uploads/images/2022-07-06/gcp_bucket_options.png)

Now you can save your changes and you’ll be redirected to the `Bucket Details`
page and you’ll see the bucket you just created.

![created_gcp_bucket.png](../uploads/images/2022-07-06/created_gcp_bucket.png)

### Get your credentials

Since you have the bucket created, we need to get the credentials to connect the
GCP remote to the project. Go to the `IAM & Admin` service and go to
`Service Accounts` in the left sidebar.

![no service accounts](../uploads/images/2022-07-06/gcp_empty_service_account.png)

Click the `Create Service Account` button to create a new service account that
you'll use to connect to the DVC project in a bit. Now you can add the name and
ID for this service account and keep all the default settings. We've chosen
`bicycle-service-account` for the name and `bicycle-account` for the ID. Click
`Create and Continue` and it will show the permissions settings. Select `Owner`
in the dropdown and click `Continue`.

![service account permissions](../uploads/images/2022-07-06/gcp_service_account_permissions.png)

Then add your user to have access to the service account and click `Done`.

![service account user access](../uploads/images/2022-07-06/gcp_service_account_user_access.png)

Finally, you'll be redirected to the `Service accounts` page.

![service account with name and ID](../uploads/images/2022-07-06/gcp_create_service_account.png)

You’ll see your service account and you’ll be able to click on `Actions` and go
to where you `Manage keys` for this service account.

![manage keys on service account](../uploads/images/2022-07-06/gcp_service_account.png)

Once you’ve been redirected, click the `Add Key` button and this will bring up
the credentials you need to authenticate your GCP account with your project. Go
ahead and download the credentials file and store it somewhere safe.

![gcp_key.png](../uploads/images/2022-07-06/gcp_key.png)

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
have valid GCP credentials.

If you are using the
[GCP CLI (google-cloud-sdk)](https://cloud.google.com/sdk/docs/install-sdk)
already, you should be able to run `gcloud auth application-default login`. This
method doesn't require a service account.

You can also authenticate with the service account we created earlier in a
couple of ways with that credentials file we downloaded.

You can run the following command with your service account email.

```dvc
$ gcloud auth activate-service-account bicycle-service-account@tonal-history-154018.iam.gserviceaccount.com --key-file=../tonal-history-154018-e62a79baf90f.json
```

If you don't have the GCP CLI installed and you want to use the service account,
you can set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to point
to the credentials file, like this:

```dvc
$ export GOOGLE_APPLICATION_CREDENTIALS='../tonal-history-154018-e62a79baf90f.json'
```

Or you can add the credentials file location with the following command:

```dvc
$ dvc remote modify --local bikes credentialpath '../tonal-history-154018-e62a79baf90f.json'
```

You can check out more about authentication
[here in the GCP docs](https://cloud.google.com/sdk/docs/authorizing).

### Push and pull data with DVC

Now you can push data from your local machine to the GCP remote! First, add the
data you want DVC to track with the following command:

`$ dvc add data`

This will allow DVC to track the entire `data` directory so it will note when
any changes are made. Then you can push that data to your GCP remote with this
command:

`$ dvc push`

Here's what that data will look like when it has been successfully uploaded to
GCP.

![data in GCP](../uploads/images/2022-07-06/data_in_gcp.png)

Then if you move to a different machine or someone else needs to use that data,
it can be accessed by cloning or forking the project repo, setting up the remote
and running:

`$ dvc pull`

_Note:_ Depending on the authentication method being used, there might be some
required extra steps, such as making sure users actually have the permissions to
read/write to the bucket.

That’s it! Now you can connect any DVC project to a GCP storage bucket. If you
run into any issues, make sure to check that your credentials are valid, check
if your user has MFA enabled, and check that the user has the right level of
permissions.
