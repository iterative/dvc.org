# Troubleshooting

Here we provide help for some of the problems that you may encounter when using
Iterative Studio.

- [Error: No data found to visualize](#error-no-data-found-to-visualize)
- [Error: No DVC repo was found at the root](#error-no-dvc-repo-was-found-at-the-root)
- [Error: Non-DVC sub-directory of a monorepo](#error-non-dvc-sub-directory-of-a-monorepo)
- [Error: No commits were found for the sub-directory](#error-no-commits-were-found-for-the-sub-directory)
- [View got created, but does not contain any data](#view-got-created-but-does-not-contain-any-data)
- [View does not contain the columns that I want](#view-does-not-contain-the-columns-that-i-want)
- [View contains columns that I did not import](#view-contains-columns-that-i-did-not-import)
- [View does not contain some of my commits or branches](#view-does-not-contain-some-of-my-commits-or-branches)
- [Error: Failed to push experiment to repository](#error-failed-to-push-experiment-to-repository)

## Support

If you need further help, please send us a message using `Help` on the
[project website](https://studio.iterative.ai). You can also create a support
ticket on [GitHub](https://github.com/iterative/studio-support) or join the
discussion in [Discord](https://discord.com/invite/dvwXA2N).

## Error: No data found to visualize

If you have connected to a non-DVC repository, then you need to specify custom
files that contain the metrics and hyperparameters that you want to visualize.
Otherwise, you will get this message when you try to create a view:
`We could not find data to visualize in this repo`.

For more details, refer to the section on
[how to prepare your Git repositories for use with Iterative Studio](/doc/studio/user-guide/prepare-repositories).
Instructions on how to specify custom files can be found
[here](/doc/studio/user-guide/views/view-settings#configuring-view-settings).

## Error: No DVC repo was found at the root

If you get this message when you try to create a view:
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
[here](/doc/studio/user-guide/views/view-settings#configuring-view-settings).

## Error: Non-DVC sub-directory of a monorepo

If you get this message when you try to create a view:
`Non-DVC sub-directory of a monorepo`, then it means that you have connected to
a Git repository which contains a DVC repository in some sub-directory, but you
have selected the incorrect sub-directory.

This could be a typical situation when your DVC repository is part of a
[monorepo](https://en.wikipedia.org/wiki/Monorepo). Suppose your Git repository
contains sub-directories A and B. If A contains the DVC repository which you
want to connect from Iterative Studio, but you specify B when creating the view,
then you will get the above error.

To solve this, you can either:

- specify the full path to the correct sub-directory that contains the DVC repo,
  or
- specify custom files that contain the metrics and hyperparameters that you
  want to visualize.

Instructions on how to specify the sub-directory or custom files can be found
[here](/doc/studio/user-guide/views/view-settings#configuring-view-settings).

## Error: No commits were found for the sub-directory

If you get this message when you try to create a view:
`No commits were found for the sub-directory`, then it means that you have
specified an empty or non-existent sub-directory.

To solve this, you need to change the sub-directory and specify the full path to
the correct sub-directory that contains the DVC repo.

If you did not intend to work with a DVC repo, you can also specify custom files
that contain the metrics and hyperparameters that you want to visualize.

Instructions on how to specify the sub-directory or custom files can be found
[here](/doc/studio/user-guide/views/view-settings#configuring-view-settings).

## View got created, but does not contain any data

If you initiatlized a DVC repository, but did make any commit with data, metrics
or hyperparameters, then you will be able to connect to this repository and
create a view. However, the view will be empty. To solve this, either make
relevant commits to your DVC repository. Or, specify custom files with the
metrics or hyperparameters that you want to visualize.

Refer to the [DVC documentation](https://dvc.org/doc) for help on making commits
to a DVC repository. Instructions on how to specify custom files can be found
[here](/doc/studio/user-guide/views/view-settings#configuring-view-settings).

## View does not contain the columns that I want

There are two possible reasons for this:

1. **The required columns were not imported:** Iterative Studio will import up
   to 200 columns (metrics, hyperparameters and files) from your Git repository.
   If your repository has more than 200 columns, you should
   [select the columns that are mandatory to import](/doc/studio/user-guide/views/view-settings#mandatory-columns).
   Iterative Studio will also import the unselected columns, but only up to a
   maximum of 200 columns.

   **What if there are more than 200 mandatory columns?** Currently Iterative
   Studio cannot import over 200 columns. If you have a large repository (with
   more than 200 mandatory columns), one solution is to split the
   metrics/<wbr>hyperparameters/<wbr>files that you want to display over
   multiple subdirectories in your git repository. For each subdirectory, you
   can create a new view that is limited to that subdirectory.

   To create views for subdirectories,
   [specify the project directory in view settings](/doc/studio/user-guide/views/view-settings#project-directory).

   If this solution does not work for your use case, please create a support
   ticket in the
   [Iterative Studio support GitHub repository](https://github.com/iterative/studio-support).

2. **The required columns are hidden:** In the view, you can hide the columns
   that you do not want to display. If any column that you want is not visible,
   make sure you have not hidden it. The following video shows how you can
   show/hide columns. Once you show/hide columns, remember to save the changes.

   ###### Show/hide columns

   ![Showing and hiding columns](https://static.iterative.ai/img/studio/show_hide_columns.gif)

## View contains columns that I did not mark as mandatory to import

This is not an error. Columns that you select as mandatory in view settings are
guaranteed to be imported. However, columns that are not selected can still be
imported and included in the view - if you have selected less than 200 columns,
Iterative Studio will also import some of the unselected columns, up to a total
of 200 columns.

If you would like to explicitly hide columns, you can simply hide them in the
view. Once you show/hide columns, you can save the changes. Check out the
[above video](#showhide-columns) to see how you can show/hide columns. Once you
show/hide columns, remember to save the changes.

## View does not contain some of my commits or branches

This is likely not an error. Iterative Studio identifies commits that do not
change metrics, files or hyperparameters and will auto-hide such commits. You
can also manually hide commits and branches. So, it is possible that the commits
or branches you do not see in your view were manually hidden by you or someone
else in your team.

You can unhide commits/branches to display them in your view. For details, refer
to
[Display preferences -> Hide commits](/doc/studio/user-guide/views/explore-experiments#hide-commits).
However, if the missing commit/branch is not in the hidden commits list, then
please [raise a support request](#support).

## Error: Failed to push experiment to repository

This is a non-specific error with a range of possible causes. To resolve it,
please check:

- Your account is able to push to the repository.
- The repository is **not** marked as archived / read only.
- In case of GitHub/GitLab/BitBucket enterprise organizations: there is no IP
  whitelisting policy in place which limits access to the organization's
  resources.
- Whether [GitHub][gh-status], [GitLab][gl-status], or [BitBucket][bb-status]
  are experiencing service disruptions. In case of an on-prem deployment, please
  check with your administrator.

[gh-status]: https://www.githubstatus.com/
[gl-status]: https://status.gitlab.com/
[bb-status]: https://bitbucket.status.atlassian.com/

If you get this error and none of the above applies, please
[get in touch with us](#support).
