# Troubleshooting

Here we provide help for some of the problems that you may encounter when using
DVC Studio.

- [Error: No data found to visualize](#error-no-data-found-to-visualize)
- [Error: No DVC repo was found at the root](#error-no-dvc-repo-was-found-at-the-root)
- [Error: Non-DVC sub-directory of a monorepo](#error-non-dvc-sub-directory-of-a-monorepo)
- [Error: No commits were found for the sub-directory](#error-no-commits-were-found-for-the-sub-directory)
- [View got created, but does not contain any data](#view-got-created-but-does-not-contain-any-data)
- [View does not contain the columns that I want](#view-does-not-contain-the-columns-that-i-want)
- [View contains columns that I did not import](#view-contains-columns-that-i-did-not-import)

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
[how to prepare your Git repositories for use with DVC Studio](/doc/studio/user-guide/prepare-repositories).
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
want to connect from DVC Studio, but you specify B when creating the view, then
you will get the above error.

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

1. **The required columns were not imported:** DVC Studio will import up to 200
   columns (metrics, hyperparameters and files) from your Git repository. If
   your repository has more than 200 columns, you should
   [select the columns that are mandatory to import](/doc/studio/user-guide/views/view-settings#mandatory-columns).
   DVC Studio will also import the unselected columns, but only up to a maximum
   of 200 columns.

   **What if there are more than 200 mandatory columns?**<br>Currently DVC
   Studio cannot import over 200 columns. If you have a large repository (with
   more than 200 mandatory columns), one solution is to create a mono repo - if
   your ML project can be divided into sub-projects, create a
   [monorepo](https://en.wikipedia.org/wiki/Monorepo) where each sub-project
   resides in a separate directory in the monorepo. Then, for each sub-project,
   create a view.<br><br>To create views in the case of a monorepo,
   [specify the project directory in view settings](/doc/studio/user-guide/views/view-settings#project-directory).<br><br>If
   this solution does not work for your use case, please create a support ticket
   in the
   [DVC Studio support GitHub repository](https://github.com/iterative/studio-support).

2. **The required columns are hidden:** In the view, you can hide the columns
   that you do not want to display. If any column that you want is not visible,
   make sure you have not hidden it. The following video shows how you can
   show/hide columns. Once you show/hide columns, remember to save the changes.

   ###### Show/hide columns

   ![](https://static.iterative.ai/img/studio/show_hide_columns.gif)

## View contains columns that I did not import

This is not an error. Columns that you select as mandatory in view settings are
guaranteed to be imported. However, columns that are not selected can still be
imported and included in the view - if you have selected less than 200 columns,
DVC Studio will also import DVC Studio will also import some of the unselected
columns, up to a total of 200 columns.

If you would like to explicitly hide columns, you can simply hide them in the
view. Once you show/hide columns, you can save the changes. Check out the
[above video](#showhide-columns) to see how you can show/hide columns. Once you
show/hide columns, remember to save the changes.
