# Add a model

You can add models from any ML project to the model registry. To add a model to
your model registry, Iterative Studio creates an annotation for it in an
`artifacts.yaml` file in your Git repository. If you are using the GTO command
line tool, you can also add models from the [CLI][gto]. To add models using
Iterative Studio, watch this tutorial video or read on below:

https://www.youtube.com/watch?v=szzv4ZXmYAs

1. Click on `Add a model`
2. Select the project to which you want to add the model. If your model file or
   the DVC file for your model exists in a Git repository, select the project
   that connects to this Git repository. If your model file resides in a remote
   storage (eg, S3, GCS, etc.), select the project whose Git repository you want
   to add the model to.

   <admon>

   Only repositories that you have connected to Iterative Studio are available
   in the `Add a model` form. To connect your desired repository to Iterative
   Studio, go to the `Projects` tab and
   [create a project that connects to this Git repository](/doc/studio/user-guide/projects-and-experiments/create-a-project).
   Then you can come back to the model registry and add the model.

   </admon>

3. Enter the path of the model file as follows:

   - If the model file is in the Git repository, enter the relative path of the
     model from the repository root.
   - If the model file is in a remote storage but is DVC-tracked, enter the path
     of the DVC file for your model.
   - If the model file is in a remote storage and is not DVC-tracked, enter the
     absolute path of the model file.
   - If you use [MLEM] to save your model, use the path to the binary file that
     MLEM generates. After you have run
     [`mlem init`](https://mlem.ai/doc/command-reference/init), Iterative Studio
     will be able to parse the `.mlem` file to extract model metadata.

4. Provide labels for your model. For example, if your model is about reviewing
   sentiment analysis using natural language processing, one of the labels may
   be `nlp`. You can provide multiple labels as a comma separated list. Eg,
   `nlp, sentiment_analysis`.
5. Optionally, add a brief description for your model.
6. Enter a Git commit message. Then, select the branch to commit to. You can
   commit to either the base branch or a new branch. Iterative Studio will
   commit the changes to the selected branch. If you commit to a new branch,
   Iterative Studio will also create a Git pull request from the new branch to
   the base branch.
7. Now, click on `Commit changes`.
8. At this point, the new model appears in the models dashboard.
9. In your Git repository, you will find that an entry for the new model has
   been created in the `artifacts.yaml` file in the repository's root. If you
   had committed to a new branch, a new pull request (or merge request in the
   case of GitLab) will also have been created to merge the new branch into the
   base branch.

[gto]: https://github.com/iterative/gto
[mlem]: https://mlem.ai/
