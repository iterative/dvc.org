<admon>

**We have renamed Views to Projects in Iterative Studio.**

Accordingly, _Views dashboard_ is now called _Projects dashboard_; _View
settings_ are now called _Project settings_; and so on.

</admon>

# Troubleshooting

Here we provide help for some of the problems that you may encounter when using
Iterative Studio.

**Projects and experiments**

- [Error: No data found to visualize](#error-no-data-found-to-visualize)
- [Error: No DVC repo was found at the root](#error-no-dvc-repo-was-found-at-the-root)
- [Error: Non-DVC sub-directory of a monorepo](#error-non-dvc-sub-directory-of-a-monorepo)
- [Error: No commits were found for the sub-directory](#error-no-commits-were-found-for-the-sub-directory)
- [Project got created, but does not contain any data](#project-got-created-but-does-not-contain-any-data)
- [Project does not contain the columns that I want](#project-does-not-contain-the-columns-that-i-want)
- [Project contains columns that I did not import](#project-contains-columns-that-i-did-not-mark-as-mandatory-to-import)
- [Project does not contain some of my commits or branches](#project-does-not-contain-some-of-my-commits-or-branches)
- [Error: Failed to push experiment to repository](#error-failed-to-push-experiment-to-repository)

**Model registry**

- [I cannot find my desired Git repository in the form to add a model](#i-cannot-find-my-desired-git-repository-in-the-form-to-add-a-model)
- [Model registry does not display the models in my Git repositories](#model-registry-does-not-display-the-models-in-my-git-repositories)
- [How can I remove models from my model registry](#how-can-i-remove-models-from-my-model-registry)
- [How can I un-assign stages from model versions](#how-can-i-un-assign-stages-from-model-versions)

**Billing and payment**

- [Questions or problems with billing and payment](#questions-or-problems-with-billing-and-payment)

## Support

If you need further help, please send us a message using `Help` on the
[Iterative Studio website](https://studio.iterative.ai). You can also
[email us](mailto:support@iterative.ai), create a support ticket on
[GitHub](https://github.com/iterative/studio-support) or join the discussion in
[Discord](https://discord.com/invite/dvwXA2N).

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

If you get this message when you try to add a project:
`No commits were found for the sub-directory`, then it means that you have
specified an empty or non-existent sub-directory.

To solve this, you need to change the sub-directory and specify the full path to
the correct sub-directory that contains the DVC repo.

If you did not intend to work with a DVC repo, you can also specify custom files
that contain the metrics and hyperparameters that you want to visualize.

Instructions on how to specify the sub-directory or custom files can be found
[here][project-settings].

## Project got created, but does not contain any data

If you initialized a DVC repository, but did make any commit with data, metrics
or hyperparameters, then you will be able to connect to this repository.
However, the project will appear empty in Iterative Studio. To solve this,
either make relevant commits to your DVC repository. Or, specify custom files
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

1. **The required columns were not imported:** Iterative Studio will import up
   to 200 columns (metrics, hyperparameters and files) from your Git repository.
   If your repository has more than 200 columns, you should [select the columns
   that are mandatory to import]. Iterative Studio will also import the
   unselected columns, but only up to a maximum of 200 columns.

   **What if there are more than 200 mandatory columns?** Currently Iterative
   Studio cannot import over 200 columns. If you have a large repository (with
   more than 200 mandatory columns), one solution is to split the
   metrics/<wbr>hyperparameters/<wbr>files that you want to display over
   multiple subdirectories in your git repository. For each subdirectory, you
   can create a new project in Iterative Studio and limit it to that
   subdirectory.

   To create projects for subdirectories, [specify the project directory in
   project settings].

   If this solution does not work for your use case, please create a support
   ticket in the [Iterative Studio support GitHub repository].

[select the columns that are mandatory to import]:
  /doc/studio/user-guide/projects-and-experiments/configure-a-project#mandatory-columns
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

## Project contains columns that I did not mark as mandatory to import

This is not an error. Columns that you select as mandatory in project settings
are guaranteed to be imported. However, columns that are not selected can still
be imported and included in the project - if you have selected less than 200
columns, Iterative Studio will also import some of the unselected columns, up to
a total of 200 columns.

If you would like to explicitly hide columns, you can simply hide them in the
project. Once you show/hide columns, you can save the changes. Check out the
[above video](#showhide-columns) to see how you can show/hide columns. Once you
show/hide columns, remember to save the changes.

## Project does not contain some of my commits or branches

This is likely not an error. Iterative Studio identifies commits that do not
change metrics, files or hyperparameters and will auto-hide such commits. You
can also manually hide commits and branches. So, it is possible that the commits
or branches you do not see in your project were manually hidden by you or
someone else in your team.

You can unhide commits and branches to display them. For details, refer to
[Display preferences -> Hide commits]. However, if the missing commit/branch is
not in the hidden commits list, then please [raise a support request](#support).

[display preferences -> hide commits]:
  /doc/studio/user-guide/projects-and-experiments/explore-ml-experiments#hide-commits

## Error: Failed to push experiment to repository

This is a non-specific error with a range of possible causes. To resolve it,
please check:

- Your account is able to push to the repository.
- The repository is **not** marked as archived / read only.
- In case of GitHub/GitLab/BitBucket enterprise organizations: there is no IP
  whitelisting policy in place which limits access to the organization's
  resources.
- Whether [GitHub][gh-status], [GitLab][gl-status], or [BitBucket][bb-status]
  are experiencing service disruptions. In case of an on-premises deployment,
  please check with your administrator.

[gh-status]: https://www.githubstatus.com/
[gl-status]: https://status.gitlab.com/
[bb-status]: https://bitbucket.status.atlassian.com/

If you get this error and none of the above applies, please
[get in touch with us](#support).

## I cannot find my desired Git repository in the form to add a model

Only repositories that you have connected to Iterative Studio are available in
the `Add a model` form. To connect your desired repository to Iterative Studio,
go to the `Projects` tab and
[create a project that connects to this Git repository](/doc/studio/user-guide/projects-and-experiments/create-a-project).
Then you can come back to the model registry and add the model.

## Model registry does not display the models in my Git repositories

For a model to be displayed in the model registry, it has to be registered using
[GTO]. You can [register the model] from Iterative Studio or with GTO's CLI.

## How can I remove models from my model registry

To remove models from the model registry, you should remove the associated
project from your projects dashboard.

## How can I un-assign stages from model versions

To un-assign any stage from a model, open the corresponding Git repository (in
GitHub, GitLab or Bitbucket). Then, remove the Git tag pertaining to the stage
that you want to un-assign.

After removing the Git tag, reparse the repository. To do this, open the project
in Iterative Studio and then click on `Force import` as shown below.

![Showing and hiding columns](https://static.iterative.ai/img/studio/force_import.gif)

Currently, you cannot un-assign stages from the Iterative Studio user interface.

## Questions or problems with billing and payment

Check out the [Frequently Asked Questions](https://studio.iterative.ai/faq) to
see if your questions have already been answered. If you still have problems,
please [contact us](#support).

[gto]: https://github.com/iterative/gto
[register the model]: /doc/studio/user-guide/model-registry/add-a-model
