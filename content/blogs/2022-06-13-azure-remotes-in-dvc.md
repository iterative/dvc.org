---
title: Syncing Data to Azure Blob Storage
date: 2022-06-13
description: >
  We're going to set up an Azure Blob Storage remote in a DVC project.
descriptionLong: >
  Setting up a remote to make data versioning easier with DVC is a common need
  so we're going to go through a tutorial for doing this with Azure.
picture: 2022-06-13/dvc-azure.png
pictureComment: Using Azure Blob Storage in DVC
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/syncing-data-to-azure-blob-storage/1212
tags:
  - MLOps
  - DVC
  - Git
  - DVC Remotes
  - Azure
  - Collaboration
  - Tutorial
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

![initial Azure page](../uploads/images/2022-06-13/initial_azure.png)

Search for `storage accounts` in the search bar and click `Storage accounts`
under `Services`. Make sure you don't click the "classic" option.

![search for storage account](../uploads/images/2022-06-13/storage_account_search.png)

This will bring you to the `Storage accounts` page where you'll need click the
`Create storage account` button.

![storage accounts page](../uploads/images/2022-06-13/storage_account_page.png)

Now you need to enter a `Resource group` and name for the account. You can
create a new resource group right here, like we do, and call it
`BicycleProject`. We'll name this storage account `bicycleproject`. Then you can
leave all the default settings in place and click `Review + create`.

![storage account details](../uploads/images/2022-06-13/storage_account_details.png)

Azure will run validation on the account and then you'll be able to click
`Create` and it will generate the storage account.

![created storage account](../uploads/images/2022-06-13/created_storage_account.png)

You'll get redirected to a new page and you should click the `Go to resource`
button. Now you should see all of the details for your storage account. In the
left sidebar, got to on `Data storage` > `Containers`.

![bicycle project account](../uploads/images/2022-06-13/bicycle_project_account.png)

Then click the `+ Container` button at the top of the new page and you'll see a
right sidebar open. In the name field, type `bikedata` and then click `Create`.
Now we have everything set up for the blob storage to work.

![new container for bike data](../uploads/images/2022-06-13/bikedata_container.png)

### Set the right roles for your Azure account

You'll need the right roles on your storage account and your container in order
to connect this remote storage to your machine learning project.

On the page for your `bicycleproject` storage account, go to the
`Access Control (IAM)` in the left sidebar.

![update roles for storage account](../uploads/images/2022-06-13/storage_account_iam.png)

On this page, you'll click `Add role assignment` and get directed to the page
with all of the roles.

![update roles for storage account](../uploads/images/2022-06-13/storage_account_role.png)

Select the `Storage Blob Data Contributor` role and click `Next`

![update roles for storage account](../uploads/images/2022-06-13/storage_account_member.png)

Then you can click `+ Select members` to add this role to your user.

You'll also need to go through this exact flow for your `bikedata` container, so
make sure you do this immediately after your storage account is updated.

Since our Azure storage account and container have the correct roles now, let's
set up the project!

## Set up a DVC project

First, add DVC as a requirement to your project with the following installation
command:

```dvc
$ pip install 'dvc[azure]'
```

Then you can initialize DVC in your own project with the following command:

```dvc
$ dvc init
```

This will add all of the DVC internals needed to start versioning your data and
tracking experiments. Now we need to set up the remote to connect our project
data stored in Azure to the DVC repo.

### Create a default remote

Now we can add a default to the project with the following command:

```dvc
$ dvc remote add -d bikes azure://bikedata
```

This creates a default remote called `bikes` that connects to the `bikedata`
container we made earlier which is where the training data for the model will be
stored.

### Add Azure credentials

In order for DVC to be able to push and pull data from the remote, you need to
have valid Azure credentials.

By default, DVC authenticates using your
[Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
configuration.

Run the following command to authenticate with Azure.

```dvc
$ az login
A web browser has been opened at https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize. Please continue the login in the web browser. If no web browser is available or if the web browser fails to open, use device code flow with `az login --use-device-code`.
[
  {
    "cloudName": "AzureCloud",
    "homeTenantId": "some-id",
    "id": "some-id",
    "isDefault": true,
    "managedByTenants": [],
    "name": "Azure subscription 1",
    "state": "Enabled",
    "tenantId": "some-id",
    "user": {
      "name": "test@test.com",
      "type": "user"
    }
  }
]
```

This should open a window that looks like this where you can enter your login
credentials.

![Azure CLI authentication page](../uploads/images/2022-06-13/azure_auth_page.png)

You can check out more details on this command
[here in the Azure docs](https://docs.microsoft.com/en-us/cli/azure/authenticate-azure-cli).
If you want to use a different authentication method with DVC, check out
[our docs here](https://dvc.org/doc/command-reference/remote/modify#microsoft-azure-blob-storage).

You will also need to manually define the storage account name with the
following command:

```dvc
$ dvc remote modify bikes account_name 'bicycleproject'
```

### Push and pull data with DVC

Now you can push data from your local machine to the Azure remote! First, add
the data you want DVC to track with the following command:

```dvc
$ dvc add data
```

This will allow DVC to track the entire `data` directory so it will note when
any changes are made. Then you can push that data to your Azure remote with this
command:

```dvc
$ dvc push
```

Here's what the data might look like in your Azure container.

![data in Azure container](../uploads/images/2022-06-13/data_in_azure.png)

Then if you move to a different machine or someone else needs to use that data,
it can be accessed by cloning or forking the project repo and running:

```dvc
$ dvc pull
```

This will get any data from your remote and download it to your local machine.

<admon type="info">

Authentication has to be setup locally on any machine you need to pull or push
data from. That means running the `az login` command on any other machine. You
don't need to go through the DVC setup again.

</admon>

---

That’s it! Now you can connect any DVC project to an Azure blob storage
container. If you run into any issues, makes sure to check that your credentials
are valid, check if your user has MFA enabled, and check that the user has the
right level of permissions.
