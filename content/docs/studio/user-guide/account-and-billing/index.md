# Account Management

To open your account settings, click on your user icon on the top right corner
of Iterative Studio, and go to your `Profile`. You can view and update the
following settings:

- [Personal details](#personal-details), including name, username and email
  addresses
- [Security details](#security-details), including password, access token, and
  cloud credentials
- [Git integrations](#git-integrations) with GitHub, GitLab and Bitbucket

<admon>

This does not include managing your team plan (Free, Basic, or Enterprise). Team
plans are defined for each team separately. To manage them, go to the [team
settings] page and scroll to the `Plan and billing` section. You can change
plans there and increase or decrease the number of seats in it.

[team settings]: /doc/studio/user-guide/team-collaboration/teams#settings

</admon>

## Personal details

In your profile page, the topmost section includes your first name, last name
and profile picture. If you signed up with a GitHub, GitLab or Bitbucket
account, these details are fetched from your connected Git hosting account.

Your username is displayed next. This is also fetched from your connected Git
hosting account if you signed up with a GitHub, GitLab or Bitbucket account.

You can edit your name as well as username.

### Managing email addresses

You can add multiple email addresses to a single Iterative Studio account. You
can login to the account with any of your verified email addresses as long as
you have set up a password for your account. This is true even if you signed up
using your GitHub, GitLab, or Bitbucket.

One of your email addresses must be designated as primary. This is the address
to which Iterative Studio will send all your account notification emails.

You can change your primary email address by clicking on the `Primary` button
next to the email address which you want to designate as primary.

You can delete your non-primary email addresses.

## Security details

Your password can be changed or reset from the `Account` section in your profile
page.

### Studio access token

Iterative Studio uses access tokens to authorize [DVC] and [DVCLive] to send
experiment updates.

In the `Studio access token` section of your [Profile] page, you can generate a
new token as well as regenerate (replace) or delete your access token.

The option to delete the access token is also available when you change your
password, so that you can reset all your access credentials at once. This is
handy if you suspect that your account security may have been compromised.

### Cloud credentials

In the `Cloud Credentials` section of your [Profile] page, you can view, add and
update credentials for cloud resources. These credentials are used to:

- [fetch project data from data remotes](/doc/studio/user-guide/projects-and-experiments/configure-a-project#data-remotes--cloud-storage-credentials),
  and
- [create cloud resources for running experiments](/doc/studio/user-guide/projects-and-experiments/run-experiments#cloud-experiments).

To add new credentials, click `Add credentials` and select the cloud provider.
Depending on the provider, you will be asked for more details. Note that
[cloud experiments](/doc/studio/user-guide/projects-and-experiments/run-experiments#cloud-experiments)
currently support AWS and GCP.

![](https://static.iterative.ai/img/studio/s3_remote_settings_v2.png)

The credentials must have the required permissions. For
[cloud experiments](/doc/studio/user-guide/projects-and-experiments/run-experiments#cloud-experiments),
the following permissions are needed:

<details>

#### AWS

```
"autoscaling:CreateAutoScalingGroup",
"autoscaling:DeleteAutoScalingGroup",
"autoscaling:DescribeAutoScalingGroups",
"autoscaling:DescribeScalingActivities",
"autoscaling:UpdateAutoScalingGroup",
"ec2:AuthorizeSecurityGroupEgress",
"ec2:AuthorizeSecurityGroupIngress",
"ec2:CancelSpotInstanceRequests",
"ec2:CreateKeyPair",
"ec2:CreateLaunchTemplate",
"ec2:CreateSecurityGroup",
"ec2:CreateTags",
"ec2:DeleteKeyPair",
"ec2:DeleteLaunchTemplate",
"ec2:DeleteSecurityGroup",
"ec2:DescribeAutoScalingGroups",
"ec2:DescribeImages",
"ec2:DescribeInstanceTypeOfferings",
"ec2:DescribeInstances",
"ec2:DescribeKeyPairs",
"ec2:DescribeLaunchTemplates",
"ec2:DescribeScalingActivities",
"ec2:DescribeSecurityGroups",
"ec2:DescribeSpotInstanceRequests",
"ec2:DescribeSubnets",
"ec2:DescribeVpcs",
"ec2:GetLaunchTemplateData",
"ec2:ImportKeyPair",
"ec2:ModifyImageAttribute",
"ec2:ModifyLaunchTemplate",
"ec2:RequestSpotInstances",
"ec2:RevokeSecurityGroupEgress",
"ec2:RevokeSecurityGroupIngress",
"ec2:RunInstances",
"ec2:TerminateInstances",
"s3:CreateBucket",
"s3:DeleteBucket",
"s3:DeleteObject",
"s3:GetObject",
"s3:ListBucket",
"s3:PutObject",
```

See
https://github.com/iterative/terraform-provider-iterative/blob/a92499539f109821c021d1efb1fb01e51f1db47f/docs/guides/permissions/aws/main.tf

</details>

<details>

#### GCP

```
"compute.acceleratorTypes.get",
"compute.diskTypes.get",
"compute.disks.create",
"compute.firewalls.create",
"compute.firewalls.delete",
"compute.firewalls.get",
"compute.globalOperations.get",
"compute.instanceGroupManagers.create",
"compute.instanceGroupManagers.delete",
"compute.instanceGroupManagers.get",
"compute.instanceGroupManagers.update",
"compute.instanceGroups.create",
"compute.instanceGroups.delete",
"compute.instanceGroups.get",
"compute.instanceTemplates.create",
"compute.instanceTemplates.delete",
"compute.instanceTemplates.get",
"compute.instanceTemplates.useReadOnly",
"compute.instances.create",
"compute.instances.delete",
"compute.instances.get",
"compute.instances.setMetadata",
"compute.instances.setServiceAccount",
"compute.instances.setTags",
"compute.machineTypes.get",
"compute.networks.create",
"compute.networks.get",
"compute.networks.updatePolicy",
"compute.subnetworks.use",
"compute.subnetworks.useExternalIp",
"compute.zoneOperations.get",
"iam.serviceAccounts.actAs",
"storage.buckets.create",
"storage.buckets.delete",
"storage.buckets.get",
"storage.multipartUploads.abort",
"storage.multipartUploads.create",
"storage.multipartUploads.list",
"storage.multipartUploads.listParts",
"storage.objects.create",
"storage.objects.delete",
"storage.objects.get",
"storage.objects.list",
"storage.objects.update",
```

See
https://github.com/iterative/terraform-provider-iterative/blob/a92499539f109821c021d1efb1fb01e51f1db47f/docs/guides/permissions/gcp/main.tf

</details>

For
[data remotes](/doc/studio/user-guide/projects-and-experiments/configure-a-project#data-remotes--cloud-storage-credentials),
you can find more details about required permissions [here][data remote].

[data remote]: /doc/user-guide/data-management/remote-storage
[profile]: https://studio.iterative.ai/user/_/profile

Finally, click `Save credentials`.

## Git integrations

In this section, you can,

- Connect to GitHub.com, GitLab.com or Bitbucket.org.

  When you connect to a Git hosting provider, you will be prompted to grant
  Iterative Studio access to your account.

  To connect to your GitHub repositories, you must install the Iterative Studio
  GitHub app. Refer to the section on
  [GitHub app installation](/doc/studio/user-guide/install-github-app) for more
  details.

  Note that if you signed up to use Iterative Studio using your GitHub, GitLb or
  Bitbucket account, integration with that Git account will have been created
  during sign up.

  Also, note that **connections to self-hosted GitLab servers** are not managed
  in this section. If you want to connect to a self-hosted GitLab server, you
  should create a team and
  [set up the GitLab server connection](/doc/studio/user-guide/connect-custom-gitlab-server)
  in the [team settings].

- Disconnect from your GitHub, GitLab, or Bitbucket accounts.
- Configure your GitHub account connection. That is, install the Iterative
  Studio GitHub app on additional organizations or repositories, or even remove
  the app from organizations or repositories where you no longer need it.

## Delete account

If you delete your account, all the projects you own and the links that you have
shared will be permanently deleted. So, click on `Delete my account` only if you
are absolutely sure that you do not need those projects or links anymore.

<admon>

Deleting your account in Iterative Studio does not delete your Git repositories.

</admon>

[dvc]: /doc
[dvclive]: /doc/dvclive
