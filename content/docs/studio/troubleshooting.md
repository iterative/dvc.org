# Troubleshooting

Here we provide help for some of the problems that you may encounter when using
DVC Studio.

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
