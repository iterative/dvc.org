---
title: Syncing Data to Azure Blob Storage
date: 2022-06-22
description: >
  We're going to set up an Azure Blob Storage remote in a DVC project.
descriptionLong: >
  Setting up a remote to make data versioning easier with DVC is a common need
  so we're going to go through a tutorial for doing this with AWS.
picture: 2022-06-22/dvc-azure.png
pictureComment: Using Azure Blob Storage in DVC
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/syncing-data-to-aws-s3/1192
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
that enables you to switch between datasets quickly and easily. That’s why we’re
going to do a quick walkthrough of how to set up a remote with Azure Blob
Storage and handle data versioning with [DVC](https://dvc.org/doc).

We’ll start by creating a new blob storage container in our Azure account, then
we’ll show how you can add DVC to your project. We’ll be working with
[this repo](https://github.com/iterative/stale-model-example) if you want an
example to play with.

<admon type="info">

By the time you finish, you should be able to create this setup for any machine
learning project using an Azure remote.

</admon>

## Set up an Azure blob storage container

Make sure that you already have a
[Microsoft Azure account](https://azure.microsoft.com/en-us/features/azure-portal/).
When you log in, you should see a page like this.

![initial Azure page](/uploads/images/2022-06-22/initial_azure.png)

Search for `storage accounts` in the search bar and click `Storage accounts`
under `Services`. Make sure you don't click the "classic" option.

![search for storage account](/uploads/images/2022-06-22/storage_account_search.png)

This will bring you to the `Storage accounts` page where you'll need click the
`Create storage account` button.

![storage accounts page](/uploads/images/2022-06-22/storage_account_page.png)

Now you need to enter a `Resource group` and name for the account. You can
create a new resource group right here, like we do, and call it
`BicycleProject`. We'll name this storage account `bicycleproject`. Then you can
leave all the default settings in place and click `Review + create`.

![storage account details](/uploads/images/2022-06-22/storage_account_details.png)

Azure will run validation on the account and then you'll be able to click
`Create` and it will generate the storage account. You'll get redirected to a
page like this and you should click the `Go to resource` button.

![created storage account](/uploads/images/2022-06-22/created_storage_account.png)

Now you should see all of the details for your storage account. In the left
sidebar, click on `Containers` under the `Data storage` section.

![bicycle project account](/uploads/images/2022-06-22/bicycle_project_account.png)

Then click the `+ Container` button at the top of the new page and you'll see a
right sidebar open. In the name field, type `bikedata` and then click `Create`.
Now we have everything set up for the blob storage to work.

### Get your credentials

You'll need some credentials to connect this remote storage to your machine
learning project.

## Set up a DVC project

First, add DVC as a requirement to your project with the following installation
command:

```dvc
$ pip install 'dvc[s3]'
```

Then you can initialize DVC in your own project with the following command:

```dvc
$ dvc init
```

This will add all of the DVC internals needed to start versioning your data and
tracking experiments. Now we need to set up the remote to connect our project
data stored in AWS to the DVC repo.

### Create a default remote

Now we can add a default to the project with the following command:

```dvc
$ dvc remote add -d bikes s3://updatedbikedata
```

This creates a default remote called `bikes` that connects to the
`updatedbikedata` bucket we made earlier which is where the training data for
the model will be stored.

### Add AWS credentials

In order for DVC to be able to push and pull data from the remote, you need to
have valid AWS credentials.

By default, DVC authenticates using your AWS CLI configuration, if it has been
set. You can do that with the `aws configure` command like in this example:

```dvc
$ aws configure
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]:
Default output format [None]:
```

You can check out more details on this command
[here in the AWS docs](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).

If you want to
[use a different authentication method](https://dvc.org/doc/command-reference/remote/modify#amazon-s3)
or if you run into issues with the credentials, you can manually add them with
the following commands:

```dvc
$ dvc remote modify --local bikes access_key_id 'mykey'
$ dvc remote modify --local bikes secret_access_key 'mysecret'
```

### Push and pull data with DVC

Now you can push data from your local machine to the AWS remote! First, add the
data you want DVC to track with the following command:

```dvc
$ dvc add data
```

This will allow DVC to track the entire `data` directory so it will note when
any changes are made. Then you can push that data to your AWS remote with this
command:

```dvc
$ dvc push
```

Here's what the data might look like in your AWS bucket.

![data in AWS bucket](/uploads/images/2022-05-17/aws_bucket.png)

Then if you move to a different machine or someone else needs to use that data,
it can be accessed by cloning or forking the project repo and running:

```dvc
$ dvc pull
```

This will get any data from your remote and download it to your local machine.

<admon type="info">

Authentication has to be setup locally on any machine you need to pull or push
data from.

</admon>

---

That’s it! Now you can connect any DVC project to an AWS S3 bucket. If you run
into any issues, makes sure to check that your credentials are valid, check if
your user has MFA enabled, and check that the user has the right level of
permissions.
