# Promote models

To manage model lifecycle, you can promote specific model versions to different
stages (such as `development`, `staging`, `production`, etc.).

To assign a stage to a model version, Iterative Studio uses [GTO] to create an
[annotated Git tag][git tag] with the specified stage and version number. Refer
the [GTO docs][gto] to see the exact format of the Git tag.

You can write CI/CD actions that can actually deploy the models to the different
deployment environments upon the creation of a new Git tag for stage assignment.
For that, you can leverage any ML model deployment tool, such as MLEM.

You can assign stages using the [GTO] CLI. To assign stages using Iterative
Studio, watch this tutorial video or read on below:

**_TODO: Replace the below with the tutorial video on assigning stages_**

https://www.youtube.com/watch?v=hKf4twg832g

1. On the model details page, click on `Promote`. The promotion action can also
   be initiated from the models dashboard or from the related project’s
   experiment table as shown in the above video.

2. Select the version that you want to promote.
3. Enter the stage name (eg, `development`, `staging`, `production`).

   <admon>

   You can define the list of stages in the `.gto` config file, which is a
   `yaml` structured file that allows you to specify artifact types and stages.
   If you have defined the stages in this file, then you can only promote to the
   stages listed here. But if you have not defined the list of stages, you can
   enter any string as the stage name. Note the following:

   - GTO config files with stage names are specific to a Git repository. So,
     they apply only to models within one repository.
   - Currently, you cannot make entries to the GTO config file from Iterative
     Studio.
   - If you define stages in the config file at any point, any stage promotions
     after that point can use only the names defined in the config file.

   </admon>

4. Optionally, provide a Git tag message.
5. Click on `Promote version`.
6. At this point, if you reload the model details page, you will see that your
   model version has been promoted to (assigned) the stage. This information is
   available in the model `History` section as well as in the `Stages` section.
7. If you go to your Git repository, you will see that a new Git tag referencing
   the selected version and stage has been created, indicating the stage
   assignment.

[gto]: https://github.com/iterative/gto
[git tag]: https://git-scm.com/docs/git-tag
