# Assign stages to models

To manage model lifecycle, you can assign stages (such as `development`,
`staging`, `production`, etc.) to specific model versions.

To assign a stage to a model version, Iterative Studio uses [GTO] to create an
[annotated Git tag][git tag] with the specified stage and version number. Refer
the [GTO docs][gto] to see the exact format of the Git tag.

You can write CI/CD actions that can actually deploy the models to the different
deployment environments upon the creation of a new Git tag for stage assignment.
For that, you can leverage any ML model deployment tool, such as MLEM.

You can assign stages using the [GTO] CLI. To assign stages using Iterative
Studio, watch this tutorial video or read on below:

https://www.youtube.com/watch?v=Vrp1O5lkWBo

1. On the models dashboard, open the 3-dot menu for the model whose version you
   want to assign the stage to. Then, click on `Assign stage`. This action can
   also be initiated from the model details page or from the related project’s
   experiment table - look for the `Assign stage` button or icon.

2. Select the version to which you want to assign the stage.
3. Enter the stage name (eg, `development`, `staging`, `production`).

   <admon>

   You can define the list of stages in the `.gto` config file, which is a
   `yaml` structured file that allows you to specify artifact types and stages.
   If you have defined the stages in this file, then you can assign to these
   stages only. But if you have not defined the list of stages, you can enter
   any string as the stage name. Note the following:

   - GTO config files with stage names are specific to a Git repository. So,
     they apply only to models within one repository.
   - Currently, you cannot make entries to the GTO config file from Iterative
     Studio.
   - If you define stages in the config file at any point, any stage assignments
     after that point can use only the names defined in the config file.

   </admon>

4. Optionally, provide a Git tag message.
5. Click on `Assign stage`.
6. Once the action is successful, the stage assignment will show up in the
   `Stages` column of the models dashboard.
7. If you open the model details page, the stage assignment will be visible in
   the model `History` section as well as in the `Stages` section.
8. If you go to your Git repository, you will see that a new Git tag referencing
   the selected version and stage has been created, indicating the stage
   assignment.

[gto]: https://github.com/iterative/gto
[git tag]: https://git-scm.com/docs/git-tag
