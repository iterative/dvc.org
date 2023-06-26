# Remove a model, version, or stage assignment

To **remove a model** from the model registry, use the `Deprecate model` menu
item in the 3-dot menu next to the model name in the models dashboard or details
page. This action
[creates a new Git tag in your Git repository to indicate that the model has been deprecated](https://mlem.ai/doc/gto/command-reference/deprecate#deprecating-an-artifact).

You can also remove all of a project's models from Iterative Studio by deleting
the project from your projects dashboard. This does not deprecate the model in
the Git repository.

To **deregister a model version**, use the `Deregister version` menu item in the
3-dot menu next to the model name in the models dashboard or the
`Deregister version` button on the model details page. This action creates a new
Git tag in your Git repository to
[indicate that the given model has been deregistered](https://mlem.ai/doc/gto/command-reference/deprecate#deregister-a-version).

To **unassign a stage from a model version**, use the `Unassign stage` menu item
in the 3-dot menu next to the model name in the models dashboard. You can also
click on the the relevant stage assignment pill in the `Stages` section of the
model details page to reveal the `Unassign stage` menu item. This action creates
a new Git tag in your Git repository to
[indicate that the given model version has been unassigned from the given stage](https://mlem.ai/doc/gto/command-reference/deprecate#unassigning-a-stage).

Removing a Git tag from your Git repository also removes the model version or
stage assignment represented by that Git tag. To get this change to reflect in
Iterative Studio, reparse the repository by opening the project in Iterative
Studio and clicking on `Force import` as shown below.

![Showing and hiding columns](https://static.iterative.ai/img/studio/force_import.gif)
