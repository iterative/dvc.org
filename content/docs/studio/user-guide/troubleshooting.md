# Troubleshooting

Here we provide help for some of the problems that you may encounter when using
Iterative Studio.

## Support

If you need further help, you can send us a message using `Help` on the
[Iterative Studio website](https://studio.iterative.ai). You can also
[email us](mailto:support@iterative.ai), create a support ticket on
[GitHub](https://github.com/iterative/studio-support) or join the discussion in
[Discord](https://discord.com/invite/dvwXA2N).

## Projects and experiments

- [Errors accessing your Git repository](#errors-accessing-your-git-repository)
- [Errors related to parsing the repository](#errors-related-to-parsing-the-repository)
- [Errors related to DVC remotes and credentials](#errors-related-to-dvc-remotes-and-credentials)

- [Error: No data found to visualize](#error-no-data-found-to-visualize)
- [Error: No DVC repo was found at the root](#error-no-dvc-repo-was-found-at-the-root)
- [Error: Non-DVC sub-directory of a monorepo](#error-non-dvc-sub-directory-of-a-monorepo)
- [Error: No commits were found for the sub-directory](#error-no-commits-were-found-for-the-sub-directory)
- [Project got created, but does not contain any data](#project-got-created-but-does-not-contain-any-data)
- [Project does not contain the columns that I want](#project-does-not-contain-the-columns-that-i-want)
- [Project does not contain some of my commits or branches](#project-does-not-contain-some-of-my-commits-or-branches)

- [Error: Missing metric or plot file(s)](#error-missing-metric-or-plot-files)
- [Error: Base commit not found](#error-base-commit-not-found)
- [Error: Failed to push experiment to repository](#error-failed-to-push-experiment-to-repository)
- [Project does not display live metrics and plots](#project-does-not-display-live-metrics-and-plots)
- [Project does not display DVC experiments](#project-does-not-display-dvc-experiments)
- [Error: `dvc.lock` validation failed](#error-dvclock-validation-failed)
- [Project does not reflect updates in the Git repository ](#project-does-not-reflect-updates-in-the-git-repository)

## Model registry

- [I cannot find my desired Git repository in the form to add a model](#i-cannot-find-my-desired-git-repository-in-the-form-to-add-a-model)
- [Model registry does not display the models in my Git repositories](#model-registry-does-not-display-the-models-in-my-git-repositories)
- [My models have disappeared even though I did not remove (deprecate) them](#my-models-have-disappeared-even-though-i-did-not-remove-deprecate-them)

## Billing and payment

- [Questions or problems with billing and payment](#questions-or-problems-with-billing-and-payment)

## Errors accessing your Git repository

When Iterative Studio cannot access your Git repository, it can present one of
the following errors:

- Repository not found or you don't have access to it
- Unable to access repository due to stale authorization
- Unable to access repository
- Could not access the git repository, because the connection was deleted or the
  token was expired
- No tokens to access the repo
- Insufficient permission to push to this repository
- No access to this repo

To fix this, make sure that the repository exists and you have access to it.
Re-login to the correct Git account and try to import the repository again. If
you are connecting to a GitHub account, also make sure that the Iterative Studio
GitHub app is installed.

Additionally, network or third party issues (such as GitHub, GitLab or Bitbucket
outages) can also cause connection issues. In this case, Iterative Studio can
display an appropriate indication in the error message.

## Errors related to parsing the repository

If you see one of the following errors, it means that for some reason, parsing
of the Git repository could not start or it stopped unexpectedly. You can try to
import the repo again.

- Failed to start parsing
- Parsing stopped unexpectedly

## Errors related to DVC remotes and credentials

Iterative Studio can include data from
[data remotes](/doc/studio/user-guide/projects-and-experiments/configure-a-project#data-remotes-cloudremote-storage)
in your project. However, it can access data from network-accessible remotes
such as Amazon S3, Microsoft Azure, etc but not from [local DVC
remotes][local-dvc-remotes]. If your project uses an unsupported remote, you
will see one of the following errors:

- Local remote was ignored
- Remote not supported

Please use one of the following types of data remotes: Amazon S3, Microsoft
Azure, Google Drive, Google Cloud Storage and SSH.

If the data remotes have access control, then you should [add the required
credentials to your project][cloud-credentials]. If credentials are missing or
incorrect, you will see one of the following errors:

- No credentials were provided
- Credentials are either broken or not recognized
- No permission to fetch remote data

### Errors related to DVC remotes behind firewall

For self-hosted S3 storage(like Minio) or SSH server, ensure that it is
available to access from the internet. If your server is behind the firewall,
you can limit the traffic on the firewall to the server to allow access from our
IP addresses only, which are:

```
3.21.85.173/32
3.142.203.124/32
```

Additionally, if you provide the hostname, the DNS records associated with the
storage server should be publicly available to resolve the server name. Use
[DNS Propagation Checker](https://www.whatsmydns.net/) to confirm if the server
domain is resolvable. If you still have any trouble setting up the connection to
your server, please [contact us](/doc/studio/troubleshooting#support).

## Error: No data found to visualize

If you have connected to a non-DVC repository, then you need to specify custom
files that contain the metrics and hyperparameters that you want to visualize.
Otherwise, you will get this message when you try to add a project:
`We could not find data to visualize in this repo`.

For more details, refer to the section on how to [prepare your Git repositories]
for use with Iterative Studio. Instructions on how to specify custom files can
be found [here][project-settings].

Note that if you're connecting to a repository just to fetch models for the
model registry, and you are not working with DVC repositories, you can ignore
this error.

[prepare your git repositories]:
  /doc/studio/user-guide/prepare-your-repositories
[project-settings]:
  /doc/studio/user-guide/projects-and-experiments/configure-a-project#configuring-project-settings

## Error: No DVC repo was found at the root

If you get this message when you try to add a project:
`No DVC repo was found at the root`, then it means that you have connected to a
Git repository which contains a DVC repository in some sub-directory but not at
the root.

This could be a typical situation when your DVC repository is part of a
[monorepo](https://en.wikipedia.org/wiki/Monorepo).

To solve this, you can either:

- specify the full path to the sub-directory that contains the DVC repo, or
- specify custom files that contain the metrics and hyperparameters that you
  want to visualize.

Instructions on how to specify the sub-directory or custom files can be found
[here][project-settings].

Note that if you're connecting to a repository just to fetch models for the
model registry, and you are not working with DVC repositories, you can ignore
this error.

## Error: Non-DVC sub-directory of a monorepo

If you get this message when you try to add a project:
`Non-DVC sub-directory of a monorepo`, then it means that you have connected to
a Git repository which contains a DVC repository in some sub-directory, but you
have selected the incorrect sub-directory.

This could be a typical situation when your DVC repository is part of a
[monorepo](https://en.wikipedia.org/wiki/Monorepo). Suppose your Git repository
contains sub-directories A and B. If A contains the DVC repository which you
want to connect from Iterative Studio, but you specify B when creating the
project, then you will get the above error.

To solve this, you can either:

- specify the full path to the correct sub-directory that contains the DVC repo,
  or
- specify custom files that contain the metrics and hyperparameters that you
  want to visualize.

Instructions on how to specify the sub-directory or custom files can be found
[here][project-settings].

## Error: No commits were found for the sub-directory

If you get this message when you try to add a project, then it means that you
have specified an empty or non-existent sub-directory.

To solve this, you need to change the sub-directory and specify the full path to
the correct sub-directory that contains the DVC repo.

If you did not intend to work with a DVC repo, you can also specify custom files
that contain the metrics and hyperparameters that you want to visualize.

Instructions on how to specify the sub-directory or custom files can be found
[here][project-settings].

## Project got created, but does not contain any data

If you initialized a DVC repository, but did not push any commit with data,
metrics or hyperparameters, then even though you will be able to connect to this
repository, the project will appear empty in Iterative Studio. To solve this,
either make relevant commits to your DVC repository, or specify custom files
with the metrics or hyperparameters that you want to visualize.

Refer to the [DVC documentation](https://dvc.org/doc) for help on making commits
to a DVC repository. Instructions on how to specify custom files can be found
[here][project-settings].

Note that if you're connecting to a repository just to fetch models for the
model registry, and your repository is not expected to contain experiment data,
metrics or hyperparameters, your project will appear empty. This is ok - you
will still be able to work with your models in the model registry.

## Project does not contain the columns that I want

There are two possible reasons for this:

1. **The required columns were not imported:** Iterative Studio will only import
   columns that you select in the
   [**Columns** setting](/doc/studio/user-guide/projects-and-experiments/configure-a-project#columns).

   **What if the repository has more than 500 columns?** Currently Iterative
   Studio does not import over 500 columns. If you have a large repository (with
   more than 500 columns), one solution is to split the
   metrics/<wbr>hyperparameters/<wbr>files that you want to display over
   multiple subdirectories in your Git repository. For each subdirectory, you
   can create a new project in Iterative Studio and limit it to that
   subdirectory.

   To create projects for subdirectories, [specify the project directory in
   project settings].

   If this solution does not work for your use case, please create a support
   ticket in the [Iterative Studio support GitHub repository].

[specify the project directory in project settings]:
  /doc/studio/user-guide/projects-and-experiments/configure-a-project#project-directory
[iterative studio support github repository]:
  https://github.com/iterative/studio-support

2. **The required columns are hidden:** In the project's experiment table, you
   can hide the columns that you do not want to display. If any column that you
   want is not visible, make sure you have not hidden it. The following video
   shows how you can show/hide columns. Once you show/hide columns, remember to
   save the changes.

   #### Show/hide columns

   ![Showing and hiding columns](https://static.iterative.ai/img/studio/show_hide_columns.gif)

## Project does not contain some of my commits or branches

This is likely not an error. Iterative Studio identifies commits that do not
change metrics, files or hyperparameters and will auto-hide such commits. It
also auto-hides commits that contain the string `[skip studio]` in the commit
message. You can also manually hide commits and branches, which means it is
possible that the commits or branches you do not see in your project were
manually hidden by you or someone else in your team.

You can unhide commits and branches to display them. For details, refer to
[Display preferences -> Hide commits]. However, if the missing commit/branch is
not in the hidden commits list, please [raise a support request](#support).

[display preferences -> hide commits]:
  /doc/studio/user-guide/projects-and-experiments/explore-ml-experiments#hide-commits

## Error: Missing metric or plot file(s)

This error message means that the metric or plot files referenced from
`dvc.yaml` could not be found in your Git repository or cache. Make sure that
you have pushed the required files using `dvc push`. Then try to import the
repository again.

## Error: Skipped big remote file(s)

Files that are larger than 10 MB are currently skipped by Iterative Studio.

## Error: Base commit not found

The base commit which you have selected cannot be found in your Git repository.
Check if the commit has been removed from your Git repository.

## Error: Failed to push experiment to repository

This is a non-specific error with a range of possible causes. To resolve it,
check that:

- Your account is able to push to the Git repository.

  <admon>

  If your Git account does not have write access on the Git repository connected
  to a project, you cannot push changes (e.g., new experiments) to the
  repository even if the project belongs to a team
  [where you are an `Editor` or `Admin`](/doc/studio/user-guide/teams#roles).

  </admon>

- The repository is **not** marked as archived / read only.
- In case of GitHub/GitLab/BitBucket enterprise organizations: there is no IP
  whitelisting policy in place which limits access to the organization's
  resources.
- Whether [GitHub][gh-status], [GitLab][gl-status], or [BitBucket][bb-status]
  are experiencing service disruptions. In case of an on-premises deployment, do
  check with your administrator.

[gh-status]: https://www.githubstatus.com/
[gl-status]: https://status.gitlab.com/
[bb-status]: https://bitbucket.status.atlassian.com/
[local-dvc-remotes]:
  /doc/user-guide/data-management/remote-storage#file-systems-local-remotes
[cloud-credentials]:
  /doc/studio/user-guide/projects-and-experiments/configure-a-project#data-remotes--cloud-storage-credentials

If you get this error and none of the above applies, please
[get in touch with us](#support).

## Project does not display live metrics and plots

Confirm that you are correctly following the
[procedure to send live metrics and plots](/doc/studio/user-guide/projects-and-experiments/live-metrics-and-plots)
to Iterative Studio.

Note that a live experiment is nested under the parent Git commit in the project
table. If the parent Git commit is not pushed to the Git repository, the live
experiment row will appear within a `Detached experiments` dummy branch in the
project table. Once you push the missing parent commit to the Git remote, the
live experiment will get nested under the parent commit as expected.

## Project does not display DVC experiments

Iterative Studio automatically checks for updates to your repository using
webhooks, but it can not rely on this mechanism for custom Git objects, like
<abbr>DVC experiment</abbr> references. So the experiments you push using
`dvc exp push` may not automatically display in your project table.

To manually check for updates in your repository, use the `Reload` button 🔄
located above the project table.

## Error: `dvc.lock` validation failed

This error indicates that the `dvc.lock` file in the given commit has an invalid
YAML. If the given commit is unimportant to you, you can ignore this error.

One potential cause for this error is that at the time of the given commit, your
repository used DVC 1.0. The format of lock files used in DVC 1.0 was deprecated
in the DVC 2.0 release. Upgrading to the latest DVC version will resolve this
issue for any future commits in your repository.

## Project does not reflect updates in the Git repository

When there are updates (new commits, branches, etc.) in your Git repository,
your project in Iterative Studio gets reflected to include those updates. If the
project has stopped receiving updates from the Git repository and you have to
`force import` the project each time to get any new commit, then it is possible
that the Iterative Studio webhook in your repository got deleted or messed up.

Iterative Studio periodically checks for any missing or messed up webhooks, and
attempts to re-create them. Currently, this happens every 2 hours. The webhook
also gets re-created every time you create a new project or force import a
repository.

## I cannot find my desired Git repository in the form to add a model

Only repositories that you have connected to Iterative Studio are available in
the `Add a model` form. To connect your desired repository to Iterative Studio,
go to the `Projects` tab and [create a project that connects to this Git
repository][create a project]. Then you can come back to the model registry and
add the model.

## Model registry does not display the models in my Git repositories

For a model to be displayed in the model registry, it has to be registered using
[GTO]. You can [register the model] from Iterative Studio or with the [`gto`
CLI].

## My models have disappeared even though I did not remove (deprecate) them

When a project is deleted, all its models get automatically removed from the
model registry. So check if the project has been removed. If yes, you can [add
the project][create a project] again. Deleting a project from Iterative Studio
does not delete any commits or tags from the Git repository. So, adding the
project back will restore all the models from the repository along with their
details, including versions and stage assignments.

## Questions or problems with billing and payment

Check out the [Frequently Asked Questions](https://studio.iterative.ai/faq) to
see if your questions have already been answered. If you still have problems,
please [contact us](#support).

[gto]: /doc/gto
[register the model]: /doc/studio/user-guide/model-registry/add-a-model
[`gto` cli]: /doc/gto/command-reference
[create a project]:
  /doc/studio/user-guide/projects-and-experiments/create-a-project
