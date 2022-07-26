# View models

You can find all your models in the [models dashboard](#models-dashboard). Each
model has separate [model details pages](#model-details-page) for all its model
versions. Also, all models from a given Git repository are included as
[`model` columns in the experiment tables](#model-columns-in-the-projects-experiment-table)
of those projects that connect to this Git repository.

## Models dashboard:

The models in your model registry are organized in a central dashboard that
facilitates search and discovery.

![](https://static.iterative.ai/img/studio/models-dashboard.png)

You can sort the models in the dashboard by several criteria, including model
framework, repository, etc.

Iterative Studio consolidates the stages of all the models in the registry, and
provides a way to filter models by stages.

Iterative Studio also consolidates the frameworks of all the models in the
registry, and provides a way to filter models by framework. Note that the
framework of a model is identified by Iterative’s model deployment tool [MLEM].
If you have not used MLEM, then Iterative Studio will use a generic framework
label (`G`) to indicate that the model framework was not identified, and that
the model was registered using [GTO].

## Model details page:

You can open the details of any model in the registry by clicking on the name of
the model in the models dashboard.

![](https://static.iterative.ai/img/studio/model-details-page.png)

A model details page is divided into the following sections:

- Top section: This contains
  - the model name,
  - a link to the model’s Git repository,
  - latest registered version of the model,
  - a button to
    [register a new version](/doc/studio/user-guide/model-registry/register-version),
    and
  - information about how many projects in Iterative Studio have been created
    from the model’s Git repository.
- Left section: The left section contains information that is specific to a
  particular registered version of the model. It has a version picker, which you
  can use to switch between different registered versions of the model. For the
  selected version, the left section shows
  - a button to
    [assign a stage to the version](/doc/studio/user-guide/model-registry/assign-stage),
  - the path to the model,
  - the version description,
  - labels, and
  - model methods. Note that the methods of a model are identified by
    Iterative’s model deployment tool [MLEM]. If you have not used MLEM, then
    Iterative Studio will not display any methods for the model.
- Right section: The right section contains information that is applicable
  across all the versions of the model. In particular, it displays
  - the assigned stages for the different versions, and
  - the history of all version registration and stage assignment actions.

## Model columns in the project’s experiment table:

The models will also appear as `model` columns in the experiment tables of those
projects that have been created from the Git repository to which the model
belongs.

![](https://static.iterative.ai/img/studio/model-columns-in-experiment-table.png)

[mlem]: https://mlem.ai/
[gto]: https://github.com/iterative/gto
